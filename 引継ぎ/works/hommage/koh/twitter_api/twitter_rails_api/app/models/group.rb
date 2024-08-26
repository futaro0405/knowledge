# frozen_string_literal: true

class Group < ApplicationRecord
  has_many :group_members, dependent: :destroy
  has_many :messages, dependent: :destroy

  def self.search_existing_group(user_id:, other_id:)
    existing_group = nil
    groups = GroupMember.where(user_id:).map(&:group)
    groups.each do |group|
      if group.group_members.find_by(user_id: other_id)
        existing_group = group
        break
      end
    end
    existing_group
  end

  # 自分以外の相手のユーザ情報をjsonで返す
  def user_as_json(current_user)
    group_members.where.not(user_id: current_user.id).first.user.merge_image_as_json
  end

  # 最新のメッセージ1件を返す
  def latest_message
    messages.order(created_at: :desc).limit(1)[0]
  end
end
