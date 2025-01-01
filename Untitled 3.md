

---

## 4. Login and Logout

ユーザーが一度アカウントを作ったら、次は**ログイン**して認証付きのページを閲覧できるようにします。また、**ログアウト**してセッションを切る仕組みも用意します。

### カスタムミドルウェアを活用したセッション管理

全APIでセッション状態を確認するのは面倒なので、**ミドルウェア**を使って共通処理を挟み込みます。

1. `middleware/auth.go` に `AuthenticateUser()` 関数を定義。
2. このミドルウェアで `sessions.Default(c)` からセッションを取得し、ユーザーIDを確認する。
3. ユーザーIDが存在すれば、`c.Set("userID", user.ID)` や `c.Set("email", user.Email)` のように Ginのコンテキストに格納しておく。
4. `r.Use(middleware.AuthenticateUser())` のように設定すると、すべてのリクエストでこの認証チェックが行われるようになる。

### main.goでのセッションストア設定

```go
store := memstore.NewStore([]byte("secret"))
r.Use(sessions.Sessions("mysession", store))
r.Use(middleware.AuthenticateUser())
```

- 最初にGinのsessionsミドルウェアを登録し、次にカスタムミドルウェアを登録。
- これにより、`AuthenticateUser`関数内でセッションを正しく取得できる。

### ログインの実装

`SessionsController` にて:

```go
func Login(c *gin.Context) {
    email := c.PostForm("email")
    password := c.PostForm("password")

    user := models.UserCheck(email, password)  // email と password を検証
    if user == nil {
        // エラー(ユーザーが見つからないorパスワード不一致)
        c.Redirect(http.StatusFound, "/login")
        return
    }

    // セッションにユーザーIDを保存してログイン状態を記録
    SessionSet(c, user.ID)
    c.Redirect(http.StatusFound, "/")
}
```

`UserCheck` 関数は、メールアドレスでユーザーを検索し、パスワードのハッシュをチェックする仕組みを内部で持ちます。

### ログアウト

```go
func Logout(c *gin.Context) {
    SessionClear(c)
    c.Redirect(http.StatusFound, "/login")
}
```

メニューなどでログアウトを選ぶとセッションがクリアされ、その後は認証がない状態に戻ります。

---

## 5. add user id to the models

認証機能が整っても、**今のままでは全ノートが全ユーザーに見えている**可能性があります。これをユーザーごとに保護するため、ノートモデルにユーザーIDを持たせ、所有者しか操作できないようにします。

### ノートモデルにUserIDフィールドを追加

```go
type Note struct {
    ID        uint64         `gorm:"primaryKey"`
    Name      string         `gorm:"size:255"`
    Content   string         `gorm:"type:text"`
    UserID    uint64         `gorm:"index"`
    CreatedAt time.Time
    UpdatedAt time.Time
    DeletedAt gorm.DeletedAt `gorm:"index"`
}
```

- `UserID` がノートの所有者を示す。
- すでに作られたテーブルにマイグレーションをかけると、新しいカラム`user_id`が追加される。
- 古いノートは `user_id = null` になるため、あとで必要に応じてデータを更新します。

### ノート取得/作成時にUserIDを考慮

#### 例：NotesAll

```go
func NotesAll(userID uint64) []Note {
    var notes []Note
    Db().Where("deleted_at IS NULL AND user_id = ?", userID).
         Order("updated_at desc").
         Find(&notes)
    return notes
}
```

#### 例：NotesCreate

```go
func NotesCreate(userID uint64, name, content string) {
    note := Note{
        Name:    name,
        Content: content,
        UserID:  userID,
    }
    Db().Create(&note)
}
```

### コントローラ側の変更

`NotesIndex` などノート一覧を表示する関数で、**現在ログインしているユーザーID** をセッションまたはコンテキストから取得し、それをモデルのパラメータに渡します。

```go
func NotesIndex(c *gin.Context) {
    userID := c.GetUint64("userID")
    if userID == 0 {
        c.HTML(http.StatusUnauthorized, "errors/401.html", gin.H{
            "message": "未認証アクセスです",
        })
        return
    }

    notes := models.NotesAll(userID)
    c.HTML(http.StatusOK, "notes/index.html", gin.H{
        "notes": notes,
    })
}
```

- こうすることで、ログイン済みユーザーのノートだけが表示されるようになる。
- 他のAPI（詳細表示・新規作成・編集・削除）も同様に、**UserIDを必ずチェック**し、該当ユーザーのノートだけ操作できるようにします。

---

## 6. 最終動作確認

1. **データベーススキーマの変更**
    - `models/setup.go` に `Db().AutoMigrate(&Note{}, &User{})` のように追記し、ノートとユーザーテーブルを最新化。
    - MySQLコンソールなどで `DESCRIBE notes;` を行い、`user_id` カラムが追加されたことを確認。
2. **既存のノートの`user_id`を手動で設定**
    - `UPDATE notes SET user_id = 1 WHERE ...` のようにSQLで複数レコードを更新し、様々なユーザーに分けて割り当て。
3. **動作チェック**
    - ログインしたユーザーは自分のノートだけが見える。
    - 他のユーザーでログインすると、そのユーザーに紐づけられたノートしか見えない。
    - ログアウトすればノート一覧にはアクセスできず、「未認証アクセス」などのメッセージが表示される。

こうして**ユーザー単位でのノート管理**が実現し、アプリがよりセキュアかつ使いやすいものに仕上がります。

---

## まとめ

今回の手順を通して、以下の機能がそろいました。

1. **bcrypt** を用いた安全なパスワードハッシュ化
2. **sessions** を用いたログイン状態の管理（サインアップ / ログイン / ログアウト）
3. ノートモデルに `UserID` フィールドを追加し、**ユーザー専用のノート**を作成・閲覧できる仕組み
4. カスタムミドルウェアでセッションをチェックして、認証必須ページへのアクセス制御を行う

これらが揃うと、**複数ユーザーが同じアプリを使っても、お互いのノートが見えない**状態を作れます。さらに発展させるには、次のようなトピックを検討してみてください。

- **パスワードリセット機能**（メール送信によるリセットリンク）
- **トークン認証**（JWTなどを利用して、スケールしやすい分散環境に対応）
- **OAuth**（GoogleやGitHubなどの外部サービスを使ったログイン）
- **アクセスポリシーの厳密化**（APIレベルでさらにきめ細かい権限制御を行う）

これらはさらにセキュアでリッチなユーザー体験を実装するための道筋です。今回の構成が**Go × Gin × GORM** での認証の基本形となるので、ぜひ活用してみてください。