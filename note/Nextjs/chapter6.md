# データベースのセットアップ
ダッシュボードの作業を続ける前に、いくつかのデータが必要です。  
この章では、`@vercel/postgres`を使用してPostgreSQLデータベースをセットアップします。  
PostgreSQLに既に精通しており、自身のプロバイダーを使用したい場合は、この章をスキップして独自にセットアップすることができます。  
そうでなければ、続けましょう！  

この章では... 以下のトピックを扱います。  

1. プロジェクトをGitHubにプッシュする。
2. Vercelアカウントをセットアップし、即時プレビューとデプロイメントのためにGitHubリポジトリをリンクする。
3. Postgresデータベースを作成し、プロジェクトにリンクする。
4. 初期データでデータベースをシードする。

これらの手順を通じて、アプリケーションのためのデータベース環境を整えていきます。  

# GitHubリポジトリの作成
まずは、まだ行っていない場合、リポジトリをGitHubにプッシュしましょう。  
これにより、データベースのセットアップとデプロイが容易になります。  

リポジトリのセットアップに助けが必要な場合は、[GitHubのこのガイド](https://help.github.com/en/github/getting-started-with-github/create-a-repo)を参照してください。  

## 知っておくと良いこと

- GitLabやBitbucketなど、他のGitプロバイダーを使用することもできます。
- GitHubが初めての方には、簡素化された開発ワークフローのためにGitHub Desktopアプリをお勧めします。

# Vercelアカウントの作成
vercel.com/signup にアクセスしてアカウントを作成してください。  
無料の「ホビー」プランを選択します。  
**Continue with GitHub**を選択して、GitHubアカウントとVercelアカウントを連携させます。  

# プロジェクトの接続とデプロイ
次に、以下の画面に移動し、作成したばかりのGitHubリポジトリを選択して**インポート**できます。  
この画面では、GitHubリポジトリを選択してVercelにインポートする操作を行います。  
これにより、プロジェクトをVercelプラットフォームに接続し、自動デプロイの設定を行うことができます。  

![[Pasted image 20241011202451.png]]

プロジェクトに名前を付け、**Deploy**（デプロイ）をクリックしてください。  

![[Pasted image 20241011202817.png]]

おめでとうございます！🎉 プロジェクトがデプロイされました。

![[Pasted image 20241011202859.png]]

GitHubリポジトリを接続したことで、**main**ブランチに変更をプッシュするたびに、Vercelは設定不要で自動的にアプリケーションを再デプロイします。  
プルリクエストを開く際には、即時プレビューが利用可能となり、デプロイメントのエラーを早期に発見し、チームメンバーとプロジェクトの [プレビュー](https://vercel.com/docs/deployments/preview-deployments#preview-urls)を共有してフィードバックを得ることができます。  

# Postgresデータベースの作成
次に、データベースをセットアップするために、**Continue to Dashboard**をクリックし、プロジェクトダッシュボードから**Storage**タブを選択してください。  
**Connect Store** → **Create New** → **Postgres** → **Continue**を選択します。

![[Pasted image 20241011203602.png]]

利用規約に同意し、データベースに名前を付け、データベースのリージョンが **Washington D.C (iad1)** に設定されていることを確認してください。  
これは新しいVercelプロジェクトの[default region](https://vercel.com/docs/functions/configuring-functions/region)でもあります。  
アプリケーションコードと同じまたは近いリージョンにデータベースを配置することで、[データリクエストの遅延](https://developer.mozilla.org/en-US/docs/Web/Performance/Understanding_latency)を減らすことができます。  

![[Pasted image 20241011210946.png]]

**覚えておくこと**
データベースの初期化後はリージョンを変更できません。  
別の [リージョン](https://vercel.com/docs/storage/vercel-postgres/limits#supported-regions)を使用したい場合は、データベースを作成する前に設定してください。  

接続後、`.env.local`タブに移動し、**Show secret**と**Copy Snippet**をクリックしてください。  
コピーする前に必ずシークレットを表示してください。  

![[Pasted image 20241011211157.png]]

コードエディタに移動し、`.env.example`ファイルを`.env`にリネームします。  
Vercelからコピーした内容を貼り付けてください。  

**重要**：`.gitignore`ファイルを確認し、`.env`が無視されるファイルに含まれていることを確認して、GitHubにプッシュする際にデータベースのシークレットが公開されないようにしてください。

最後に、ターミナルで`pnpm i @vercel/postgres`を実行して、[Vercel Postgres SDK](https://vercel.com/docs/storage/vercel-postgres/sdk)をインストールしてください。

# データベースのシード
データベースが作成されたので、初期データでシードしましょう。

`/app`内に`seed`というフォルダがあります。  
このファイルのコメントを解除してください。  
このフォルダには`route.ts`というNext.jsの[Route Handler](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)が含まれており、データベースのシードに使用されます。  
これはブラウザでアクセスしてデータベースの入力を開始できるサーバーサイドのエンドポイントを作成します。  

コードの動作をすべて理解する必要はありませんが、概要として、このスクリプトは**SQL**を使用してテーブルを作成し、`placeholder-data.ts`ファイルのデータを使用してテーブル作成後にデータを入力します。  

`pnpm run dev`でローカル開発サーバーが実行中であることを確認し、ブラウザで`localhost:3000/seed`にアクセスしてください。  
完了すると、ブラウザに "Database seeded successfully" というメッセージが表示されます。  
完了後、このファイルは削除できます。  

## トラブルシューティング

- データベースのシークレットを`.env`ファイルにコピーする前に、必ず表示してください。
- スクリプトはユーザーのパスワードのハッシュ化に`bcrypt`を使用しています。`bcrypt`が環境と互換性がない場合は、代わりに`bcryptjs`を使用するようにスクリプトを更新できます。
- データベースのシード中に問題が発生し、スクリプトを再実行したい場合は、データベースクエリインターフェースで`DROP TABLE テーブル名`を実行して既存のテーブルを削除できます。詳細は以下のクエリ実行セクションを参照してください。ただし、このコマンドはテーブルとそのすべてのデータを削除するので注意してください。プレースホルダーデータを使用しているサンプルアプリでは問題ありませんが、本番アプリでこのコマンドを実行すべきではありません。
- Vercel Postgresデータベースのシード中に引き続き問題が発生する場合は、GitHubでディスカッションを開いてください。

# データベースの探索
データベースがどのようになっているか見てみましょう。  
Vercelに戻り、サイドナビの**Data**をクリックしてください。  

このセクションでは、4つの新しいテーブル（users、customers、invoices、revenue）が見つかります。  

![[Pasted image 20241011212140.png]]

各テーブルを選択すると、そのレコードを表示でき、`placeholder-data.ts`ファイルのデータとエントリが一致していることを確認できます。  

# クエリの実行
「query」タブに切り替えて、データベースと対話することができます。  
このセクションは標準的なSQLコマンドをサポートしています。  
例えば、`DROP TABLE customers`と入力すると、"customers"テーブルとそのすべてのデータが削除されます。   
そのため注意してください！  

最初のデータベースクエリを実行しましょう。  
以下のSQLコードをVercelインターフェースに貼り付けて実行してください。  

```sql
SELECT invoices.amount, customers.name
FROM invoices
JOIN customers ON invoices.customer_id = customers.id
WHERE invoices.amount = 666;
```
