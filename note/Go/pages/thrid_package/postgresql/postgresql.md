# PostgreSQLの準備
## Goの設定
PostgreSQL用のドライバをインストール
```
go get github.com/lib/pq
```
### macの場合
#### PostgreSQLのインストール
```
brew install postgresql
```

#### 文字コードをUTF-8でデータベースの初期化
```
initdb /usr/local/var/postgres -E utf8
```
#### Postgresのバージョンチェック
```
postgres --version
```
#### PostgreSQLサーバの起動
```
postgres -D /usr/local/var/postgres
```
#### psql -lでデータベース一覧を取得
```
psql -l
```
### windowsの場合
OS、バージョンに応じたインストーラをダウンロード
[PostgreSQL公式](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

![[Pasted image 20240808152941.png]]

![[Pasted image 20240808153019.png]]






インストーラによるインストール

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_01-06-26-f91c0c461455e9891aaa29b600bc7888.PNG)

ここでは例として、バージョン 13 をインストールしています。

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_01-06-26-435b1ce4ec7db78a7ed5257c6ca48f30.PNG)

しばらく待つと、インストーラが起動されます。「Next」をクリックします。

インストール先のフォルダを指定します。バージョン 13 だとデフォルトでは `C:\Program Files\PostgreSQL\13` になります。とくに変更の必要はないでしょう。変更する場合はフォルダのパスを直接入力するか、フォルダのアイコンをクリックし、起動されるダイアログでフォルダを選択します。フォルダを指定したら、「Next」をクリックします。

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_01-06-26-4553c56389caf675690469dc5f14c2c3.PNG)

インストールするコンポーネントを選択します。選択できるコンポーネントは以下のとおりです。

**コンポーネント名説明**

PostgreSQL ServerPostgreSQL のサーバ本体

pgAdmin 4PostgreSQL の管理や操作を行う GUI ツール

Stack BuilderPostgreSQL の周辺ツールをインストールするユーティリティ

Command Line ToolPostgreSQL のコマンドラインツールとライブラリ

デフォルトではすべて選択されています。PostgreSQL をサーバとして使うなら、少なくとも「PostgreSQL Server」を選択する必要があります。とくに選択を外す必要はないでしょう。選択を外す場合はコンポーネント名の前のチェックボックスをクリックし、チェックを外します。コンポーネントを選択したら、「Next」をクリックします。

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_01-06-27-26944b4f5cd285df2bcfefad8298a41a.PNG)

データベースクラスタ作成先のフォルダを指定します。データベースクラスタとはデータベースを格納する領域のことです。デフォルトではインストール先の下の `data` で、バージョン 13 だと `C:\Program Files\PostgreSQL\13\data` になります。とくに変更の必要はないでしょう。フォルダを指定したら、「Next」をクリックします。

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_01-06-27-120a5536d329a1be2b44d154aee98dd3.PNG)

スーパーユーザ `postgres` のパスワードを指定します。パスワードは確認のため、同じものを 2 回入力します。データベースへの接続時に必要になるので、忘れないように注意してください。パスワードを入力したら、「Next」をクリックします。

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_01-06-26-748c2dfdaff083d6c4f19f154b5d88ba.PNG)

クライアントからの接続を受けつけるポート番号を入力します。デフォルトでは 5432 ポートになります。複数バージョンの PostgreSQL をインストールするなどしていて、すでに 5432 ポートを使っている場合でもなければ、とくに変更の必要はないでしょう。ポート番号を入力したら、「Next」をクリックします。

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_01-06-26-a40d4016bf4026be7ac789b5df2b3a92.PNG)

デフォルトのロケールを選択します。ロケールは言語や国によって異なる文字の扱いや並び替え順を指定するものです。デフォルトの `[Default locale]` では OS の設定に基づくロケール、日本語の環境であれば `Japanese_Japan.932` が選択されます。日本語ではロケールを使う必要があまりなく、ロケールを使うと文字の処理が遅くなり、インデックスの作成時にオプションを指定しないと、`LIKE` でインデックスも使えなくなるので、ロケールを使わないことを示す `C` を選択しておきましょう。ロケールを選択したら、「Next」をクリックします。

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_01-06-26-f66c3c60c121ef240f030d081b7d1c17.PNG)

インストールの設定内容が表示されるので、確認の上、問題なければ、「Next」をクリックします。

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_01-06-26-c06d56fb5790b7d94e9785c1fa83e70a.PNG)

これでインストールの準備はできたので、このままインストールするなら、「Next」をクリックします。

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_01-06-26-92e4dedf87d2ddf72294ecc4469984cd.PNG)

インストールが開始されるので、完了するまでしばらく待ちます。

コンポーネントの選択時に Stack Builder のチェックを外してなければ、インストーラの終了後に Stack Builder を起動するかを選択します。デフォルトでは選択されています。あとでいつでも起動できるので、選択は外しておきましょう。起動するかを選択したら、「Finish」をクリックします。

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_01-06-26-2a862551bde6ccc2603541cc5ed3c84b.PNG)

スタックビルダを開いた場合は、閉じます。

  

  

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_01-06-26-cb59220a6c785a9f1dbd3bca5e907a93.PNG)

  
PostgreSQL サービスの起動と停止

PostgreSQL サーバは Windows サービスとして登録され、起動された状態になっています。また、OS の起動や停止に応じて自動的に起動や停止も行われるようになっています。

サービスを手動で起動や停止を行ったり、設定の変更を反映させるのに再起動したりするには、サービス管理コンソールを使います。サービス管理コンソールを起動するには、スタートメニューの「Windows 管理ツール」の「サービス」をクリックします。

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_01-06-26-3a77a5e35aba407320169e9db1ab68e6.PNG)

サービス一覧から PostgreSQL サービスを選択し、右クリックして表示されるメニューから行う操作をクリックします。サービス名は `postgresql-x64-13` で、名前に含まれる `13` は PostgreSQL のバージョン番号を表し、64 ビットの場合には `-x64` がつきます。

スタートメニューに PostgreSQL フォルダが作成されています。フォルダ名はバージョン 13 だと「PostgreSQL 13」になります。

  
データベースへの接続確認

![](https://img-c.udemycdn.com/redactor/raw/article_lecture/2021-03-28_01-06-26-a26e6990afa324404a34468ed8ebb4ce.PNG)

最後にデータベースに接続し、データベースの一覧を表示します。それには、スタートメニューの PostgreSQL フォルダ内の「SQL Shell (SQL)」をクリックし、psql を起動します。

  

接続先のホスト名 `Server`、データベース名 `Database`、ポート番号 `Port`、ユーザ名 `Username`、クライアント側のエンコーディング `Client Encoding`、パスワードの入力を求めるプロンプトが順番に表示されます。角カッコ内がデフォルト値を表しており、パスワード以外はデフォルト値のまま何も入力せず、`Enter` キーをタッチしていけばよいです。パスワードはインストール時に指定したものを入力します。

データベースに正常に接続できると、psql のプロンプト `postgres=#` が表示されます。そこで、`\l` と入力すれば、データベースの一覧が表示されます。データベースクラスタの作成直後は `postgres`、`template0`、`template1` の 3 つのデータベースが存在しています。psql を終了するには `\q` を入力した後に何かキーをタッチします。

PostgreSQL のインストールはこれで完了です。