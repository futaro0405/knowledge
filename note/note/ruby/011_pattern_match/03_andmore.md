# パターンマッチについてもっと詳しく
## ガード式
パターンマッチでは次のような形式でin節に追加の条件式（if文やunless分）を追加できる。  
条件式を追加するとcase節の式がin節のパターンにマッチすることに加え、この条件式も真になった場合にin節に対応する処理が実行される。このような条件式をガード式という。  
ガード式の中ではパターンマッチで代入された変数を参照することもできる。  

```
data = [[1, 2, 3], [5, 4, 6]]
data.each do |numbers|
  case numbers
  # 要素が3つの配列かつ、3つの連続した整数であればマッチ
  in [a, b, c] if b === a + 1 && c === b + 1
    puts "matched: #{numbers}"
  else
    puts "not matched: #{numbers}"
  end
end
#=> matched: [1, 2, 3]
# not matched: [5, 4, 6]
```

ただし、findパターンとガード式を組み合わせるときは注意が必要。  
ガード式を利用しながら再検索を繰り返すことはできない。  

```
case [1, 2, 3, 2, 1]
in [*, n, 2, *] if n === 1
  "matched: #{n}"
else
  "not matched"
end
```
## 1行パターンマッチ
case節を省略して1行で書くこともできる。マッチすればtrue、しなければfalseが返る。  
この特性を活かしてif文で活用できる。  

```
person = {name: 'Alice', children: ['Bob']}

# :nameと:childrenをキーに持ち、:childrenが要素1つの配列であれば
if person in {name:m children: [_]}
  "Hello, #{name}"
end
```

パターンマッチとselectメソッドを組み合わせて配列の中から目当てのハッシュだけを抽出する。  

```
cars = [
  {name: 'The Beatle', engine: '105ps'},
  {name: 'Prius', engine: '98ps', motor: '72ps'},
  {name: 'Tesla', motor: '306ps'}
]

cars.select do |car|
  car in {name:, motor:}
end
#=> [{name: 'Prius', engine: '98ps', motor: '72ps'},
# {name: 'Tesla', motor: '306ps'}]
```

ただし、Ruby3.0では実験的機能のため、使用すると警告が表示される。  
1行パターンマッチは`式=>パターン`という記法もある。あたかも左辺の式を右辺の変数に代入しているように見えるため、__右代入__ と呼ばれる。  
それ自体はマッチするとnil、マッチしなければ、例外が発生する。

```
{name: 'Alice', children: ['Bob']} => {name:, children:[child]}

name #=> "Alice"
child #=> "Bob"
```

## 変数のスコープに関する注意点
