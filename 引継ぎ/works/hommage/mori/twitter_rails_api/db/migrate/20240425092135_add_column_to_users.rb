# frozen_string_literal: true

class AddColumnToUsers < ActiveRecord::Migration[7.0]
  def change
    change_table :users, bulk: true do |t|
      t.string :bio, null: false, default: ''
      t.string :birthday, null: false, default: ''
      t.string :location, null: false, default: ''
      t.string :website, null: false, default: ''
    end
  end
end
