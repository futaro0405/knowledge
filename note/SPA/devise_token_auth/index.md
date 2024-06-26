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

必ず`devise:install` を先に実施する。
末尾にUser authをつけることで、以下の設定になる。  
ユーザー認証に使うクラスをUserとする  
認証に関連するパスはauth/~となる

ユーザー認証時のルーティングを設定する。  
今回はappディレクトリ配下にapi/v1/authディレクトリを作成し、registrationsコントローラーをオーバーライドする。

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

ユーザー登録時に認証メールを送信するようにする。  
User.rbにconfirmableを追加すればOK