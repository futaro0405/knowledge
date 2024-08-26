# frozen_string_literal: true

class User < ApplicationRecord
  before_save :attach_dummy_image
  before_destroy :destroy_groups

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
  include DeviseTokenAuth::Concerns::User

  has_one_attached :profile_image
  has_one_attached :header_image

  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :notifications, dependent: :destroy

  has_many :reposts, dependent: :destroy
  has_many :reposting_posts, through: :reposts, source: :post

  has_many :likes, dependent: :destroy
  has_many :liking_posts, through: :likes, source: :post

  # 新たにブックマークした順に取得するためorderを明示的に指定する
  has_many :bookmarks, -> { order(created_at: :desc) }, dependent: :destroy, inverse_of: 'user'
  has_many :bookmarking_posts, through: :bookmarks, source: :post

  # 自分がフォローしているユーザたち
  has_many :following_status, class_name: 'Follow', foreign_key: :follower_id, dependent: :destroy,
                              inverse_of: 'follower'
  has_many :followees, through: :following_status, source: :followee

  # 自分がフォローされているユーザたち
  has_many :followed_status, class_name: 'Follow', foreign_key: :followee_id, dependent: :destroy,
                             inverse_of: 'followee'
  has_many :followers, through: :followed_status, source: :follower

  has_many :group_members, dependent: :destroy
  has_many :groups, through: :group_members

  has_many :messages, dependent: :destroy

  with_options presence: true do
    validates :phone
    validates :birthdate
    validates :name, length: { maximum: 50 }
    validates :user_name, uniqueness: true
  end

  validates :introduction, length: { maximum: 160 }
  validates :place, length: { maximum: 30 }
  validates :website, length: { maximum: 100 }

  # プロフィール画像ファイルのパスを内包したjsonを返す
  def merge_image_as_json
    profile_image_path = profile_image.attached? ? url_for(profile_image) : ''
    header_image_path = header_image.attached? ? url_for(header_image) : ''
    as_json.merge(profile_image_path:, header_image_path:)
  end

  # 子レコードとプロフィール画像ファイルのパスを内包したjsonを返す
  def merge_children_and_image_as_json
    tweets = posts.order(created_at: :desc).map(&:merge_user_and_image_as_json)
    comments = self.comments.order(created_at: :desc).map(&:merge_user_as_json)
    retweets = reposting_posts.order(created_at: :desc).map(&:merge_user_and_image_as_json)
    likes = liking_posts.order(created_at: :desc).map(&:merge_user_and_image_as_json)
    bookmarks = bookmarking_posts.map(&:merge_user_and_image_as_json)
    followees = self.followees
    followers = self.followers
    merge_image_as_json.as_json.merge(tweets:, comments:, retweets:, likes:, followees:, followers:, bookmarks:)
  end

  private

  def attach_dummy_image
    unless profile_image.attached?
      profile_image.attach(io: Rails.root.join("app/assets/images/dummy_image_#{rand(4)}.jpg").open,
                           filename: 'dummy_image.jpg')
    end

    return if header_image.attached?

    header_image.attach(io: Rails.root.join('app/assets/images/dummy_header_image.jpg').open,
                        filename: 'dummy_header_image.jpg')
  end

  # user.destoryだけではUser側から適切にカスケード削除されないGroupsテーブルを前処理で削除
  def destroy_groups
    Group.where(id: groups.map(&:id)).destroy_all
  end
end
