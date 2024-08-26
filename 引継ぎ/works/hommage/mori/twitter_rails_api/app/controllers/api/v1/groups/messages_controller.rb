# frozen_string_literal: true

module Api
  module V1
    module Groups
      class MessagesController < ApplicationController
        before_action :authenticate_api_v1_user!, only: %i[index create]

        def index
          group = Group.find_by(id: params[:group_id])
          return if group.entries.where(user_id: current_api_v1_user.id).blank?

          another_user = group.entries
                              .where.not(user_id: current_api_v1_user.id)
                              .first.user
          messages = group.messages.all
          render json: { messages:, another_user: }, status: :ok
        end

        def create
          message = current_api_v1_user.messages.build(message_params)
          return unless message.save

          render status: :ok
        end

        private

        def message_params
          params.require(:message).permit(:message, :group_id)
        end
      end
    end
  end
end
