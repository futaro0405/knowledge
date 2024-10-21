# App Intro and setup

![[Pasted image 20241021220006.png]]
次のプロジェクトは「Facebookでログイン」機能を持つ簡単なアプリケーションを構築します。

1. アプリケーションの特徴：
    - Facebookを使用してサインインします。
    - FacebookのアクセストークンをDBに保存します。
    - GoogleやTwitterなど、他のOAuth認証も簡単に追加できるよう設計されています。



1. Facebookアプリケーションの作成手順：
	1. developers.facebook.comにアクセスし、「My Apps」に移動します。
	2. 「Create App」をクリックします。
	3. アプリのタイプを選択します（ここでは「Consumer」を選択）。
	4. アプリの表示名とメールアドレスを入力します。
	5. 「Create App」をクリックします（注：名前に「Facebook」を含めることはできません）。

1. アプリケーションのセットアップ
	1. ダッシュボードで「Facebook Login」をクリックします。
	2. プラットフォームとして「Web」を選択します。
	3. サイトのURLを入力します（ここでは「localhost:9000」）。
	4. 「Continue」をクリックし、その後数回「Next」をクリックしてセットアップを完了します。

これらの手順により、FacebookのOAuth認証を使用するためのアプリケーションの基本的なセットアップが完了します。
# Project Setup
![[Pasted image 20241021220623.png]]

1. 新しいプロジェクト「blog」を作成します。
    - セットアップの過程は以前行ったものと同じなので、早送りします。
2. VSCodeでプロジェクトを開きます。
3. 以前の「login」プロジェクトから必要なファイルをコピーします：
    - main.go
    - templatesフォルダ
    - staticフォルダ
4. 必要なパッケージをすべてインストールするために、`go get .`を実行します。

![[Pasted image 20241021220745.png]]

1. これまでアプリケーションの実行にはデフォルトのポート8080を使用していましたが、今回はポートを9000に変更します：
    - r.Run()の引数に"0.0.0.0:9000"を指定します。
2. サーバーを再起動します。
3. ブラウザで「localhost:9000」にアクセスし、アプリケーションが正常に読み込まれることを確認します。

# FB app Integration

![[Pasted image 20241021220916.png]]

- oauth2パッケージとginパッケージをインストールします。
- index.htmlテンプレートの見出しを「Facebook Login」に変更します。

![[Pasted image 20241021221151.png]]

- oauth2.Configのインスタンスを作成し、以下の項目を設定します：
    - ClientID と ClientSecret（Facebook開発者ページからコピー）
    - Scopes（アプリケーションがアクセスする機能やAPI）
    - Endpoint（Facebookのエンドポイント）
    - RedirectURL（テスト用に "localhost:9000/facebook/auth" を使用）

![[Pasted image 20241021221230.png]]

![[Pasted image 20241021221304.png]]

- ホームページにログインボタンを追加し、Facebook認証URLにリンクさせます。

![[Pasted image 20241021221424.png]]

- "/facebook/auth" ハンドラーを実装します：
    - URLから認証コードを取得
    - コードを使用してアクセストークンを取得
    - トークンをJSON形式でレンダリング

![[Pasted image 20241021221550.png]]

- アクセストークンを使用してユーザー情報を取得する処理を追加：
    - "graph.facebook.com/me" にAPIリクエストを送信
    - ID、名前、メールアドレスを取得
    - 取得した情報をマップに格納し、JSONでレンダリング
- サーバーを再起動し、ブラウザでテスト：
    - ホームページでログインボタンをクリック
    - Facebook認証ページにリダイレクト
    - 認証後、ユーザーの情報（メール、ID、名前）が表示される