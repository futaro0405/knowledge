# frozen_string_literal: true

module Api
  module V1
    module Tweets
      class RetweetsController < ApplicationController
        before_action :authenticate_api_v1_user!, only: %i[create destroy]
        before_action :set_tweet, only: %i[create destroy]

        def create
          retweet = current_api_v1_user.retweets.build(tweet_id: @tweet.id)
          if retweet.save
            @tweet.update(updated_at: Time.zone.now)
            render json: { tweet: @tweet }, include: [:retweets], status: :ok
          else
            render json: { error: retweet.errors }, status: :unprocessable_entity
          end
        end

        def destroy
          retweet = current_api_v1_user.retweets.find_by(tweet_id: @tweet.id)
          if retweet
            retweet.destroy
            @tweet.update(updated_at: @tweet.created_at)
            render status: :ok
          else
            render json: { error: 'リツイートが存在しません' }, status: :not_found
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
