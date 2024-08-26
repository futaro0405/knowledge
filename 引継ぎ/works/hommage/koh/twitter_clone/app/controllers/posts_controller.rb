# frozen_string_literal: true

class PostsController < ApplicationController
  before_action :set_user
  before_action :set_posts, only: %i[index create]

  def index; end

  def show
    @post = Post.find(params[:id])
    @comments = @post.comments.includes(:user).latest
    @comment = Comment.new
  end

  def create
    @post = Post.new(post_params)
    @post.user = current_user
    if @post.save
      redirect_to request.referer
    else
      render :index
    end
  end

  private

  def set_posts
    @post = Post.new
    @posts = Post.includes(INCLUDES_MODELS).latest.page(params[:posts_page]).per(10)
    # 自分がフォローしている投稿
    followee_ids = @user.followees.map(&:id)
    @followee_posts = Post.includes(INCLUDES_MODELS).followee_posts(followee_ids:).page(params[:followee_page]).per(10)
  end

  def post_params
    params.require(:post).permit(:content, images: [])
  end
end
