現在のアプリには認証機能がなく、URLを知っていれば誰でもすべてのノートにアクセスできる状態です。これを解消し、ユーザー単位でノートを管理するために、サインアップやログイン、セッション管理などを導入していきましょう。この章では、その認証機能を実装する手順を解説します。

# ログイン・サインアップページの用意

本格的な認証機能を実装する前に、まずは**ログイン**と**サインアップ**のフォームページを用意します。

## テンプレートフォルダの名称変更

最初に作成した `template/views` フォルダを、`template/home` にリネームしましょう。合わせて、すべてのルートやHTML読み込みのパスを更新する必要があります。

```html:app/templates/home/index.html
{{ define "views/index.html"}}
    {{ template "layouts/header.html" .}}
    <h1>{{.title}}</h1>
    {{ template "layouts/footer.html" .}}
{{ end }}
```

そして、`main.go`では次のようにHTMLを描画しています。

```go:app/main.go
r.GET("/", func(c *gin.Context) {
    c.HTML(http.StatusOK, "home/index.html", gin.H{
        "title": "Note Application",
    })
})
```

## サインアップページとログインページの新規作成

`app/templates/notes/new.html` を参考にして、以下の2つのテンプレートを作成してください。

- `templates/home/signup.html`
- `templates/home/login.html`

### サインアップページ

サインアップ用フォームでは「メールアドレス」「パスワード」「パスワード確認」の3つの入力フィールドを用意し、`<form action="/signup" method="POST">` のように送信先を指定します。

```html:app/templates/home/signup.html
{{ define "home/signup.html"}}
    {{ template "layouts/header.html" .}}
        <h1>Sign Up</h1>
        <form class="row g-3" action="/signup" method="POST">
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="text" class="form-control" id="email" aria-describedby="emailHelp" name="email">
                <div id="emailHelp" class="form-text">Email of the user</div>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password">
            </div>
            <div class="mb-3">
                <label for="password_confirmation" class="form-label">Password Confirmation</label>
                <input type="password" class="form-control" id="password_confirmation" name="password_confirmation">
            </div>
            <button type="submit" class="btn btn-primary">Sign Up</button>
        </form>
    {{ template "layouts/footer.html" .}}
{{ end }}
```

### ログインページ

ログインページは「メールアドレス」と「パスワード」の2つだけ入力フィールドが必要です。パスワード確認用のフィールドは不要なので、下記のように簡潔に作成します。

```html:app/templates/home/login.html
{{ define "home/login.html"}}
    {{ template "layouts/header.html" .}}
        <h1>Login</h1>
        <form class="row g-3" action="/login" method="POST">
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="text" class="form-control" id="email" aria-describedby="emailHelp" name="email">
                <div id="emailHelp" class="form-text">Email of the user</div>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password">
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
    {{ template "layouts/footer.html" .}}
{{ end }}
```

## ルートとコントローラの設定

`main.go`にサインアップページとログインページを表示するルートを追加します。

```go:app/main.go
r.GET("/login", controllers.LoginPage)
r.GET("/signup", controllers.SignupPage)
```

次に、コントローラ側（例：`notes_controller.go`）で単にテンプレートを返す処理を実装します。

```go
func LoginPage(c *gin.Context) {
    c.HTML(http.StatusOK, "home/login.html", nil)
}

func SignupPage(c *gin.Context) {
    c.HTML(http.StatusOK, "home/signup.html", nil)
}
```

### トップページ（index.html）にボタンを追加

トップページ（`index.html`）にも、「ログイン」「サインアップ」へのリンクボタンを配置しましょう。

```html:app/templates/home/index.html
{{ define "views/index.html"}}
    {{ template "layouts/header.html" .}}
        <h1>{{.title}}</h1>

        <div class="d-grid gap-2 col-6 mx-auto">
            <a href="/signup" class="btn btn-primary">Sign Up</a>
            <a href="/login" class="btn btn-primary">Login</a>
        </div>
    {{ template "layouts/footer.html" .}}
{{ end }}
```

これで、トップページからログイン・サインアップフォームに遷移できる導線ができました。

---

# ヘルパー関数の作成

ログインやサインアップ用の画面は整いましたが、実際にユーザーをデータベースに登録したり、ログイン状態を保持したりするロジックはまだ実装していません。そこで、**認証機能を実装するために必要なライブラリ**を導入し、それを使ってパスワードとセッションを扱う**ヘルパー関数**を作ります。

## bcryptライブラリ

ユーザーパスワードを安全にハッシュ化し、データベースに保存するためのライブラリです。既存のハッシュと照合して認証する仕組みも簡単に実装できます。

## sessionsライブラリ

ユーザーがログインしている状態を維持するため、サーバー側でセッションを管理するライブラリです。RedisやMemcached、MongoDB、PostgreSQLなど、複数のバックエンドをサポートしています。  
これらのライブラリを組み合わせることで、**パスワード管理**と**ログイン状態の保持**が実現できます。

### パッケージのインストール

```bash
go get golang.org/x/crypto/bcrypt
go get github.com/gin-contrib/sessions
```

### パスワードハッシュ化用のヘルパー関数

`helpers`フォルダを作成し、その中に `password_hashing.go` を置きます。

```go:app/helpers/password_hashing.go
package helpers

import (
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
```

- **HashPassword**: ユーザーが入力した平文パスワードをbcryptでハッシュ化し、その結果を文字列として返します。
- **CheckPasswordHash**: フォームから送られた平文パスワードと、DBに保存されているハッシュを照合し、一致するかどうかを判定します。

### セッション管理用のヘルパー関数

続いて、`helpers/session.go` を作り、ログイン状態（ユーザーIDなど）をセッションに保存・取得・クリアする関数をまとめます。

```go:app/helpers/sessions.go
package helpers

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

type Session struct {
	ID uint64
}

func SetSession(c *gin.Context, userId uint64) {
	session := sessions.Default(c)
	var idinterface interface{} = &Session{ID: userId}
	session.Set("id", idinterface)
	session.Save()
}

func GetSession(c *gin.Context) uint64 {
	session := sessions.Default(c)
	id := session.Get("id")
	return id.(uint64)
}

func ClearSession(c *gin.Context) {
	session := sessions.Default(c)
	session.Clear()
	session.Save()
}
```

- **SetSession**: ログイン成功時に、ユーザーIDをセッションに格納します。
- **GetSession**: ログインしているかどうか判定するときにセッションからIDを取り出します。
- **ClearSession**: ログアウト時にセッション情報を消去します。

---

# ユーザーモデルの作成

GORMで使用するユーザーモデルを定義し、データベースに「users」テーブルを作成できるようにします。

```go
package models

import "time"

type User struct {
	ID        uint64    `gorm:"primaryKey"`
	Username  string    `gorm:"size:64;not null;unique"`
	Email     string    `gorm:"size:255;not null;unique"`
	Password  string    `gorm:"size:255;not null"`
	CreatedAt time.Time `gorm:"not null"`
	UpdatedAt time.Time `gorm:"not null"`
}
```

- `Username` と `Email` は重複しないように `unique` を付けています。
- `Password` フィールドにはbcryptでハッシュ化した後の文字列が入ります。

`main.go` にログイン、サインアップ、ログアウト用のルートを追加し、それぞれに対応するコントローラを呼び出せるように設定します。

```go:app/main.go
r.GET("/signup", controllers.Signup)
r.GET("/login", controllers.Login)

r.POST("/signup", controllers.SignupPost)
r.POST("/login", controllers.LoginPost)
r.GET("/logout", controllers.Logout)
```

---

# コントローラ（例：`sessions_controller.go`）

ここでは、サインアップ・ログイン・ログアウトを行うためのハンドラをまとめます。  
まずはサインアップの処理例です。

```go:app/controllers/sessions_controller.go
func Signup(c *gin.Context) {
	email := c.PostForm("email")
	password := c.PostForm("password")
	confirmPassword := c.PostForm("confirm_password")

	// 1. メールアドレスが既に使われていないかチェック
	if !models.UserCheckAvailability(email) {
		c.HTML(http.StatusConflict, "home/signup.html", gin.H{
			"alert": "Email already exists",
		})
		return
	}

	// 2. パスワードと確認用の不一致をチェック
	if password != confirmPassword {
		c.HTML(http.StatusBadRequest, "home/signup.html", gin.H{
			"alert": "Passwords do not match",
		})
		return
	}

	// 3. ユーザーの作成
	user := models.UserCreate(email, password)
	if user == nil || user.ID == 0 {
		c.HTML(http.StatusInternalServerError, "home/signup.html", gin.H{
			"alert": "Failed to create user",
		})
		return
	}

	// 4. 必要に応じてセッションにIDをセットし、リダイレクト
	helpers.SetSession(c, user.ID)
	c.Redirect(http.StatusFound, "/")
}
```

モデル側の例：

```go
func UserCheckAvailability(email string) bool {
	var user User
	Db.Where("email = ?", email).First(&user)
	return user.ID == 0
}

func UserCreate(email, password string) *User {
	hashedPassword, err := helpers.HashPassword(password)
	if err != nil {
		return nil
	}
	user := User{Email: email, Password: hashedPassword}
	Db.Create(&user)
	return &user
}
```

---

## 4. Login と Logout

ユーザーがサインアップしたら、次はログインして認証付きのページにアクセスできるようにします。さらに、ログアウト処理も整えてセッションを破棄できるようにしましょう。

### カスタムミドルウェアでセッション管理を一元化

全てのルートでセッションを個別にチェックするのは煩雑なので、**ミドルウェア**を使ってリクエストを共通処理に通します。

- `middleware/auth.go` に `AuthenticateUser()` 関数を作り、`sessions.Default(c)` からセッション情報を取得。
- ユーザーIDがあれば `c.Set("userID", user.ID)` などコンテキストに保管し、なければ未ログインとして扱う。
- `main.go` で `r.Use(middleware.AuthenticateUser())` を追加すると、以降のルートはすべて認証確認が行われる。

### main.goでのセッションストア設定

```go
store := memstore.NewStore([]byte("secret"))
r.Use(sessions.Sessions("mysession", store))
r.Use(middleware.AuthenticateUser())
```

1. `sessions.Sessions("mysession", store)` でセッションのミドルウェアを登録。
2. 続けて `AuthenticateUser` を登録し、セッションからユーザー情報を読み込む。

### ログイン処理の例

```go
func Login(c *gin.Context) {
    email := c.PostForm("email")
    password := c.PostForm("password")

    user := models.UserCheck(email, password)  // userがnilの場合は不一致
    if user == nil {
        c.Redirect(http.StatusFound, "/login?error=invalid_credentials")
        return
    }

    helpers.SetSession(c, user.ID)
    c.Redirect(http.StatusFound, "/")
}
```

### ログアウト

```go
func Logout(c *gin.Context) {
    helpers.ClearSession(c)
    c.Redirect(http.StatusFound, "/login")
}
```

---

## 5. ノートモデルにUserIDを追加してユーザーごとに管理

認証があっても、今のままだと全ノートが全ユーザーに見えてしまう場合があります。そこでノートモデル自体に**UserID**フィールドを加え、「どのユーザーのノートか」を区別します。

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

### ノート操作関数の変更

- **NotesAll(userID uint64)**: `WHERE user_id = ?` の条件でログインユーザーのノートだけ取得
- **NotesCreate(userID uint64, name, content string)**: 新規作成時に `UserID = userID` をセット
- 他の関数も同様に、ユーザーIDを引数に追加し、適切にクエリを絞り込む

### コントローラの修正

`NotesIndex` の例（ノート一覧を表示する場合）：

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

ログイン済みであれば userID が渡され、該当ユーザーのノートだけを取得できます。ほかのAPI（詳細表示、編集、削除）も同様に書き換えれば、**ユーザーごとにノートが分離**できるようになります。

---

## 6. 動作確認

1. **マイグレーション**
    - `models/setup.go` に `Db().AutoMigrate(&User{}, &Note{})` を追加し、テーブルスキーマを最新化。
2. **ノートテーブルに user_id カラムが追加されているか確認**
    - 既存データは `user_id` がnullになるので、必要に応じて手動で`UPDATE notes SET user_id=1 ...`などを実施。
3. **ログイン後に /notes を開くと、自分が所有するノートだけが表示される**
    - 他のユーザーでログインすると、そのユーザーのノートだけが出ることを確認。
    - ログアウトすると「未認証アクセス」などのメッセージが返ることを確認。

---

# まとめ

1. **ログイン/サインアップページ**を準備し、ユーザーインターフェースを整備。
2. **bcrypt**によるパスワードの安全管理、**sessions**によるログイン状態の保持を実装。
3. ノートモデルに**UserID**を追加し、ユーザー単位でノートが管理されるように修正。
4. ミドルウェアでセッションをチェックし、認証必須のAPIではログイン必須に。

これにより、複数ユーザーが同じアプリを利用しても、お互いのノートを参照できない**セキュアな認証システム**が完成します。さらに高度な機能（パスワードリセット、OAuth連携、トークン認証など）も追加可能ですが、まずはこの構成が「Go × Gin × GORM」での認証機能の基本形です。ぜひ活用してみてください。