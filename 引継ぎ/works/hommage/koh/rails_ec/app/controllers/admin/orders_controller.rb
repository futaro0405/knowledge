# frozen_string_literal: true

module Admin
  class OrdersController < Admin::ApplicationController
    def index
      @orders = Order.all.order(created_at: :desc)
    end

    def show
      @order = Order.find(params[:id])
      @ordered_cart_products = @order.cart.cart_products.order(created_at: :desc)
      @promotion_code = @order.cart.promotion_code
      @total = @order.cart.calc_total
    end
  end
end
