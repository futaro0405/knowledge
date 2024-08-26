# frozen_string_literal: true

module Api
  module V1
    class NotificationsController < ApplicationController
      before_action :authenticate_api_v1_user!, only: %i[index]

      def index
        notifications = current_api_v1_user.passive_notifications.order(created_at: :desc)
        notifications.where(read: false).update_all(read: true)
        render json: { notifications: }, include: %i[visitor], status: :ok
      end
    end
  end
end
