# README

ECサイト課題の資材。

## 開発環境setup

```
docker compose build
docker compose run --rm web bin/setup
docker compose run --rm web yarn install
docker compose up
docker compose exec web rails db:migrete
docker compose exec web rails db:seed
```

http://localhost:3000

## 本番環境Herokuでのsetup

* produciton_prepareに前回アプリ削除前の情報あり
* Amazon S3設定。以下を参考にActive StorageでHerokuのproduction環境でAmazon S3を設定する
  * https://qiita.com/tochisuke221/items/189a9dacd2c4c27c0d14
  * https://qiita.com/jibiking/items/0e8c1d826271ac9e4a7d
  * https://qiita.com/tsubasan1122/items/0171fe04754a760f7e4a
* Herokuでの環境変数設定
* メール送信時のURLを新たに作られたアプリのパスに変更
* コマンド
```sh
# アプリケーション作成
heroku apps:create
# アプリケーションリネーム
heroku apps:rename hc-koh-rails-ec
# DB作成
heroku addons:create heroku-postgresql:mini
# 資材push
git push heroku main
# DB migrate
heroku run rails db:migrate
# テストデータ作成
heroku run rails db:seed
```

## rubocop
auto correct
```
docker compose run --rm web bundle exec rubocop -A
```

## htmlbeautifier
erbのフォーマッター
```
docker compose run --rm web bin/htmlbeautifier
```
