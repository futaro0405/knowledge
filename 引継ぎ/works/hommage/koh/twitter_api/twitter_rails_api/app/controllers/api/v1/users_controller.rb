# frozen_string_literal: true

module Api
  module V1
    class UsersController < ApplicationController
      def show
        user = User.find_by(user_name: params[:user_name])

        if user
          data = user.merge_children_and_image_as_json
          render json: data
        else
          # 該当idのuserがない場合、status_code:404で返す
          render json: { message: 'ユーザが見つかりませんでした。' }, status: :not_found
        end
      end

      def update
        user = User.find_by(user_name: params[:user_name])
        user.attributes = user_params

        if user.save
          data = user.merge_children_and_image_as_json
          render json: data
        else
          # 更新に失敗した場合、status_code:422で返す
          messages = user.errors.empty? ? '編集に失敗しました。' : user.errors.full_messages
          render json: { errors: messages }, status: :unprocessable_entity
        end
      end

      private

      def user_params
        params.permit(%i[name user_name introduction place website birthdate profile_image header_image])
      end
    end
  end
end
