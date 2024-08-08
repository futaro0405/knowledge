package config

import (
  "log"

  "gopkg.in/gi-ini/ini.v1"
)

type ConfigList struct {
  Port      string
  SQLDriver string
  DbName    string
  LogFile   string
}

// globalに宣言して外部ファイルから呼び出せるように
var Config ConfigList

func init() {
  LoadConfig()
}

func LoadConfig() {
  // iniを読み込む
  cfg, err := ini.Load("config.ini")
  if err != nil {
    log.Fatalln(err)
  }
  // iniの内容をConfigListに格納
  Config = ConfigList{
    Port:      cfg.Section("web").Key("port").MustString("8080"),
    SQLDriver: cfg.Section("db").Key("driver").String(),
    DbName:    cfg.Section("db").Key("name").String(),
    LogFile:   cfg.Section("web").Key("logfile").String(),
  }
}
