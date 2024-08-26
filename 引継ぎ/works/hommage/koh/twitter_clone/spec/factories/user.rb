# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    name { 'test_name' }
    sequence(:user_name) { |n| "test_id#{n}" }
    sequence(:email) { |n| "example#{n}@exmaple.com" }
    password { 'password' }
    password_confirmation { 'password' }
    phone { '123456789' }
    birthdate { '2000-01-01' }
  end
end
