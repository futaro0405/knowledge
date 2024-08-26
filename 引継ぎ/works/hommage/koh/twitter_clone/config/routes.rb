# frozen_string_literal: true

Rails.application.routes.draw do
  # 開発環境でブラウザ上でメール受信できるようにする
  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?
  devise_for :users, controllers: {
    omniauth_callbacks: 'users/omniauth_callbacks'
  }

  resources :posts, only: %i[index show create] do
    resources :likes, only: %i[create destroy]
    resources :reposts, only: %i[create destroy]
    resources :bookmarks, only: %i[create destroy]
  end

  resources :users, only: %i[show edit update] do
    resources :follows, only: %i[create destroy]
    resources :rooms, only: %i[create]
  end

  resources :bookmarks, only: %i[index]
  resources :comments, only: %i[create]
  resources :rooms, only: %i[index show]
  resources :messages, only: %i[create]
  resources :notifications, only: %i[index]

  root 'posts#index'
end
