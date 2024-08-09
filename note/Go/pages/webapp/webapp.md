# 1.各種設定
1. configの設定
2. logの設定

ここから簡単なTodoアプリケーションを作成していきます。
GoでのCRUD(Create, Read, Update, Delete)処理について、学習します。
デザインは非常にシンプルなので、各自カスタマイズしていただけると嬉しいです。
## configの設定
config.ini作成
config.go作成
configList
LoadConfig
init
main.go作成

## logの設定
utils/logging.go作成
config..goのinitにloggingSettingsを設定

# 2.User
1. DBの作成 + Userテーブルの設定、作成
2. ユーザーの作成（Create）
3. ユーザーの取得（Read）
4. ユーザーの更新（Update）
5. ユーザーの削除（Delete)

## DBの作成 + Userテーブルの設定、作成
app/models/base.goの作成