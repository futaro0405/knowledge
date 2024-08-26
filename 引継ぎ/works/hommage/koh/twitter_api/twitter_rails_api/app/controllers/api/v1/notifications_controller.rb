# frozen_string_literal: true

module Api
  module V1
    class NotificationsController < ApplicationController
      def index
        notifications = current_api_v1_user.notifications.order(created_at: :desc).map do |record|
          sender = record.sender.merge_image_as_json
          record.as_json.merge(target: record.target, sender:)
        end
        render json: notifications
      end
    end
  end
end
