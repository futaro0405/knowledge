# frozen_string_literal: true

class Comment < ApplicationRecord
  include NotificationCreator

  after_create :create_notification

  belongs_to :post
  belongs_to :user
  has_one :notification, as: :action, dependent: :destroy

  validates :content, presence: true, length: { maximum: 140 }

  def merge_user_as_json
    user = self.user.merge_image_as_json
    as_json.merge(user:)
  end
end
