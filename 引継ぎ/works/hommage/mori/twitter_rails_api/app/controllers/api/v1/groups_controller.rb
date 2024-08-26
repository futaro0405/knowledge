# frozen_string_literal: true

module Api
  module V1
    class GroupsController < ApplicationController
      before_action :authenticate_api_v1_user!, only: %i[index create]

      def index
        my_group_id = current_api_v1_user.entries.pluck(:group_id)
        another_entries = Entry
                          .where(group_id: my_group_id)
                          .where.not(user_id: current_api_v1_user.id)
                          .preload(group: :messages)
        render json: { another_entries: }, include: {
          group: { methods: %i[last_message] },
          user: { methods: %i[profile_image_url] }
        }, status: :ok
      end

      def create
        group = Group.create
        current_user_entry = group.entries.create(user_id: current_api_v1_user.id)
        another_entry = group.entries.create(user_id: params[:user_id])
        render json: { current_user_entry:, another_entry: }, status: :ok
      end
    end
  end
end
