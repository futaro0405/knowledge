# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  # url_forのメソッドを使うためinclude
  include Rails.application.routes.url_helpers
end
