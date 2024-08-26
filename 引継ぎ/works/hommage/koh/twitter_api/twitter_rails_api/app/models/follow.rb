# frozen_string_literal: true

class Follow < ApplicationRecord
  include NotificationCreator

  after_create :create_notification

  belongs_to :follower, class_name: 'User'
  belongs_to :followee, class_name: 'User'
  has_one :notification, as: :action, dependent: :destroy

  validates :follower_id, uniqueness: { scope: :followee_id }
end
