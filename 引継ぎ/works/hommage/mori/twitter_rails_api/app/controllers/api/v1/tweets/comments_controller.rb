# frozen_string_literal: true

module Api
  module V1
    module Tweets
      class CommentsController < ApplicationController
        def index
          comments = Comment.where(tweet_id: params[:tweet_id]).order(created_at: :desc)
          render json: { comments: }, status: :ok, include: [:user]
        end
      end
    end
  end
end
