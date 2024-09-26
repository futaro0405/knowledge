# contextの具体的な使用例
これまで学んだコンテキストの機能を全て活用した実用的な例を紹介します。  
具体的には、簡単なHTTPサーバーもどきを作成します。  

## 簡易HTTPサーバーの作成
作成するものは、以下の特徴を持つ簡易HTTPサーバーです。  

**基本機能**  
- `go run main.go`コマンドで起動
- 起動後、ユーザーが入力した「path」と「token」に基づいて、適切なハンドラを選ぶ
- 選ばれたハンドラは、以下の処理を行う
  1. データベースからデータを取得
  2. レスポンスを作成
  3. 作成したレスポンスを画面に表示


**特別な機能**  
- データベースからのデータ取得に2秒以上かかった場合、タイムアウトとして処理を中断します。

### 実際に作成する
#### エントリポイント(main)
まずは`go run main.go`でサーバーを起動させるエンドポイントである`main.go`を作っていきます。  

```go
package main

func main() {
  srv := server.DefaultServer
  srv.ListenAndServe()
}
```

##### `server.DefaultServer`の取得
これは、私たちが別途定義する予定のサーバー設定です。  
標準的な設定を持つサーバーインスタンスを取得します。  

##### `srv.ListenAndServe()`の実行
これにより、サーバーが起動し、リクエストの受付を開始します。  
実際のHTTPサーバーでは、この関数が特定のポートでリッスンを始めます。  

### サーバーの実装
それでは、エントリポイント中で起動しているサーバーの中身を見てみましょう。

#### サーバーのリクエスト受付処理
このコードは、サーバーがどのようにリクエストを受け付け、処理を開始するかを示しています。  

```go
package server

type MyServer struct {
	router map[string]handlers.MyHandleFunc
}

func (srv *MyServer) ListenAndServe() {
	for {
		var path, token string
		fmt.Scan(&path)
		fmt.Scan(&token)

		ctx := session.SetSessionID(context.Background())
		go srv.Request(ctx, path, token)
	}
}
```

詳しく解説します。  

##### サーバー構造体

```go
type MyServer struct {
  router map[string]handlers.MyHandleFunc
}
```

**`router`**  
パスと対応するハンドラ関数のマップです。  
これを使ってリクエストを適切な処理にルーティングします。

#### リクエスト受付処理 (ListenAndServe メソッド)

```go
func (srv *MyServer) ListenAndServe() {
  for {
    var path, token string
    fmt.Scan(&path)
    fmt.Scan(&token)

    ctx := session.SetSessionID(context.Background())
    go srv.Request(ctx, path, token)
  }
}
```
##### 無限ループ
`for`ループを使用して、サーバーを常時稼働状態にします。  
これにより、サーバーは停止するまで継続的にリクエストを受け付けます。  
##### リクエスト情報の読み取り
`fmt.Scan(&path)`と`fmt.Scan(&token)`で標準入力からパスとトークンを読み取ります。  
実際のHTTPサーバーでは、これはHTTPリクエストからの情報読み取りに相当します。  
##### コンテキストの作成
`ctx := session.SetSessionID(context.Background())`で新しいコンテキストを作成します。  
`context.Background()`は空のコンテキストを作成し、`SetSessionID`はそこにセッションIDを追加します。  
これにより、各リクエストに一意のセッションIDが割り当てられます。  
##### 非同期リクエスト処理
`go srv.Request(ctx, path, token)`で新しいゴールーチンを起動し、リクエストを処理します。  
これにより、サーバーは複数のリクエストを並行して処理できます。  

#### ルーティング
`Request`メソッドは、受け取ったリクエストを適切なハンドラに振り分ける重要な役割を果たします。  

```go
package server

func (srv *MyServer) Request(ctx context.Context, path string, token string) {
	// リクエストオブジェクト作成
	var req handlers.MyRequest
	req.SetPath(path)

	// (key:authToken <=> value:token)をcontextに入れる
	ctx = auth.SetAuthToken(ctx, token)

	// ルーティング操作
	if handler, ok := srv.router[req.GetPath()]; ok {
		handler(ctx, req)
	} else {
		handlers.NotFoundHandler(ctx, req)
	}
}
```

##### リクエストオブジェクトの作成

```go
var req handlers.MyRequest
req.SetPath(path)
```

`handlers.MyRequest`型のオブジェクトを作成します。  
受け取ったパスをこのオブジェクトに設定します。  

##### コンテキストへの認証情報の追加

```go
ctx = auth.SetAuthToken(ctx, token)
```

受け取った認証トークンをコンテキストに追加します。
これにより、後続の処理で認証情報を簡単に取得できます。

##### ルーティング処理

```go
if handler, ok := srv.router[req.GetPath()]; ok {
  handler(ctx, req)
} else {
  handlers.NotFoundHandler(ctx, req)
}
```

`srv.router`マップを使用して、パスに対応するハンドラを探します。  
- ハンドラが見つかった場合（`ok`が`true`）:
  - そのハンドラを呼び出し、コンテキストとリクエストオブジェクトを渡します。
- ハンドラが見つからなかった場合:
  - `NotFoundHandler`を呼び出します。

#### ハンドラの実装
このハンドラは、リクエストを受け取り、認証を行い、データベースからデータを取得し、適切なレスポンスを返す一連の処理を行います。  

```go
package handlers

type MyHandleFunc func(context.Context, MyRequest)

var GetGreeting MyHandleFunc = func(ctx context.Context, req MyRequest) {
	var res MyResponse

	// トークンからユーザー検証→ダメなら即return
	userID, err := auth.VerifyAuthToken(ctx)
	if err != nil {
		res = MyResponse{Code: 403, Err: err}
		fmt.Println(res)
		return
	}

	// DBリクエストをいつタイムアウトさせるかcontext経由で設定
	dbReqCtx, cancel := context.WithTimeout(ctx, 2*time.Second)

	//DBからデータ取得
	rcvChan := db.DefaultDB.Search(dbReqCtx, userID)
	data, ok := <-rcvChan
	cancel()

	// DBリクエストがタイムアウトしていたら408で返す
	if !ok {
		res = MyResponse{Code: 408, Err: errors.New("DB request timeout")}
		fmt.Println(res)
		return
	}

	// レスポンスの作成
	res = MyResponse{
		Code: 200,
		Body: fmt.Sprintf("From path %s, Hello! your ID is %d\ndata → %s", req.path, userID, data),
	}

	// レスポンス内容を標準出力(=本物ならnet.Conn)に書き込み
	fmt.Println(res)
}
```

##### ハンドラの定義

```go
type MyHandleFunc func(context.Context, MyRequest)

var GetGreeting MyHandleFunc = func(ctx context.Context, req MyRequest) {
    // ... (ハンドラの内容)
}
```

`MyHandleFunc`型を定義し、それに基づいて`GetGreeting`ハンドラを実装しています。  

##### 認証処理

```go
userID, err := auth.VerifyAuthToken(ctx)
if err != nil {
  res = MyResponse{Code: 403, Err: err}
  fmt.Println(res)
  return
}
```

コンテキストから認証トークンを取り出し、検証します。  
認証に失敗した場合、403 Forbiddenエラーを返して処理を終了します。  


##### データベースリクエストのタイムアウト設定
```go
dbReqCtx, cancel := context.WithTimeout(ctx, 2*time.Second)
```

データベースリクエストに2秒のタイムアウトを設定します。

##### データベースからのデータ取得

```go
rcvChan := db.DefaultDB.Search(dbReqCtx, userID)
data, ok := <-rcvChan
cancel()
```

データベースに検索リクエストを送信し、結果をチャネルで受け取ります。  
`cancel()`を呼び出してリソースを解放します。  

##### タイムアウト処理

```go
if !ok {
  res = MyResponse{Code: 408, Err: errors.New("DB request timeout")}
  fmt.Println(res)
  return
}
```

データベースリクエストがタイムアウトした場合、408 Request Timeoutエラーを返します。

##### レスポンスの作成と返却

```go
res = MyResponse{
  Code: 200,
  Body: fmt.Sprintf("From path %s, Hello! your ID is %d\ndata → %s", req.path, userID, data),
}
fmt.Println(res)
```

成功した場合、200 OKステータスコードと共に、パス、ユーザーID、取得したデータを含むレスポンスを作成します。  
レスポンスを標準出力に書き込みます（実際のHTTPサーバーではクライアントに送信します）。  

#### リクエストスコープな値の共有(session, auth)
この「HTTPサーバーもどき」では、リクエストごとに共有される2つの重要な値があります。  

- セッションID（トレース用の内部ID）
- 認証トークン

これらの値をコンテキストに格納し、必要な時に取り出すための関数を別のパッケージとして提供しています。  

##### セッションIDの管理 (session パッケージ)

```go
package session

type ctxKey int

const (
  sessionID ctxKey = iota
)

var sequence int = 1

func SetSessionID(ctx context.Context) context.Context {
  idCtx := context.WithValue(ctx, sessionID, sequence)
  sequence += 1
  return idCtx
}

func GetSessionID(ctx context.Context) int {
  id := ctx.Value(sessionID).(int)
  return id
}
```

`ctxKey`型を定義し、`sessionID`という一意のキーを作成します。  
SetSessionID 関数は新しいセッションIDを生成し、コンテキストに追加します。  
GetSessionID 関数はコンテキストからセッションIDを取得します。  

##### 認証トークンの管理 (auth パッケージ)

```go
package auth

type ctxKey int

const (
  authToken ctxKey = iota
)

func SetAuthToken(ctx context.Context, token string) context.Context {
  return context.WithValue(ctx, authToken, token)
}

func getAuthToken(ctx context.Context) (string, error) {
  if token, ok := ctx.Value(authToken).(string); ok {
    return token, nil
  }
  return "", errors.New("cannot find auth token")
}

func VerifyAuthToken(ctx context.Context) (int, error) {
  token, err := getAuthToken(ctx)
  if err != nil {
    return 0, err
  }

  userID := len(token)
  if userID < 3 {
    return 0, errors.New("forbidden")
  }

  return userID, nil
}
```

認証トークンの設定、取得、検証のための関数を提供します。  
SetAuthToken はトークンをコンテキストに追加します。  
getAuthToken はコンテキストからトークンを取得します。  
VerifyAuthToken はトークンを検証し、ユーザーIDを返します。  

##### 別パッケージとして提供する利点
**循環参照の回避**  
これらの機能を別パッケージにすることで、handlers と db パッケージ間の循環参照を防ぎます。

**再利用性の向上**  
セッションIDや認証トークンの管理は、アプリケーションの多くの部分で必要になる可能性があります。  
別パッケージにすることで、どのパッケージからでも簡単に利用できます。  

**関心の分離**  
認証やセッション管理のロジックを独立させることで、コードの構造が明確になります。  

**テストの容易さ**  
これらの機能を独立させることで、単体テストが容易になります。  

**拡張性**  
将来、認証やセッション管理の方法を変更する場合、これらのパッケージだけを修正すれば良くなります。  

このように、リクエストスコープの値を別パッケージで管理することで、コードの整理、再利用性、保守性が向上します。これは、大規模なアプリケーション開発において特に重要な設計原則です。