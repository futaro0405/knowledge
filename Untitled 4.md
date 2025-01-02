現在のアプリには認証機能がなく、URLさえ分かれば誰でもすべてのノートにアクセスできる状態です。
これを解消し、ユーザー単位でノートを管理するには、サインアップやログイン、セッション管理などが必要です。
この章では、認証機能を実装していきましょう。

# ログイン、サインインページ
本格的な認証機能を実装する前に、**ログインとサインアップのページ（フォーム）** を用意します。

最初に作成した`template/views`の修正しましょう。
フォルダ名を `template/views` から `template/home` に変更します。
そして、すべてのルートやHTML読み込みのパスを更新します。

```html:app/templates/home/index.html
{{ define "home/index.html"}}
    {{ template "layouts/header.html" .}}
    <h1>{{.title}}</h1>
    {{ template "layouts/footer.html" .}}
{{ end }}
```

```go:app/main.go
r.GET("/", func(c *gin.Context) {
    c.HTML(http.StatusOK, "home/index.html", gin.H{
        "title": "Note Application",
    })
})
```

## サインアップページ
`notes/new.html`を流用してサインアップページのテンプレートを作成しましょう。
サインアップページの必要項目は「メールアドレス」、「パスワード」、「パスワード確認」のフィールドです。`<form action="/signup" method="POST">` のように送信先を指定しましょう。

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





サインアップページ、ログインページともに入力フォームが必要です。`app/templates/notes/new.html`を流用して2つのテンプレートを作成しましょう。
- `templates/home/signup.html`
- `templates/home/login.html`

## サインアップページ
サインアップページの必要項目は「メールアドレス」、「パスワード」、「パスワード確認」のフィールドです。`<form action="/signup" method="POST">` のように送信先を指定しましょう。

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

## ログインページ
ログインページの必要項目は「メールアドレス」、「パスワード」です。
`<form action="/login" method="POST">` のように送信先を指定します。
パスワード確認用のフィールドは不要です。

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

# ルートとコントローラ
ルートとコントローラにサインアップページとログインページの処理を追加しましょう。

まずは、`main.go`から修正します。

```go:app/main.go
r.GET("/login", controllers.LoginPage)
r.GET("/signup", controllers.SignupPage)
```

次は`notes_controller.go`です。
コントローラでは単にHTMLを返すだけです。

```go
func LoginPage(c *gin.Context) {
    c.HTML(http.StatusOK, "home/login.html", nil)
}

func SignupPage(c *gin.Context) {
    c.HTML(http.StatusOK, "home/signup.html", nil)
}
```

### indexページへのボタン追加
トップページ（`index.html`）に「ログイン」と「サインアップ」のボタンを置いて、これらのフォームへ遷移できるようにします。

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

# ヘルパー関数を作ろう
ログインやサインアップ用のフォーム画面を用意しましたが、実際にユーザーをデータベースに登録するロジックがまだありません。認証機能を実装するために必要なライブラリが２種類あります。このライブラリを使用して機能を実装しましょう。

## `bcrypt`ライブラリ
ユーザーパスワードを安全にハッシュ化し、データベースに保存するためのライブラリです。既存のハッシュと照合して認証する仕組みが簡単に実装できます。

## `sessions`ライブラリ
ユーザーがログインしている状態を保持するため、サーバー側セッションを扱うライブラリです。  
RedisやMemcached、MongoDB、PostgreSQLなど、複数のバックエンドをサポートしています。

この2つのライブラリを組み合わせることで、**パスワードの管理**と**ログイン状態の維持**が可能になります。必要なパッケージをインストールしましょう。

```bash
go get golang.org/x/crypto/bcrypt
go get github.com/gin-contrib/sessions
```

パスワードハッシュやセッションの操作など、どのコントローラからも呼び出す可能性がある処理は**共通ヘルパー関数**としてまとめると便利です。

入力されたパスワードを安全に管理するために、パスワードをハッシュ化するのヘルパー関数を作成します。`helpers`フォルダを作成し、その中に`password_hashing.go`を作成します。

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

`HashPassword`関数は、ユーザーが入力した平文パスワードを`bcrypt`でハッシュ化し、その文字列を返します。
`CheckPasswordHash`関数はフォームから送られた平文パスワードと、DBに保存されているハッシュを照合します。正しければ`true`、違えば`false`を返します。

次はログイン状態を管理するためのヘルパー関数を作成します。`helpers`フォルダの中に`session.go`を作成します。

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

`SetSession`は、ユーザーがログインしたら、その`id`をセッションに格納しておきます。
`GetSession`は、セッションからユーザーIDを取り出します。ログイン済みかどうかを判断する際に使います。
`ClearSession`は、ログアウト時にセッションを消去し、ユーザーIDなどを無効化します。

# ユーザーモデルを作成する
ユーザーデータを管理するため、GORMで使用する構造体を定義します。

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

- **Email** は重複登録を防ぐために`uniqueIndex`を付与します。  
- **Password** には平文パスワードではなく、**bcryptハッシュ化後の文字列**を保存します。

このモデルがマイグレーションされると、`users`テーブルに上記フィールドを持つ列が作成されます。

`main.go`にログイン、サインアップ、ログアウトのルートを追加します。

```go:app/main.go
r.GET("/signup", controllers.Signup)
r.GET("/login", controllers.Login)

r.POST("/signup", controllers.SignupPost)
r.POST("/login", controllers.LoginPost)
r.GET("/logout", controllers.Logout)
```

# コントローラ
`app/controllers/sessions_controller.go`を作成します。
まずは、`Signup`を実装しましょう。

```go:app/controllers/sessions_controller.go
package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func LoginPage(c *gin.Context) {
	c.HTML(http.StatusOK, "home/login.html", gin.H{})
}

func SignupPage(c *gin.Context) {
	c.HTML(http.StatusOK, "home/signup.html", gin.H{})
}

func Signup(c *gin.Context) {
	email := c.PostForm("email")
	password := c.PostForm("password")
	confirmPassword := c.PostForm("confirm_password")

	available := models.UserCheckAvailability(email)
	if !available {
		c.HTML(
			http.StatusIMUsed,
			"home/signup.html",
			gin.H{
				"alert": "email already exists",
			},
		)
		return
	}

	if password != confirmPassword {
		c.HTML(
			http.StatusNotAcceptable,
			"home/signup.html",
			gin.H{
				"alert": "password does not match",
			},
		)
		return
	}

	user := models.UserCreate(email, password)
	if user.ID == 0 {
		c.HTML(
			http.StatusNotAcceptable,
			"home/signup.html",
			gin.H{
				"alert": "failed to create user",
			},
		)
		return
	}
}
```
userモデルもにも作成します。

```

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

	user := User{Email: email, Password: string(hashedPassword)}
	Db.Create(&user)
	return &user
}

```

# LoginとLogout
ユーザーが一度アカウントを作ったら、次は**ログイン**して認証付きのページを閲覧できるようにします。また、**ログアウト**してセッションを切る仕組みも用意します。

## カスタムミドルウェアを活用したセッション管理
全てのルートでセッションを個別にチェックするのは煩雑なので、**ミドルウェア** を使ってリクエストを共通処理に通します。ミドルウェアはリクエストとコントローラーの間に位置します。
設計するミドルウェアの機能は、「APIからセッション情報を読み取る」、「ユーザー詳細を取得する」、「ユーザーIDとメールアドレスをGinのコンテキストにセットする」の処理を順に行います。これにより、コントローラーはログインユーザーのIDにアクセスでき、ユーザーIDの有無に基づいてログイン状態を判断できます。

`middleware/auth.go` ファイルを作成し `AuthenticateUser()` 関数を作ります。
`sessions.Default(c)` からセッション情報を取得するようにしましょう。

```go:app/middlewares/auth.go
package middlewares

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func AuthenticationUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		sessionID := session.Get("id")
		var user *models.User
		userpresent := true
		
		if sessionID == nil {
			userpresent = false
		} else {
			user = models.UserFind(sessionID.(uint64))
			userpresent = (user.ID > 0)
		}

		if userpresent {
			c.Set("user_id", user.ID)
			c.Set("email", user.Email)
		}

		c.Next()
	}
}
```

`models.UserFind`も実装しましょう。

```go:app/models/user.go
func UserFind(id uint64) *User {
	var user User
	Db.Where("id = ?", id).First(&user)
	return &user
}
```

### main.goでのセッションストア設定

```go
store := memstore.NewStore([]byte("secret"))
r.Use(sessions.Sessions("mysession", store))
r.Use(middleware.AuthenticateUser())
```

最初に`sessions.Sessions("mysession", store)`を付与し、セッション機能を有効にします。
次に `middleware.AuthenticateUser()` を登録して、セッション情報を用いて実際のログイン状況を判定できるようにします。
これにより、すべてのルートで「ログイン情報があるかどうか」が自動チェックされるようになります。

## 2. ログイン状態による画面の切り替え

1. **コントローラやルートハンドラ**  
   - ルートハンドラ`"/"`などでHTMLを返す際、 `c.GetUint64("userID")` を確認すれば、ログインしているかどうかを判定できます。  
   - 例えば、ユーザーIDが `0` なら未ログイン扱いとし、テンプレートに `"loggedIn": false` のようなデータを渡す。  
   - 逆にユーザーIDが正の値であればログイン中と判断し、 `"loggedIn": true` を渡せます。

2. **index.htmlなどのテンプレート**  
   ```html
   {{ if .loggedIn }}
       <!-- ログアウトボタン -->
       <form action="/logout" method="POST">
         <button type="submit" class="btn btn-danger">Logout</button>
       </form>
   {{ else }}
       <!-- ログイン・サインアップボタン -->
       <a href="/login" class="btn btn-primary">Login</a>
       <a href="/signup" class="btn btn-success">Sign Up</a>
   {{ end }}
   ```
   - こうすることで、ログイン状態に応じて表示を切り替え、不要なリンクを隠すことが可能です。

---

## 3. SessionsController – ログイン・ログアウトの具体的な実装

### ログイン

1. **フォームの送信先**  
   - `<form action="/login" method="POST">`  
   - メールアドレスとパスワードを入力して送信する。

2. **コントローラ**  
   ```go
   func LoginPost(c *gin.Context) {
       email := c.PostForm("email")
       password := c.PostForm("password")

       // 1. ユーザーをメールアドレスで検索 + パスワードハッシュの照合
       user := models.UserCheck(email, password)
       if user == nil {
           // ログイン失敗時
           c.HTML(http.StatusUnauthorized, "home/login.html", gin.H{
               "alert": "メールアドレスまたはパスワードが一致しません",
           })
           return
       }

       // 2. セッションにユーザーIDを格納し、トップページへ
       helpers.SetSession(c, user.ID)
       c.Redirect(http.StatusFound, "/")
   }
   ```
   - `models.UserCheck(email, password)` は、メールアドレスでユーザーを検索し、bcryptでパスワードを検証する関数（後述）。

3. **UserCheck関数（モデル側）**  
   ```go
   func UserCheck(email, password string) *User {
       var user User
       if err := Db.Where("email = ?", email).First(&user).Error; err != nil {
           return nil
       }

       // bcryptで照合
       if !helpers.CheckPasswordHash(password, user.Password) {
           return nil
       }
       return &user
   }
   ```
   - ここで`user.Password`はDBに保存されているハッシュ値です。  
   - フォームから送られた平文パスワードと比較し、一致しなければ`nil`を返します。

### ログアウト

1. **ログアウトボタン**  
   - 画面上に`<form action="/logout" method="POST">` のようなフォームを配置してボタンを押せば、`POST /logout` へリクエストが飛ぶ。

2. **コントローラ**  
   ```go
   func LogoutPost(c *gin.Context) {
       helpers.ClearSession(c)
       c.HTML(http.StatusOK, "home/login.html", gin.H{
           "alert": "ログアウトしました",
       })
   }
   ```
   - セッションをクリアしてログアウト状態にします。  
   - そのままログインページに戻したり、別のページにリダイレクトしたりすればOKです。

---

## 4. ユーザーテーブルのマイグレーション

1. **models/setup.go** にて `DbMigrate` 関数などで `AutoMigrate(&User{})` を追加。  
2. これで `users` テーブルが作られ、`ID`, `Email`, `Password` などが定義されます。  
3. 実行前は `notes` テーブルだけだったのが、実行後に `users` テーブルも存在し、構造がモデル定義と合っているか MySQLコンソールで確認しましょう。

---

## 5. ノートをユーザーごとに保護する – UserIDの追加

すでにユーザー認証が動くようになったとしても、今のままだと「ノートが全ユーザーに公開されている」状態の可能性があります。そこでノートモデルに `UserID` フィールドを追加して、特定ユーザーの所有物であることを示しましょう。

```go
type Note struct {
    ID        uint64 `gorm:"primaryKey"`
    Title     string
    Content   string
    UserID    uint64 `gorm:"index"`
    CreatedAt time.Time
    UpdatedAt time.Time
    DeletedAt gorm.DeletedAt `gorm:"index"`
}
```

### モデル関数の変更
- `NotesAll(userID uint64) []Note` など、ユーザーIDを引数として受け取り、 `WHERE user_id = ?` でフィルタリングするようにします。  
- `NoteCreate(userID, title, content string)` も同様に、`UserID: userID` をセットして新規ノートを作成。

### コントローラでログインユーザーを取得
- `c.GetUint64("userID")` か、あるいは `GetUserFromRequest(c)` のようなヘルパー関数を通じて、ログイン中のユーザーIDを取り出します。  
- ノート一覧や詳細表示、編集、削除などでは、必ずログインユーザーのIDをモデル関数に渡してクエリを絞り込みます。

### 既存ノートの移行
- 以前から存在するノートは `user_id` が `NULL` になっているため、MySQLコンソールなどで `UPDATE notes SET user_id=1 ...` のように手動で割り当てます。  
- これで、異なるユーザーでログインしたときに見えるノートが変わるようになります。

---

## 6. 動作確認

1. **サーバーを再起動**  
   - `models/setup.go` 内で `AutoMigrate(&User{}, &Note{})` を行い、新しいカラムが追加されているか確認。  
2. **ユーザーを2人以上登録**  
   - 例：`email: alice@example.com, password: alicepass` と、 `email: bob@example.com, password: bobpass`  
3. **ノートの `user_id` を手動または新規作成で割り当て**  
   - AliceのIDが1、BobのIDが2として、それぞれ何件かノートを持つようにデータを分ける。  
4. **ブラウザでログインテスト**  
   - Aliceアカウントでログイン → `/notes` にアクセス → Aliceのノートだけ見える。  
   - Bobアカウントでログイン → `/notes` → Bobのノートだけ見える。  
   - ログアウト → `/notes` を開くと「未認証アクセス」やリダイレクトなどが起こり、ノートを見られなくなる。

---

## まとめ

1. **ミドルウェア（AuthenticateUser）**  
   - すべてのリクエストに先駆けてセッションをチェックし、ログインしているユーザーのIDをGinのコンテキストにセット。  
2. **ログイン機能**  
   - `/login` に対してフォームでメールアドレスとパスワードを送信。  
   - bcryptでパスワードを検証し、成功すればセッションにユーザーIDを保存。  
3. **ログアウト機能**  
   - `/logout` へPOSTすることでセッションをクリアし、再度未ログイン状態へ。  
4. **ノートモデルのUserIDフィールド**  
   - 自分のノートだけが閲覧・編集できるようにするため、すべてのモデル関数やコントローラでユーザーIDを扱う。

これで**認証付きのノートアプリ**が完成し、一つのユーザーでログインするときは他人のノートにアクセスできなくなります。今後は「パスワードリセット機能」や「OAuthログイン」、「より詳細な権限管理（OwnerとCollaboratorなど）」を追加することで、さらに実用的なアプリへ進化させることが可能です。