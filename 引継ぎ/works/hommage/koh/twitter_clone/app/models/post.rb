# frozen_string_literal: true

class Post < ApplicationRecord
  belongs_to :user
  has_many_attached :images

  has_many :likes, dependent: :destroy
  has_many :liked_users, through: :likes, source: :user

  has_many :reposts, dependent: :destroy
  has_many :reposted_users, through: :reposts, source: :user

  has_many :comments, dependent: :destroy
  has_many :commented_users, through: :comments, source: :user

  has_many :bookmarks, dependent: :destroy
  has_many :bookmarked_users, through: :bookmarks, source: :user

  validates :content, presence: true, length: { maximum: 140 }

  scope :latest, -> { order(created_at: :desc) }
  scope :followee_posts, ->(followee_ids:) { where(user_id: followee_ids).order(created_at: :desc) }

  delegate :name, :user_name, to: :user, prefix: true
end
