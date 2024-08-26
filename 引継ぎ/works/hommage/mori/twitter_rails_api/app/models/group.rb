# frozen_string_literal: true

class Group < ApplicationRecord
  has_many :entries, dependent: :destroy
  has_many :messages, dependent: :destroy

  def last_message
    messages.last
  end
end
