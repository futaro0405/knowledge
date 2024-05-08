---
tags: ruby-on-Rails slim
---
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
`rails generate`コマンドで作成されるファイルを`slim`で作成する場合は`config/application.rb`を編集する

```ruby:config/application.rb
module App
	class Application < Rails::Application
		config.generators.template_engine = :slim
	end
end

```


`html2slm`を使用して`slim`に変換する際にerrorが発生する場合

```
NoMethodError: undefined method exists? for File:Class
```
発生原因
`html2slm`内で使用しているFile.exists?メソッドがRuby3.2から削除されたため

https://docs.ruby-lang.org/ja/2.3.0/method/File/s/exists=3f.html

対処法
`html2slm`のFile.exists?を書き換える

`--trace`を追加して実行してエラーが発生しているファイルを特定する
```
erb2slim app/views/layouts/application.html.erb --trace
```

中身を修正する
```
vim /usr/local/bundle/gems/html2slim-0.2.0/lib/html2slim/converter.rb
```

```ruby
...
erb = File.exist?(file) ? open(file).read : file
...
```

対処法2
本家の`html2slm`を使用することにこだわりがなければRuby3に対応した`html2slim-ruby3`を使用する

https://rubygems.org/gems/html2slim-ruby3

```Gemfile
gem 'html2slim-ruby3'
```
