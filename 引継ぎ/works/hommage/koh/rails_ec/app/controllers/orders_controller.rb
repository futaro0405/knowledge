# frozen_string_literal: true

class OrdersController < ApplicationController
  before_action :set_cart
  before_action :set_promotion_code, only: %i[index create]
  before_action :set_cart_products, only: %i[index create]

  def index
    @order = Order.new
  end

  def create
    @order = Order.new(order_params)
    @order[:cart_id] = @cart.id

    error_messages = @cart.set_validate_error_messages
    if error_messages.size.positive?
      flash.now[:danger] = error_messages.join('<br/>')
      render :index
      return
    end

    if @order.save
      session[:cart_id] = nil
      flash[:success] = '購入ありがとうございます。'
      # Modelのselfはシリアライズされるためメール送信はコントローラに記載
      OrderMailer.complete(order: @order).deliver_later
      redirect_to products_path
    else
      render :index
    end
  end

  private

  def order_params
    params.require(:order).permit(%i[last_name first_name user_name email country prefecture zip_code address1 address2
                                     credit_name credit_number credit_expiration credit_cvv])
  end

  def set_promotion_code
    @promotion_code = @cart.promotion_code
  end

  def set_cart_products
    @cart_products = @cart.cart_products.order(created_at: :desc)
    @total = @cart.calc_total
  end
end
