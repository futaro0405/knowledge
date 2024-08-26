# frozen_string_literal: true

class CartProduct < ApplicationRecord
  belongs_to :cart
  belongs_to :product
  delegate :name, :price, to: :product, prefix: true

  def subtotal
    product.price * quantity
  end
end
