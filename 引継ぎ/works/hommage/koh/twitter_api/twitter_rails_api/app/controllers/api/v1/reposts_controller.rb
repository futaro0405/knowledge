# frozen_string_literal: true

module Api
  module V1
    class RepostsController < ApplicationController
      def create
        repost = current_api_v1_user.reposts.create(post_id: params[:tweet_id])
        render json: { data: repost }
      end

      def destroy
        repost = current_api_v1_user.reposts.find_by(post_id: params[:tweet_id])
        repost.destroy
        render json: { data: repost }
      end
    end
  end
end
