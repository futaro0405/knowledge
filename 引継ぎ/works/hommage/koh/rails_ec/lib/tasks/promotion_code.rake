# frozen_string_literal: true

namespace :promotion_code do
  task generate: :environment do
    10.times do
      code = SecureRandom.alphanumeric(7)
      discount = rand(1..10) * 100
      PromotionCode.create(code:, discount:)
      puts "コード #{code} で#{discount}円割引"
    end
  end
end
