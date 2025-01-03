# create notes app
`GOPATH/src`ディレクトリに移動します。
プロジェクト用の新しいディレクトリを作成し、そのディレクトリに移動します。
「gin-notes」という名前で新しいGoモジュールを初期化します。
正しいコマンドは「go mod init」です（「in mod」ではありません）。
前回の「hello_gin」プロジェクトから、templatesとstaticフォルダをコピーします。
これにより、再度作成する手間が省けます。

```tarminal
cd $GOPATH/src
mkdir gin_notes
cd gin_notes
go mod init gin_notes
cp ../hello_gin/templates . -r
cp ../hello_gin/static . -r
```

![[Pasted image 20241019181404.png]]

プロジェクトをVS Codeで開きます。
headerテンプレートを開き、プロジェクトのタイトルを変更します。 「Notes app」と名付けましょう。
「hello_gin」プロジェクトからmain.goファイルもコピーし、タイトルを変更します。
プログラムを実行する前に、ターミナルを開きます。
必要なパッケージをダウンロードし、サーバーを起動します。
ブラウザでURLにアクセスします。
プログラムが正常に動作することを確認します。

これらの手順により、新しい「Notes app」プロジェクトの基本的なセットアップが完了します。前回のプロジェクトからファイルを再利用することで、効率的に新しいプロジェクトを始めることができます。
# GORM integration

![[Pasted image 20241019183152.png]]

![[Pasted image 20241019183642.png]]

1. GORM（Go Object Relational Mapper）を深く学ぶ前に、データベースとユーザーを作成しましょう。
2. rootユーザーとしてMySQLコンソールを開きます。

```
sudo mysql
```

```
CREATE USER 'notes'@'localhost' IDENTIFIED BY 'tmp_pwd';
CREATE DATABASE notes
```

1. アプリケーションがデータベースにアクセスするための新しいユーザーを作成します。
2. アプリケーション関連のすべてのテーブルを保持する新しいデータベースを作成します。
3. 作成したユーザーにデータベースへのアクセス権を付与します。
4. 必要なライブラリをインストールします：
    - まず、GORMライブラリをインストールします。
    - MySQLを使用してデータベーステーブルを保存するため、MySQLドライバーもインストールします。

![[Pasted image 20241019183949.png]]

![[Pasted image 20241019184110.png]]

1. コードに戻り、データベースに接続する関数を作成します：
    - 新しいMySQLコネクションを開きます。
    - 接続文字列を入力します（ユーザー名、パスワード、localhost、ポート3306、データベース名「notes」）。
    - UTF-8文字セットを使用します。
    - エラーがあればログを記録し、プログラムを停止します。
2. データベース接続を保存する変数を作成します。
3. プログラムの初期化時にconnectDatabase関数を呼び出します。
4. サーバーを起動します。
5. データベース接続に失敗した場合は、エラーを確認します。
    - この場合、パスワードが間違っていたようです。
6. パスワードを修正します。
7. サーバーを再起動します。

これらの手順により、データベースの設定とアプリケーションとの接続が行われます。パスワードの誤りのような小さな問題も、迅速に特定し修正することが重要です。

# GORM -First data model

![[Pasted image 20241019184625.png]]

1. モデルを作成するために、新しく「models」フォルダを作成します。
2. そのフォルダ内に「note.go」ファイルを作成します。
3. パッケージ名を「models」と定義します。
4. ノートの構造を定義します：
    - ID: プライマリーキー、uint64型、GORMパラメータで主キーと指定
    - Name: string型、GORMパラメータでサイズを指定
    - Content: string型、GORMパラメータでtext型として指定
    - CreatedAt, UpdatedAt: タイムスタンプ用、インデックスを追加
    - DeletedAt: ソフトデリート用、インデックスを追加
5. モデルの定義だけでは実際のテーブルは作成されません。テーブルを作成するには、マイグレーションを実行する必要があります。

![[Pasted image 20241019184716.png]]

![[Pasted image 20241019185228.png]]

1. main.goファイルに戻り、「dbMigrate」関数を作成します：
    - db.AutoMigrate(&models.Note{})を呼び出します
2. main関数内でdbMigrate関数を呼び出します。
3. サーバーを起動します。エラーが発生した場合は、括弧の欠落を修正します。

![[Pasted image 20241019185353.png]]

1. アプリケーションで使用している認証情報でMySQLコンソールを開きます。
2. データベースを選択し、テーブルを表示します。
3. マイグレーションによって「notes」テーブルが作成されたことを確認します。
4. テーブルの構造を確認します：
    - SHOW CREATE TABLE notes; コマンドを使用
5. テーブルがモデルで定義したとおりに作成されていることを確認します（全てのカラムとインデックスを含む）。

この手順により、GORMを使用してモデルを定義し、それに基づいてデータベーステーブルを自動的に作成する方法が示されています。これはコードファーストアプローチと呼ばれ、データベーススキーマの管理を容易にします。

# Model Reorg

![[Pasted image 20241019190152.png]]

![[Pasted image 20241019190329.png]]

1. コードを少し再構成しましょう。
2. main.goファイルにある「connectDatabase」と「dbMigrate」という2つの関数は、main.goに置くのは適切ではありません。
3. これらの関数はデータベースのセットアップに関連しているので、modelsフォルダに移動させましょう。
4. modelsフォルダ内に新しいファイル「setup.go」を作成します。
5. setup.goファイルの先頭に「package models」と記述します。
6. main.goファイルから該当するコードをsetup.goにコピーします。
7. 関数名を変更して、パッケージ外からアクセスできるようにします（main.goから呼び出す必要があるため）。
    - 例：「connectDatabase」→「ConnectDatabase」
    - 例：「dbMigrate」→「DbMigrate」
8. 同じパッケージ内なので、モデルの参照時にパッケージ名を明示する必要はありません。
9. main.goファイルに戻り、関数呼び出しを変更します：
    - 「models.ConnectDatabase()」
    - 「models.DbMigrate()」

この再構成により、コードの構造がより明確になり、関連する機能がグループ化されます。データベース関連の設定がmodelsパッケージにまとめられ、main.goファイルがよりシンプルになります。これは、コードの保守性と可読性を向上させる良い実践です。

# First Controller - Index page

![[Pasted image 20241019190616.png]]



1. 最初のコントローラーを作成します：
    - 「controllers」フォルダを新規作成
    - 「notes_controller.go」ファイルを作成
    - パッケージ名を「controllers」と定義
2. システム内の全ノートを返す関数「NotesIndex」を実装：
    - パラメータとして「*gin.Context」を受け取る

![[Pasted image 20241019221900.png]]

1. モデルに「NotesAll」関数を実装：
    - 「note.go」ファイルに移動
    - 関数「NotesAll」を定義（ノートのリストのポインタを返す）
    - GORMを使用してクエリを作成：削除されていないノートを更新日時の降順で取得

![[Pasted image 20241019222014.png]]

1. コントローラーに戻り、取得したノートデータをHTMLでレンダリング：
    - c.HTML()を使用してステータスコード200とテンプレートを指定
    - 取得したノートデータを渡す

![[Pasted image 20241019222258.png]]

1. インデックスページ用のテンプレートを作成：
    - 「templates/notes」フォルダを作成
    - 「index.html」ファイルを作成
    - 基本構造を「home/index.html」からコピー
    - テンプレートパスを「notes/index.html」に変更
    - 見出しを「All Notes」に変更
    - ノートをループで表示するコードを追加

![[Pasted image 20241019222404.png]]

1. ルートを作成：
    - 「main.go」に移動
    - 「r.GET("/notes", controllers.NotesIndex)」を追加
2. サーバーを起動し、ブラウザで「localhost:8080/notes」にアクセス：
    - ページは表示されるが、ノートがまだ存在しないため何も表示されない
3. 次のビデオでは、ノートを作成するメカニズムを実装する予定

この手順により、基本的なMVCの構造（Model-View-Controller）が実装されました。次のステップでは、実際にデータを作成・保存する機能を追加することで、アプリケーションの機能が拡張されていきます。

# New Note Form Page

![[Pasted image 20241019222947.png]]

1. 新しいルートを作成します：
    - r.GET("/notes/new", controllers.NotesNew) を追加

![[Pasted image 20241019223023.png]]

1. notesControllerに新しい関数を実装します：
    - NotesNew 関数を作成し、*gin.Context をパラメータとして受け取ります
    - この関数は新しいノートを作成するためのフォームをレンダリングします
    - c.HTML() を使用して "notes/new.html" テンプレートをレンダリングします

![[Pasted image 20241019223221.png]]

1. 新しいテンプレートファイルを作成します：
    - templates/notes ディレクトリに new.html を作成
    - テンプレートのパスを定義し、基本構造を index.html からコピーします
2. フォームを追加します：
    - Bootstrap のドキュメントを参照し、基本的なフォームのコードをコピーします
    - フォームを自分たちのニーズに合わせて修正します：
        - 最初の入力フィールドをノートの名前に変更
        - 2番目のフィールドをノートの内容用のテキストエリアに変更
    - フォームのアクション（送信時の処理）を追加します
3. サーバーを起動し、/notes/new にアクセスします：
    - ページの要素は表示されますが、Bootstrap CSSが適用されていないことに気づきます
    - ページを調査し、コンソールでエラーを確認します
    - Bootstrap CSSファイルのパスに問題があることが分かります

![[Pasted image 20241019223457.png]]

1. header.html のCSSのパスを修正します：
    - スラッシュが不足していたため、相対パスで検索していました
2. ページを更新し、Bootstrap CSSが正しく適用されていることを確認します

![[Pasted image 20241019223557.png]]

1. notes/index ページに "New Note" ボタンを追加します：
    - サーバーを再起動し、/notes にアクセスします
    - "New Note" ボタンが表示され、クリックすると /notes/new ページに移動することを確認します

これらの手順により、新しいノートを作成するためのフォームページが実装され、既存のインデックスページからアクセスできるようになりました。次のステップでは、このフォームから実際にデータを保存する機能を実装することになるでしょう。

# New Note Creation

![[Pasted image 20241019224014.png]]

1. ノート新規作成ページで、開発者ツールのNetworkタブを開きます。
2. フォームを送信すると、404エラー（ページが見つかりません）が表示されます。これは予想通りの動作です。まだこのルートを実装していないからです。
3. 送信されたペイロードを確認すると、nameとcontentの2つのパラメータが送られていることがわかります。

![[Pasted image 20241019224856.png]]

1. このルートを実装します：
    - POST APIとして `/notes` に設定します。
    - ハンドラ関数を渡します。

![[Pasted image 20241019225018.png]]

1. NotesControllerに新しい関数を実装します：
    - フォームデータを読み取るために、Ginの`c.PostForm()`メソッドを使用します。
    - nameとcontentの値を取得します。

![[Pasted image 20241019225126.png]]

1. 新しいノートを作成するモデル関数を呼び出します。
2. ノートモデルに新しい関数を実装します：
    - パラメータとしてnameとcontentを受け取ります。
    - 新しいノートのインスタンスを作成し、パラメータを設定します。
    - `db.Create()`を使用してデータベースに新しい行を作成します。

![[Pasted image 20241019225308.png]]

1. コントローラに戻り、エントリが作成された後、ノート一覧ページにリダイレクトします：
    - `c.Redirect()`を使用し、HTTPステータス301（恒久的に移動）で `/notes` にリダイレクトします。
2. サーバーを再起動し、ブラウザでテストします：
    - 新しいノートを作成し、送信すると、ノート一覧ページにリダイレクトされ、作成したノートが表示されます。

![[Pasted image 20241019225523.png]]

1. コンソールにtime.Timeデータ型のエラーが表示される場合：
    - modelsのsetup.goファイルで接続文字列に `parseTime=true` を追加します。
2. サーバーを再起動し、再度テストします。今回はコンソールにエラーが表示されないはずです。

![[Pasted image 20241019231003.png]]

1. MySQLコンソールで、レコードが正しく作成されていることを確認します。

これらの手順により、新しいノートを作成し、データベースに保存する機能が実装されました。
また、時間データ型の処理に関する小さな問題も解決されました。

# Beautification - Use Bootstrap Card view

![[Pasted image 20241019231353.png]]

1. ビューをもう少し改善しましょう。
2. Bootstrapのドキュメントに戻ります。
3. 「Card」というBootstrapコンポーネントを使用します：
    - カードは非常に使いやすいコンポーネントです。
    - Bootstrapの「Components」セクションから「Card」を選択します。
    - さまざまな種類のカードとそのコードがこのページにあります。
    - 画像付き、画像なし、ボタン付き、リンク付きなど、多様なカードがあります。
4. ノートを表示するためにカードレイアウトを使用します。
5. カードのリストを表示するためにグリッドビューを使用します：
    - Bootstrapの「Layout」セクションから「Grid」を選択します。
    - このページには、Bootstrapを使って構築できる様々なグリッドビューが示されています。
6. コードに戻り、「notes/index.html」を開きます。
7. カードのグリッドを作成します：
    - 時間を節約するため、この部分の実装は動画で早送りされています。
8. サーバーを再起動します。
9. ブラウザで「/notes」にアクセスします。
10. カードビューが使用されていることが確認できます。

この手順により、ノートの表示がよりビジュアル的に魅力的になり、ユーザーフレンドリーなインターフェースが実現されます。Bootstrapのコンポーネントを活用することで、簡単に美しいデザインを実装できることがわかります。

# CRUD - Show API

![[Pasted image 20241019231645.png]]

1. 次のAPI、Show APIを作成します。このAPIは特定のノートの詳細を表示します。
2. notesディレクトリに新しいテンプレート「show.html」を作成します：
    - new.htmlテンプレートをコピーし、フォームを削除します。
    - index.htmlから要素をコピーし、h5をh1に変更します。

![[Pasted image 20241019232945.png]]

1. main.goに新しいルートを追加します：
    - r.GET("/notes/:id", controllers.NotesShow)

![[Pasted image 20241019233056.png]]

1. NotesControllerに新しいハンドラーメソッドを実装します：
    - URLからIDパラメータを読み取ります（c.Param("id")）。
    - IDを文字列からuint64に変換します（strconv.ParseUint）。
    - 変換エラーがあれば出力します。

![[Pasted image 20241019233207.png]]

1. ノートの詳細を取得するモデル関数を呼び出します：
    - models.NotesFind(id)
2. モデルにNotesFind関数を実装します：
    - パラメータとしてIDを受け取り、ノートのポインタを返します。
    - GORMを使用してクエリを実行：db.Where("id = ?", id).First(&note)

![[Pasted image 20241019233305.png]]

1. コントローラーに戻り、ビューをレンダリングします：
    - c.HTML(http.StatusOK, "notes/show.html", gin.H{"note": note})
2. サーバーを起動し、エラーを修正します：
    - c.paramsをc.Paramに修正

![[Pasted image 20241019233344.png]]

1. ブラウザで "/notes/1" にアクセスし、ID 1のノートが表示されることを確認します。

![[Pasted image 20241019233432.png]]

1. index.htmlビューに「View」ボタンを追加して、各ノートの詳細ページへのリンクを作成します。
2. ブラウザで "/notes" にアクセスし、各ノートに「View」ボタンが表示されていることを確認します。
3. 「View」ボタンをクリックして、正常に動作することを確認します。

これらの手順により、個々のノートの詳細を表示するShow APIが実装され、ノート一覧ページから各ノートの詳細ページにアクセスできるようになりました。

# CRUD - Edit

![[Pasted image 20241019234301.png]]

1. notesフォルダに新しいHTMLテンプレート「edit.html」を作成します：
    - show.htmlの内容をコピーし、テンプレート名を変更します。
    - コードブロックを削除し、フォームを追加します（new.htmlからコピー）。
    - フォーム内で編集中のノートの詳細を事前に入力します。
    - フォーム送信時、"/notes/:id"のPOST APIを呼び出すように設定します。

![[Pasted image 20241019234741.png]]

1. main.goに新しいルートを追加します：
    - r.GET("/notes/edit/:id", controllers.NotesEdit)

![[Pasted image 20241019234924.png]]

1. NotesControllerに新しいハンドラー関数を実装します：
    - URLからIDを取得し、uint64に変換します。
    - ノートの詳細を取得し、edit.htmlテンプレートをレンダリングします。
2. サーバーを起動し、ブラウザで "/notes/edit/1" にアクセスしてテストします。

![[Pasted image 20241019235111.png]]

1. フォーム送信時の404エラーを解決するため、POST APIを実装します：
    - main.goに新しいルートを追加：r.POST("/notes/:id", controllers.NotesUpdate)

![[Pasted image 20241019235237.png]]

1. NotesControllerにUpdateハンドラー関数を実装します：
    - URLからIDを取得し、ノートの詳細を取得します。
    - フォームから新しい名前と内容を読み取ります。

![[Pasted image 20241020085421.png]]

1. ノートモデルにUpdate関数を実装します：
    - 名前と内容を更新し、データベースに保存します。

![[Pasted image 20241020085528.png]]

1. コントローラーでUpdate関数を呼び出し、ノートを更新します。
2. 更新後、ノートの詳細ページ（/notes/:id）にリダイレクトします。
3. サーバーを再起動し、ブラウザでテストします。

![[Pasted image 20241020085645.png]]

1. show.htmlテンプレートに編集と削除のボタンを追加します：
    - ボタングループを作成し、編集と削除ボタンを追加します。
    - 削除機能は次のビデオで実装予定です。
2. サーバーを再起動し、ノート一覧から個別のノートページにアクセスして、新しく追加された編集と削除ボタンを確認します。

これらの手順により、ノートの編集機能が実装され、ユーザーインターフェースが改善されました。次のステップでは、削除機能の実装が予定されています。

# CRUD - Delete

![[Pasted image 20241020090053.png]]

![[Pasted image 20241020090519.png]]

![[Pasted image 20241020090611.png]]

1. ノートの削除にHTTP DELETEメソッドを使用します。HTMLはDELETEメソッドをサポートしていないため、JavaScriptを使用してDELETE APIを呼び出します。
2. HTMLテンプレートにスクリプトブロックを追加し、`sendDelete`関数を作成します：
    - XMLHttpRequestを使用してAPI呼び出しを行います。
    - イベントのデフォルトアクションを防ぐため、`preventDefault()`を呼び出します。
    - `readystatechange`イベントのコールバックを設定します。
    - 操作が完了したら（readyState === 4）、レスポンスのURLに画面を遷移させます。
    - DELETEメソッドでリクエストを開き、送信します。
3. 削除ボタンのonclickイベントに`sendDelete`関数を設定します。

![[Pasted image 20241020090653.png]]

1. main.goにDELETE APIのルートを追加します。

![[Pasted image 20241020090758.png]]

1. NotesControllerに削除ハンドラー関数を実装します：
    - URLからIDパラメータを取得します。
    - `models.NotesMarkDelete(id)`関数を呼び出してノートを削除します。
    - 削除後、ノート一覧ページ（/notes）にリダイレクトします。

![[Pasted image 20241020090903.png]]

1. ノートモデルに`NotesMarkDelete`関数を実装します：
    - GORMを使用して、指定されたIDのノートの`deleted_at`フィールドを現在時刻に更新します。
    - クエリ：`UPDATE notes SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`
2. サーバーを再起動し、ブラウザでテストします：
    - /notesページに移動し、任意のノートを表示します。
    - 削除ボタンをクリックすると、ノートが削除され、ノート一覧ページにリダイレクトされます。

この実装により、ソフトデリート（論理削除）機能が追加されました。削除されたノートは実際にはデータベースから削除されず、`deleted_at`フィールドに削除時刻が記録されます。これにより、必要に応じてデータを復元することが可能になります。