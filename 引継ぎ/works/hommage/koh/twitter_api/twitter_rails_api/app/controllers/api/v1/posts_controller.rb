# frozen_string_literal: true

module Api
  module V1
    class PostsController < ApplicationController
      def index
        if params[:limit] && params[:offset]
          limit = params[:limit].to_i
          offset = params[:offset].to_i

          posts = Post.order(created_at: :desc).limit(limit).offset(offset)
          prev_offset = offset.zero? ? 0 : offset - limit
          next_offset = offset + limit
        else
          # limit, offsetのquery parameterがない場合は全件を返す
          posts = Post.all.order(created_at: :desc)
          prev_offset = 0
          next_offset = 0
        end

        # 画像URLを追記してdataとして返す
        data = posts.map(&:merge_user_and_image_as_json)

        render json: { data:, prev_offset:, next_offset: }
      end

      def show
        post = Post.find_by(id: params[:id])

        if post
          data = post.merge_user_and_image_as_json
          render json: data
        else
          # 該当idのpostがない場合、status_code:404で返す
          render json: { message: '投稿が見つかりませんでした。' }, status: :not_found
        end
      end

      def create
        post = Post.new(post_params)
        post.user = current_api_v1_user
        if post.save!
          render json: { data: post }
        else
          # status_code:422で返す
          render json: { message: 'ポスト投稿に失敗しました。' }, status: :unprocessable_entity
        end
      end

      def attach_images
        images = params.require(:images)
        # 画像がない状態で呼ばれた場合、status_code:204で返す
        render status: :no_content if images.empty?

        post = Post.find(params[:post_id])
        # 添付先の投稿が見つからない場合、status_code:422で返す
        render json: { message: '画像添付先の投稿が見つかりませんでした。' }, status: :unprocessable_entity unless post

        blobs = []
        images.each do |image|
          blob =
            ActiveStorage::Blob.create_and_upload!(
              io: image,
              filename: image.original_filename,
              content_type: image.content_type
            )

          post.images.attach(blob.signed_id)
          blobs.push(blob)
        end

        if blobs.length >= 0
          render json: { data: blobs }
        else
          # status_code:422で返す
          render json: { message: '画像登録に失敗しました。' }, status: :unprocessable_entity
        end
      end

      def destroy
        post = Post.find_by(id: params[:id])
        post.destroy
        render json: { data: post }
      end

      private

      def post_params
        params.require(:post).permit(:content)
      end
    end
  end
end
