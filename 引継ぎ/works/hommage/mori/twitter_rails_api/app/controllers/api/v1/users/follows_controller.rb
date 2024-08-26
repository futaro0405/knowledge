# frozen_string_literal: true

module Api
  module V1
    module Users
      class FollowsController < ApplicationController
        before_action :authenticate_api_v1_user!, only: %i[create destroy]
        before_action :set_user, only: %i[create destroy]

        def create
          current_api_v1_user.follow(@user)
          render status: :ok
        end

        def destroy
          current_api_v1_user.unfollow(@user)
          render status: :ok
        end

        private

        def set_user
          @user = User.find_by(id: params[:user_id])
        end
      end
    end
  end
end
