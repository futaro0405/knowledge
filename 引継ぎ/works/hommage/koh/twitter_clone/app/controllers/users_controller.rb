# frozen_string_literal: true

class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    @posts = @user.posts.includes(INCLUDES_MODELS).latest.page(params[:posts_page]).per(10)
    @liking_posts = @user.liking_posts.includes(INCLUDES_MODELS).latest.page(params[:like_page]).per(10)
    @reposting_posts = @user.reposting_posts.includes(INCLUDES_MODELS).latest.page(params[:repost_page]).per(10)
    @commenting_posts = @user.commenting_posts.includes(INCLUDES_MODELS).latest.page(params[:comment_page]).per(10)
  end

  def edit
    return unless current_user.id != params[:id].to_i

    redirect_to user_path(current_user), flash: { danger: '自分以外のプロフィールは編集できません。' }
    nil
  end

  def update
    current_user.attributes = user_params
    if current_user.save(context: :not_new_form)
      redirect_to user_path(current_user)
    else
      render :edit
    end
  end

  private

  def user_params
    params.require(:user).permit(%i[name introduction place website birthdate photo header_photo])
  end
end
