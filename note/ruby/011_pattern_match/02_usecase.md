# パターンマッチの利用パターン
パターンマッチは配列、ハッシュをのほかにいくつかの利用パターンがある。  

- valueパターン
- variableパターン
- arrayパターン
- hashパターン
- asパターン
- alternativeパターン
- findパターン

## valueパターン
in節に数値や文字列などを直接指定できる利用パターン。  
case節の式とin節の値が等しければ、対応する処理が実行される。  
case文と同様にパターンマッチも当たを返すので結果を変数に代入したり、メソッドの戻り値とすることができる。  

```
country = 'italy'

message =
  case country
  in 'japan'
    'こんにちは'
  in 'us'
    'Hello'
  in 'italy'
    'Ciao'
  end
```

`then`を使って条件にマッチした時の処理を一行で書くことができる（case文と同じ）。

```
case country
in 'japan' then 'こんにちは'
in 'us' then 'Hello'
in 'italy' then 'Ciao'
end
```

パターンがひとつもマッチしない場合はエラー（例外）が発生する。  
case文の時はnil、パターンマッチは例外（`NoMatchingPatternError`）
エラーを発生させたくない場合はelse節を書くことで、どの条件にもマッチしなかった場合の処理を用意することができる。  

## variableパターン
in節のパターンに変数を書いてローカル変数の宣言と代入を同時に行う利用パターン。  

`in obj`のように書くとあらゆるオブジェクトがマッチし変数objに代入される。  

```
# 文字列をマッチ
case 'Alice'
in obj
  "obj=#{obj}
end
#=> "obj=Alice"

# 数値をマッチ
case '123'
in obj
  "obj=#{obj}
end
#=> "obj=123"

# 配列をマッチ
case [10, 20]
in obj
  "obj=#{obj}
end
#=> "obj=[10, 20]"
```

代入ではなくin節で事前に定義された変数の値を参照したい場合は、ピン演算子（`^`）を使う。  

```
alice = 'Alice'
bob = 'Bob'
name = 'Bob'

case name
in ^alice
  'Aliceさんこんにちは'
in ^bob
  'Bobさんこんにちは'
end
```

ピン演算子は事前に定義された変数だけでなく、in節で代入された変数を同じin節で参照することもできる。  

```
records = [
  [7, 7, 7],
  [6, 7, 5]
]

records.each do |record|
  case record
  in [n, ^n, ^n]
    puts "all same: #{record}"
  else
    puts "not same: #{record}"
  end
end
```

厳密にいうとピン演算子を使ったマッチはvalueパターンのため、マッチに`===`が利用される。  

```
records = [
  [Integer, 1, 2],
  [Integer, 3, X]
]

records.each do |record|
  case record
  # 最後の2要素が最初の要素のクラスのインスタンスであればマッチ
  in [Klass, ^Klass, ^Klass]
    puts "match: #{record}"
  else
    puts "not match: #{record}"
  end
end
#=> match: [Integer, 1, 2]
# not match: [Integer, 3, X]
```

なお、in節に指定できる変数はローカル変数のみ。  
インスタンス変数を使うと構文エラーとなる。  

```
case 1
in @n
  "@n=#{@n}"
end
#=> SyntaxError

# ピン演算子とインスタンス変数を組み合わせても構文エラー
@n = 1
case 1
in ^@n
  '1です'
end
#=> SyntaxError

# ピン演算子を使いたい場合はいったんローカル変数に入れなおす必要がある
n = @n
case 1
in ^n
  '1です'
end
#=> "1です"
```

メソッド呼び出しもピン演算子と組み合わせることはできない。  

```
s = '1'
# ピン演算子とto_iメソッドを組み合わせた場合も構文エラー
case 1
in ^s.to_i
  '1です'
end
#=> SyntaxError
```

## arrayパターン
in節に[]を使って配列の構造パターンを指定する利用パターン。  
[]の中に書いた変数には対応する要素の値が代入される。  

```
case [1, 2, 3]
in [a, b, c]
  "a=#{a}, b=#{b}, c=#{c}"
end
#=> "a=1, b=2, c=3"
```

配列は入れ子になっていてもよい。  
入れ子になった配列を配列のまま1つの変数に代入することもできる。  

```
case [1, [2, 3]]
in [a, [b, c]]
  "a=#{a}, b=#{b}, c=#{c}"
end
#=> "a=1, b=2, c=3"

case [1, [2, 3]]
in [a, b]
  "a=#{a}, b=#{b}"
end
#=> "a=1, b=[2, 3]"
```

変数ではなく、数値や文字列をそのままin節に指定すると「その値と等しいこと」がマッチの条件になる。  

```
case [1, 999, 3]
in [1, n, 3]
# 配列の要素数3、かつ最初と最後の要素が1,3であればマッチ
  "n=#{n}"
end
#=> "n=999"
```

各要素のマッチ判定には`===`が使われるため、クラス名（クラスオブジェクト）や範囲オブジェクトをin節に指定して「そのクラスのインスタンスか」「その範囲に収まるか」といった条件を指定することもできる。  

```
case ['Alice', 999, 3]
# 1番目の要素がString、2番目の要素が10以上
in [String, 10..., n]
  "n=#{n}
end
#=> "n=3"
```

in節で同じ変数を2回以上使うことはできない。  

```
case [1, 2, 3]
in [a, a, 3]
  # 省略
end
#= (SyntaxError)
```

ただし、`_`（アンダースコア）または`_`で始まる変数は「任意の要素」を表現する目的で例外的に2回以上使うことができる。  
この場合、通常の変数として使わないことが前提になる。  

```
case [1, 2, 3]
in [_, _, 3]
  # 要素数が3つで最後の要素が3ならマッチ
  'matched'
end
#=> 'matched'

# _の代わりに_aを使う
case [1, 2, 3]
in [_a, _a, 3]
  # 要素数が3つで最後の要素が3ならマッチ
  'matched'
end
#=> 'matched'
```

in節で*を使うと任意の長さの要素を指定できる。  

```
case [1, 2, 3, 4, 5]
in [1, *rest]
  # 最初の要素が1であればマッチ
  "rest=#{rest}"
end
#=> 'rest=[2, 3, 4, 5]'
```

*は使いたいが変数には入れたくない場合は変数名を省略できる。  
*をなくしてカンマで終わらせても同じ意味になる。  


```
case [1, 2, 3, 4, 5]
in [1, *]
  # 最初の要素が1であればマッチ
  'matched'
end
#=> 'matched'

# *をなくしても同じ意味になる
case [1, 2, 3, 4, 5]
in [1,]
  # 最初の要素が1であればマッチ
  'matched'
end
#=> 'matched'
```

arrayパターンのin節には必ず`[]`を付けていたが一番外側の`[]`は省略可能。  

```
case [1, [2, 3]]
in a, [b, c]
  "a=#{a}, b=#{b}, c=#{c},"
end
#=> "a=1, b=2, c=3,"
```

さらにcase節に指定するオブジェクトはある条件を満たしていれば変数（Arrayオブジェクト）以外も指定可能。  

## hashパターン
in節に`{}`を使ってハッシュの構造パターンを指定する利用パターン。  
値に変数を指定すると、その変数に対応する値が格納される。  

```
case {name: 'Alce', age: 20}
in {name: name, age: age}
  "name=#{name}, age=#{age}"
end
```

値の変数を省略するとキーと同じ名前の変数に値が代入される。  

```
case {name: 'Alce', age: 20}
in {name:, age:}
  "name=#{name}, age=#{age}"
end
```

キーの順番はマッチの結果には影響しない

```
case {name: 'Alce', age: 20}
in {age:, name:}
  "name=#{name}, age=#{age}"
end
```

値にはvalueパターンのように固定の値や`===`で比較可能な値を指定できる。  

```
case {name: 'Alce', age: 20, gender: :female}
in {age: 'Alice', name: 20..., gender:}
  # :nameの値が'Alice'、:ageの値が18以上、キーに:genderが含まれていればマッチ
  "gender=#{gender}"
end
#=> 'gender=female'
```

hashパターンとarrayパターンを混在させることも可能。  

```
case {name: 'Alce', children: ['Bob']}
in {name:, children: [child]}
  # :nameと:childrenのキーを持ち、なおかつ:childrenの値が要素1個の配列であればマッチ
  "name=#{name}, child=#{child}"
end
#=> 'name=Alce, child=Bob'
```

hashパターンはハッシュの各要素がin節で指定したパターン（キーと値、またはキーのみ）に部分一致すればマッチしたと判定される。  

```
case {name: 'Alice' age: 20, gender: :female}
in {name: 'Alice, gender:}
  # in節に:ageを指定していないが:name、:genderが部分一致しているので全体としてはマッチ
  "gender=#{gender}"
end
#=> 'gender=female'
```

このため、in節の順番を間違えると意図した動きにならない。  

```
cars = [
  {name: 'The Beatle', engine: '105ps'},
  {name: 'Prius', engine: '98ps', motor: '72ps'},
  {name: 'Tesla', motor: '306ps'}
]

cars.each do |car|
  case car
  in {name: engine:}
    # The Beatle、Priusどちらもマッチ
    puts "Gasoline: #{name} / engine: #{engine}"
  in {name:, motor}
    puts "EV: #{name} / motor: #{motor}"
  in {name:, engine:, motor}
    # PriusはGasolineに部分一致するためマッチしない
    puts "Hybrid: #{name} / engine: #{engine} / motor: #{motor}"
  end
end
#=> Gasoline: The Beatle /engine: 105ps
# Gasoline: Prius / engine: 98ps
# EV: Tesla / motor: 306ps
```

in節に`{}`を書いた場合は例外的に「からのハッシュに完全一致」することがマッチの条件になる。  

```
case {a: 1}
in {}
  'empty'
in {a:}
  "a=#{a}"
end
#=> "a=1"

case{}
in {}
  # 空のハッシュ同士で完全一致するのでここにマッチする
  'empty'
in{a:}
  "a=#{a}"
end
#=> "empty"
```

hashパターンのin節は、key: value形式のパターンしか許容しない。key => value形式を使おうとすると構文エラーになる。  
Rubyのパターンマッチでは=>がasパターンで使用されるため。  
また、この制約によりhashパターンで使えるハッシュのキーは必然的にシンボルのみになる。  

メソッド引数の定義と同様に`**`を使って「任意のキーと値」を指定することもできる。  

```
case {name: 'Alice', age: 20, gender: :female}
in {name: 'Alice', **rest}
  "rest=#{rest}"
end
#=> "rest={:age=>20, :gender=>:female}"
```

arrayパターンの`*`とは異なり、`**`が使える位置はパターンの最後だけで、最初や途中で`**`を津青打つすると構文エラーになる。（そもそもhashpターンではキーの順番はマッチの結果に影響しないので、`**`を使う場所を変えても意味がないため）  

変数として使わない場合は`**`だけでよい。ですが、`**`をつけない時と違いがないため実際に使うことはない。  

```
case {name: 'Alice', age: 20, gender: :female}
in {name: 'Alice', **}
  # in {name: 'Alice'}と同じ
  'matched'
end
#=> "matched"
```

`**nil`とした場合は「他のキーと値がないこと」を指定したことになる。`**nil`を使うとhashパターンを部分一致ではなく完全一致でマッチさせることができる。  

```
case {name: 'Alice', age: 20, gender: :female}
in {name:, **nil}
end
#=> (NomatchingPatternError)

case {name: 'Alice'}
in {name:, **nil}
  "name=#{name}"
end
#=> "name=Alice"
```

arrayパターンと同様にin節の一番外側の`{}`は省略可能。  

```
# in節の一番外側の{}は省略可能
case {name: 'Alice', age: 20}
in age:, name:
  "name=#{name}, age=#{age}"
end
```

さらにcase節に指定するオブジェクトはある条件を満たしていればハッシュ（Hashオブジェクト）以外も指定可能。  

## `as`パターン
`as`パターンはパターンマッチでマッチしたオブジェクトを変数に代入する利用パターン。  

```
case {name: 'Alice', age: 20, gender: :female}
in {name: String => name, age: 18.. => age}
  "name=#{name}, age=#{age}"
end
```

一番外側に"=> 変数名"と書くとマッチしたオブジェクト全体を取得できる。  

```
case {name: 'Alice', age: 20, gender: :female}
in {name: String, age: 18..} => person
  "person=#{person}"
end
#=> "person={:name=>\"Alice\", :age=>20, :gender=>:female}"
```

## alternativeパターン
alternativeパターンは2つ以上のパターンを指定し、どれか1つにマッチすればマッチしたとみなす利用パターン。  
alternativeパターンではパターンをパイプ（`|`）で連結する。  

```
case 2
in 0 | 1 | 2
  'matched'
end
#=> "matched"
```

arrayパターンやhashパターンとalternativeパターンを組み合わせることも可能。  

```
case {name: 'Bob', age: 25}
in {name: 'Alice' | 'Bob' => name, age:}
  "name=#{name}, age=#{age}"
end
```

ただし、alternativeパターンとvariableパターンを組み合わせることはできない。  

```
case [2021, 4, 1]
in [y, m, d] | Date
  # 省略
end
#=> (SyntaxError)
```

次のようにパターン全体を`as`パターンで変数に代入するのはエラーにならない。  

```
case [2021, 4, 1]
in[Integer, Integer, Integer] | Date => obj
  "obj=#{obj}"
end
#=> "obj=[2021, 4, 1]"
```

alternativeパターンとvariableパターンが組み合わせられない理由はマッチ成功時に変数の値が未定義になる可能性があるため。  

```
case 0
in 0 | a
  a
end
```

ただし、例外的に`_`（アンダーバースコア1文字）そのもの、または`_`で始まる変数名はalternativeパターンと組み合わせることができる。  

```
case [2021, 4, 1]
in[_, _] | [_, _, _]
  "matched"
end
#=> "matched"
```

## findパターン
findパターンはRuby3.0から導入された利用パターン。  
Ruby2.7までは`*`は1回までしか使えなかったが、Ruby3.0では`*`を2回使って「前と後にある任意の要素」をパターンとして表現できる。  
これにより、配列の中から特定のパターンに合致する部分を見つけて抜き出すことができる。  
ただし、実験的な機能であるため警告が表示される点に注意。  

```
case [13, 11, 9, 6, 12, 10, 15, 5, 7, 14]
in[*, 10.. => a, 10.. => b, 10.. => c, *]
  # 10以上の整数が3連続する部分
  "a=#{a}, b=#{b}, c=#{c}"
end
#=> "a=12, b=10, c=15"
```

