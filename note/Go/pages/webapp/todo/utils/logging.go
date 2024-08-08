package utils

func LoggingSettings(logFile strng) {
  // logfileを読み込み
  logfile, err := os.OpenFile(logFile, os.O_RDWR|os.O_CRATE|os.O_APPEND, 0666)
  if err != nil {
    log.Fatalln(err)
  }
  // logの書き込み先を標準出力とログファイルに指定
  multiLogFile := io.MultiWriter(os.Stdout, logfile)
  // logのformatを指定
  log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
  log.SetOutput(multiLogFile)
}