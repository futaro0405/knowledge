# frozen_string_literal: true

module NotificationCreator
  def create_notification
    notification = Notification.create!(user: post.user, action: self, action_type: self.class.name)
    NotificationMailer.complete(notification:).deliver_later
  end
end
