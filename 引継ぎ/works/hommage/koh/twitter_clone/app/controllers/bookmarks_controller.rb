# frozen_string_literal: true

class BookmarksController < ApplicationController
  before_action :set_user

  def index
    @bookmarking_posts = @user.bookmarking_posts.includes(INCLUDES_MODELS).latest.page(params[:page]).per(10)
  end

  def create
    @bookmark = current_user.bookmarks.create(post_id: params[:post_id])
    redirect_to request.referer
  end

  def destroy
    @bookmark = current_user.bookmarks.find_by(post_id: params[:post_id])
    @bookmark.destroy
    redirect_to request.referer
  end
end
