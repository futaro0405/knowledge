# frozen_string_literal: true

class Notification < ApplicationRecord
  belongs_to :user
  belongs_to :action, polymorphic: true

  def sender
    case action_type
    # Followsテーブルだけ項目名が異なるので、返す項目を変更する
    when 'Follow' then action.follower
    else action.user
    end
  end

  # 通知送信の対象の情報のレコードを返す
  def target
    case action_type
    when 'Follow' then action.followee
    when 'Comment' then action.merge_user_as_json
    else action.post
    end
  end
end
