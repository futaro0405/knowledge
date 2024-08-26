# frozen_string_literal: true

class Like < ApplicationRecord
  include NotificationCreator

  after_create :create_notification

  belongs_to :user
  belongs_to :post
  has_one :notification, as: :action, dependent: :destroy

  validates :user_id, uniqueness: { scope: :post_id }
end
