# frozen_string_literal: true

class Cart < ApplicationRecord
  has_many :cart_products, dependent: :destroy
  has_many :products, through: :cart_products
  belongs_to :promotion_code, optional: true

  def set_validate_error_messages
    messages = []
    messages << 'カートに商品が入っていません。' if cart_products.empty?
    messages << 'プロモーションコードがすでに使用済です。' if promotion_code&.order_id.present?
    set_out_of_stock_messages(messages:)

    messages
  end

  def decrease_product_stock
    cart_products.each do |cart_product|
      quantity = cart_product.quantity
      cart_product.product.update(stock: cart_product.product.stock - quantity)
    end
  end

  def calc_total
    total = cart_products.inject(0) { |result, cart_product| result + cart_product.subtotal }
    if promotion_code
      total -= promotion_code.discount
      total = 0 if total.negative?
    end
    total
  end

  private

  def set_out_of_stock_messages(messages:)
    cart_products
      .select { |cart_product| cart_product.quantity > cart_product.product.stock }
      .map do |cart_product|
        product = cart_product.product
        messages << "#{product.name}が注文可能数を超えています。最大注文可能数：#{product.stock}個"
      end
  end
end
