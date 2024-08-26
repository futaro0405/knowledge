# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :admin do
    resources :orders, only: %i[index show]
    resources :products, only: %i[index show new create edit update destroy]
  end
  resources :products, only: %i[index show]
  resources :cart_products, only: %i[create destroy]
  resources :orders, only: %i[index create]
  root 'products#index'

  post 'register_promotion_code', to: 'promotion_codes#register'
  post 'cancel_promotion_code', to: 'promotion_codes#cancel'

  # ルーティングが存在しないパスへアクセスしたとき、ルートへリダイレクトする。
  # この際、'rails/active_storage'が含まれているパスはリダイレクト対象外にする
  get '*path', to: redirect('/'), constraints: ->(req) { req.path.exclude? 'rails/active_storage' }
end
