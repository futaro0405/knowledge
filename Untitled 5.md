現在のアプリには認証機能がなく、URLさえ分かれば誰でもすべてのノートにアクセスできる状態です。
これを解消し、ユーザー単位でノートを管理するには、サインアップやログイン、セッション管理などが必要です。この章では、認証機能を実装していきましょう。

# ホーム画面を作成する
本格的な認証機能を実装する前に、**ログインとサインアップのページ（フォーム）** を用意します。

最初に作成した`template/views`の修正しましょう。フォルダ名を `template/views` から `template/home` に変更します。
そして、すべてのルートやHTML読み込みのパスを更新します。

```html:app/templates/home/index.html
{{ define "/home/index" }}
    {{ template "header" . }}
    <h1>{{ .title }}</h1>
    {{ template "footer" . }}
{{ end }}
```

```go:app/main.go
r.GET("/", func(c *gin.Context) {
    c.HTML(http.StatusOK, "home/index.html", gin.H{
        "title": "Note Application",
    })
})
```

こちらにサインインボタンとログインボタンを配置します。

```html:app/templates/home/index.html
{{ define "home" }}
    {{ template "header" .}}
    <h1>{{.title}}</h1>

    <div class="d-grid gap-2 col-6 mx-auto">
        <a href="/signup" class="btn btn-primary">Sign Up</a>
        <a href="/login" class="btn btn-primary">Login</a>
    </div>
    {{ template "footer" .}}
{{ end }}
```

# サインアップページ
`notes/new.html`を流用してサインアップページ（`app/templates/home/signup.html`）のテンプレートを作成しましょう。サインアップページの必要項目は「メールアドレス」、「パスワード」、「パスワード確認」のフィールドです。`<form action="/signup" method="POST">` のように送信先を指定しましょう。

```html:app/templates/home/signup.html
{{ define "home/signup.html" }}
    {{ template "header" .}}
        <h1>Sign Up</h1>
        <form class="row g-3" action="/signup" method="POST">
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="text" class="form-control" id="email" aria-describedby="emailHelp" name="email">
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
    {{ template "footer" .}}
{{ end }}
```

# ログインページ
`notes/new.html`を流用して、ログインページ（`app/templates/home/login.html`）のテンプレートも作成します。ログインページの必要項目は「メールアドレス」、「パスワード」です。
`<form action="/login" method="POST">` のように送信先を指定します。
パスワード確認用のフィールドは不要です。

```html:app/templates/home/login.html
{{ define "home/login" }}
    {{ template "header" .}}
        <h1>Login</h1>
        <form class="row g-3" action="/login" method="POST">
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="text" class="form-control" id="email" aria-describedby="emailHelp" name="email">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password">
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
    {{ template "footer" .}}
{{ end }}
```

# ルートとコントローラ
ルートにサインアップページとログインページの処理を追加しましょう。
まずは、`main.go`から修正します。

```go:app/main.go
r.GET("/login", controllers.LoginPage)
r.GET("/signup", controllers.SignupPage)
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
cd ./app
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
userモデルにも作成します。

```go:app/models/user.go
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

```go:app/middleware/auth.go
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
`main.go`にstoreのinitを記載します。
```go
store := memstore.NewStore([]byte("secret"))
r.Use(sessions.Sessions("notes", store))
r.Use(middleware.AuthenticateUser())
```

最初に`sessions.Sessions("notes", store)`を付与し、セッション機能を有効にします。
次に `middleware.AuthenticateUser()` を登録して、セッション情報を用いて実際のログイン状況を判定できるようにします。
これにより、すべてのルートで「ログイン情報があるかどうか」が自動チェックされるようになります。

## ログイン状態による画面の切り替え
`main.go`にログインの状態によって出し分けできるようにしましょう。

```go:app/main.go
r.GET("/", func(c *gin.Context) {
    c.HTML(http.StatusOK, "/home", gin.H{
        "title": "Note Application",
        "logged_in": (c.GetUint64("user_id") > 0),
    })
})
```

ルートハンドラ`"/"`でHTMLを返す際、 `c.GetUint64("user_id")` を確認すれば、ログインしているかどうかを判定できます。ユーザーIDが `0` なら未ログイン扱いとし、テンプレートに `"loggedIn": false` のようなデータを渡します。
逆にユーザーIDが正の値であればログイン中と判断し、 `"loggedIn": true` を渡せます。

```html:app/templates/home/index.html
<div class="d-grid gap-2 col-6 mx-auto">
    {{ if .logged_in }}
        <form action="/logout" method="post">
            <button type="submit" class="btn btn-primary">Logout</button>
        </form>
    {{ else }}
        <a href="/signup" class="btn btn-primary">Sign Up</a>
        <a href="/login" class="btn btn-primary">Login</a>
    {{ end }}
</div>
```

こうすることで、ログイン状態に応じて表示を切り替え、不要なリンクを隠すことが可能です。

# SessionsController

## ログイン
まずログイン機能を実装します。このハンドラはログインフォームが送信されたときに呼び出されます。
フォームからメールアドレスとパスワードを読み取ります。メールアドレスとパスワードが一致するかチェックする関数を呼び出します。`models.UserCheck(email, password)`という関数を想定します。

```go:app/controllers/sessions_controller.go
func Login(c *gin.Context) {
	email := c.PostForm("email")
	password := c.PostForm("password")
	user := models.UserCheck(email, password)
}
```

ユーザーモデルに移動し、UserCheck関数を実装します。引数としてemailとpasswordを受け取り、userを返します。

```go:app/models/user.go
func UserCheck(email, password string) *User {
	var user User
	Db.Where("email = ?", email).First(&user)
	if user.ID == 0 {
		return nil
	}
	match := helpers.CheckPasswordHash(password, user.Password)
	if match {
		return &user
	} else {
		return nil
	}
}
```

まず、与えられたメールアドレスでユーザーを検索します。ユーザーが存在しない場合はnilを返します。パスワードチェックには先に実装したcheckPasswordHash関数を使用します。パスワードが一致すればユーザーを、一致しなければnilを返します。


コントローラーに戻り、ログイン処理を完成させます。
ユーザーが存在する場合、セッションを設定し、インデックスページにリダイレクトします。
ユーザーが見つからない場合、ログインページにアラートメッセージと共にリダイレクトします。

```go:app/controllers/sessions_controller.go
func Login(c *gin.Context) {
	email := c.PostForm("email")
	password := c.PostForm("password")

	user := models.UserCheck(email, password)
	if user == nil {
		helpers.SetSession(c, user.ID)
		c.Redirect(http.StatusMovedPermanently, "/")
	} else {
		c.HTML(
			http.StatusOK,
			"home/login.html",
			gin.H{
				"alert": "email or password is incorrect",
			},
		)
	}
}
```

ログアウト機能を実装します。
セッションをクリアし、ログインページを表示します。
アラートメッセージ「logged out」を表示します。

```go:app/controllers/sessions_controller.go
func Logout(c *gin.Context) {
	helpers.ClearSession(c)
	c.HTML(
		http.StatusOK,
		"home/login.html",
		gin.H{
			"alert": "logged out",
		},
	)
}
```

ユーザーモデルのマイグレーションを追加します。
`models/setup.go` のDbMigrate関数に、ユーザーモデルのマイグレーションを追加します。

```go:app/models/setup.go
func DbMigrate() {
	DB.AutoMigrate(Note{})
    // Userモデルを追加
	DB.AutoMigrate(User{})
}
```

アプリケーションを実行し、MySQLコンソールでテーブルを確認します。実行前は「notes」テーブルのみでしたが、実行後は「notes」と「users」の2つのテーブルが存在します。usersテーブルの構造がモデルで定義したものと一致することを確認します。

サーバーを起動し、ログイン機能をテストします。正しいメールアドレスとパスワードでログインすると、ホームページにリダイレクトされ、ログアウトボタンが表示されます。
ログアウトをクリックすると、ログインページに戻り、「ログアウトしました」というアラートが表示されます。
間違ったパスワードでログインを試みると、ログインページに戻り、「メールアドレスまたはパスワードが一致しません」というアラートが表示されます。

これらの実装により、基本的なユーザー認証システム（ログイン、ログアウト、パスワード検証）が完成しました。また、データベースにユーザー情報を保存するためのテーブルも正しく作成されています。

# モデルにユーザーを追加する
アプリケーションにはすでにユーザーのサインアップとログイン機能がありますが、現在すべてのノートが全ユーザーにアクセス可能です。
この動画では、ユーザーが自分のノートにのみアクセスできるように変更を加えます。

notesモデルに変更を加えます。ノート構造体に新しいフィールド「UserID」（uint64型）を追加します。このフィールドはノートの所有者のユーザーIDを保存します。

```go:app/models/note.go
type Note struct {
	ID        uint64 `gorm:"primaryKey"`
	Name      string `gorm:"size:255"`
	Content   string `gorm:"type:text"`
    // UserIDを追加
	UserID    uint64 `gorm:"index"`
	CreatedAt time.Time
	UpdatedAt time.Time      `gorm:"index"`
	DeletedAt gorm.DeletedAt `gorm:"index"`
}
```

モデルの全ての関数に変更を加えます。
`NotesAll` 関数はユーザーポインタを新しいパラメータとして追加し、DBクエリにユーザーIDの条件を追加します。

```go:app/models/note.go
func NoteAll(user *User) *[]Note {
	var notes []Note
	DB.Where("deleted_at is NULL AND user_id = ?", user.ID).Order("updated_at desc").Find(&notes)
	return &notes
}
```

`NoteCreate`関数はユーザーをパラメータとして追加し、ノートインスタンス作成時にUserIDフィールドを設定します。

```go:app/models/note.go
func NoteCreate(user *User, name string, content string) *Note {
	entry := Note{Name: name, Content: content, UserID: user.ID}
	DB.Create(&entry)
	return &entry
}
```

他の関数も同様に変更します。

```go:app/models/note.go
func NoteFind(user *User, id uint64) *Note {
	var note Note
	DB.Where("id = ? AND user_id = ?", id, user.ID).First(&note)
	return &note
}

func (note *Note) Update(name, content string) error {
	note.Name = name
	note.Content = content
	return DB.Save(&note).Error
}

func NoteMarkDelete(user *User, id uint64) error {
	return DB.Where("id = ? AND user_id = ?", id, user.ID).Delete(&Note{}).Error
}
```

コントローラーにも同様の変更を加えます。
`NotesIndex`関数は、現在サインインしているユーザーを取得し、そのユーザーに属するノートのみを取得します。

```go:app/controllers/notes_controller.go
func NoteIndex(c *gin.Context) {
    // currentUserを取得する
    userID := c.GetUint64("user_id")
	var currentUser *models.User
    if userID > 0 {
		currentUser = models.UserFind(userID)
	} else {
		currentUser = nil
	}

	notes := models.NoteAll(currentUser)
	c.HTML(
		http.StatusOK,
		"notes/index.html",
		gin.H{
			"notes": notes,
		},
	)
}
```
コンテキストからユーザーIDを取得し、ユーザー情報を取得する処理を共通化します。`/helpers` ディレクトリに `utils.go` ファイルを作成します。`GetUserFromRequest` 関数を実装し、`gin.Context` を受け取り、現在のユーザーを返すようにします。

```go:app/helpers/utils.go
package helpers

import (
	"gin-docker/models"
)

func GetUserFromRequest(c *gin.Context) *models.User {
	userID := c.GetUint64("user_id")
	var currentUser *models.User
	if userID > 0 {
		currentUser = models.UserFind(userID)
	} else {
		currentUser = nil
	}
	return currentUser
}
```

コントローラーのNotesIndex関数に戻り、GetUserFromRequest関数を呼び出して現在のユーザーを取得します。

```go:app/controllers/notes_controller.go
func NoteIndex(c *gin.Context) {
	currentUser := helpers.GetUserFromRequest(c)
    if currentUser == nil || currentUser.ID == 0 {
		c.HTML(
			http.StatusUnauthorized,
			"home/login.html",
			gin.H{
				"alert": "unauthorized Access!",
            },
		)
        return
	}
	notes := models.NoteAll(currentUser)
	c.HTML(
		http.StatusOK,
		"notes/index.html",
		gin.H{
			"notes": notes,
		},
	)
}
```

ユーザーがサインインしていない場合、未認証アクセスとして処理します。現在のユーザーがnilか、IDが0の場合、ユーザーはサインインしていないと判断します。
この場合、ステータスコード「未認証」でHTMLをレンダリングし、「未認証アクセス」というアラートを表示します。他のハンドラー関数にも同様の変更を加えます。

```go:app/controllers/notes_controller.go
func NoteCreate(c *gin.Context) {
    currentUser := helpers.GetUserFromRequest(c)
    if currentUser == nil || currentUser.ID == 0 {
		c.HTML(
			http.StatusUnauthorized,
			"home/login.html",
			gin.H{
				"alert": "unauthorized Access!",
            },
		)
        return
	}
	title := c.PostForm("title")
	content := c.PostForm("content")
	models.NoteCreate(currentUser, title, content)
	c.Redirect(http.StatusMovedPermanently, "notes")
}

func NoteShow(c *gin.Context) {
    currentUser := helpers.GetUserFromRequest(c)
    if currentUser == nil || currentUser.ID == 0 {
		c.HTML(
			http.StatusUnauthorized,
			"home/login.html",
			gin.H{
				"alert": "unauthorized Access!",
            },
		)
        return
	}
    idStr := c.Param("id")
    id, err := strconv.ParseUint(idStr, 10, 64)
    if err != nil {
        c.String(http.StatusBadRequest, fmt.Sprintf("Invalid ID: %s", idStr))
        return
    }
    note := models.NoteFind(currentUser, id)
    if note == nil {
        c.String(http.StatusNotFound, fmt.Sprintf("Note with ID %d not found", id))
        return
    }

    c.HTML(http.StatusOK, "notes/show.html", gin.H{
        "note": note,
    })
}

func NoteEdit(c *gin.Context) {
    currentUser := helpers.GetUserFromRequest(c)
    if currentUser == nil || currentUser.ID == 0 {
		c.HTML(
			http.StatusUnauthorized,
			"home/login.html",
			gin.H{
				"alert": "unauthorized Access!",
            },
		)
        return
	}
    idStr := c.Param("id")
    id, err := strconv.ParseUint(idStr, 10, 64)
    if err != nil {
        c.String(http.StatusBadRequest, "Invalid ID")
        return
    }

    note := models.NotesFind(currentUser, id)
    if note == nil {
        c.String(http.StatusNotFound, "Note Not Found")
        return
    }

    c.HTML(http.StatusOK, "notes/edit.html", gin.H{
        "note": note,
    })
}

func NoteUpdate(c *gin.Context) {
    currentUser := helpers.GetUserFromRequest(c)
    if currentUser == nil || currentUser.ID == 0 {
		c.HTML(
			http.StatusUnauthorized,
			"home/login.html",
			gin.H{
				"alert": "unauthorized Access!",
            },
		)
        return
	}
    idStr := c.Param("id")
    id, err := strconv.ParseUint(idStr, 10, 64)
    if err != nil {
        c.String(http.StatusBadRequest, "Invalid ID")
        return
    }
    note := models.NoteFind(currentUser, id)
    if note == nil {
        c.String(http.StatusNotFound, "Note Not Found")
        return
    }
    title := c.PostForm("title")
    content := c.PostForm("content")
    note.Update(title, content)
    c.Redirect(http.StatusMovedPermanently, "/notes/"+idStr)
}

func NotesDelete(c *gin.Context) {
    currentUser := helpers.GetUserFromRequest(c)
    if currentUser == nil || currentUser.ID == 0 {
		c.HTML(
			http.StatusUnauthorized,
			"notes/index.html",
			gin.H{
				"alert": "unauthorized Access!",
            },
		)
        return
	}
    idStr := c.Param("id")
    id, err := strconv.ParseUint(idStr, 10, 64)
    if err != nil {
        c.String(http.StatusBadRequest, "Invalid ID")
        return
    }
    models.NoteMarkDelete(currentUser, id)
    c.Redirect(http.StatusMovedPermanently, "/notes")
}
```

MySQLコンソールでノートテーブルの構造を確認します：
サーバーを再起動してマイグレーションを実行し、user_idカラムが追加されたことを確認します。

ノーステーブルのuser_idの値を確認します：
現時点では全てのuser_idがnullであることを確認します。

アプリケーションにサインインし、ノートが表示されないことを確認します（user_idがnullのため）。

MySQLで、いくつかのノートにuser_id = 1を、残りのノートにuser_id = 2を割り当てます。

ブラウザで2番目のユーザーでサインインし、/notesにアクセスします：
このユーザーに属するノートのみが表示されることを確認します。

1番目のユーザーでサインインし、同様に確認します：
このユーザーに属するノートのみが表示されることを確認します。