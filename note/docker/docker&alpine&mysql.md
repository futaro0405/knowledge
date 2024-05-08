---
tags: docker
---

```
docker run --rm -ti -v ./rails-practice:/app ruby:3.2.2-alpine sh
```
`docker run`
特定のイメージからコンテナを実行

`ruby:3.2.2-alpine`
コンテナのもとになるイメージ名
alpine linux環境にruby v3.2.2がインストールされたイメージを指定
alpine linuxは余計なものが入っておらず軽量

`sh`
イメージから作成されたコンテナ上で実行するコマンド

`--rm`
コンテナを終了したときにコンテナを自動で削除するオプション

`-ti`
コンテナでシェルを立ち上げた際にシェルでコマンドを実行したり、コマンドの結果を画面に表示するために必要
docker runで実行した場合は必要

`-v ./rails-practice:/app`
PC上の`rails-practice`を`app`にマウントする指定

windowsの場合

`-v $(pwd)\rails-practice:/app`

  
  

```

apk update

```

  

`apk`

alpine linuxで使用するパッケージ管理システム

  

`apk update`

インストール可能なパッケージのリストを最新の状態に更新する

  

```

apk add git g++ make mysql-dev

```

  

`apk add`

指定したパッケージのインストール

  

```

gem update --system

```

  

gemのパッケージ管理システムそのものをアップデート

  

```

gem install rails -v 7.0.6

```

  

railsのgemをインストール

  
  

```

rails new app --database=mysql --skip-bundle --skip-test

```

  

`app`

docker runコマンドにつけた以下のオプションのappディレクトリと同一にする必要がある

`-v ./rails-practice:/app`

  

`--database=mysql`

MySQLを使用した構成で設定ファイルなどを書き換えてくれる

  

`--skip-bundle`

Railsに関連したパッケージのインストールを自動では行わないようにスキップさせる

bundlerというツールを使用して、アプリーケーションに必要なgemの依存関係の管理やインストールなどを行ってくれるが、後で行うためここではスキップ

  

`--skip-test`

テスト環境の構築をスキップ

使用するテストツールによって必要なものが変わってくるためデフォルトのテスト関連はスキップする

  
  

## `dockerfile`作成

  

## `docker-compose.yml`作成

  

`docker compose build`

docker-composeファイルからイメージのbuild

  

`docker image ls`

作成したイメージの確認

  

`docker compose up`

docer-compose.yml ファイルを読み込んでコンテナを起動

`-d`オプション：バックグラウンドで起動

  

`docker compose ps`

コンテナの状態を確認

  

`docker compose stop`

コンテナを停止

  

```

docker compose exec web rails db:crete

```

  

`docker compose exec web`

webのコンテナでコマンドを実行する

  
  

# Railsアプリケーション開発

  

## Ruby on Railsとは

- Rubyで書かれたWebアプリケーションフレームワーク

- フレームワークにはWebアプリケーション開発に必要な基本的な機能があらかじめ用意されている

- ある程度コードを書く際のルールが決まっている

  

## Railsの基本理念

- 同じことは繰り返すな(Don't Reperat Yourself:DRY)

- 設定より規約が優先される(Convention Over Configuration)

  

## MVCアーキテクチャ

Model,View,Controllerの役割にわけ、コードを書く

  

Controller

ユーザーからのリクエストを受け、モデルとビューの仲介役をし、最終的にユーザーにwebページのコンテンツを返す役割をする

  

Model

データの管理やビジネスロジックといってデータの管理を記載

  

view

HTMLを作成する部分

BRB

  
  
  

# 新しいwebページの作成

`config/routes.rb`

ページのルーティングを設定

  

`controller/application_controller.rb`

  

`views/boards/index.html.erb`

  
  

# Bootstrap

- webのUIを作成するためのフレームワーク

- 画面のレイアウトを作成したり、予めデザインされたボタン、フォームなどのパーツを利用できる

  
  

```

docker compose run web rails g model board author_name: string title:string body:text

```

  

`rails generate model`

新しいmodelを作成するためのひな型のファイルを作成

  

`board author_name: string title:string body:text`

作成するモデル名とそのmodelで扱うカラム名と型のペアを指定する

Boardモデルを作成

このマイグレーション実行で

この名前に対応する"boards"テーブルがDB上に作成される

  

```

docker compose run web rails db:migrate

```

  

`rails db:migrate`

まだ実行されていないマイグレートを実行

  

```

docker compose run web rails db;rollback

```

  

直前のmigrateを取り消す

  
  
  

# RESTfulについて

- Webアプリケーションの設計方法の1つ

- HTTPメソッドを使ってWebのリソースを操作する際の設計方法

- Railsにおいてリソースとは、ユーザーや掲示板の情報など、主にデータベースのテーブルのデータのこと

  

## ブラウザから送信するHTTPリクエストメソッドと役割

- GET

  - リソースの取得

- POST

  - リソースの作成

- PATCH

  - リソースの部分更新

- PUT

  - リソースの置き換え

- DELETE

  - リソースの削除

  

## HTTPリクエストメソッドとコントローラ、アクションの対応表

  

![Alt text](image.png)