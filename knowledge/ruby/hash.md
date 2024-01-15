# ハッシュ

ハッシュはキーと値の組み合わせでデータを管理するオブジェクトのこと。

  

```

# 空のハッシュを作成し、そのクラス名を確認する

{}.class #=>Hash

  

{'Japan'=>'yen','us'=>'dollar','India'=>'rupee'}

  

# 改行もできる

{

  'Japan'=>'yen',

  'us'=>'dollar',

  'India'=>'rupee'

}

  

# 同じキーが複数使われる場合、最後の値が使われる

{'Japan'=>'yen','Japan'=>'円'}

# {'Japan'=>'円'}

```

  

## 要素の追加、変更、取得

  

```

currencles = {'Japan'=>'yen','us'=>'dollar','India'=>'rupee'}

  

# 要素の追加

currencles['Italy'] = 'euro'

```

  

すでにキーが存在している場合は、値が上書きされる。

  

```

currencles = {'Japan'=>'円','us'=>'dollar','India'=>'rupee'}

  

# 要素の追加

currencles['japan'] = 'yen'

  

currencles

# {'Japan'=>'yen','us'=>'dollar','India'=>'rupee'}

```

  

ハッシュから要素を取得する。

  

```

currencles['japan']

# 'yen'

  

# 存在しないキーを指定した場合はnilが返ってくる

currencles['brazil']

# nil

```

  

## ハッシュを使った繰り返し処理

`each`メソッドを使い、格納した順にキーと値を取り出すことができる。

  

```

currencles = {'japan'=>'yen','us'=>'dollar','India'=>'rupee'}

  

currencles.each do |key, value|

  puts "#{key}:#{value}"

end

  

# Japan:yen

# us:dollar

# India:rupee

```

  

ブロックパラメータを1つにするとキーと値が配列に格納される

  

```

currencles = {'japan'=>'yen','us'=>'dollar','India'=>'rupee'}

  

currencles.each do |key_value|

  key = key_value[0]

  value = key_value[1]

end

  

# Japan:yen

# us:dollar

# India:rupee

```

  

## ハッシュの同値比較、要素数の取得、要素の削除

  

### ハッシュの同値比較

  

```

a = {'x' => 1, 'y' => 2, 'z' => 3}

  

# すべてのキーと値が同じであればtrue

b = {'x' => 1, 'y' => 2, 'z' => 3}

a == b

# true

  

# 並び順が異なっていてもキーと値が同じであればtrue

c = {'x' => 1, 'z' => 3, 'y' => 2}

a == c

# true

  

# キー'x'の値が異なるためfalse

d = {'x' => 10, 'z' => 3, 'y' => 2}

a == d

# false

```

  

### ハッシュの要素の個数

`size`メソッド(エイリアスメソッドは`length`メソッド)でハッシュの要素の個数を調べることができる

  
  

```

{}.size

# 0

  

{'x' => 1, 'y' => 2, 'z' => 3}.size

# 3

```

  

### ハッシュの要素の削除

`delete`メソッドを使うと指定したキーに対応する要素を削除できる。

戻り値は削除された要素の値。

  

```

currencles = {'japan'=>'yen','us'=>'dollar','India'=>'rupee'}

currencles.delete('japan')

# "yen"

  

currencles

#=> {'us'=>'dollar','India'=>'rupee'}

```

  

`delete`で指定したキーがなければnilが返る。

ブロックを渡すとキーが見つからないときにブロックの戻り値を`delete`メソッドの戻り値にできる。

  

```

currencles = {'japan'=>'yen','us'=>'dollar','India'=>'rupee'}

  

currencles.delete('Italy') #=>nil

  

# ブロックを渡すとキーが見つからないときの戻り値を作成できる

currencles.delete('Italy') {|key| "Not found: #{key}"}

#=>"Not found: Italy"

```