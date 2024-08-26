# frozen_string_literal: true

class CreateNotifications < ActiveRecord::Migration[7.0]
  def change
    create_table :notifications do |t|
      t.integer :visitor_id, null: false
      t.integer :visited_id, null: false
      t.integer :nice_id
      t.integer :follow_id
      t.integer :comment_id
      t.string :action, default: '', null: false
      t.boolean :read, default: false, null: false

      t.timestamps
    end
  end
end
