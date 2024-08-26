# frozen_string_literal: true

class MessagesController < ApplicationController
  def create
    @message = current_user.messages.build(message_params)
    if @message.save
      redirect_to request.referer
    else
      redirect_to request.referer, flash: { danger: 'メッセージ投稿に失敗しました。本文を確認してください。' }
    end
  end

  private

  def message_params
    permit_params = params.require(:message).permit(:content)
    permit_params.merge(room_id: params[:room_id])
  end
end
