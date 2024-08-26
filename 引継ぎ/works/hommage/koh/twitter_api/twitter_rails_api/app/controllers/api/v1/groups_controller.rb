# frozen_string_literal: true

module Api
  module V1
    class GroupsController < ApplicationController
      def index
        current_user = current_api_v1_user
        groups = current_user.groups.order(updated_at: :desc).map do |group|
          user = group.user_as_json(current_user)
          group.as_json(methods: :latest_message).merge(user:)
        end
        render json: groups
      end

      def create
        current_user = current_api_v1_user
        member_ids = [current_user.id, params[:user_id]]
        existing_group = Group.search_existing_group(user_id: current_user.id, other_id: params[:user_id])
        if existing_group
          group = existing_group
        else
          group = Group.create
          member_ids.each { |member_id| GroupMember.create(user_id: member_id, group_id: group.id) }
        end

        render json: group
      end
    end
  end
end
