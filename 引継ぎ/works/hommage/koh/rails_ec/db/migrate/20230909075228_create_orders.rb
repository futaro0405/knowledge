# frozen_string_literal: true

class CreateOrders < ActiveRecord::Migration[7.0]
  def change
    create_table :orders do |t|
      t.string :last_name, null: false
      t.string :first_name, null: false
      t.string :user_name, null: false
      t.string :email, null: false
      t.string :country, null: false
      t.string :prefecture, null: false
      t.string :zip_code, null: false
      t.string :address1, null: false
      t.string :address2, null: false
      t.string :credit_name, null: false
      t.string :credit_number, null: false
      t.string :credit_expiration, null: false
      t.string :credit_cvv, null: false
      t.references :cart, null: false, foreign_key: true

      t.timestamps
    end
  end
end
