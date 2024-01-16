# 例外処理についてもっと詳しく
## `ensure`
例外処理に`ensure`節を加えることで例外が発生してもしなくても必ず実行したい処理を書くことができる。  

```
begin
  # 例外が発生するかもしれない処理
rescue
  # 例外発生時の処理
ensure
  # 例外の有無にかかわらず実行する処理
end
```

```
# 書き込みモードでファイルを開く
file = File.open('some.txt', 'w')

begin
  # ファイルに文字を書き込む
  file << 'Hello'
ensure
  # 例外の有無にかかわらずファイルをクローズする
  file.close
end
```

## `ensure`の代わりにブロックを使う
ファイルの読み込みを行う場合はopenメソッドにブロックを渡すことで、ensure節やクローズ処理を書かずに済ませることができる。  
もしブロックの実行中に例外が発生した場合も、openメソッドが必ずクローズ処理を行う。

```
# ブロックつきでオープンするとメソッドの実行後に自動でクルーズ
File.open('some.txt', 'w') do |file|
  file << 'Hello'
  1/0
end
# 例外は発生するもののopenメソッドによってクローズ処理自体は必ず行われる
#=> divided by 0 (ZeroDivisionError)
```

## 例外処理のelse
例外が発生しなかった場合に実行されるelse節を書くこともできる。  
else節はrescue節とensure節の間におく。  

```
begin
  # 例外が発生するかもしれない処理
rescue
  # 例外が発生した場合の処理
else
  # 例外が発生しなかった場合の処理
ensure
  # 例外の有無にかかわらず実行する処理
end
```

else節が使われるケースはあまり多くなく、使わなくてもbegin節に例外が発生しなかった場合の処理を書いてしまえばよい。  
ただし、begin節とは異なり、else節の中で実行されたコードはエラーが起きてもその手前に書かれたrescue節で捕捉されない。

```
begin
  puts 'Hello'
  puts '例外は発生しませんでした。'
rescue
  puts '例外は発生しました。'
# else
# puts '例外は発生しませんでした。'
end
```

## 例外処理と戻り値
例外処理にも戻り値がある。  
例外が発生せず、最後まで正常に処理が進んだ場合はbegin節の最後の式が戻り値になる。  
また、例外が発生してその例外が捕捉された場合はrescue節の最後の式が戻り値になる。  

```
ret =
  begin
    'ok'
  rescue
    'error'
  ensure
    'ensure'
  end

ret #=> "ok"
```

```
def some_method(n)
  begin
    1 / n
    'ok'
  rescue
    'error'
  ensure
    'ensure'
  end
end

some_method(1) #=> "ok"
some_method(0) #=> "error"
```

## `begin`/`end`を省略する`rescue`修飾子
`rescue`は修飾子として使うこともできる。  

```
例外が発生しそうな処理 rescue 例外が発生したときの戻り値
```

例外が発生しなければ元の処理の値が、例外が発生した場合は`rescue`修飾子に書いた値が、それぞれ式全体の戻り値となる。  

```
# 例外が発生しない場合
1 / 1 rescue 0 #=> 1

# 例外が発生する場合
1 / 0 rescue 0 #=> 0
```

実践的なコード例  
Dateクラスを使い、引数として渡された文字列をパースしてDateクラスのオブジェクトに変換するメソッド。

```
require 'date'

def to_date(string)
  begin
    # 文字列のパースを試みる
    Date.parse(string)
  rescue ArgumentError
    # パースできない場合はnilを返す
    nil
  end
end

# パース可能な文字列を渡す
to_date('2021-01-01')
#=> <Date:2021-01-01 ((2459216 j, 0 s, 0 n),+ 0 s, 2299161 j)>

# パース不可能な文字列を渡す
to_date('abcde')
#=> nil
```

上のコードを書き換える。  

```
def to_date(string)
  Date.parse(string) rescue nil
end
```

`begin`と`end`を省略できる分メソッドを短く描くことができる。  
ただし、補足する例外クラスを指定することはできない。  
`rescue`修飾子を使うとStanderdErrorとそのサブクラスが捕捉される。  

## `$!`と`$@`に格納される例外情報
Rubyでは最後に発生した例外は組み込み変数の`$!`に格納される。  
バックトレース情報葉`$@`に格納される。  

```
begin
  1 / 0
rescue
  puts "#{$!.class}#{$!.message}"
  puts $@
end
```

## 例外処理の`begin/end`を省略できるケース
メソッドの中身全体が例外処理で囲まれている場合は`begin`と`end`を省略することができる。  

```
def fizz_buzz(n)
  begin
    if n % 15 == 0
      'Fizz Buzz'
    elsif n % 3 == 0
      'Fizz'
    elsif n % 5 == 0
      'Buzz'
    else
      n.to_s
    end
  rescue => e
    puts "#{e.class} #{e.message}"
  end
end
```

上のコードを例外処理の`begin`と`end`を省略して次のように書く。  

```
def fizz_buzz(n)
  if n % 15 == 0
    'Fizz Buzz'
  elsif n % 3 == 0
    'Fizz'
  elsif n % 5 == 0
    'Buzz'
  else
    n.to_s
  end
  rescue => e
    puts "#{e.class} #{e.message}"
end
```

## `rescue`した例外を再度発生させる
`rescue`節の中で`raise`メソッドを使うこともできる。  
このとき`raise`メソッドの引数を省略すると、`rescue`節で捕捉した例外をもう一度発生させることができる。  
例外が発生したらプログラム自体は異常終了させるものの、その情報はログに残すというときにこのテクニックが使える。

```
def fizz_buzz(n)
  if n % 15 == 0
    'Fizz Buzz'
  elsif n % 3 == 0
    'Fizz'
  elsif n % 5 == 0
    'Buzz'
  else
    n.to_s
  end
  rescue => e
  puts "[LOG]エラーが発生しました。#{e.class} #{e.message}"
  raise
end
```

## 独自の例外クラスを定義する
例外クラスは独自に定義することも可能。  
例外クラスを定義する場合は特別な理由がない限り、StandardErrorクラスか、そのサブクラスを継承する。  

```
clas NoCountryError < StandardError
  attr_reader :country

  def initialize(message, country)
    @country = country
    super("#{message} #{country}")
  end
end

def currency_of(country)
  case country
  when :japan
    'yen'
  when :us
    'dollar'
  when :india
    'repee'
  else
    # 独自に定義したNoCountryErrorを発生させる
    raise NoCountryError, "無効な国名です。 #{country}"
  end
end

begin
  currency_of(:italy)
rescue NoCountryError => e
  puts e.message
  puts e.country
end
#=> 無効な国名です。italy
# italy
```