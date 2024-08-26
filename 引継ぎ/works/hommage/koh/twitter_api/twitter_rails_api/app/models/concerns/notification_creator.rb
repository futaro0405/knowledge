# frozen_string_literal: true

module NotificationCreator
  def create_notification
    # Followsテーブルだけ構造が違うので、userに設定するリレーションを変更する
    user =
      case self.class.name
      when 'Follow' then followee
      else post.user
      end

    Notification.create!(user:, action: self, action_type: self.class.name)
  end
end
