# frozen_string_literal: true

module Api
  module V1
    module Auth
      class SessionsController < ApplicationController
        def index
          if current_api_v1_user
            render json: { data: current_api_v1_user.merge_children_and_image_as_json }
          else
            # status_code:204を返す
            render status: :no_content
          end
        end
      end
    end
  end
end
