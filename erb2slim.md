erb2slimを使うためのセットアップ
`slim-rails`
Ruby on Railsのデフォルトテンプレートエンジンは`erb`
`slim`を使うために`gem`をインストールする

`html2slim`
`erb`を`slim`に変換する`gem`

```gemfile
gem 'slim-rails'
gem 'html2slim'
```

`bundle install`を行う。

`html2slm`を実際に使ってみる
```
# erbファイルを残す
erb2slim app/views/layouts/application.html.erb
# erbファイルを削除して変換
erb2slim app/views/layouts/application.html.erb　-d
```
`rails generate`コマンドで作成されるファイルを`slim`で作成する場合は`config/application.rb