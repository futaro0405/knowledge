# frozen_string_literal: true

class Comment < ApplicationRecord
  include NotificationCreator

  after_create :create_notification

  belongs_to :user
  belongs_to :post
  has_many_attached :images
  has_one :notification, as: :action, dependent: :destroy

  validates :content, presence: true

  scope :latest, -> { order(created_at: :desc) }

  delegate :name, :user_name, to: :user, prefix: true
end
