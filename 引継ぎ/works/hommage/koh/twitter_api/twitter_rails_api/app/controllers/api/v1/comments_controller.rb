# frozen_string_literal: true

module Api
  module V1
    class CommentsController < ApplicationController
      def index
        post = Post.find_by(id: params[:tweet_id])
        if post
          data = post.merge_comments_as_json
          render json: data
        else
          # 該当idのpostがない場合、status_code:404で返す
          render json: { message: '投稿が見つかりませんでした。' }, status: :not_found
        end
      end

      def create
        comment = current_api_v1_user.comments.build(comment_params)
        if comment.save
          render json: { data: comment }
        else
          # status_code:422で返す
          render json: { message: 'コメントに失敗しました。' }, status: :unprocessable_entity
        end
      end

      def destroy
        comment = Comment.find_by(id: params[:id])
        comment.destroy
        render json: { data: comment }
      end

      private

      def comment_params
        permit_params = params.require(:comment).permit(%i[content post_id])
        permit_params.merge(post_id: permit_params[:post_id])
      end
    end
  end
end
