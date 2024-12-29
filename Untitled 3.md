以下では、Go言語とGinフレームワーク、そしてMySQL＋GORMを用いて「Notesアプリ」を構築する手順を、一連の流れがわかるようにまとめています。コードの断片だけでなく、それぞれの作業意図や背景を盛り込み、**読みやすさ**と**理解しやすさ**を重視しました。余計な手戻りを減らすためにも、適宜コードを動かして確かめながら進んでいってください。

---

## はじめに：Notesアプリをつくる背景と概要

Go言語のWebフレームワーク「Gin」は、高速かつシンプルな特徴を持ち、学習コストも比較的低いのが魅力です。これに加えてORMライブラリである「GORM」を組み合わせると、データベース連携を容易に扱えるようになります。ここでは、「メモ帳アプリ（Notesアプリ）」を題材に、以下の機能を一通り実装していきます。

- **一覧表示（Index）**
- **新規作成（Create）**
- **詳細表示（Show）**
- **編集（Edit）**
- **削除（Delete：ソフトデリート）**

大まかな流れとしては、まずはGinフレームワークでHello World的なアプリを立ち上げ、前回のサンプルコードを再利用しながら新しいプロジェクトを作成します。次にGORMを導入し、MySQLとつなぎ込んだ上で、アプリのMVC構造を整えながらCRUD機能を作り込んでいきます。最終的には、Bootstrapで見た目を整えて**使いやすいアプリ**に仕上げていきましょう。

---

## 1. 新規プロジェクト「Notesアプリ」のセットアップ

まずはGo Modulesを使って新しいプロジェクトを立ち上げます。`$GOPATH/src` 直下など、手元の環境でGoが動くディレクトリに移動してください。

```bash
cd $GOPATH/src
mkdir gin_notes
cd gin_notes
go mod init gin_notes
```

ここで `gin_notes` という名前のGoモジュールを初期化しました。もしエラーが出る場合は、Goのバージョンや`go env`を確認してください。

### テンプレートと静的ファイルのコピー

前回作成した「hello_gin」プロジェクトに既に`templates`と`static`というフォルダがある場合、それらをコピーすると手間を省けます。ディレクトリ構成はなるべく同じにしておくと、テンプレートのパスやCSS、JSなどがスムーズに動きます。

```bash
cp ../hello_gin/templates . -r
cp ../hello_gin/static . -r
```

これで最低限のレイアウトファイルやCSSなどを流用できました。

### VS Codeで開き、タイトルを修正する

ここまで準備したら、VS Codeなど好みのエディタで`gin_notes`フォルダを開きましょう。`templates`配下にある`header.html`を開き、`<title>`タグなどに「Notes app」というタイトルを記述すると、今回のプロジェクトらしい画面に早変わりします。

### main.goファイルのセットアップ

すでに何らかの`main.go`がある人は、それをコピーして使う方法が手っ取り早いです。もし何もなければ、以下のように最小限のコードを書きましょう。

```go
package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()
    
    // テンプレートや静的ファイルのパスを設定
    r.LoadHTMLGlob("templates/**/*")
    r.Static("/static", "./static")

    // 簡易ルートを1つだけ定義 (動作確認用)
    r.GET("/", func(c *gin.Context) {
        c.String(http.StatusOK, "Hello Notes App!")
    })

    // サーバー起動
    r.Run(":8080")
}
```

この状態で`go run main.go`を実行し、ブラウザで`http://localhost:8080`を開いて「Hello Notes App!」が表示されれば成功です。

---

## 2. GORMを使ったMySQL連携

### MySQLユーザーとデータベースの準備

ノートデータを保存するためにMySQLのデータベースを用意します。以下はLinux環境の例です。rootユーザーでMySQLに入り、新しいユーザー`notes`とデータベース`notes`を作成しましょう。

```bash
sudo mysql
CREATE USER 'notes'@'localhost' IDENTIFIED BY 'tmp_pwd';
CREATE DATABASE notes;
GRANT ALL ON notes.* TO 'notes'@'localhost';
FLUSH PRIVILEGES;
```

これでアプリ用の`notes`というユーザーが、`notes`データベースに自由にアクセスできるようになりました。パスワードはあくまで開発用の仮パスワードなので、実運用では強固なものを設定してください。

### GORMとMySQLドライバのインストール

Go Modulesの恩恵で、`go get`コマンドを使えば簡単にライブラリを追加できます。

```bash
go get -u gorm.io/gorm
go get -u gorm.io/driver/mysql
```

`gorm.io/gorm`がORM本体、`gorm.io/driver/mysql`がMySQL用のドライバです。

---

## 3. 最初のデータモデル – Note構造体

ノート情報を保存するためのテーブルをどのように扱うか、GORMのモデルを定義します。`models`というパッケージ（フォルダ）を作り、その中に`note.go`を作成してください。

```go
package models

import (
    "time"

    "gorm.io/gorm"
)

type Note struct {
    ID        uint64         `gorm:"primaryKey"`
    Name      string         `gorm:"size:255"`
    Content   string         `gorm:"type:text"`
    CreatedAt time.Time      `gorm:"index"`
    UpdatedAt time.Time      `gorm:"index"`
    DeletedAt gorm.DeletedAt `gorm:"index"`
}
```

ここでは、`DeletedAt`を定義することでGORMのソフトデリート機能を使えるようにしています。削除フラグを立てるだけでなく、物理削除も選べる仕組みですが、今回は論理削除にしておきましょう。

### AutoMigrateを使ったテーブル作成

テーブルを自動生成するには、GORMの`AutoMigrate`を呼び出します。まずは暫定的に`main.go`に以下のようなコードを書き、サーバー起動の直後にマイグレーションを走らせてみます。

```go
import "gin_notes/models" // 自作パッケージのインポート

func dbMigrate() {
    models.Db().AutoMigrate(&models.Note{})
}

func main() {
    ...
    dbMigrate()
    r.Run(":8080")
}
```

本来、データベース接続の確立やマイグレーションは`models`パッケージ側にまとめるほうがキレイです。今は暫定でOKです。サーバー起動後にMySQLコンソールで`USE notes; SHOW TABLES;`と確認すると、自動生成された`notes`テーブルが見つかるはずです。

---

## 4. Modelファイルの再構成

繰り返しになりますが、データベースの接続処理とマイグレーション処理を`main.go`にすべて書いていると煩雑です。そこで、`models/setup.go`を新たに作り、以下のように整理しましょう。

```go
package models

import (
    "fmt"
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
)

var db *gorm.DB

func ConnectDatabase() {
    dsn := "notes:tmp_pwd@tcp(127.0.0.1:3306)/notes?charset=utf8mb4&parseTime=True&loc=Local"
    conn, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        panic("Failed to connect to database!")
    }
    db = conn
}

func DbMigrate() {
    db.AutoMigrate(&Note{})
}

func Db() *gorm.DB {
    return db
}
```

すると、`main.go`は次のようにシンプルになります。

```go
func main() {
    models.ConnectDatabase()
    models.DbMigrate()

    r := gin.Default()
    ...
    r.Run(":8080")
}
```

このほうが「データベース関連の処理＝modelsパッケージに集約される」形となり、可読性がグッと向上します。

---

## 5. MVCのControllerを追加 – 最初は一覧画面から

アプリ開発でよく取られるMVCパターンに従い、コントローラとテンプレートを用意し、ノートの一覧を表示してみます。

### コントローラの作成

`controllers/notes_controller.go`のようなファイルを作り、以下のように書きます。

```go
package controllers

import (
    "net/http"
    "gin_notes/models"

    "github.com/gin-gonic/gin"
)

func NotesIndex(c *gin.Context) {
    notes := models.NotesAll()
    c.HTML(http.StatusOK, "notes/index.html", gin.H{
        "notes": notes,
    })
}
```

`NotesAll()` はこのあとモデル側に用意する関数で、削除されていないノート一覧を返すようにします。

### モデル側に一覧取得の関数を追加

```go
// note.go
func NotesAll() []Note {
    var notes []Note
    Db().Where("deleted_at IS NULL").Order("updated_at desc").Find(&notes)
    return notes
}
```

### テンプレート「notes/index.html」の設計

テンプレートを`templates/notes/index.html`に用意し、取得したノート一覧をループで表示します。ひとまず簡素に書いておき、あとでBootstrapを使って見栄えを良くします。

```html
<h1>All Notes</h1>
<hr>
{{range .notes}}
<div>
  <strong>{{.Name}}</strong>: {{.Content}}
</div>
{{end}}
```

### ルーティング設定

`main.go`に新しいルートを加えてあげると、`/notes` で一覧表示ができるようになります。

```go
r.GET("/notes", controllers.NotesIndex)
```

これで、ブラウザで`http://localhost:8080/notes`を開けば、追加したノートが一覧表示されるはずです。（今はまだデータが空っぽかもしれませんが問題ありません。）

---

## 6. 新規作成フォームページ

ノートの新規作成用フォームがないと何も登録できません。ページを一つ増やし、フォームの入力を受け付けるようにしましょう。

### ルートとコントローラ

`main.go`に次の1行を追加します。

```go
r.GET("/notes/new", controllers.NotesNew)
```

そしてコントローラ側では、単純にフォームページをレンダリングする処理を作ります。

```go
func NotesNew(c *gin.Context) {
    c.HTML(http.StatusOK, "notes/new.html", nil)
}
```

### テンプレート「new.html」

`templates/notes/new.html`にフォームを用意します。メモのタイトルと内容を入力して送信するイメージです。

```html
<h1>Create a New Note</h1>
<hr>
<form action="/notes" method="POST">
  <p>Name: <input type="text" name="name"></p>
  <p>Content: <textarea name="content"></textarea></p>
  <button type="submit">Create</button>
</form>
```

---

## 7. 新規ノートの作成処理

フォームを送信しても、まだサーバー側のPOSTルートが無いため404エラーになります。今度はPOST処理を実装しましょう。

### コントローラ「NotesCreate」

ルートを設定し、フォームデータを受け取ってモデルに保存させます。

```go
// main.go
r.POST("/notes", controllers.NotesCreate)
```

```go
// controllers/notes_controller.go
func NotesCreate(c *gin.Context) {
    name := c.PostForm("name")
    content := c.PostForm("content")
    models.NotesCreate(name, content)
    c.Redirect(http.StatusMovedPermanently, "/notes")
}
```

### モデル側のCreate関数

```go
// note.go
func NotesCreate(name, content string) {
    note := Note{Name: name, Content: content}
    Db().Create(&note)
}
```

これでフォーム送信→ノート登録→一覧ページへリダイレクト、という流れが完成です。試しにブラウザで`/notes/new`を開き、何か入力して作成ボタンを押すと、一覧画面にノートが表示されるはずです。

#### time.Timeエラーの対処

もし`time.Time`の解析に関するエラーが出たときは、接続文字列に `parseTime=True` をつけましょう。

```go
// setup.go
dsn := "notes:tmp_pwd@tcp(127.0.0.1:3306)/notes?charset=utf8mb4&parseTime=True&loc=Local"
```

---

## 8. 見た目の改善 – Bootstrap Cardを使う

テキストを並べただけのページだと少し寂しいので、Bootstrapの**カード（Card）**コンポーネントを使って、ノートをカード形式で一覧表示してみましょう。

```html
<!-- templates/notes/index.html -->
<h1>All Notes</h1>
<hr>
<div class="container">
  <div class="row">
    {{range .notes}}
    <div class="col-md-4 mb-3">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{{.Name}}</h5>
          <p class="card-text">{{.Content}}</p>
          <a href="/notes/{{.ID}}" class="btn btn-primary">View</a>
        </div>
      </div>
    </div>
    {{end}}
  </div>
</div>
```

同様にフォーム画面（`new.html`）もBootstrapのフォーム構造に書き換え、ラベルやボタンをスタイリッシュに整えると良いでしょう。Bootstrapの公式ドキュメントを参考にしながら書き換えてみてください。

---

## 9. 個別ノートの詳細表示 – Show機能

一覧には「View」ボタンを用意しましたが、その先で詳細ページを表示する機能が必要です。ここではURLパラメータ（`/notes/:id`）を使ってデータベースから個別のノートを取得します。

### ルートとコントローラ

```go
r.GET("/notes/:id", controllers.NotesShow)
```

```go
// controllers/notes_controller.go
func NotesShow(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.ParseUint(idStr, 10, 64)
    if err != nil {
        c.String(http.StatusBadRequest, "Invalid ID")
        return
    }
    note := models.NotesFind(id)
    if note == nil {
        c.String(http.StatusNotFound, "Note Not Found")
        return
    }
    c.HTML(http.StatusOK, "notes/show.html", gin.H{"note": note})
}
```

### モデル側で単一ノートを探す関数

```go
func NotesFind(id uint64) *Note {
    var note Note
    result := Db().Where("id = ? AND deleted_at IS NULL", id).First(&note)
    if result.Error != nil {
        return nil
    }
    return &note
}
```

### テンプレート「show.html」

```html
<h1>{{.note.Name}}</h1>
<hr>
<p>{{.note.Content}}</p>
<a href="/notes" class="btn btn-secondary">Back</a>
<!-- 後から Edit / Delete を追加します -->
```

これで`/notes/1`のようなURLでノートの詳細を確認できるようになりました。

---

## 10. ノートの編集 – Edit機能

ノートのタイトルや内容を修正したい場合に備え、編集画面を用意します。

### 編集ページを表示するためのルート

```go
r.GET("/notes/edit/:id", controllers.NotesEdit)
```

そして、`NotesEdit`関数では対象のノートを取得し、`edit.html`をレンダリングします。

```go
func NotesEdit(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.ParseUint(idStr, 10, 64)
    if err != nil {
        c.String(http.StatusBadRequest, "Invalid ID")
        return
    }
    note := models.NotesFind(id)
    if note == nil {
        c.String(http.StatusNotFound, "Note Not Found")
        return
    }
    c.HTML(http.StatusOK, "notes/edit.html", gin.H{"note": note})
}
```

### 「edit.html」の内容

新規作成時のフォームとよく似ていますが、既存の値を初期表示し、送信先を「`/notes/:id`」に変更します。

```html
<h1>Edit Note</h1>
<hr>
<form action="/notes/{{.note.ID}}" method="POST">
  <div class="mb-3">
    <label for="noteName" class="form-label">Note Name</label>
    <input type="text" class="form-control" id="noteName" name="name" value="{{.note.Name}}">
  </div>
  <div class="mb-3">
    <label for="noteContent" class="form-label">Note Content</label>
    <textarea class="form-control" id="noteContent" rows="3" name="content">{{.note.Content}}</textarea>
  </div>
  <button type="submit" class="btn btn-primary">Update</button>
</form>
```

### 編集内容を保存するPOSTルート

編集した内容を受け取ってデータベースを更新します。`/notes/:id`へのPOSTを受け付けるようにしてください。

```go
r.POST("/notes/:id", controllers.NotesUpdate)
```

```go
func NotesUpdate(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.ParseUint(idStr, 10, 64)
    if err != nil {
        c.String(http.StatusBadRequest, "Invalid ID")
        return
    }

    name := c.PostForm("name")
    content := c.PostForm("content")

    models.NotesUpdate(id, name, content)
    c.Redirect(http.StatusMovedPermanently, fmt.Sprintf("/notes/%d", id))
}
```

### モデルのUpdate関数

```go
func NotesUpdate(id uint64, name, content string) error {
    var note Note
    // まず対象ノートを取得
    if err := Db().Where("id = ? AND deleted_at IS NULL", id).First(&note).Error; err != nil {
        return err
    }
    // フィールドを更新
    note.Name = name
    note.Content = content
    // データベースへ保存
    return Db().Save(&note).Error
}
```

ここまで設定すると、詳細ページ(`show.html`)や一覧ページ(`index.html`)などから「Edit」ボタンを設置してあげれば、無事に編集画面へ遷移できるようになります。

---

## 11. ノートの削除 – Delete機能

最後は不要になったノートを削除する機能を追加します。ただし今回はGORMの**ソフトデリート**を活かして`deleted_at`に時刻を入れる形にしますので、物理的に行が消えるわけではありません。

### DELETEメソッドを使った削除API

HTMLフォームはGETかPOSTしかサポートしないため、JavaScriptでDELETEリクエストを送る方法を採用します。詳細ページなどにボタンを配置し、ボタンをクリックするとJavaScriptでDELETEリクエストを送るように書きましょう。

```html
<button class="btn btn-danger" onclick="deleteNote({{.note.ID}})">Delete</button>

<script>
function deleteNote(noteId) {
  if (!confirm('Are you sure you want to delete this note?')) {
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open('DELETE', '/notes/' + noteId, true);
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4 && xhr.status === 200){
      window.location.href = '/notes';
    }
  };
  xhr.send();
}
</script>
```

### ルートとコントローラ

`main.go`にDELETEメソッド用のエンドポイントを登録します。

```go
r.DELETE("/notes/:id", controllers.NotesDelete)
```

そして、コントローラ`NotesDelete`を実装します。

```go
func NotesDelete(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.ParseUint(idStr, 10, 64)
    if err != nil {
        c.String(http.StatusBadRequest, "Invalid ID")
        return
    }
    if err := models.NotesMarkDelete(id); err != nil {
        c.String(http.StatusInternalServerError, "Failed to delete note")
        return
    }
    c.String(http.StatusOK, "/notes")
}
```

### モデル側の削除関数

```go
func NotesMarkDelete(id uint64) error {
    var note Note
    if err := Db().Where("id = ? AND deleted_at IS NULL", id).First(&note).Error; err != nil {
        return err
    }
    return Db().Delete(&note).Error
}
```

`Delete(&note)`を呼ぶと、GORMは`deleted_at`にタイムスタンプを入れてくれます。これで同じIDを持つノートは「論理的に消えた」状態になり、以降は条件`WHERE deleted_at IS NULL`のSELECTにもヒットしなくなります。

---

## 終わりに – 今回の成果と今後の展開

ここまでで、Go + Gin + GORM + MySQLの環境下で「Notesアプリ」が動き、下記の一連のCRUDが実装できました。

1. 一覧表示 (`/notes`)
2. 新規作成 (`/notes/new` → POST `/notes`)
3. 詳細表示 (`/notes/:id`)
4. 編集 (`/notes/edit/:id` → POST `/notes/:id`)
5. ソフトデリート (`DELETE /notes/:id`)

また、Bootstrapカードを使って見た目を簡単に洗練することもできるのがわかりました。今回の作り方を応用すれば、ユーザー認証や複数テーブルの関連付け、RESTful APIサーバーの構築などへ発展させることができます。DockerやDocker ComposeでGoとMySQLを連携させた本格的な開発環境を整えるのも良いでしょう。

**Go言語 × Gin × GORM** は、少ない記述量でスピーディにWebアプリケーションを開発できる強力な組み合わせです。ぜひ、この「Notesアプリ」をベースに多機能化やUIのブラッシュアップを行ってみてください。実践を重ねることで、Goのモジュール管理やGinのルーティング、GORMの操作に対する理解がより深まるはずです。あなたの次のアイデアを形にするための第一歩として、本記事が少しでもお役に立てれば幸いです。