1. DB 初期化／マイグレーション
    - app/db/init.sql に、docs/db/db.md で決めた CREATE TABLE 文を書き込む。
	- Docker Compose で MySQL（あるいは Postgres）が立ち上がることを確認し、docker-compose up → docker exec でテーブル定義が反映されるか確認。
2. 設定ファイルの整備
    - app/config/database.go で、環境変数（DB_HOST、DB_USER、DB_PASS、DB_NAME…）を読み込むように修正。
    - main.go の起動処理で database.go の Connect 関数を呼び、エラーなく接続できるかテストログを出す。
3. **モデル（構造体）の定義**
    - app/models/user.go をはじめ、他テーブル分の Go 構造体を作る。
    - gorm／sqlx タグや JSON タグを付けて、DB カラムとマッピングできるようにする。    
4. **リポジトリ層の実装**
    - app/repositories/user_repository.go の中に、CRUD 用のメソッド（CreateUser、FindByID、UpdateUser など）を定義。
    - 他テーブル分のリポジトリも同様に作成。
        
    
5. **サービス層の骨子作り**
    
    - app/services/user_service.go で、リポジトリを使ったビジネスロジック（パスワードハッシュ化→保存、認証処理など）を実装。
        
    - 他ドメイン（Workout, Exercise…）のサービスも同じパターンで。
        
    
6. **コントローラ／ルーター実装**
    
    - app/controllers にハンドラを置き、router/router.go でエンドポイントをマッピング。
        
    - まずはユーザー登録・取得あたりのシンプルな API (POST /users、GET /users/:id) を動かしてみる。
        
    
7. **動作確認→拡張**
    
    - Postman などで上記エンドポイントを叩き、「DB に正しくデータが入る／返ってくる」ことを確認。
        
    - 問題なければ、Workout → Exercise → Set → Thread → Comment… の順に同じ流れで実装を広げていく。
        
    

---

最初は「DB 定義 → 接続 → モデル → リポジトリ → サービス → コントローラ」の順で、各レイヤーを１エンティティずつ固めていくイメージです。まずは User 周りを動かして「全体のパイプライン」が通ることを確認し、そのあと他テーブルに同じ構造をコピーしていくと効率的です。