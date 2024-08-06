ツールDoc

#### 【Goのツール群について】

標準でさまざまなツールが付属している。

前章まででプログラムのビルドgo buildや簡易的な実行go run のコマンドは使いましたが、本章では細かく紹介する。

  

  

**Goコマンド**

Go　のツールはgo コマンドで使用する。goだけ実行するとヘルプメッセージを見れる

  

`go`

  

1. Go is a tool for managing Go source code.

3. Usage:

5. 	go <command> [arguments]

7. The commands are:

9. 	bug         start a bug report
10. 	build       compile packages and dependencies
11. 	clean       remove object files and cached files
12. 	doc         show documentation for package or symbol
13. 	env         print Go environment information
14. 	fix         update packages to use new APIs
15. 	fmt         gofmt (reformat) package sources
16. 	generate    generate Go files by processing source
17. 	get         add dependencies to current module and install them
18. 	install     compile and install packages and dependencies
19. 	list        list packages or modules
20. 	mod         module maintenance
21. 	run         compile and run Go program
22. 	test        test packages
23. 	tool        run specified go tool
24. 	version     print Go version
25. 	vet         report likely mistakes in packages

27. Use "go help <command>" for more information about a command.

29. Additional help topics:

31. 	buildmode   build modes
32. 	c           calling between Go and C
33. 	cache       build and test caching
34. 	environment environment variables
35. 	filetype    file types
36. 	go.mod      the go.mod file
37. 	gopath      GOPATH environment variable
38. 	gopath-get  legacy GOPATH go get
39. 	goproxy     module proxy protocol
40. 	importpath  import path syntax
41. 	modules     modules, module versions, and more
42. 	module-get  module-aware go get
43. 	module-auth module authentication using go.sum
44. 	module-private module configuration for non-public modules
45. 	packages    package lists and patterns
46. 	testflag    testing flags
47. 	testfunc    testing functions

49. Use "go help <topic>" for more information about that topic.

  

これらはコマンドの一覧と説明です。

  

  

**コマンドのドキュメントを参照**

go help コマンド

例)

`go help version`

  

**バージョン確認**

`go version`

  

**環境変数の確認**

`go env`

  

**ソースコードの整形**

ソースコードを推奨される形式へ自動的に変換する

インデントなどの乱れがあるソースコードがあるディレクトリで

`go fmt`

を打つと、きれいに整形しなおしてくれる。できるだけ使った方がきれいなコードになる。

  

1. OP
2. -n 実行されるコマンドの表示(ファイルは書き換えない)　対象のファイルを確認する時に使う
3. -x 実行されるコマンドの表示

  

**パッケージのドキュメントを参照する**

go doc パッケージ名

例）

`go doc math/rand`

  

**識別子（関数や定数、変数など）を指定**

go doc パッケージ名.識別子

例）

`go doc math/rand.Intn`

  

**メソッド名の指定**

例）timeパッケージのTime型のUnixのドキュメントを参照

`go doc time.Time.Unix`

  

1. OP
2. -c 識別子のマッチングで大文字小文字を厳密に判定する
3. -u 非公開な識別子やメソッドについてもドキュメントを出力する

  

  

**プログラムのビルド**

`go build`

ファイルやパッケージを指定しないビルド

  

例）app - main.go

        　　 config.go

  

   appディレクトリ内で

`go build`

   を実行した場合、app（Windowsではapp.exe)という実行ファイルが生成されれば成功

   この様に、ファイルやパッケージ名を指定しないビルドはカレントディレクトリ内の*.goファイルを対象にコンパイルする。

   ビルド結果として、カレントディレクトリの名前を持つ実行ファイルを生成する。

   １つのディレクトリ内には１つのパッケージのみ定義可能

**パッケージのビルド**

例）src - foo - bar1.go   

               　　　bar2.go

`go build app`

   fooパッケージを構成するファイルがコンパイルされる。

  

**ファイルを指定するビルド**

通常のgo build　では１つのディレクトリ内に複数パッケージを含む状態ではエラーを発生させる。個別にファイルを指定すればビルド可能

例）app - main.go  (package main)

     　　　 config.go(package main)

       　 　  foo.go   (package foo)

`go build main.go config.go`

   この場合生成される実行ファイル名は最初に指定したファイル名になる。(この場合main)

  

   実行ファイル名の指定の場合

`go build -o appname main.go config.go`

  

1. OP
2. -x 内部処理の出力 go build -x
3. -o 生成する実行ファイル名の指定 go build -o ファイル名

  

  

**パッケージや実行ファイルをビルドした結果をGOPATH内にインストールする**

`go install パッケージ名`

$GOPATHな/srcに置かれたパッケージのビルドした結果が実行ファイルであれば$GOPATH/binへ、それ以外であれば$GOPATH/pkgへインストールされる。

$GOPATH - bin (実行ファイルのインストール先)

                     pkg (ビルドしたパッケージのインストール先)

                     src (パッケージのソースコードのインストール先)

  

  

**外部パッケージのダウンロードとインストールをまとめて実行する**

`go get パッケージ`

GitHubなどのサービス上で開発されているGoのパッケージなどに使用することができる。

ダウンロード対象のパッケージがさらに別のパッケージに依存している場合でも、自動的に依存関係を抽出しつつ必要なパッケージのダウンロードとインストールを実行してくれる。

GitHubでは数多くのGoのパッケージが開発されていて、これらの資産を生かすためにもGitの導入は必須である。

Goを使用してAndroidやiOSで動作するアプリの開発をサポートするgolang/mobileがある。これらの拡張パッケージは実験的なものであったり、多くのバグを含むものなどが混在しているので、

使用には十分に注意が必要である。

  

例）

HTTPプロトコルの最新版であるHTTP2に対応した拡張パッケージをインストールする

`go get golang.org/x/net/http2`

このパッケージはgolang.orgによってホストされているため、パッケージにはgolang.org/x/net/http2を指定する。

何も出力されなければ成功。内部の処理を確認したい場合は-xオプションを付与すれば確認できる。

go install同様に$GOPATH内に保存される。

このパッケージを使用する場合は

  

import "golang.org/x/net/http2"

  

と指定する。

GitHubでホストされているパッケージも同様の手順で導入できる。

1. OP
2. -d 対象パッケージのダウンロードのみ実行して停止する
3. -f 対象パッケージのパスから推測されるリポジトリへの検証をスキップする (-u指定時のみ）
4. -fix 対象パッケージの依存関係を解決する前にgo fixツールを適用する。
5. -insecure カスタムリポジトリを使用する場合に非セキュアなプロトコルの使用を許可する。（例：HTTP)
6. -t 対象パッケージに付属するテストが依存するパッケージも合わせてダウンロードする。
7. -u 対象パッケージの更新と依存パッケージの更新を検出して再ダウンロードとインストールを実行する。

  

**テストの実行**

`go test パッケージ名`