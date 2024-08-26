# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

Product.destroy_all

# db/seeds.rb

products = [
  {
    name: 'メンズカジュアルTシャツ',
    sku: 'TS001',
    price: 2500,
    stock: 100,
    description: 'クラシックなデザインのメンズTシャツ。快適な綿素材で、白、黒、青、赤のカラーバリエーションから選択可能。'
  },
  {
    name: 'レディースデニムジーンズ',
    sku: 'DJ002',
    price: 3800,
    stock: 75,
    description: 'スタイリッシュなレディースデニムジーンズ。サイズとカラーのバリエーションで個性を表現。'
  },
  {
    name: 'キッズスポーツシューズ',
    sku: 'SS003',
    price: 2200,
    stock: 50,
    description: '子供用のスポーツシューズ。軽量で快適、白、黒、ピンク、青のカラーで楽しい遊びをサポート。'
  },
  {
    name: 'ウィンターコート',
    sku: 'WC004',
    price: 6500,
    stock: 40,
    description: '暖かくてスタイリッシュなウィンターコート。寒冷地に対応し、グレー、ネイビー、カーキのカラーバリエーション。'
  },
  {
    name: 'ベビーコットンロンパース',
    sku: 'CR005',
    price: 1200,
    stock: 60,
    description: '赤ちゃん用のコットンロンパース。やさしい素材で快適さと可愛さを提供。ピンク、ブルー、イエローから選択可能。'
  },
  {
    name: 'スポーツジャケット',
    sku: 'SJ006',
    price: 4200,
    stock: 30,
    description: 'スタイリッシュなスポーツジャケット。運動中や日常のアウトドア活動に最適。機能的で快適な素材を使用。'
  },
  {
    name: 'ユニセックスビーニー帽',
    sku: 'BH007',
    price: 800,
    stock: 120,
    description: 'シンプルなデザインのビーニー帽。暖かく、ファッショナブル。男女兼用で着こなせる。'
  },
  {
    name: 'ワークブーツ',
    sku: 'WB008',
    price: 5500,
    stock: 45,
    description: '丈夫で快適なワークブーツ。作業現場やアウトドアでの使用に適しています。'
  },
  {
    name: 'イブニングドレス',
    sku: 'ED009',
    price: 9800,
    stock: 25,
    description: '華やかなイブニングドレス。パーティーや特別なイベントにぴったり。魅力的なシフォン素材を使用。'
  },
  {
    name: 'ベビーカーシート',
    sku: 'CS010',
    price: 6000,
    stock: 35,
    description: '赤ちゃんのための快適なカーシート。安全性と快適さを両立させたデザイン。多彩なカラーオプション。'
  }
]

products.each do |product_data|
  product = Product.new(product_data)
  product.image.attach(io: File.open(Rails.root.join("app/assets/images/#{product.name}.jpg")),
                       filename: "#{product.name}.jpg")
  product.save
end
