# 状態を保持するモジュールの作成
クラスインスタンス変数を使ってクラス自身にデータを保持する方法はモジュールでも使うことができる。  
ただし、モジュールはインスタンスできない。インスタンスを作って何か操作をする必要がない場合はモジュールにしたほうがミスを防げる。  
```
module AwesomeApi
  # 設定値を保持するクラスインスタンス変数
  @base_url = ''
  @debug_mode = false

  # クラスインスタンス変数を読み書きするための特異メソッドを定義
  class << self
    def base_url=(value)
      @base_url = value
    end

    def base_url
      @base_rul
    end

    def debug_mode=(value)
      @debug_mode = value
    end

    def debug_mode
      @debug_mode
    end

    # わかりやすく定義したが、本来は下の一行
    # attr_accessor :base_url, :debug_mode
  end
end

# 設定値を保存
AwesomeApi.base_url = 'https://example.com'
AwesomeApi.debug_mode = true

# 設定値を参照
AwesomeApi.base_url #=> "https://example.com"
AwesomeApi.debug_mode #=> true
```

ライブラリの実行に必要な設定値などはアプリケーション全体で共通の値になることが多い。そのため、設定値の情報はアプリケーション内で唯一ひとつだけの状態になっていることが望ましい。  
このように唯一ひとつだけのオブジェクトを作る手法を __シングルトンパターン__ と呼ぶ。  
