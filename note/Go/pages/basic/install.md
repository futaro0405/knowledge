# インストール
https://go.dev/
# Goのコードを保存する場所
GoのファイルはGOPATHのsrcで管理するのが基本となっています。
基本的にな考え方として、GOPAH/src配下にプロジェクトを作成することで、独自のパッケージをimportしてくれるようになっています。
アプリケーションなどで、プログラムファイルの分割をした際に重要になってきます。
GOPATHの確認は、コマンドプロンプト（Windows)かターミナル（Mac)でgo envと入力しますと、下記のような画面になるかと思います。
```
~/ go env
GO111MODULE=""
GOARCH="amd64"
GOBIN=""
GOCACHE="/Users/masa/Library/Caches/go-build"
GOENV="/Users/masa/Library/Application Support/go/env"
GOEXE=""
GOFLAGS=""
GOHOSTARCH="amd64"
GOHOSTOS="darwin"
GOINSECURE=""
GONOPROXY=""
GONOSUMDB=""
GOOS="darwin"
GOPATH="/Users/masa/go"　←ここ
GOPRIVATE=""
GOPROXY="https://proxy.golang.org,direct"
GOROOT="/usr/local/go"
GOSUMDB="sum.golang.org"
GOTMPDIR=""
GOTOOLDIR="/usr/local/go/pkg/tool/darwin_amd64"
GCCGO="gccgo"
AR="ar"
CC="clang"
CXX="clang++"
CGO_ENABLED="1"
GOMOD=""
CGO_CFLAGS="-g -O2"
CGO_CPPFLAGS=""
CGO_CXXFLAGS="-g -O2"
CGO_FFLAGS="-g -O2"
CGO_LDFLAGS="-g -O2"
PKG_CONFIG="pkg-config"
GOGCCFLAGS="-fPIC -m64 -pthread -fno-caret-diagnostics -Qunused-arguments -fmessage-length=0 -fdebug-prefix-map=/var/folders/ls/8q990vmx2b39jz892415zp040000gn/T/go-build035012952=/tmp/go-build -gno-record-gcc-switches -fno-common"
```

この中のGOPATHの配下にsrcというフォルダがありますので、その中で例えば今回の学習の場合、golang_udemyというフォルダを作り、lesson1/main.goのようにGoのファイルを作成すると良いかと思います。
レッスンごとにファイルを分けますと、後ほど復習する際に良いかと思います。

例）
GOPATH --- src --- golang_udemy --- lesson1 --- main.go

                                 ∟  lesson2 --- main.go
## ver1.13以降の場合
ver1.13以降ではmodule機能が有効となったため、GOPATHの配下にsrcフォルダが存在せず、binとpkgのみの構成になるようです。
なので、この場合自分でsrcフォルダを作成し、その配下にプロジェクトを保存するというやり方で問題ありません。

# Goのプログラムの実行（go run & go build)
## go run
### Goプログラムの手軽な実行方法
Goはコンパイルを基本とした言語ですが、直接プログラムを実行できるgo run コマンドを備えています。
Goプログラムのファイルパスを渡すだけで、簡単に実行できます。

```
go run main.go
```
## go build
go buildコマンドは、OPで与えたGoファイルを実行ファイル形式にコンパイルする。
### コンパイルとは？
人間が分かる言葉で書いたプログラムの元ネタ（ソースコード）の中身をコンピュータ上で実行可能な形式（オブジェクトコード）に変換することです。

```
go build -o main main.go
```

`-o`　OPを使用して出力する実行ファイルのファイル名を指定できる。
上記では、main.goをmainとしてコンパイル。
**--Windows ver--**
Windows環境でビルドする場合は、拡張子.exeをつけないと実行ファイル形式として扱えないので、`go build -o main.exe main.go`としてビルドする。

ビルドに成功すると、同じディレクトリに実行ファイルが生成される。
ビルドで生成されたファイルを実行するとgo runで実行した場合と同様のプログラムが走る。
GOではシンプルな手順で実行ファイルを生成できる。
### コンパイルするメリット
#### 1.ネイティブコードにコンパイルされる
Goはネイティブコードにコンパイルされた上で実行されるので、一般的なスクリプト言語の実行速度より10〜100倍という高いパフォーマンスを発揮する。
#### 2.マルチプラットフォームで動作する
GoはOSやCPUによる実行環境の差を隠蔽してくれる。この為、実行されるプラットフォームの差に気を配らなくても良い。
各実行環境で動作するプログラムを、１つのコンパイル環境から生成できる、クロスコンパイル機能を備えている。
特にこのクロスコンパイルの恩恵が大きいです。
Go は、1つのソースコードから様々なOS向けのバイナリを生成するクロスコンパイルをサポートしています。
Macで.exeファイルを生成してWindowsユーザにそれを渡せば、受け取った瞬間にすぐに実行できるという点が非常に便利なため、コマンドラインツールのようなものをクロスコンパイルして配布するなどといった用途で、Goが導入される場面も目立ってきました。
環境を指定したい場合は、__GOOS__ と __GOARCH__ という環境変数を先ほどのリストにある組み合わせで指定します。
##### Linux環境を指定してコンパイル

```
GOOS=linux GOARCH=amd64 go build -o main main.go
```
## マルチプラットフォーム
前述の通り、コンパイルすることで、異なる環境でも同一に動作させることが可能です。
例えば、Pythonなどだと、実装環境と、実行環境で差がある場合動作しないことがあります。
(ホストAで言語がインストールされているが、Bではインストールされていない場合は動作しない)
Goの場合は、buildして出来上がったバイナリをそのまま配布するだけで動作するというメリットがあります。
あとは、ターミナル上で`./main`と実行するだけで動作します

