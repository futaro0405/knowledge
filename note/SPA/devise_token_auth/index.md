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

必ず