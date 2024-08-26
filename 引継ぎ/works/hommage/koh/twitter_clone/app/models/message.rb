# frozen_string_literal: true

class Message < ApplicationRecord
  belongs_to :user
  belongs_to :room

  validates :content, presence: true

  scope :old, -> { order(created_at: :asc) }
end
