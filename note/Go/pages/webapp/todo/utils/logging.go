package utils

func LoggingSettings(logFile strng) {
  logfile, err := os.OpenFile(logFile, os.O_RDWR|os.O_CRATE|os.O_APPEND, 0666)
}