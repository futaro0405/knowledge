# frozen_string_literal: true

module Api
  module V1
    class LikesController < ApplicationController
      def create
        like = current_api_v1_user.likes.create(post_id: params[:tweet_id])
        render json: { data: like }
      end

      def destroy
        like = current_api_v1_user.likes.find_by(post_id: params[:tweet_id])
        like.destroy
        render json: { data: like }
      end
    end
  end
end
