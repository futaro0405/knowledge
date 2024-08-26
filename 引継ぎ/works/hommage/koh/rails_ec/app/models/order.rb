# frozen_string_literal: true

class Order < ApplicationRecord
  belongs_to :cart

  with_options presence: true do
    validates :last_name
    validates :first_name
    validates :user_name
    validates :email
    validates :country
    validates :prefecture
    validates :zip_code
    validates :address1
    validates :address2
    validates :credit_name
    validates :credit_number
    validates :credit_expiration
    validates :credit_cvv
  end

  before_create do
    cart.decrease_product_stock
  end

  after_create do
    update_promotion_code
  end

  private

  def update_promotion_code
    promotion_code = cart.promotion_code
    return unless promotion_code && promotion_code.order_id.nil?

    promotion_code.update(order_id: id)
  end
end
