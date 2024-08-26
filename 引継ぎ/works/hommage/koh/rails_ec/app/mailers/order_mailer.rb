# frozen_string_literal: true

class OrderMailer < ApplicationMailer
  helper ApplicationHelper

  def complete(order:)
    @order = order
    recipient = @order.email
    @ordered_cart_products = @order.cart.cart_products.order(created_at: :desc)
    @promotion_code = @order.cart.promotion_code
    @total = @order.cart.calc_total
    mail(to: recipient, subject: '注文内容ご確認')
  end
end
