# Procオブジェクト
## Procオブジェクトの基礎
Procクラスはブロックをオブジェクト化するためのクラス。  

```
# "Hello"という文字列を返すProcオブジェクトを作成
hello_proc = Proc.new do
  'Hello'
end

# {}をつかってもよい
hello_proc = Proc.new{'Hello'}
```

Procオブジェクトはオブジェクトとして存在しているだけでは実行されない。  
Procオブジェクトを実行する場合は`call`メソッドを使う。  

```
hello_proc = Proc.new { 'Hello' }
hello_proc.call #=> "Hello"
```

実行時に引数を利用するProcオブジェクトも定義できる。  

```
add_proc = Proc.new { |a, b| a + b }
add_proc.call(10, 20) #=> 30
```

引数にデフォルト値を付けることもできる。  

```
add_proc = Proc.new { |a = 0, b = 0| a + b }
add_proc.call #=>0
add_proc.call(10) #=>10
add_proc.call(10, 20) #=>30
```

Procオブジェクトを作成する場合は`Proc.new`だけでなく、`Kernel`モジュールの`proc`メソッドを使うこともできる。  

```
add_proc = proc { |a, b| a + b }
```

## Procオブジェクトをブロックの代わりに渡す
Procオブジェクトはブロックとは異なりオブジェクトとして扱うことができる。  
つまり、変数に入れて別のメソッドに渡す、Procオブジェクトに対してメソッドを呼び出すことができる。  

```
def greet(&block)
  puts block.class
  puts 'おはよう'
  text = block.call('こんにちは')
  puts text
  puts 'こんばんは'
end

greet do |text|
  text * 2
end
#=> Proc
# おはよう
# こんにちはこんにちは
# こんばんは
```

引数の`block`はProcクラスのインスタンスであることがわかる。  
`arity`メソッドはProcクラスのインスタンスメソッドであり、つまりは、`arity`メソッドが呼び出せるのはメソッド呼び出し時に使ったブロックがProcオブジェクトになっているから、ということになる。  
この考えを発展させると、ブロックの代わりにProcオブジェクトをメソッドの引数として渡すテクニックが使える。  

```
def greet(&block)
  puts 'おはよう'
  text = block.call('こんにちは')
  puts text
  puts 'こんばんは'
end

repeat_proc = Proc.new { |text| text * 2}
greet(&repeat_proc)
#=> おはよう
# こんにちはこんにちは
# こんばんは
```

Procオブジェクトをブロックの代わりに渡す際は`&repeat_proc`のように、手前に`&`がついている点に注意が必要。  
`&`がないとブロックではなく、普通の引数が渡されたとみなす。  

## Procオブジェクトを普通の引数として渡す
メソッドがブロックを受け取るのではなく、Procオブジェクトを普通の引数として受け取って実行することができる。  
メソッドが受け取れるブロックの数は最大1つだが、Procオブジェクトを引数として渡す分には制限がない。  

```
def greet(proc_1, proc_2, proc_3)
  puts proc_1.call('おはよう')
  puts proc_2.call('こんにちは')
  puts proc_3.call('こんばんは')
end

# メソッドに渡すProcオブジェクトを用意する
shuffle_proc = Proc.new { |text| text.chars.shuffle.join }
repeat_proc = Proc.new { |text| text * 2 }
question_proc = Proc.new { |text| "#{text}?" }

greet(shuffle_proc, repeat_proc, question_proc)
# => はおうよ
# こんにちはこんにちは
# こんばんは?
```

## `Proc.new`とラムダの違い
Procオブジェクトを作る方法は4つある。  

```
# Proc.newまたはprocメソッドでProcオブジェクトを作成する
Proc.new { |a, b| a + b }
proc { |a, b| a + b }

# ->構文またはlambdaメソッドでProcオブジェクトを作成する
->(a, b) {a + b}
lambda { |a, b| a + b }
```

上の2つと下の2つは振る舞いが異なる。  
ここでは上の方法で作られたオブジェクトは`Proc.new`、下の方法で作られたオブジェクトをラムダと呼ぶこととする。  
`->`はラムダを作成するための記号。  
引数のリストに使っている()は省略可能。  
引数がなければすべて省略可能。  
ブロックを作成するときと同様、{}は改行させて使っても構わない。  
また、{}の代わりに`do...end`を使うことが可能。
引数のデフォルト値を持たせることも可能。

```
->a,b {a+b}

->{'Hello!'}

->(a, b) {
  a + b
}

->(a, b) do
  a + b
end

->(a=0, b=0) {a+b}
```

`Proc.new`とラムダはほぼ同じものだが、微妙な違いがいくつかある。  
その中で一番重要な違いが引数の扱い方。  
単純な呼び出し方では`Proc.new`もラムダも引数の扱いに違いはない。  
しかし、ラムダは`Proc.new`よりも引数のチェックが厳密になる。  

```
# Proc.newの場合
add_proc = Proc.new { |a, b| a.to_i + b.to_i }
add_proc.call(10, 20, 100) #=> 30

# ラムダの場合（引数の数が合わないとエラー）
add_lambda = ->(a, b) { a.to_i + b.to_i }
add_proc.call(10, 20, 100)
#=> (ArgumentError)
```

## `Proc.new`かラムダかを判断する`lambda?`メソッド
Procクラスのインスタンスが`Proc.new`として作られたのか、ラムダとして作られたのかを判断したい場合は`lambda?`メソッドを使う。  

```
# Proc.newの場合
add_proc = Proc.new { |a, b| a + b }
add_proc.class #=> Proc
add_proc.lambda #=> false

# ラムダの場合
add_lambda = ->(a, b) { a + b }
add_lambda.class #=> Proc
add_lambda.lambda #=> true
```

