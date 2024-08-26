# frozen_string_literal: true

module Api
  module V1
    module Tweets
      class NicesController < ApplicationController
        before_action :authenticate_api_v1_user!, only: %i[create destroy]
        before_action :set_tweet, only: %i[create destroy]

        def create
          nice = current_api_v1_user.nices.build(tweet_id: @tweet.id)
          if nice.save
            render json: { tweet: @tweet }, include: [:nices], status: :ok
          else
            render json: { error: nice.errors }, status: :unprocessable_entity
          end
        end

        def destroy
          nice = current_api_v1_user.nices.find_by(tweet_id: @tweet.id)
          if nice
            nice.destroy
            render status: :ok
          else
            render json: { error: 'いいねが存在しません' }, status: :not_found
          end
        end

        private

        def set_tweet
          @tweet = Tweet.find_by(id: params[:tweet_id])
        end
      end
    end
  end
end
