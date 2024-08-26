# frozen_string_literal: true

class User < ApplicationRecord
  before_save :attach_dummy_photo

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :timeoutable, :trackable,
         :omniauthable, omniauth_providers: %i[github]

  has_many :posts, dependent: :destroy
  has_one_attached :photo
  has_one_attached :header_photo

  # 自分がフォローしているユーザたち
  has_many :following_status, class_name: 'Follow', foreign_key: :follower_id, dependent: :destroy,
                              inverse_of: 'follower'
  has_many :followees, through: :following_status, source: :followee

  # 自分がフォローされているユーザたち
  has_many :followed_status, class_name: 'Follow', foreign_key: :followee_id, dependent: :destroy,
                             inverse_of: 'followee'
  has_many :followers, through: :followed_status, source: :follower

  has_many :likes, dependent: :destroy
  has_many :liking_posts, through: :likes, source: :post

  has_many :reposts, dependent: :destroy
  has_many :reposting_posts, through: :reposts, source: :post

  has_many :comments, dependent: :destroy
  has_many :commenting_posts, through: :comments, source: :post

  has_many :bookmarks, dependent: :destroy
  has_many :bookmarking_posts, through: :bookmarks, source: :post

  has_many :room_members, dependent: :destroy
  has_many :rooms, through: :room_members

  has_many :messages, dependent: :destroy
  has_many :notifications, dependent: :destroy

  with_options presence: true do
    validates :name
    validates :user_name, uniqueness: true
    # 電話番号と誕生日は画面からの新規登録時以外は無効化する。
    validates :phone, unless: -> { validation_context == :not_new_form }
    validates :birthdate, unless: -> { validation_context == :not_new_form }
  end

  def self.from_omniauth(auth)
    find_or_initialize_by(provider: auth.provider, uid: auth.uid) do |u|
      u.email = auth.info.email
      u.password = Devise.friendly_token[0, 20]
      u.name = auth.info.name
      u.user_name = auth.info.nickname
    end
  end

  def like(post)
    likes.find_by(post_id: post.id)
  end

  def repost(post)
    reposts.find_by(post_id: post.id)
  end

  def followee(user)
    followees.find_by(id: user.id)
  end

  def bookmark(post)
    bookmarks.find_by(post_id: post.id)
  end

  private

  def attach_dummy_photo
    unless photo.attached?
      photo.attach(io: File.open(Rails.root.join('app/assets/images/dummy_photo.jpg')),
                   filename: 'dummy_photo.jpg')
    end

    return if header_photo.attached?

    header_photo.attach(io: File.open(Rails.root.join('app/assets/images/dummy_header_photo.jpg')),
                        filename: 'dummy_header_photo.jpg')
  end
end
