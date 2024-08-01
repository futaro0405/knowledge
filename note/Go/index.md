## インストール
https://go.dev/

## Goのコードを保存する場所
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
