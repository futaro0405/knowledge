# frozen_string_literal: true

class Notification < ApplicationRecord
  belongs_to :nice, optional: true
  belongs_to :follow, class_name: 'Relationship', optional: true
  belongs_to :comment, optional: true

  belongs_to :visitor, class_name: 'User'
  belongs_to :visited, class_name: 'User'
end
