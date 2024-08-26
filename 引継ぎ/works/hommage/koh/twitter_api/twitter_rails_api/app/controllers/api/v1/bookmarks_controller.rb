# frozen_string_literal: true

module Api
  module V1
    class BookmarksController < ApplicationController
      def index
        bookmarks = current_api_v1_user.bookmarking_posts.map(&:merge_user_and_image_as_json)
        render json: bookmarks
      end

      def create
        bookmark = current_api_v1_user.bookmarks.create(post_id: params[:tweet_id])
        render json: bookmark
      end

      def destroy
        bookmark = current_api_v1_user.bookmarks.find_by(post_id: params[:tweet_id])
        bookmark.destroy
        render json: bookmark
      end
    end
  end
end
