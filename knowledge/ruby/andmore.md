# クラス定義やRubyの言語仕様に関する高度な話題

## エイリアスメソッドの定義

独自クラスでもエイリアスメソッドを定義することが可能。  

先に元のメソッドを定義してからエイリアスメソッドを定義しなければエラーになる。  

  

```

class User

  def hello

    'Hello'

  end

  

  # alias 新しい名前 元の名前

  alias greet hello

end

```

  

## メソッドの削除

メソッドの定義を後から削除することが可能。  

  

```

# オブジェクトクラスのfreezeメソッドを削除

class User

  undef freeze

end

  

user = User.new

user.freeze

#=>(NoMethodError)

```

  

## 入れ子になったクラス定義

クラス定義では入れ子も可能。  

クラス内部に定義したクラスは`::`を使って参照する。  

  

```

class User

  class BloodType

    attr_reader :type

  

    def initialize(type)

      @type = type

    end

  end

end

  

blood_type = User::BloodType.new('B')

blood_type.type

#=> "B"

```

  

クラス名の予期せぬ衝突を防ぐ「名前空間」を作る場合に用いられる。  

  

## 演算子の挙動を独自に再定義する

一見演算子を使っているようで実際はメソッドとして定義されているものがあり、それらはクラスごとに再定義できる。  

  

```

class Product

  attr_reader :code, :name

  

  def initialize(code, name)

    @code = code

    @name = name

  end

  

  def ==(other)

    # otherがProductかつ、商品コードが一致していれば同じProductとみなす

    other.is_a?(Product) && code == other.code

  end

end

  

a = Product.new('A-0001', 'A great movie')

b = Product.new('B-0001', 'An awesome film')

c = Product.new('A-0001', 'A great movie')

  

# 商品コードが一致すればtrueになる

a == b #=> false

a == c #=> true

  

# Product以外ではfalse

a == 1   #=> false

a == 'a' #=> false

```

  

==はメソッドとして再定義しているため`.`で呼び出せる  

  

```

a.==(b) #=>false

a.==(c) #=>true

```

  

## 等値を判断するメソッドや演算子を理解する

等値を判断する演算子は`==`以外にもある。  

  

- `==`

- `equal?`

- `eql?`

- `===`

  

### `equal?`

`equal?`メソッドはobject_idが等しい場合にtrueを返す。  

つまり、全く同じインスタンスかを判断する。  

`equal?`メソッドは再定義できない。  

  

```

a = 'abc'

b = 'abc'

c = a

  

a.equal?(b) #=> false

a.equal?(c) #=> true

```

  

### `==`

`==`はオブジェクトの内容が等しいかを判断する。  

  

```

1 == 1.0 #=> true

```

  

## `eql?`

`eql?`メソッドは`==`と同様に等値判定を行うが、クラスによって厳格な等値判定を行う。  

`eql?`メソッドで数値を比較する場合は同じクラスでなければtrueにならない。  

  

```

1.eql?(1.0)   #=> false

1.eql?(1)     #=> true

1.0.eql?(1.0) #=> true

```

  

`eql?`メソッドの代表的な用途は2つのオブジェクトがハッシュとキーとして同じかどうか判断すること。  

独自のクラスを定義してハッシュのキーとして使いたい場合は`eql?`メソッドを再定義する。  

ただし、`eql?`メソッドを再定義する場合は、`hash`メソッドも再定義したうえで「a.eql?(b)が真ならa.hash == b.hashも真」という関係を必ず満たす必要がある。  

  
  

```

class CountryCode

  attr_reader :code

  

  def initialize(code)

    @code = code

  end

  

  def eql?(other)

    other.instance_of?(CountryCode) && code.eql?(other.code)

  end

  

  def hash

    code.hash

  end

end

  

japan = CountryCode.new('JP')

us = CountryCode.new('US')

india = CountryCode.new('IN')

  

currences = {japan => 'yen', us => 'dollar', india => 'rupee'}

  

# 同じ国コードなら同じキーとしたいが、同一インスタンスだけが同じキーとみなされる

key = CountryCode.new('JP')

currencies[key] #=> "yen"

currencies[japan] #=> "yen"

```

  

## `===`

`===`の代表的な用途は`case`文のwhen節。  

  
  

```

text = '03-1234-5678'

  

case text

when /^\d{3}-\d{4}$/

  puts '郵便番号です'

when /^\d{4}\/\d{1,2}/\/d{1,2}$/

  puts '日付です'

when /^\d+-\d+$/

  puts '電話番号です'

end

# => "電話番号です"

```

  

このコードを実行すると内部的には`/^\d{3}-\d{4}$/ === text`等の評価が行われている。  

  

## オープンクラスとモンキーパッチ

Rubyはクラスの継承に制限がない。組み込みライブラリのクラスであっても継承して独自のクラスを定義することができる。  

  

```

class MyString < String

# 拡張するコード

end

  

s = MyString.new('Hello')

s #=> "Hello"

s.class #=> Mystring

```

  

それだけでなく、定義済みのクラスそのものにメソッドを追加したり、メソッドの定義を上書きすることもできる。  

Rubyのクラスは変更に対してオープンのため、 __オープンクラス__ と呼ばれる。  

Ruby on Rails ではオープンクラスを積極的に活用し、様々な独自メソッドを組み込みクラスに追加している。  

  

```

class String

  def shuffle

    chars.shuffle.join

  end

end

  

s = 'Hello, I am Alice.'

s.shuffle

```

  

新しいメソッドを追加するだけでなく、既存のメソッドを上書きすることもできる。  

既存の実装を上書きして、自分が期待する挙動に変更することを __モンキーパッチ__ と呼ぶ。  

  

```

# 以下のUserクラスは外部ライブラリで定義される想定

class User

  def initialize(name)

    @name = name

  end

  

  def hello

    "Hello, #{@name}"

  end

end

  

# モンキーパッチ前の挙動

user = User.new('Alice')

user.hello #=> "Hello, Alice"

  

# モンキーパッチ後の挙動

class User

  def hello

    "#{@name}さん, こんにちは"

  end

end

  

user.hello #=> "Aliceさん, こんにちは"

```

  

## 特異メソッド

Rubyではオブジェクト単位で挙動を変更することも可能。  

特定のオブジェクトにだけ紐づくメソッドのことを __特異メソッド__ という。  

ただし、数値、シンボルなど特異メソッドを定義できないオブジェクトも存在する。  

  

```

alice = 'I am Alice'

bob = 'I am bob'

  

# aliceオブジェクトだけshuffleメソッドを定義

def alice.shuffle

  chars.shuffle.join

end

  

# bobオブジェクトはshuffleメソッドを持たない

alice.shuffle

bob.shuffle #=> (NoMethodError)

```

  

別の定義方法もある。

  

```

alice = 'I am Alice'

  

class << alice

  def alice.shuffle

    chars.shuffle.join

  end

end

```

  

## クラスメソッドは特異メソッドの一種

特異メソッドの定義とクラスメソッドの定義は似ている点がある。

Rubyで便宜上クラスメソッドと呼んでいるものは特定クラスの特異メソッドである。

  
  

```

# クラスメソッドを定義

class User

  def self.hello

    'Hello.'

  end

  

  class << self

    def hi

      'Hi'

    end

  end

end

  

# 特異メソッドの定義

alice = 'I am Alice'

  

def alice.hello

  'Hello.'

end

  

class << alice

  def hi

    'Hi'

  end

end

```

  

## ダックタイピング

Rubyは動的型付け言語のため、実行時にそのメソッドが呼び出せるかどうか判断し呼び出せない場合にエラーが起きる。  

オブジェクトのクラスがなんであろうとそのメソッドが呼び出せればよしとするプログラミングスタイルを __ダックタイピング__ と呼ぶ。  

これは「もしもそれがアヒルのように歩き、アヒルのように鳴くのなら、それはアヒルだ」に由来する。  

  

```

class Product

  def initialize(name, price)

    @name = name

    @price = price

  end

  

  def desplay_text

    stock = stock??'あり':'なし'

    "商品名: #{@name} 価格: #{@price}円 在庫: #{stock}"

  end

end

  

class DVD < Product

  def stock?

    # 省略

    true

  end

end

  

# スーパークラスはstock?メソッドを持たないのでエラー

product = Product.new('A great film', 1000)

product.display_text

#=> (NoMethodError)

  

dvd = DVD.new('An awesome film', 3000)

dvd.desplay_text

#=> "商品名: An awesome film 価格: 3000円 在庫: あり"

```

  

stock?メソッドを呼び出せないProductクラスではエラーが発生する。  

Productクラス内でもstock?メソッドを定義し、エラーメッセージを発生させる手法をとることがある。  

  

```

class Product

  # 省略

  def stock?

    raise 'must important stock? in subclass'

  end

end

```