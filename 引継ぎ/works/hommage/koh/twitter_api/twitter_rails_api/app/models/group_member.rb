# frozen_string_literal: true

class GroupMember < ApplicationRecord
  belongs_to :user
  belongs_to :group
end
