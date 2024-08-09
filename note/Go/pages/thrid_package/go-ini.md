# go-iniの準備
```
go get "gopkg.in/go-ini/ini.v1"
```
でgo-iniをインストールしてください。

# go-ini
iniファイルを読み込むためのサードパーティのパッケージ。
iniファイルでプログラム上でconfigの設定などを行うことができる。

```ini:config.ini
[web]
port = 8080

[db]
name = webapp.sql
driver = sqlite3
```


```go
package main

import (
	"fmt"

	"gopkg.in/go-ini/ini.v1"
)

type ConfigList struct {
	Port      int
	DbName    string
	SQLDriver string
}

var Config ConfigList

func init() {
	// config.iniを読み込む
	cfg, _ := ini.Load("config.ini")
	Config = ConfigList{
		// MustInt(初期値)
		Port: cfg.Section("web").Key("port").MustInt(8080),
		DbName: cfg.Section("db").Key("name").MustString("webapp.sql"),
		SQLDriver: cfg.Section("db").Key("driver").String(),
	}
}

func main() {
	fmt.Printf("%T %v\n", Config.Port, Config.Port)
	fmt.Printf("%T %v\n", Config.DbName, Config.DbName)
	fmt.Printf("%T %v\n", Config.SQLDriver, Config.SQLDriver)
}

```