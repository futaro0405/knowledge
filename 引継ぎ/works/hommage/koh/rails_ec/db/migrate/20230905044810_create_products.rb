# frozen_string_literal: true

class CreateProducts < ActiveRecord::Migration[7.0]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.string :sku, null: false
      t.integer :price, null: false
      t.integer :stock, null: false, default: 0
      t.text :description

      t.timestamps
    end
  end
end
