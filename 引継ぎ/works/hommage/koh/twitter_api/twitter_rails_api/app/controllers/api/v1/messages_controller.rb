# frozen_string_literal: true

module Api
  module V1
    class MessagesController < ApplicationController
      def index
        group = current_api_v1_user.groups.find_by(id: params[:group_id])
        messages = group.messages.order(created_at: :asc)
        render json: messages
      end

      def create
        current_user = current_api_v1_user
        message = current_user.messages.build(message_params)

        if message.save!
          render json: { data: message }
        else
          # status_code:422で返す
          render json: { message: 'メッセージ投稿に失敗しました。' }, status: :unprocessable_entity
        end
      end

      private

      def message_params
        permit_params = params.require(:message).permit(:content)
        permit_params.merge(group_id: params[:group_id])
      end
    end
  end
end
