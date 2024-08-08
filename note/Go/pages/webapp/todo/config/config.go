package config

type ConfigList struct {
  Port      string
  SQLDriver string
  DbName    string
  LogFile   string
}

// globalに宣言して外部ファイルから呼び出せるように
var Config ConfigList

func LoadConfig() {
  // iniを読み込む
  cfg, err := ini.Load("config.ini")
  if err != nil {
    log.Fatalln(err)
  }
  // iniの内容をConfigListに格納
  Config = ConfigList{

  }
}