# frozen_string_literal: true

module Api
  module V1
    class FollowsController < ApplicationController
      def create
        followee_id = User.find_by(user_name: params[:user_name]).id
        follow = current_api_v1_user.following_status.create!(followee_id:)
        render json: { data: follow }
      end

      def destroy
        followee_id = User.find_by(user_name: params[:user_name]).id
        follow = current_api_v1_user.following_status.find_by(followee_id:)
        follow.destroy!
        render json: { data: follow }
      end
    end
  end
end
