# frozen_string_literal: true

class CreateNices < ActiveRecord::Migration[7.0]
  def change
    create_table :nices do |t|
      t.references :user, null: false, foreign_key: true
      t.references :tweet, null: false, foreign_key: true

      t.timestamps
    end
    add_index :nices, %i[user_id tweet_id], unique: true
  end
end
