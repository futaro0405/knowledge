# Directory Structure

![[Pasted image 20241019171404.png]]

Ginフレームワークは非常に柔軟で、コードを整理する方法は100通りもあります。
このビデオでは、コードを簡単に整理し、メンテナンスを容易にする方法を紹介します。

これは、ログインしてノートを管理できる簡単なアプリケーションです。
自分のノートは他のユーザーには見えません。

![[Pasted image 20241019171504.png]]

コードの構造化にはMVCパターンを使用します：

- Model：データストア（データベースやファイル）とやり取りするコード
- View：クライアント側でデータを表示するためのテンプレート
- Controller：ビジネスロジックを含む

MVCについてよく知らない場合は、インターネットで学習してからこのビデオに戻ることをお勧めします。

![[Pasted image 20241019171647.png]]

プロジェクト構造の概要：

- controllers、models、templatesなどのディレクトリがあります
- main.goファイルがエントリーポイントで、ルートとコントローラーメソッドを定義しています

![[Pasted image 20241019171810.png]]

controllers フォルダ：

- Notes と Sessions の2つのコントローラーがあります
- helpersディレクトリには、コントローラーで必要なユーティリティ関数を格納しています

![[Pasted image 20241019171924.png]]

models フォルダ：

- note.go、setup.go、user.goの3つのモデルファイルがあります
- 各構造体を別々のファイルに保存しています

static フォルダ：

- CSS、JavaScript、Bootstrapなどの静的ファイルを格納します

![[Pasted image 20241019172019.png]]

templates フォルダ：

- ビュー（テンプレート）を格納します
- home と notes のサブフォルダがあります

![[Pasted image 20241019172108.png]]

middleware フォルダ：

- カスタムミドルウェアを格納します
- 例：ユーザー認証ミドルウェア

![[Pasted image 20241019172143.png]]

helpers フォルダ：

- アプリケーション全体で使用できるヘルパー関数を格納します
- 例：パスワードハッシュ関数、セッションユーティリティ関数

この構造は、私がRuby on Railsの経験から好んで使用している方法ですが、コードを整理する唯一の方法ではありません。