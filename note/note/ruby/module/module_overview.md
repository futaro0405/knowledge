# モジュールの概要

## モジュールの用途

- 継承を使わずにクラスにインスタンスメソッドを追加する（ミックスイン）

- 複数のクラスに対して共通の特異メソッド（クラスメソッド）を追加する

- クラス名や定数名の衝突を防ぐため名前空間を作る

- 関数的メソッドを定義

- シングルトンオブジェクトのように扱って設定値などを保持

  

## モジュールの定義

  

```

# helloメソッドを持つGreetableモジュール

module Greetable

  def hello

    'hello'

  end

end

```

  

クラス構文と似ているがモジュールには次のような特徴がある

  

- モジュールからインスタンスを作成することはできない

- 他のモジュールやクラスを継承することはできない

  

# モジュールを利用したメソッド定義（includeとextend）

## モジュールをクラスにincludeする

Rubyは単一継承を採用しているため、1つのクラスは1つのスーパークラスしか持てない。  

モジュールがあれば、他のクラスでも継承関係を気にすることなく機能を持たすことができる。  

このようにモジュールをクラスにincludeして機能を追加することをミックスインという。  

  

```

module Loggable

  def log(text)

    puts "[LOG] #{text}"

  end

end

  

class Product

  include Loggable

  

  def title

    log 'title is called.'

      'A great movie'

  end

end

  

class User

  include Loggable

  

  def name

    log 'name is called.'

      'Alice'

  end

end

  

product = Product.new

product.title

#=> [LOG] title is called.

#=> "A great movie"

  

user = User.new

user.name

#=> [LOG] name is called.

#=> "Alice"

```

  

ただ、logメソッドがpublicメソッドになってしまう。  

publicメソッドである必要がないのなら、モジュール側でprivateメソッドとして定義する。  

includeしたクラスでもそのメソッドはprivateメソッドとして扱われる。  

  

```

module Loggable

  private

  def log(text)

    puts "[LOG] #{text}"

  end

end

```

  

## include先のメソッドを使うモジュール

ダックプログラミングの考え方はモジュールにも適応できる。  

  

```

module Taggable

  def price_tag

    "#{prive}円"

  end

end

  

class Product

  include Taggable

  

  def price

    1000

  end

end

  

product = Product.new

product.price_tag

```

  

明示的に記載されていないがモジュールのメソッドを実行する際のselfはinclude先のクラスのインスタンスになる。  

そのため、Productクラスに定義したpriceメソッドがprice_tagメソッド内で呼び出せる。  

  

## モジュールをextendする

extendを使うとモジュール内のメソッドをそのクラスの特異メソッド（クラスメソッド）にすることができる。  

  

```

module Loggable

  def log(text)

    puts "[LOG] #{text}"

  end

end

  

class Product

  extend Loggable

  

  def self.create_products(name)

    log 'create_products is called.'

  end

end

  

Product.create_product([])

#=>[LOG]create_products is called.

  

# Productクラスのクラスメソッドとして直接呼び出すことも可能

Product.log('Hello.')

#=>[LOG]Hello.

```

  

クラス構文の直下はselfがそのクラス自身を表すためクラス構文直下でextendしたメソッドを使うこともできる。  

また、`クラス名.include`、`クラス名.extend`の形で呼び出すことも可能。  

  

```

Product.include Loggable

Product.extend Loggable

```