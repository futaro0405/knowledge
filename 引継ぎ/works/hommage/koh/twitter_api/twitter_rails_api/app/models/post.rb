# frozen_string_literal: true

class Post < ApplicationRecord
  belongs_to :user
  has_many_attached :images

  has_many :comments, dependent: :destroy
  has_many :reposts, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :bookmarks, dependent: :destroy

  validates :content, presence: true, length: { maximum: 140 }

  def merge_user_and_image_as_json
    image_paths = images.map { |image| url_for(image) }
    comment_count = comments.count
    retweet_count = reposts.count
    like_count = likes.count
    bookmark_count = bookmarks.count
    user = self.user.merge_image_as_json
    as_json.merge(image_paths:, user:, comment_count:, retweet_count:, like_count:, bookmark_count:)
  end

  def merge_comments_as_json
    comments = self.comments.order(created_at: :desc).map(&:merge_user_as_json)
    merge_user_and_image_as_json.as_json.merge(comments:)
  end
end
