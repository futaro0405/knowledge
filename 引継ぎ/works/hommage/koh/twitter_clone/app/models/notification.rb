# frozen_string_literal: true

class Notification < ApplicationRecord
  belongs_to :user
  belongs_to :action, polymorphic: true

  scope :latest, -> { order(created_at: :desc) }

  delegate :email, to: :user, prefix: true

  def sender
    action.user
  end
end
