# frozen_string_literal: true

class LikesController < ApplicationController
  def create
    @like = current_user.likes.create(post_id: params[:post_id])
    redirect_to request.referer
  end

  def destroy
    @like = current_user.likes.find_by(post_id: params[:post_id])
    @like.destroy
    redirect_to request.referer
  end
end
