# frozen_string_literal: true

class Nice < ApplicationRecord
  belongs_to :user
  belongs_to :tweet

  validates :user_id, uniqueness: { scope: :tweet_id }

  include NotificationConcern
end
