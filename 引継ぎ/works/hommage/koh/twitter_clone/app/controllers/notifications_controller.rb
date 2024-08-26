# frozen_string_literal: true

class NotificationsController < ApplicationController
  before_action :set_user

  def index
    @notifications = @user.notifications.includes(:user).latest.page(params[:page]).per(10)
  end
end
