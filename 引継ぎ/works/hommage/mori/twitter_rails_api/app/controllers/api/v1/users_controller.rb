# frozen_string_literal: true

module Api
  module V1
    class UsersController < DeviseTokenAuth::RegistrationsController
      private

      def sign_up_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
      end
    end
  end
end
