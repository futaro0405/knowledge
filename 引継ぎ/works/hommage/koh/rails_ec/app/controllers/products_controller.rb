# frozen_string_literal: true

class ProductsController < ApplicationController
  def index
    @products = Product.kept.order(created_at: :desc)
  end

  def show
    @product = Product.kept.find(params[:id])
    @recommended_products = Product.kept.where.not(id: params[:id]).order(created_at: :desc).limit(4)
  end
end
