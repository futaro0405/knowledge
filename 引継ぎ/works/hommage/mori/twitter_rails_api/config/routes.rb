# frozen_string_literal: true

Rails.application.routes.draw do
  mount LetterOpenerWeb::Engine, at: '/letter_opener'
  namespace :api do
    namespace :v1 do
      mount_devise_token_auth_for 'User', at: 'users'
      resources :sessions, only: %i[index]
      resources :tweets, only: %i[index create show destroy] do
        resources :comments, only: %i[index], module: :tweets
        resource :retweets, only: %i[create destroy], module: :tweets
        resource :favorites, only: %i[create destroy], module: :tweets, controller: :nices
      end
      resources :users, only: %i[show], controller: :profiles do
        resource :follow, only: %i[create], module: :users
        resource :unfollow, only: %i[destroy], module: :users, controller: :follows
      end

      resources :groups, only: %i[index create] do
        resources :messages, only: %i[index create], module: :groups
      end

      resources :images, only: %i[create]
      put '/profile', to: 'profiles#update'
      resources :users, only: %i[show], controller: :profiles
      resources :comments, only: %i[create destroy]
      resources :notifications, only: %i[index]
      resources :bookmarks, only: %i[index create destroy]
    end
  end

  resources :tasks
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
