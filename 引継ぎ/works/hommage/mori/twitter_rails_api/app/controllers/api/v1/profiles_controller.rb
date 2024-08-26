# frozen_string_literal: true

module Api
  module V1
    class ProfilesController < ApplicationController
      before_action :authenticate_api_v1_user!, only: %i[show update]

      def show
        user = User.find_by(id: params[:id])
        current_user_entry = Entry.where(user_id: current_api_v1_user.id)
        another_entry = Entry.where(user_id: user.id)
        unless user.id == current_api_v1_user.id
          current_entry_group_ids = current_user_entry.pluck(:group_id)
          another_entry_group_ids = another_entry.pluck(:group_id)
          same_group_ids = current_entry_group_ids & another_entry_group_ids
          if same_group_ids.present?
            @is_group = true
            @group_id = same_group_ids.first
          end
        end
        render json: { user:, is_group: @is_group, group_id: @group_id },
               status: :ok,
               methods: %i[profile_image_url header_image_url retweet_tweet nice_tweet],
               include: {
                 tweets: { methods: %i[image_urls retweets_count nices_count bookmarked],
                           include: %i[retweets nices bookmarks] },
                 comments: {},
                 following: {},
                 followers: {}
               }
      end

      def update
        current_api_v1_user.update!(profile_params)
        if params[:user][:headerImageData] && params[:user][:headerFileName]
          blob = add_image(params[:user][:headerImageData], params[:user][:headerFileName])
          current_api_v1_user.header_image.attach(blob)
        end

        if params[:user][:profileImageData] && params[:user][:profileFileName]
          blob = add_image(params[:user][:profileImageData], params[:user][:profileFileName])
          current_api_v1_user.profile_image.attach(blob)
        end
        render json: { user: current_api_v1_user }, status: :ok, methods: %i[profile_image_url header_image_url]
      end

      private

      def profile_params
        params.require(:user).permit(:name, :bio, :birthday, :location, :website)
      end

      def add_image(file_data, file_name)
        ActiveStorage::Blob.create_and_upload!(
          io: StringIO.new(Base64.decode64(file_data.split(',').last)),
          filename: file_name
        )
      end
    end
  end
end
