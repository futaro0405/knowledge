# frozen_string_literal: true

Rails.application.routes.draw do
  # 開発環境でブラウザ上でメール受信できるようにする
  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?

  namespace :api do
    namespace :v1 do
      # Usersテーブル
      get 'users/:user_name', to: 'users#show'
      post 'profile', to: 'users#update'

      mount_devise_token_auth_for 'User', at: 'users', controllers: {
        # confirmationはUnsafe redirect toのエラー対応のため、変更を加えた同名自作メソッドを使用
        confirmations: 'api/v1/auth/confirmations'
      }

      # ログイン確認
      namespace :auth do
        resources :sessions, only: %i[index]
      end

      # Postsテーブル
      post 'tweets', to: 'posts#create'
      get 'tweets', to: 'posts#index'
      get 'tweets/:id', to: 'posts#show'
      delete 'tweets/:id', to: 'posts#destroy'

      # Postsテーブルの画像登録
      post 'images', to: 'posts#attach_images'

      # Commentsテーブル
      post 'comments', to: 'comments#create'
      get 'tweets/:tweet_id/comments', to: 'comments#index'
      delete 'comments/:id', to: 'comments#destroy'

      # Repostsテーブル
      post 'tweets/:tweet_id/retweets', to: 'reposts#create'
      delete 'tweets/:tweet_id/retweets', to: 'reposts#destroy'

      # Likesテーブル
      post 'tweets/:tweet_id/favorites', to: 'likes#create'
      delete 'tweets/:tweet_id/favorites', to: 'likes#destroy'

      # Followsテーブル
      post 'users/:user_name/follows', to: 'follows#create'
      delete 'users/:user_name/follows', to: 'follows#destroy'

      # Noftificationsテーブル
      get 'notifications', to: 'notifications#index'

      # Groups, Messagesテーブル
      get 'groups', to: 'groups#index'
      post 'groups', to: 'groups#create'
      get 'groups/:group_id/messages', to: 'messages#index'
      post 'groups/:group_id/messages', to: 'messages#create'

      # Bookmarksテーブル
      get 'bookmarks', to: 'bookmarks#index'
      post 'tweets/:tweet_id/bookmarks', to: 'bookmarks#create'
      delete 'tweets/:tweet_id/bookmarks', to: 'bookmarks#destroy'
    end
  end
end
