# Symbol

## シンボルとは

シンボルは任意の文字列と一対一に対応するオブジェクトです。

文字列の代わりに用いることもできますが、必ずしも文字列と同じ振る舞いをするわけではありません。

同じ内容のシンボルは必ず同一のオブジェクトです。

  

```

:apple

:Japan

:ruby_Is_fun

```

  

## シンボルと文字列の違い

シンボルはSymbolクラスのオブジェクト。

  

```

:apple.class #=> Symbol

'apple'.class #=> String

```

シンボルはRubyの内部で整数として管理される。

そのため、2つの値が同じかどうか調べる場合、文字列より高速に処理ができる。

  

```

'apple' == 'apple'

:apple == :apple

```

  

「同じシンボルであれば全く同じオブジェクトである。」という特徴がある。

「大量の同じ文字列」と「大量の同じシンボル」ではシンボルのほうがメモリの仕様効率が良くなる。

  

```

:apple.object_id #=>11223344

:apple.object_id #=>11223344

:apple.object_id #=>11223344

```

  

シンボルはイミュータブルなオブジェクトである。

  

```

# シンボルはイミュータブルなので、破壊的な変更は不可能

symbol = :apple

symbol.upcase! #=> error

```

  

## シンボルの特徴と主な用途

  

- 表面上は文字列っぽいので、理解しやすい

- 内部的には整数なので、コンピュータは高速に値を比較できる。

- 同じシンボルは同じオブジェクトであるため、メモリの使用効率がいい。

- イミュータブルなので、勝手に値を変えられる心配がない。

  

代表的な使用例はハッシュのキー。

ハッシュのキーにシンボルを使うと文字列よりも高速に値を取り出すことができる。

  

```

# シンボルをハッシュのキーにする

currencies = {:japan => 'yen', :us => 'dollar', :india => 'rupee'}

# シンボルを使い値を取り出す

currencies[:japan]

# => "yen"

```

  

プログラム上で区分や状態を管理したいときにシンボルが使える。

  

```

# タスクの状態をシンボルで管理する

status = :done

case status

when :todo

  'これからやります'

when :doing

  'いまやっています'

when :done

  '終わりました'

end

  

#=> "終わりました"

```

  

# シンボルについて

シンボルがキーになる場合、コロンの位置が変わり省略して書くことができます。

  

```

currencies = {japan: 'yen', us: 'dollar', india: 'rupee'}

```

  

キーも値もシンボルの場合

  

```

{japan: :yen, us: :dollar, india: :rupee}

```

  

## メソッドのキーワード引数とハッシュ

キーがシンボルのハッシュとよく似た記法でメソッドの引数を指定する「キーワード引数」という機能がある。

  

```

def メソッド名(キーワード引数1: デフォルト値1, キーワード引数2: デフォルト値2)

  # メソッドの実装

end

```

  

```

def buy_burger(menu, drink: true, potato: true)

  # 省略

end

  

buy_burger('cheese', drink: true, potato: true)

```

  

キーワード引数にはデフォルト値が設定されているので引数を省略することもできる。

  

```

buy_burger('cheese', potato: false)

```

  

キーワード引数は呼び出し時に順番を自由に入れ替えることができる。

  

```

buy_burger('cheese', potato: true, drink: true)

```

  

デフォルト値を省略することも可能。

  

```

buy_burger('cheese', potato:, drink:)

```

  

キーワード引数を使うメソッドには`**`を付けることでハッシュをキーワード引数として渡すことも可能。

  

```

params = {drink: true, potato: false}

buy_burger('cheese', **params)

```

  

# ハッシュとキーワード引数についてもっと詳しく

## ハッシュで使用頻度の高いメソッド

  

- keys

- values

- has_key?/key?/include?/

- member?

  

### `keys`

`keys`メソッドはハッシュのキーを配列として返すメソッド。

  

```

currencies = {japan: 'yen', us: 'dollar', india: 'rupee'}

  

currencies.keys

# => [:japan, :us, :india]

```

  

### `values`

`values`メソッドはハッシュの値を配列として返すメソッド。

  

```

currencies = {japan: 'yen', us: 'dollar', india: 'rupee'}

  

currencies.values

# => ["yen", "dollar", "rupee"]

```

  

### `has_key?`/`key?`/`include?`/

`has_key?`メソッドはハッシュの中に指定されたキーが存在するか確認するメソッド。

  

```

currencies = {japan: 'yen', us: 'dollar', india: 'rupee'}

  

currencies.has_key?(:japan) # =>true

currencies.has_key?(:italy) # =>false

```

  

## `**`でハッシュを展開させる

`**`をハッシュの前につけるとハッシュリテラル内で他のハッシュの要素を展開することができる。

  

```

h = {us: 'dollar', india: 'rupee'}

# 変数hの要素を**で展開させる

{japan: 'yen', **h}

#=> {japan: 'yen', us: 'dollar', india: 'rupee'}

```

  

`**`のかわりに`merge`メソッドを使っても同じ結果が得られる。

  

```

h = {us: 'dollar', india: 'rupee'}

  

{japan: 'yen'}.merge(h)

#=> {japan: 'yen', us: 'dollar', india: 'rupee'}

```

  

## ハッシュを使った疑似キーワード引数

メソッドのキーワード引数は、以前はメソッドの定義で引数としてハッシュそのものを受け取るようにしていた。

このようにハッシュを受け取ってキーワード引数のように見せるテクニックを __疑似キーワード引数__ と呼ぶ。

  

```

def buy_burger(menu, option = {})

  drink = options[:drink]

  potato = options[:potato]

  # 省略

end

  

buy_burger('cheese', drink: true, potato: true)

```

  

## 任意のキーワードを受け付ける`**`引数

キーワード引数を使うメソッドに定義されていないキーワードを渡すとエラーが発生する。

しかし、任意のキーワードも同時に受け取りたいというケースの場合もある。

その場合、`**`をつけた引数を最後に用意する。

`**`をつけた引数にはキーワード引数で指定されていないキーワードがハッシュとして格納される。

  

```

def buy_burger(menu, drink: true, potato: true, **others)

  puts others

end

  

buy_burger('fish', drink: true, potato: false, salad:true, chicken: false)

# =>{:salad=>true, :chicken=>false}

```

  

## ハッシュを明示的にキーワード引数に変換する`**`

Ruby2.xでは。ハッシュを引数として渡すと、それが自動的にキーワード引数に変換されていた。

  

```

def buy_burger(menu, drink: true, potato: true)

  # 省略

end

  

params = {drink: true, potato: false}

buy_burger('fish', params)

```

Ruby3.0ではキーワード引数への自動変換が行われない。

これは「キーワード引数の分離」と呼ばれる仕様変更による影響。

このような場合、`**`を使って明示的にハッシュをキーワード引数に変換する必要がある。

  

```

# **付きでハッシュを渡すと、ハッシュがキーワード引数として扱われるようになる

buy_burger('fish', **params)

```

  

## メソッド呼び出し時の{}の省略

Rubyでは「最後の引数がハッシュであればハッシュリテラルの{}を省略できる」というルールがある。

  

```

def buy_burger(menu, options = {})

  puts options

end

  

buy_burger('fish', {'drink' => true, 'potato' => false})

  

# 下のように書き換えられる。

buy_burger('fish', 'drink' => true, 'potato' => false)

```

  

このルールは配列リテラルでも同様。

以下は同じ構造の配列を定義している。

```

a = ['fish', {drink: true, potato: false}]

b = ['fish', drink: true, potato: false]

```

  

## ハッシュから配列へ、配列からハッシュへ

ハッシュは`to_a`メソッドを使い配列に変換することができる。

`to_a`メソッドを使うとキーと値が一つの配列に入り、さらにそれが複数並んだ配列になって返ってくる。

  

```

currencies = {japan: 'yen', us: 'dollar', india: 'rupee'}

currencies.to_a

# => [[:jpan, "yen"],[:us, "dollar"],[:india, "rupee"]]

```

  

配列に対して`to_h`メソッドを呼ぶと配列をハッシュに変換する。

この時、ハッシュに変換する配列はキーと値の組み合わせごとに1つの配列に入り、それが要素の分だけ配列として並んでいる必要がある。

  

```

array = [[:jpan, "yen"],[:us, "dollar"],[:india, "rupee"]]

array.to_h

# => {:japan=>"yen, :us=>"dollar",:india=>"rupee"}

```

  

## ハッシュのデフォルト値を理解する

ハッシュに対して存在しないキーを指定するとnilが返る。

nil以外の値を返したいときは`Hash.new`でハッシュを作成し引数にデフォルト値となる値を指定する。

  

```

h = Hash.new('hello')

h[:foo] #=> "hello"

```

  

newの引数としてデフォルト値を指定した場合、デフォルト値として毎回同じオブジェクトが返る。

そのため、デフォルト値に対して破壊的な変更を適応すると他の変数の値も一緒に変わってしまう。

  

```

h = Hash.new('hello')

a = h[:foo] #=> "hello"

b = h[:bar] #=> "hello"

  

# 変数aとbは同一オブジェクト

a.equal?(b) #=> true

  

# 変数aに破壊的な変更を適応すると、変数bの値も一緒に変わる

a.upcase!

a #=>"HELLO"

b #=>"HELLO"

  

# ハッシュ自身は空のまま

h #=> {}

```

  

文字列や配列など、ミュータブルなオブジェクトをデフォルト値として返す場合はHash.newとブロックを組み合わせてデフォルト値を返すことで、このような問題を避けることができる。

  

```

# キーが見つからないとブロックがその都度実行され、ブロックの戻り値がデフォルト値になる

h = Hash.new{'hello'}

a = h[:foo] #=> "hello"

b = h[:bar] #=> "hello"

  

# 変数aとbは異なるオブジェクト

a.equal?(b) #=> false

  

# 変数aに破壊的な変更を適応しても、変数bの値は変わらない

a.upcase!

a #=>"HELLO"

b #=>"hello"

  

# ハッシュ自身は空のまま

h #=> {}

```

  

また`hash.new`にブロックを与えるとブロックパラメータとしてハッシュ自身と見つからなかったキーが渡される。

そこで、ブロックパラメータを使ってハッシュにキーをデフォルト値も同時に設定するコードもよくつかわれる。

  

```

# デフォルト値を返すだけでなく、ハッシュに指定されたキーとデフォルト値を同時に設定する

h = Hash.new {|hash, key| hash[key] = 'hello'}

h[:foo] #=> "hello"

h[:bar] #=> "hello"

  

h #=> {:foo => "hello", :bar => "hello"}

```

  

## その他のキーワード引数に関する高度な話題

### キーワード引数を一切受け取らない`**nil`引数

メソッド定義にこの引数が含まれていると、そのメソッドがキーワード引数を1つも受け取らないことを意味する。

  

```

def foo(*args)

  p args

end

  

# **nilなしだとキーワード引数がハッシュになってargsに格納される

foo(x: 1)

#=> [{:x=>1}]

```

  

```

def bar(*args, **nil)

  p args

end

# **nilがあるとキーワード引数を一切受け取らないため、メソッド呼び出しはエラーになる

bar(x: 1)

#=> error

  

# キーワード引数ではなく、ハッシュオブジェクトを引数として渡すのはOK

bar({x: 1})

#=> [{:x=>1}]

```

  

### `...`を使った引数の移譲

普通の引数もキーワード引数もまとめてメソッドに渡すことができた。

  

```

# Ruby2.Xでは*つきの引数を使うと別のメソッドに引数を丸ごと移譲で来た

def foo(*args)

  bar(*args)

end

  

def bar(a, b, c: 1)

  puts "a=#{a}, b=#{b}, c=#{c}"

end

  

fooに渡した引数がそのままbarに以上される

foo(10, 20, c:30)

#=> a=10, b=20, c=30

```

  

Ruby3.0から「キーワード引数の分離」が行われた関係でエラーが発生する。

この問題は回避するために次のように通常の引数とキーワード引数を別々に移譲する必要がある。

  

```

def foo(*args, **opts)

  bar(*args, **opts)

end

```

`...`を使いよりシンプルに定義できる。

  

```

def(...)

  bar(...)

end

```

  

# シンボルについてもっと詳しく

## シンボルを作成する様々な方法

シンボルを作成する場合はコロンに続けて、変数やクラス名、メソッド名の識別子として有名な文字列を書く。

（以下に例の$はグローバル変数の、@はインスタンス変数の識別子としてそれぞれ有効。）

また、+や==など、再定義可能な演算子も:をつけてシンボルにできる。

  

```

:apple

:Apple

:ruby_is_fun

:okey?

:welcome!

:_secret

:$dollar

:@at_mark

:+

:==

```

  

識別子として無効な文字列

```

:12345

:ruby-is-fun

:ruby is fun

:()

```

この場合でもシングルクオートで囲むとシンボルとして有効になる。

  

```

:'12345'

:'ruby-is-fun'

:'ruby is fun'

:'()'

```

  

シングルクオートの代わりにダブルクオートを使うと文字列と同じように式展開できる。

  

```

name = 'Alice'

:"#{name.upcase}" #=>:ALICE

```

  

ハッシュを作成する際に"文字列リテラル:値"の形式で書いた場合も":文字列リテラル"と同じようにみなされキーがシンボルになる。

  

```

hash = {'abc': 123} #=> {:abc=>123}

```

  

## %記法でシンボルやシンボルの配列を作成する

%記法を使ってシンボルを作成することもできる。

シンボルを作成する場合は%sを使う。

  

```

# !を区切り文字に使う

%s!ruby is fun! #=> #:"ruby is fun"

  

# ()を区切り文字に使う

%s(ruby is fun) #=> #:"ruby is fun"

```

  

シンボルの配列を作成する場合は、%iを使うことができる。

この場合、空白文字が要素の区切りになる。

  

```

%1(apple orange melon)

#=> [:apple, :orange, :melon]

```

  

改行文字を含めたり、式展開したりする場合は%Iを使う。

```

name = 'Alice'

  

# %iでは改行文字や式展開の構文が、そのままシンボルになる

%i(hello\ngood-bye #{name.upcase})

#=> [:"hello\\ngood-bye",:"\\#{name.upcase}"]

  

# %Iでは改行文字や式展開が有効になったうえでシンボルが作られる

%I(hello\ngood-bye #{name.upcase})

#=> [:"hello\ngood-bye",:ALICE]

```

## シンボルと文字列の関係

文字列とシンボルは見た目が似ているが互換性はない。

ただし、`to_sym`メソッド（`intern`メソッド）を使うと文字列をシンボルに変換できる。

  

```

string = 'apple'

symbol = :apple

  

string.to_sym #=>:apple

string.to_sym == symbol #=>true

```

  

反対にシンボルを文字列に変換する場合は`to_s`メソッド（`id2name`メソッド）を使う。

  

```

string = 'apple'

symbol = :apple

  

string.to_s #=> "apple"

string == symbol.to_s #=> true

string + symbol.to_s #=> "appleapple"

```

  

メソッドによっては文字列とシンボルを同等に扱うものもある。

例えば、`respond_to?`メソッドはオブジェクトに対して、文字列またはシンボルで指定した名前のメソッドを呼び出せるかどうかを調べることができる。

  

```

'apple'.respond_to?('include?')

#=>true

'apple'.respond_to?(:include?)

#=>true

'apple'.respond_to?('foo_bar')

#=>false

'apple'.respond_to?(:foo_bar)

#=>false

```