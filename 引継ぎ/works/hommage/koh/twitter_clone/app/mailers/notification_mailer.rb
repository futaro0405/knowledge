# frozen_string_literal: true

class NotificationMailer < ApplicationMailer
  def complete(notification:)
    @notification = notification
    mail(to: @notification.user_email, subject: 'Twitterクローン通知')
  end
end
