# frozen_string_literal: true

class Room < ApplicationRecord
  has_many :room_members, dependent: :destroy
  has_many :messages, dependent: :destroy

  scope :latest, -> { order(created_at: :desc) }

  def self.search_existing_room(user_id:, other_id:)
    existing_room = nil
    rooms = RoomMember.where(user_id:).map(&:room)
    rooms.each do |room|
      if room.room_members.find_by(user_id: other_id)
        existing_room = room
        break
      end
    end
    existing_room
  end
end
