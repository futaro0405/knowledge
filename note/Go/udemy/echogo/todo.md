# overview
## overview
### 学習内容
- クリーンアーキテクチャの理解と実装
- Echoフレームワークと「gorm」を用いたREST APIの実装
- タスク管理（CRUD操作）とJWTを用いた認証機能の実装
- フロントエンドのReactとAPIの連携

### 実装概要
- アプリケーションでは、タスク管理と認証機能を中心にしたトレードアプリケーションを作成
- REST APIはEchoで構築し、DockerでPostgreSQLを使用してデータ管理
- APIにおけるルーティング、コントローラー、ユースケース、リポジトリ層の役割と依存関係を設定し、各層が疎結合で動作するように実装

![[Pasted image 20241027202934.png]]

### クリーンアーキテクチャの設計原則
- アプリケーションは、ルータ、コントローラー、ユースケース、リポジトリといった4層に分け、外側の層が内側のビジネスロジックに依存する形で設計。
- 依存関係は常に内側（ビジネスロジック層）に向かい、内側の変更が外側に影響しない設計とする
- 仕様変更やデータベースの変更があっても、影響を最小限に抑えるため、依存方向を管理

![[Pasted image 20241027203257.png]]
### デプロイ
- 最終的にREST APIはRender、ReactアプリケーションはVercelにデプロイ
## 本コースで使用するツールのインストール
下記リンクから本コースで使用するツールをインストールしてください。
### pgAdmin 4
- [https://www.pgadmin.org/download/](https://www.pgadmin.org/download/)

### Postman
- [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

### Node.js (LTS 推奨版)
- [https://nodejs.org/ja](https://nodejs.org/ja)

# Todo REST API with GO/Echo
## Github repo
- [https://github.com/GomaGoma676/echo-rest-api](https://github.com/GomaGoma676/echo-rest-api)

## The Clean Architecture
