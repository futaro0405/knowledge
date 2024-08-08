# sqlite3の準備
sqliteをインストールする際の手順の確認
## Mac
### ① brew のインストール
-> https://brew.sh/index_ja
### ②sqlite3 をインストール
```
brew install sqlite
```
### ③Install gcc
C言語のライブラリをインポートするので、GOがビルドする際に必要。
C言語やJavaなどのコンパイラ
-> https://developer.apple.com/xcode
### ④ドライバのインストール
```
go get github.com/mattn/go-sqlite3
```
### ⑤不要だが一応

```
export CGO_ENABLED=1
```
## Windows
### ①Install sqlite3
-> https://www.sqlite.org/download.html
### ②Install gcc
-> http://tdm-gcc.tdragon.net/
### ③ドライバのインストール
```
go get github.com/mattn/go-sqlite3
```
### ④不要だが一応
```
set CGO_ENABLED=1
```

 ```
 macでバージョン確認
# sqlite3 インストール確認
$ sqlite3
SQLite version 3.19.3 2017-06-27 16:48:08
Enter ".help" for usage hints.
Connected to a transient in-memory database.
Use ".open FILENAME" to reopen on a persistent database.
sqlite>
# sqlite3 を抜ける
sqlite> .exit
 
# xcode のコマンドラインツールの確認
$ xcode-select --install
xcode-select: error: command line tools are already installed, use "Software Update" to install updates
 
# gcc インストール確認
$ gcc --version
Configured with: --prefix=/Applications/Xcode.app/Contents/Developer/usr --with-gxx-include-dir=/usr/include/c++/4.2.1
Apple LLVM version 10.0.0 (clang-1000.11.45.5)
Target: x86_64-apple-darwin17.7.0
Thread model: posix
InstalledDir: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin
 
```