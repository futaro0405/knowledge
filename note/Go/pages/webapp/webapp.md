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

