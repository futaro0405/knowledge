# ブロックを利用するメソッドの定義とyield
## `yield`を使ってブロックの処理を呼び出す
メソッドの呼び出し時にブロックをつけて呼び出した時、ブロックは実行されない。  

```
def greet
  puts 'おはよう'
  puts 'こんばんは'
end

# ブロック付きでメソッドを呼び出す
greet do
  puts 'こんにちは'
end
#=> おはよう
# こんばんは
```

渡されたブロックを実行するためにメソッド内で`yield`を使う。  
`yield`を複数回書けば、ブロックも複数回呼び出される。

```
def greet
  puts 'おはよう'

  # ここでブロックの処理を呼び出す
  yield

  puts 'こんばんは'
end

greet do
  puts 'こんにちは'
end
#=> おはよう
# こんにちは
# こんばんは
```

ブロックなしでメソッドが呼ばれているにもかかわらず、`yield`でブロックを呼び出すとエラーが発生する。

```
greet
#=> (LocalJumpError)
```

ブロックが渡されたかどうかを確認する場合は`block_given?`メソッドを使う。  

```
def greet
  puts 'おはよう'

  if block_given?
    yield
  end

  puts 'こんばんは'
end

greet
#=> おはよう
# こんばんは

greet do
  puts 'こんにちは'
end
#=> おはよう
# こんにちは
# こんばんは
```

`yield`はブロックに引数を渡したり、ブロックの戻り値を受け取ったりできる。  

```
def greet
  puts 'おはよう'

  text = yield 'こんにちは'
  puts text

  puts 'こんばんは'
end

greet do |text|
  text * 2
end
#=> おはよう
# こんにちはこんにちは
# こんばんは
```

`yield`とブロックでやりとりする引数箱数の過不足に寛容。  
`yield`で渡した引数がブロックパラメータよりも多い、また、ブロックパラメータが`yield`で渡した引数より多かった場合もエラーにならない。  

```
def greet
  puts 'おはよう'

  text = yield 'こんにちは'
  puts text

  puts 'こんばんは'
end

greet do |text, other|
  text * 2 + other.inspect
end
#=> おはよう
# こんにちはこんにちはnil
# こんばんは
```

## ブロックを引数として明示的に受け取る
ブロックをメソッドの引数として明示的に受け取ることもできる。  
ブロックを引数として受け取る場合は、引数の前に`&`を付ける。  
また、ブロックを実行する場合は`call`メソッドを使う。  

```
def greet(&block)
  puts 'おはよう'

  text = block.call('こんにちは')
  puts text

  puts 'こんばんは'
end

greet do |text|
  text * 2
end
#=> おはよう
# こんにちはこんにちはnil
# こんばんは
```

引数の名前は自由につけることができる。  
ただし、ブロックの引数はメソッド定義につき1つしか指定できない。  
また、他の引数がある場合はブロックの引数を必ず最後に指定する必要がある。  
ブロックが渡されたかはその引数がnilかどうかで判断する。  

```
def greet(&block)
  puts 'おはよう'

  unless block.nil?
    text = block.call('こんにちは')
    puts text
  end
  puts 'こんばんは'
end

greet
#=> おはよう
# こんばんは

greet do |text|
  text * 2
end
#=> おはよう
# こんにちはこんにちは
# こんばんは
```

ブロックを引数として受け取る場合でも`yield`や`block_given?`メソッドは使用可能。  

```
def greet(&block)
  puts 'おはよう'

  if block_given?
    text = yield 'こんにちは'
    puts text
  end
  puts 'こんばんは'
end
```

ブロックを引数として受け取れるようにする意味はブロックを他のメソッドに引き渡せるようになること。  

```
def greet_ja(&block)
  texts = ['おはよう', 'こんにちは', 'こんばんは']

  # ブロックを別のメソッドに引き渡す
  greet_common(texts, &block)
end

def greet_en(&block)
  texts = ['good morning', 'hello', 'good evening']

  # ブロックを別のメソッドに引き渡す
  greet_common(texts, &block)
end

def greet_common(texts, &block)
  puts texts[0]
  puts block.call(texts[1])
  puts texts[2]
end

greet_ja do |text|
  text * 2
end
#=> おはよう
# こんにちはこんにちは
# こんばんは


greet_en do |text|
  text.upcase
end
#=> good morning
# HELLO
# good evening
```

他のメソッドにブロックを引き渡す場合は引数の手前にも`&`を付ける。  
`&`を付けない場合はブロックではなく、普通の引数の1つとみなされる。  

```
greet_common(texts, block)
#=> (ArgumentError)
```

もうひとつのメリッドは渡されたブロックに対してメソッドを呼び出し、必要な情報を取得したり、ブロックに対する何かしらの操作を実行したりできるようになること。  

```
# ブロックパラメータの個数に応じて、yieldで渡す引数の個数と内容を変える
def greet(&block)
  puts 'おはよう'
  text =
    # ブロックパラメータが1個の場合
    if block.arity == 1
      yield 'こんにちは'
    # ブロックパラメータが2個の場合
    if block.arity == 2
      yield 'こんに','ちは'
    end

  puts text
  puts 'こんばんは'
end

greet do |text|
  text * 2
end
#=> おはよう
# こんにちはこんにちは
# こんばんは


greet do |text1, text2|
  text1 * 2 + text2 * 2
end
#=> おはよう
# こんにこんにちはちは
# こんばんは
```

