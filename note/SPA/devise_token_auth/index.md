# devise_token_auth
## devise_token_authとは
`devise_token_auth`はRailsおけるトークンベースの認証機能を作成する際に用いられるgemです。
フロントとバックを分けて開発する際に使用されます。

## 環境設定
まずは必要なgemをインストールします。

```
gem "devise"
gem "devise_token_auth"
gem "rack-cors"
```

```
bundle install
```

deviseとdevise_token_authをインストール

```
rails g devise:install
rails g devise_token_auth:install User auth
```

```
rails g controller v1/auth/registrations
```

```ruby:app/controller/api/v1/auth/registrations_controller.rb
class V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
end
```

```ruby:config/route.rb
Rails.application.routes.draw do
	namespace :api do
		namespace :v1 do
			mount_devise_token_auth_for 'User', at: 'auth', controllers:  {
				registrations: 'api/v1/auth/registrations'
			}
		end
	end
end
```

```
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable #　追加
```