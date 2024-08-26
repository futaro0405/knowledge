# frozen_string_literal: true

module Api
  module V1
    class BookmarksController < ApplicationController
      before_action :authenticate_api_v1_user!, only: %i[index create destroy]

      def index
        bookmark_tweet_ids = current_api_v1_user.bookmarks.pluck(:tweet_id)
        bookmark_tweet = Tweet.where(id: bookmark_tweet_ids)
        render json: { bookmark_tweet: },
               include: {
                 user: { methods: %i[profile_image_url] }
               },
               status: :ok,
               methods: %i[image_urls]
      end

      def create
        bookmark = current_api_v1_user.bookmarks.build(tweet_id: params[:tweet_id])
        if bookmark.save
          render status: :ok
        else
          render json: { error: bookmark.error }, status: :unprocessable_entity
        end
      end

      def destroy
        bookmark = Bookmark.find_by(id: params[:id])
        if bookmark
          bookmark.destroy
          render status: :ok
        else
          render json: { error: 'ブックマークが存在しません' }, status: :not_found
        end
      end
    end
  end
end
