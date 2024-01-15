# パターンマッチの基本
パターンマッチの例。
以下のような配列があった場合、

```
records = [
  [2021],
  [2019, 5],
  [2017, 1, 25],
]
```

```
records.map do |record|
  case record
  in [y]
    Date.new(y, 1, 1)
  in[y, m]
    Date.new(y, m, 1)
  in[y, m, d]
    Date.new(y, m, d)
  end
end
```

パターンマッチは以下のような構文になっている。

```
case 式
in パターン1
  パターン1にマッチしたときの処理
in パターン2
  パターン1にマッチせず、パターン2にマッチしたときの処理
else
  パターン1、パターン2どちらもにマッチしなかったときの処理
end
```

in節にでてくるy,m,dはcase節の式に対応した要素が代入されるローカル変数。  
パターンマッチでは代入演算子の`=`を使わずに`in`節でローカル変数の宣言と代入が行われる。

## ハッシュをパターンマッチさせる
ハッシュをパターンマッチさせるコード例。

```
cars = [
  {name: 'The Beatle', engine: '105ps'}
  {name: 'Prius', engine: '98ps', motor: '72ps'}
  {name: 'Tesla', motor: '306ps'}
]

cars.each do |car|
  case car
  in {name:, engine:, motor:}
    puts "Hybrid: #{name} / engine: #{engine} / motor: #{motor}"
  in {name:, engine:}
    puts "Gasoline: #{name} / engine: #{engine}"
  in {name:, motor:}
    puts "EV: #{name} / motor: #{motor}"
end
```

`in`節で値を省略しキーだけを書いた場合は、自動的にキーと同じ名前のローカル変数が作成され、そこに値が代入されるようになる。  
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

