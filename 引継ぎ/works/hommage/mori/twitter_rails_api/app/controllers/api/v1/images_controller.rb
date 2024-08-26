# frozen_string_literal: true

module Api
  module V1
    class ImagesController < ApplicationController
      before_action :authenticate_api_v1_user!, only: %i[create]
      def create
        tweet = current_api_v1_user.tweets.find_by(id: image_params[:tweet_id])
        image_params[:tweet_image_datas].each_with_index do |data, index|
          blob = ActiveStorage::Blob.create_and_upload!(
            io: StringIO.new(Base64.decode64(data.split(',').last)),
            filename: image_params[:tweet_image_names][index]
          )
          tweet.images.attach(blob)
        end
        render json: { tweet_images: tweet.images }
      end

      private

      def image_params
        params.require(:image).permit(:tweet_id, tweet_image_datas: [], tweet_image_names: [])
      end
    end
  end
end
