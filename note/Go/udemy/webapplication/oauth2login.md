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

# Store User and Oauth data in database

1. Facebookを使用したログインとアクセストークンの取得方法を学びました。次は、アプリケーションをデータベースに接続し、情報を保存します。
2. MySQLをデータベースとして使用します：
    - rootでMySQLにログインします。
    - アプリケーション用の新しいユーザーを作成します。
    - 新しいデータベースを作成します。
    - 作成したユーザーにデータベースの全権限を付与します。
3. 今回は、プロジェクト内でマイグレーションを作成せず、SQLコマンドでデータベースを管理します。ただし、データベースとの通信にはGORMを使用します。
4. 以下の2つのテーブルを作成します：
    - users: ID、名前、メール、作成日時、更新日時を含む
    - oauth_users: ユーザーIDとOAuthプロバイダ（Facebook等）からの情報を保存
5. プロジェクトに戻り、データベース接続を設定します：
    - modelsフォルダにsetup.goファイルを作成
    - ConnectDatabase関数を実装してGORMを使用してデータベースに接続
6. main関数でConnectDatabase関数を呼び出し、アプリケーション起動時にDB接続を確立します。
7. usersとoauth_usersテーブルに対応するモデルを作成します：
    - user.goとoauth_user.goファイルを作成し、それぞれの構造体を定義
8. main.goのauth関数（ログイン成功時のコールバック）を修正：
    - トークン取得時のエラーハンドリングを追加
    - エラーがある場合はホームページにリダイレクト
    - ログイン成功時の処理を追加（この部分はまだ実装されていない様子）

この実装により、Facebookログイン機能とデータベース接続の基本的な設定が完了しました。次のステップでは、ログイン成功時にユーザー情報をデータベースに保存し、アプリケーション内でのセッション管理を実装することになるでしょう。

1. ユーザープロファイルを作成または更新するため、モデル関数を呼び出し、トークンを渡します。
2. user.goにUpdateOrCreate関数を実装します：
    - パラメータ：oauth2.Token型のtoken
    - 戻り値：作成または更新されたユーザーへのポインタ
3. ユーザー詳細の取得とOAuthユーザーテーブルへの保存は、OAuthUserモデルで実装します：
    - oauth_user.goにStoreDetails関数を実装
4. StoreDetails関数の実装：
    - Facebookのグラフ APIを呼び出してユーザー情報を取得
    - レスポンスボディのデコードとエラーハンドリング
    - ユーザーのID、メール、名前を取得
    - OAuthプロバイダを "Facebook" に設定
    - プロフィール画像は後で実装するため、現時点では空白に
5. OAuthUserインスタンスの作成と既存エントリの更新：
    - プロバイダとメールアドレスで既存のエントリを検索
    - 既存のエントリが見つかった場合（ID != 0）、最新情報で更新：
        - 名前
        - プロフィール画像
        - アクセストークン
        - トークン有効期限
6. 新規エントリの場合：
    - 新しいOAuthUserレコードを作成
7. ユーザーテーブルの更新または作成：
    - OAuthUserのメールアドレスを使用してユーザーを検索
    - 既存のユーザーがいない場合、新しいユーザーを作成
    - ユーザー情報を更新（名前、メールアドレス）
8. 更新されたユーザー情報を返す

この実装により、FacebookのOAuth認証後にユーザー情報をデータベースに保存または更新する機能が追加されました。これにより、アプリケーションは認証されたユーザーの情報を追跡し、必要に応じて更新することができます。

1. OAuthユーザーの更新または新規作成：
    - トークンタイプ、リフレッシュトークン、更新日時を追加
    - 既存のエントリがない場合、新しいOAuthユーザーを作成
    - プロバイダ、メール、UID、ユーザーID（初期値0）、作成日時を設定
    - データベースに新しいレコードを作成
2. ユーザーモデルに戻り：
    - 作成または更新されたOAuthユーザーを取得
    - ユーザーテーブルにエントリがない場合、新しいユーザーを作成
    - ユーザーのメールアドレスでデータベースを検索
    - 存在しない場合、新しいユーザーレコードを作成
3. OAuthユーザーモデルに新しい関数を追加：
    - UpdateUserID関数：OAuthユーザーエントリのユーザーIDを更新
    - ユーザーオブジェクトのポインタを受け取り、OAuthユーザーのユーザーIDを更新
4. ユーザーモデルに戻り：
    - UpdateUserID関数を呼び出してOAuthユーザーのユーザーIDを更新
    - 最後にユーザーオブジェクトのアドレスを返す
5. APIハンドラ関数の更新：
    - 不要なコードを削除
    - ユーザーが更新または作成された後、セッションを作成する（この機能はまだ実装されていない）
    - 最後にホームページにリダイレクト
6. 現時点での機能：
    - OAuthユーザーの作成または更新
    - 必要に応じて新しいユーザーエントリの作成
    - OAuthユーザーオブジェクトのユーザーID更新
    - ユーザーオブジェクトの返却
7. アプリケーションを実行して、データベースに新しいOAuthユーザーとユーザーが作成されるか確認

この実装により、FacebookのOAuth認証後にユーザー情報をデータベースに保存または更新する基本的な機能が追加されました。セッション管理はまだ実装されていませんが、ユーザーデータの保存と更新の基礎が整いました。次のステップでは、セッション管理を追加し、ユーザー認証の完全なフローを実装することになるでしょう。

1. サーバーを起動し、ブラウザでログインボタンをクリックします。
2. Facebookの認証情報を入力します（既にログインしている場合は不要）。
3. データベースを確認し、OAuthユーザーが作成されたことを確認します。
4. ユーザーテーブルを確認しますが、空になっています。
5. ログを確認すると、モデルに誤って追加された「AccessToken」フィールドによるエラーが見つかります。
6. モデルから「AccessToken」フィールドを削除し、アプリケーションを再起動します。
7. 再度ログインし、ユーザーテーブルを確認すると、エントリが作成されています。
8. コードに戻り、ユーザーのプロフィール画像を取得する機能を追加します：
    - getFBProfilePic関数を作成し、UIDとアクセストークンをパラメータとして受け取ります。
    - Facebook Graph APIを呼び出し、幅と高さを720pxに設定してプロフィール画像を取得します。
    - JSONレスポンスから画像URLを抽出します。
9. OAuthユーザーのstoreDetails関数内で、getFBProfilePic関数を呼び出してプロフィール画像URLを設定します。
10. サーバーを再起動し、再度ログインします。
11. MySQLでOAuthユーザーテーブルを確認し、プロフィール画像URLが設定されていることを確認します。
12. プロフィール画像URLをブラウザに貼り付けて開き、正しく表示されることを確認します。

この実装により、FacebookのOAuth認証後にユーザーのプロフィール画像URLも取得し、データベースに保存できるようになりました。これにより、アプリケーション内でユーザーのプロフィール画像を表示することが可能になります。

# Authenticate with Facebook
1. セッション機能をプロジェクトに追加します：
    - 「Helpers」フォルダを作成し、前回のプロジェクトからセッションヘルパー関数をコピーします。
    - 必要なパッケージをインストールします。
2. main関数でセッションを初期化します。
3. Facebookログインハンドラー関数でログイン成功後にセッションを作成します：
    - helpers.SessionSet()を呼び出し、コンテキストとユーザーIDを渡します。
4. ログアウトハンドラーを実装します：
    - セッションをクリアします。
    - main関数にログアウト用のPOST APIを追加します。
5. ホームページハンドラーを新しい関数「Home」に移動します：
    - ユーザーがログインしている場合、ユーザー情報を表示します。
6. セッションからユーザー情報を抽出するミドルウェアを実装します：
    - 「Middlewares」フォルダを作成し、前回のプロジェクトからミドルウェアをコピーします。
    - main関数にミドルウェアを追加します。
7. セッションからユーザーオブジェクトを取得する新しい関数「GetUserFromSession」を作成します：
    - コンテキストからユーザーIDを取得し、ユーザーオブジェクトを返します。
8. Homeハンドラーでユーザーオブジェクトを取得し、ビューに渡します。
9. index.htmlテンプレートを変更し、ユーザー情報の表示を追加します：
    - ユーザーがログインしている場合、メールIDとログアウトボタンを表示します。
    - ログインしていない場合、ログインボタンを表示します。
10. サーバーを再起動し、ブラウザでテストします：
    - ログイン後、ホームページにメールIDとログアウトボタンが表示されます。
    - ログアウト後、セッションがクリアされ、ログインボタンが表示されます。

この実装により、Facebookログイン、セッション管理、ユーザー情報の表示、ログアウト機能が完成しました。これにより、ユーザーは自身の情報を確認し、セッションを管理できるようになりました。