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

# 3.Todo
1. Todoテーブルの作成
2. Todoの作成（Create）
3. Todoの取得（シングルセレクト）（Read）
4. Todoの取得（マルチセレクト）
5. Todoの取得（マルチセレクト２）
6. Todoの更新（Update)
7. Todoの削除（Delete)
# 4.Server
1. サーバーを呼び出す
2. JqueryとBootstarapを設定する
3. よく使うレイアウトを共通化する

## difine
`{‌{difine "layout"}}{‌{end}}`や`{‌{template "content"}}{‌{end}}`などはGoのテンプレートエンジンの記法です。
この例ではlayoutテンプレートとして定義し、その中で部品となるcontentテンプレートをincludeしています。
### GenelateHTMLの中身

**template.Must**
```go
//テンプレートのキャッシュを作成
//template.Must()は独自にエラーチェックを行うため、errorを返り値には持たず、ハンドリングする必要がありません。
//つまりParseFilesがエラーの場合、panicになる。
//template.ParseFiles()は可変長引数をとり、その引数としてキャッシュさせたいファイルの名前を指定します。
templates := template.Must(template.ParseFiles(files...))
```
**template.ExecuteTamplate**
```go
//difineでテンプレートを定義した場合、ExecuteTemplateでlayoutを明示的に指定する必要がある
 templates.ExecuteTemplate(writer, "layout", data)
```

# 5.authenticate
1. ユーザーの登録ページの作成
2. ユーザーのログインページの作成
3. ユーザーのログアウト１
4. ユーザーのログアウト２
# 6.route_main
1. Todoの一覧ページの作成
2. Todoの作成ページの作成
3. Todoの更新ページの作成
4. Todoの削除の作成

# sample_todoのコード
このサンプルアプリケーションのソースコードをまとめて以下にアップしております。

もし分からなくなったりコードがうまく実行できなくなった場合は、以下のコードを参考にしてみてください。
```
go mod init sample_todo
go mod tidy
go run main.go
```
で実行可能です

# herokuで公開準備
## github登録
gitについては、レクチャー３gitをインストールするを参考にしてください。

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_00-56-31-9efcc4ce4e8aecfccaac01abed5aba13.png)

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_00-56-31-26331b2725e709236c9ffdd062d06263.png)

Username Email PassWordを入力して、アカウントを作成します。

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_00-56-31-e21be2667dab36444b7eb5cd90e78fee.png)

無料プランを選択します。

  

アカウントを作成したら、リポジトリを作成します。

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_03-11-32-d2153001acc60743c2a88a053caac7f2.png)

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_03-12-04-17b38cdc8002c82e181adea5f3e38a88.PNG)

リポジトリを作成しましたら、下記のようになります。

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_03-12-21-81188cb15209e17ab64e6b613010fb22.PNG)

**次回で使用するコマンド**

...or create a new repository on the command lineの中のコマンドを使用して、githubに保存します。

  

> heroku登録

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_00-57-07-18c404bc3f239a4a975812050018079d.PNG)

アカウントを作成します。

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_00-57-08-d958a3a884c6adacf16dfacf085fcf3a.PNG)

OSに合わせてインストールします。

下記画像を参考に進めてください。

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_00-57-07-a028e560d5b86a446e319052a727bf37.PNG)

コマンドラインツールをインストールしたら、ターミナルもしくはコマンドラインで確認します。

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_00-57-07-60ddb7cbfd57ab7929bb77e784f33c7a.PNG)