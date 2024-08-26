# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable, :timeoutable
  include DeviseTokenAuth::Concerns::User

  include Rails.application.routes.url_helpers

  # 自分がフォローする側の関係
  has_many :follows, class_name: 'Relationship', foreign_key: 'follower_id', dependent: :destroy, inverse_of: :follower
  has_many :following, through: :follows, source: :followed
  # 自分がフォローされる側の関係
  has_many :reverse_of_follows, class_name: 'Relationship', foreign_key: 'followed_id', dependent: :destroy,
                                inverse_of: :followed
  has_many :followers, through: :reverse_of_follows, source: :follower

  has_many :comments, dependent: :destroy

  has_many :retweets, dependent: :destroy

  has_many :nices, dependent: :destroy

  has_many :bookmarks, dependent: :destroy

  has_many :tweets, dependent: :destroy

  has_many :active_notifications, class_name: 'Notification', foreign_key: 'visitor_id', dependent: :destroy,
                                  inverse_of: :visitor
  has_many :passive_notifications, class_name: 'Notification', foreign_key: 'visited_id', dependent: :destroy,
                                   inverse_of: :visited

  has_many :entries, dependent: :destroy
  has_many :messages, dependent: :destroy

  has_one_attached :profile_image
  has_one_attached :header_image

  def profile_image_url
    return unless profile_image.attached?

    url_for(profile_image)
  end

  def header_image_url
    return unless header_image.attached?

    url_for(header_image)
  end

  def retweet_tweet
    # リツイートしたツイートの情報を取得
    retweet_ids = retweets.pluck(:tweet_id)
    retweet_tweet = Tweet.find(retweet_ids)
    # リツイートしたツイートのユーザー情報を取得
    retweet_user_ids = retweet_tweet.pluck(:user_id)
    retweet_user = User.find(retweet_user_ids)
    [retweet_tweet, retweet_user]
  end

  def nice_tweet
    nice_ids = nices.pluck(:tweet_id)
    nice_tweet = Tweet.find(nice_ids)
    nice_user_ids = nice_tweet.pluck(:user_id)
    nice_user = User.find(nice_user_ids)
    [nice_tweet, nice_user]
  end

  def follow(user)
    follows.find_or_create_by(followed_id: user.id) unless self == user
  end

  def unfollow(user)
    follow = follows.find_by(followed_id: user.id)
    follow&.destroy
  end
end
