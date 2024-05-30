---
tags: docker ruby-on-Rails postgresql
---

[docker-composeで開発環境を構築する](https://qiita.com/futaro0405/items/f25ef6a5b91a36ad4cf5)

# はじめに
今回はdocker composeでRuby on RailsとPostgreSQLを使用した開発環境の構築手段をまとめます。

# 開発環境について
構築する開発環境は以下のようになります。

| App名 | バージョン |
|:-- |:--:|
| Ruby | 3.2.2 |
| Ruby on Rails | 7.0.6 |
| postgres | 12 |
| docker-compose | 3.9 |

# 構築手順
## 1. 必要なファイルを作成
環境構築に必要なファイルを作成していきます。
ファイル構造は以下のようになります。

```
/raiis-docker
  ├─ Dockerfile
  ├─ Gemfile
  ├─ Gemfile.lock
  └─ Docker-compose.yml
```

### 1.1 Dockerfileを作成
Dockerfileをroot直下に作成します。
Dockerfileの記述内容は以下になります。
installが必要なアプリケーションは適宜追加してください。
今回は開発環境が決まっているのでこちらの内容になります。

```Dockerfile
FROM ruby:3.2.2
RUN apt-get update -qq && apt-get install -y \
  build-essential \
  libpq-dev \
  nodejs \
  postgresql-client \
  yarn
WORKDIR /rails-docker
COPY Gemfile Gemfile.lock /rails-docker/
RUN bundle install
```

### 1.2 Gemfileを作成
GemfileとGemfile.lockを作成します。
Gemfileの内容は以下になります。Gemfile.lockの中身は空でかまいません。

```Gemfile
source 'https://rubygems.org'
gem "rails", "~> 7.0.6"
```

### 1.3 Docker-compose.ymlを作成
Docker-compose.ymlを作成します。
Docker-compose.ymlの内容は以下になります。

```Docker-compose.yml
version: "3.9"

services:
  web:
    build: .
    ports:
      - '3000:3000'
    volumes:
      - '.:/rails-docker'
    tty: true
    stdin_open: true
```

## 2. Railsのセットアップ
以下のコマンドを実行してRailsのセットアップを行います。

```
docker compose build
docker compose exec web bash
```

コンテナ内に入りましたら以下コマンドでrailsアプリケーションを作成します。

```
rails new . --force --database=postgresql --skip-bundle
exit
```

Gemfileが新しくなったので、再度ビルドを行います。
```
$ docker-compose down
$ docker-compose up --build -d
```

## 3. DBのセットアップ
### 3.1 Docker-compose.ymlに追記
Docker-compose.ymlにDBについて追記します。

```
version: "3.9"

volumes:
  db-data:

services:
  web:
    build: .
    ports:
      - '3000:3000'
    volumes:
      - '.:/rails-docker'
    environment:
      - 'DATABASE_PASSWORD=postgres'
    tty: true
    stdin_open: true
    depends_on:
      - db
    links:
      - db

  db:
    image: postgres:12
    volumes:
      - 'db-data:/var/lib/postgresql/data'
    environment:
      - 'POSTGRES_USER=postgres'
      - 'POSTGRES_PASSWORD=postgres'
```

### 3.2 config/database.ymlを更新
`rails new`を実行したときに作成された`config/database.yml`に追記をします。
以下のように修正してください。

こちらの部分を修正します。
```config/database.yml
default: &default
  adapter: postgresql
  encoding: unicode
  # For details on connection pooling, see Rails configuration guide
  # https://guides.rubyonrails.org/configuring.html#database-pooling
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
```

こちらが修正後です。
```config/database.yml
default: &default
  adapter: postgresql
  encoding: unicode
  host: db
  user: postgres
  port: 5432
  password: <%= ENV.fetch("DATABASE_PASSWORD") %>
  # For details on connection pooling, see Rails configuration guide
  # https://guides.rubyonrails.org/configuring.html#database-pooling
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
```
## 4. RailsとDBをセットアップ
docker-composeを使用してRailsとDBがセットアップされたコンテナをbuildします。
以下のコマンドを実行してください。

```
$ docker-compose up -d
$ docker-compose exec web bash
$ # rails db:create
$ # rails g scaffold product name:string price:integer vendor:string
$ # rails db:migrate
$ # rails s -b 0.0.0.0
```

## 5. 起動時に開かれるページを設定
`config/routes.rb` を以下のように修正します。

```
Rails.application.routes.draw do
  root 'products#index'
  resources :products
end

```

## 6. `docker-compose up`でrails serverを起動できるようにする
`command`の記述を`docker-compose.yml`に追記します。

```
web:
    build: .
    command: bundle exec rails s -p 3000 -b '0.0.0.0'
    ports:
      - '3000:3000'
    volumes:
      - '.:/rails-docker'
    environment:
      - 'DATABASE_PASSWORD=postgres'
    tty: true
    stdin_open: true
    depends_on:
      - db
    links:
      - db
```

以上でdocker-composeでRails&postgreSQLの環境構築が完成です。
最後まで読んでいただきありがとうございました。

# コマンド一覧
今後よく使うであろうコマンドを一覧でまとめます。
なにかの役に立ててください。

| コマンド | 用途 |
|:--|:--|
| docker-compose build | docker imageの作成 |
| docker-compose up | docker containerを作成して起動<br>`-d`オプション : デタッチモード<br>`--build`オプション : docker imageのビルドから作成 |
| docker-compose stop | docker containerを停止 |
| docker-compose down | docker containerを停止＆削除 |



# 参照
https://docs.docker.jp/compose/rails.html
