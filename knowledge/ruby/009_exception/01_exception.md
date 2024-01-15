# 例外の捕捉
## 発生した例外を捕捉する
何らかの理由で例外が発生してもプログラムを続行したい場合は、例外処理を明示的に書くことでプログラムを続行させることが可能。  

```
begin
  # 例外処理が起きうる処理
rescue
  # 例外処理が発生した場合の処理
end
```

```
puts 'Start.'

begin
  1 + '10'
rescue
  puts '例外が発生したが、このまま続行する'
end

puts 'End.'
```

## 例外処理の流れ
実際のプログラムでは予期しない場所で例外が発生する。例外が発生した箇所がbegin~rescueで囲まれていない場合、そこで処理が中断しメソッドの呼び出しをひとつずつ戻る。  
メソッド呼び出しが戻る途中に例外を捕捉するコードがあれば、そこから処理を続行できる。  

```
def method_1
  puts 'method_1 start.'

  begin
    method_2
  rescue
    puts '例外発生'
  end

  puts 'method_1 end.'
end

def method_2
  puts 'method_2 start.'
  method_3
  puts 'method_2 end.'
end

def method_3
  puts 'method_3 start.'
  1 / 0
  puts 'method_3 end.'
end

method_1
#=> method_1 start.
#=> method_2 start.
#=> method_3 start.
#=> 例外発生
#=> method_1 end.
```

## 例外オブジェクトから情報を取得
例外オブジェクトのメソッドを呼び出すことで、発生した例外に関する情報を取得することができる。  
代表的なメソッドとして、`message`メソッドと`backtrace`メソッドを使ってみる。  
`message`メソッドは例外発生時のエラーメッセージを返す。`backtrace`メソッドはバックトレース情報を配列で返す。  
例外オブジェクトから情報を取得したい場合は次のような構文を使う。  

```
begin
  # 例外処理が起きうる処理
rescue => 例外オブジェクトを格納する変数
  # 例外処理が発生した場合の処理
end
```

具体的なコード例は以下のとおり。  

```
begin
  1 / 0
rescue => e
  puts "error class: #{e.class}"
  puts "error message: #{e.message}"
  puts e.backtrace
end
```

## クラスを指定して捕捉する例外を限定する
例外のクラスを指定すると、例外オブジェクトのクラスが一致した場合のみ、例外を捕捉することができる。  

```
begin
  # 例外が起きうる処理
rescue 捕捉したい例外クラス
  # 例外処理が発生した場合の処理
end
```

具体的なコード例は以下のとおり。  
ZeroDivisionErrorが発生した場合のみrescue節が実行されプログラムを続行する。  
ZeroDivisionError以外のエラーが発生した場合は例外は捕捉されない（プログラムが異常終了する）。  
rescue節を複数書くことで異なる例外クラスに対応することができる。  

```
begin
  'abc'.foo
rescue ZeroDivisionError
  puts '0で除算した'
rescue NoMethodError
  puts '存在しないメソッドが呼び出された'
end
```

1つのrescue節に複数の例外クラスを指定することもできる。  

```
begin
  'abc'.foo
rescue ZeroDivisionError, NoMethodError
  puts '0で除算したか存在しないメソッドが呼び出された'
end
```

例外オブジェクトを変数に格納することも可能。  

```
begin
  'abc'.foo
rescue ZeroDivisionError, NoMethodError => e
  puts '0で除算したか存在しないメソッドが呼び出された'
  puts "Error: #{e.class} #{e.message}"
end
```

## 例外クラスの継承関係を理解する
すべての例外クラスはExceptionクラスを継承している。  
その下に多くの例外クラスがあるが、StandardErrorのサブクラスとそれ以外の例外クラスの違いを理解することができる。  

StandardErrorクラスは通常のプログラムで発生する可能性が高い例外を表すクラスで、StandardErrorクラスを継承していないNoMemoryErrorクラスやSystemExitクラスは通常のプログラムでは発生しない特殊なエラーが発生したことを表す。  
rescue節に何もクラスを指定しなかった場合に捕捉されるのはStandardErrorとそのサブクラスで、StandardErrorを継承していない例外クラスは捕捉されない。  

rescue節に例外クラスを指定した場合、捕捉されるのはそのクラス自身とそのサブクラスになる。  
Exceptionクラスを指定すると、StandardErrorと無関係のエラーまで捕捉することになる。  
しかし、通常プログラムで捕捉するものはStandardErrorクラスか、そのサブクラスに限定すべきだ。  

## 継承関係とrescue節の順番に注意する
rescue節が複数ある場合、上から順番にrescue節のチェックを行うため、順番に注意しないと永遠に実行されないrescue節ができる。  

## 例外発生時にもう一度処理をやり直す`retry`
一時的に発生している問題が例外の原因であれば、やり直すことで正常に実行できる可能性がある。  
その場合はrescue節でretry文を実行するとbegin節の最初からやり直すことができる。  

```
begin
  # 例外が起きうる処理
rescue
  retry # 処理をやり直す
end
```

ただし、無条件にretryし続けると例外が解決しない無限ループを作る恐れがある。  
その場合はカウンタ変数を用意して、retryの回数を制限するのがよい。  

```
retry_count = 0
begin
  puts '処理を開始'
  1 / 0
rescue
  retry_count += 1
  if retry_count <= 3
    puts 'retry'
    retry
  else
    puts 'retry失敗'
  end
end

#=>
処理を開始
retry
処理を開始
retry
処理を開始
retry
処理を開始
retry失敗
```
