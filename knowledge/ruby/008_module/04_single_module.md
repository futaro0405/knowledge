# 関数や定数を提供するモジュールの作成
## モジュールに特異メソッドを定義する
わざわざ他のクラスに組み込まなくてもモジュール単体でそのメソッドを呼び出したいケースがある。  
その場合はモジュール自身に特異メソッドを定義すれば、直接`モジュール名.メソッド名`の形でそのメソッドを呼び出すことができる。  

```
module Lggable
  def self.log(text)
    puts "[LOG] #{text}"
  end
end

# 他のクラスにミックスインしなくてもモジュール単体でそのメソッドを呼び出せる
Loggable.log('Hello.') #=> [LOG] Hello.
```

このような使い方だと、クラスに対して特異メソッド（クラスメソッド）を定義した場合とほぼ同じ。  
モジュールはクラスと違いインスタンスが作れないため、newする必要がない「単なるメソッド（関数）の集まり」を作りたい場合に向いている。  
モジュールでもクラスと同様に`class << self`を使って、特異メソッドを定義することができる。  
特異メソッドをたくさん定義する場合はメソッド名の前の`self.`がない分、タイプ量を減らすことができる。  

```
module Loggable
  class << self
    def log(text)
      puts "[LOG] #{text}"
    end
  end
end

Loggable.log('Hello.') #=> [LOG] Hello.
```

## `module_function`メソッド
モジュールではミックスインとしても使えて、なおかつモジュールの特異メソッドとしても使える一石二鳥なメソッドを定義することもできる。  
両方で使えるメソッドを定義する場合は、`module_function`メソッドを使って対象のメソッド名を指定する。  
ちなみに、`module_function`で定義されたメソッドは他のクラスにミックスインすると自動的にprivateになる。  
ミックスインとしても、モジュールの特異メソッドとしても使えるメソッドのことを __モジュール関数__ と呼ぶ。  


```
module Loggable
  def log(text)
    puts "[LOG] #{text}"
  end

  module_function :log
end

# moduleの特異メソッドとしてlogメソッドを呼び出す
Loggable.log('Hello.') #=> [LOG] Hello.

# Loggableモジュールをinclude下したクラスを定義する
class Product
  include Loggable

  def title
    log 'title is called.'
    'A great movie.'
  end
end

# ミックスインとしてlogメソッドを呼び出す
product = Product.new

product.title
#=> title is called.
#=>"A great movie."

product.log 'Hello.'
#=> (NoMethodError)
```

`module_function`メソッドを引数なしで呼び出した場合はそこから下で定義されたメソッドは全てモジュール関数になる。  

```
module Loggable
  # ここから下は全てモジュール関数
  dodule_function

  def log(text)
    puts "[LOG] #{text}"
  end
end
```

## モジュールに定数を定義する
モジュールにも定数を定義することができる。定義の仕方や参照の仕方はクラスの時と同じ。  

```
module Loggable
  # 定数を定義
  PREFIX = '[LOG]'

  def log(text)
    puts "#{PREFIX} #{text}"
  end
end

# 定数を参照
Loggable::PREFIX #=> "[LOG]"
```

## モジュール関数や定数を持つモジュール例
モジュール関数や定数を持つ代表的なRubyの組み込みライブラリは`Math`モジュール。  
Mathモジュールのメソッドはモジュール関数になっているため、モジュールの特異メソッドとしても、ミックスインとしても利用できる。  

```
# モジュールの特異メソッドとして利用
Math.sqrt(2)

class Calulator
  include Math

  def calc_sqrt(n)
    # ミックスインとして利用
    sqrt(n)
  end
end

calculator = Calculator.new
calculator.calc_sqrt(2)
```

Mathモジュールの代表的な定数は以下。

```
# 自然対数の低を表すE
Math::E
# 円周率を表すPI
Math::PI
```

