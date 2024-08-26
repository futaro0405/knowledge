# frozen_string_literal: true

class RoomsController < ApplicationController
  before_action :set_user
  before_action :set_room_infos, only: %i[index show]

  def index; end

  def show
    room = current_user.rooms.find(params[:id])
    @messages = room.messages.includes(:user).old.page(params[:page]).per(7)
  end

  def create
    member_ids = [current_user.id, params[:user_id]]
    existing_room = Room.search_existing_room(user_id: current_user.id, other_id: params[:user_id])
    if existing_room
      room = existing_room
    else
      room = Room.create
      member_ids.each { |member_id| RoomMember.create(user_id: member_id, room_id: room.id) }
    end

    redirect_to action: :show, id: room.id
  end

  private

  def set_room_infos
    @room_infos = []
    rooms = current_user.rooms.distinct.includes(:room_members).latest
    rooms.map do |room|
      room_info = {}
      room_info[:room] = room
      room_info[:user] = room.room_members.where.not(user_id: current_user.id).includes(:user).first.user
      @room_infos << room_info
    end
  end
end
