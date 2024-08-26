# frozen_string_literal: true

class ChangeColumnsNotification < ActiveRecord::Migration[7.0]
  def up
    change_table :notifications, bulk: true do |t|
      t.remove :nice_id
      t.remove :comment_id
      t.remove :follow_id
      t.integer :tweet_id
    end
  end

  def down
    change_table :notifications, bulk: true do |t|
      t.integer :nice_id
      t.integer :comment_id
      t.integer :follow_id
      t.remove :tweet_id
    end
  end
end
