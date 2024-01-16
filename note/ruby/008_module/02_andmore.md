# モジュールを利用したメソッド定義についてもっと詳しく
## includeされたモジュールの有無を確認する
あらゆるクラスに特定のモジュールがincludeされているかどうか確認する方法はいくつかある。  

```
module Loggable
end

class Product
  include Loggable

end
```

クラスオブジェクトに対して`include?`メソッドを呼ぶと引数で渡したモジュールがincludeされているかわかる。  

```
Product.include?(Loggable) #=>true
```

また、`included_modules`メソッドを呼ぶとincludeされているモジュールが配列で返る。  

```
Product.included_mokules
#=>[Loggable, Kernel]
```

`ancestors`メソッドを使うとモジュールだけでなく、スーパークラスの情報も配列になって返ってくる。  

```
Product.ancestors
#=> [Product, Loggable, object, Kernel, BasicObject]
```

クラスオブジェクトではなく、クラスのインスタンスからもincludeされているモジュールの情報は取得できる。  
例えば、`class`メソッドを使うと自分が属しているクラスのクラスオブジェクトが取得できるため、そこから`include?`メソッドや`included_modules`メソッドを呼ぶこともできる。  

```
product = Product.new
product.class.include?(Loggable)
#=> true
product.class.included_modules
#=> [Loggable, Kernel]
```

また、`is_a?`メソッドを使い、直接インスタンスに対して自クラスがそのモジュールをincludeしているかどうかがわかる。  

```
product = Product.new

# 引数が自クラス、includeしているモジュール、スーパークラスのいずれかに該当すればtrue
product.is_a?(Product) #=> true
product.is_a?(Loggable) #=> true
product.is_a?(Object) #=> true
```

## `Enumerable`モジュール
`Enumerable`モジュールは配列やハッシュ、範囲（Range）など、何かしらの繰り返し処理ができるクラスにincludeされているモジュール。  
`Enumerable`モジュールには数多くのメソッドが定義されている（`map`,`select`,`find`,`count`等）。  

```
[1, 2, 3].map { |n| n * 10}
#=> [10, 20, 30]
```

`Enumerable`モジュールをincludeしてモジュールに定義されたメソッドを使えるようにするには「include先のクラスでeachメソッドが実装されていること」が条件。自分で定義したクラスでもeachメソッドを適切に実装すれば`Enumerable`モジュールをincludeしてメソッドを追加できる。  

## `Comparable`モジュールと`<=>`演算子
`Comparable`モジュールは比較演算を可能にするモジュール。  
`Comparable`モジュールをincludeすると以下のメソッド（演算子）が使える。  

```
< <= == > >= between?
```

`Comparable`モジュールのメソッドを使えるようにするための条件はinclude先のクラスで<=>演算子を実装しておくこと。  
<=>演算子はその形状から __宇宙船演算子（UFO演算子）__ とも呼ばれる演算子で、a<=>bが次のような結果を返すように実装する必要がある。  

- aがbより大きいなら正の整数
- aとbが等しいなら0
- aがbより小さいなら負の整数
- aとbが比較できない場合はnil

```
2 <=> 1     #=> 1
2 <=> 2     #=> 0
1 <=> 2     #=> -1
1 <=> 'abc' #=> nil

'xyz' <=> 'abc' #=> 1
'abc' <=> 'abc' #=> 0
'abc' <=> 'xyz' #=> -1
'abc' <=> 123   #=> nil
```

文字列や数値は`Comparable`モジュールもincludeしているため、比較演算子を使って大小関係を判定できる。  
もちろん、`Comparable`モジュールを独自クラスにincludeして使うこともできる。  

```
class Tempo
  include Comparable

  attr_reader :bpm

  def initialize(bpm)
    @bpm = bpm
  end

  def <=>(other)
    other.is_a?(Tempo) ? bpm <=> other.bpm :nil
  end

  def inspect
    "#{bpm}bpm"
  end
end

t_120 = Tempo.new(bpm120) #=> 120bpm
t_180 = Tempo.new(bpm180) #=> 180bpm

t_120 > t_180 #=> false
t_120 <= t_180 #=> true
t_120 == t_180 #=> false
```

<=>演算子は並び替えを行う際に使われる。  

```
tempos = [Tempo.new(180), Tempo.new(60), Tempo.new(120)]

# sortメソッドの内部では並び替えの際に<=>演算子が使われる
tempo.sort #=> [60bpm,120bpm,180bpm]
```

## `Kernel`モジュール
`Kernel`モジュールが提供するメソッドの例は以下。  
`puts`,`p`,`pp`,`print`,`require`,`loop`。  
ObjectクラスがKernelモジュールをincludeしているため、全てのクラスでKernelモジュールのメソッドが使える。  

### トップレベルは`main`という名のObject
Rubyではクラス構文やモジュール構文に囲まれていない一番外側の部分を __トップレベル__ という。  
トップレベルにはmainという名のObjectクラスのインスタンスがselfとして存在している。  

```
p self #=> main
p self.class #=> Object

class User
  p self #=> User
  p self.class #=> Class
end
```

トップレベルでもpメソッドが呼び出せるのはselfがObjectクラスのインスタンスであり、ObjectクラスがKernelモジュールをincludeしているからである。  

### クラスやモジュール自身もオブジェクト
Rubyでは全てがオブジェクトであるため、モジュール自身もオブジェクトになっている。  
そして、クラスはClassクラスのインスタンスであり、モジュールはModuleクラスのインスタンスである。  
さらに、ClassクラスもModuleクラスもObjectクラスを継承している。  
また、クラス構文やモジュール構文の内部ではselfがクラス自身やモジュール自身を指す。  

## モジュールとインスタンス変数
モジュール内で定義したメソッドの中でインスタンス変数を読み書きすると、include先のクラスのインスタンス変数を読み書きしたことと同じになる。  

```
module NameChangeable
  def change_name
    @name = 'ありす'
  end
end

class User
  include NameChangeable

  attr_reader :name

  def initialize(name)
    @name = name
  end
end

user = User.new('alice')
user.name #=> "alice"

user.change_name
user.name #=> "ありす"
```

ただし、モジュールがミックスイン先のクラスでインスタンス変数を直接参照するのはあまり良い設計ではない。  
インスタンス変数は任意のタイミングで新しく定義したり、未定義のインスタンス変数を参照できてしまうため。  
一方でメソッドであれば、未定義のメソッドを呼び出したとき、エラーが発生するため、ミックスイン先のクラスと連携する場合、特定のインスタンス変数の存在を前提とするより、特定のメソッドの存在を前提とするほうが安全である。  

先ほどのコードはセッターメソッド経由でデータを変更したほうが安全性が高い。  

```
module NameChangeable
  def change_name
    self.name = 'ありす'
  end
end

class User
  include NameChangeable

  attr_accessor :name

  def initialize(name)
    @name = name
  end
end

user = User.new('alice')
user.change_name
user.name #=> "ありす"
```

## クラス以外のオブジェクトにextendする
クラスだけでなく個々のオブジェクトにextendすることもできる。  
その場合、モジュールのメソッドはextendしたオブジェクトの特異メソッドになる。  

以下のコードは文字列オブジェクトの特異メソッドとしてモジュールをextendする例。  

```
module Loggable
  def log(text)
    puts "[LOG] #{text}"
  end
end

s = 'abc'
s.log('Hello')
#=> (NoMethodError)

s.extend Loggable
s.log('Hello')
#=> [LOG] Hello
```
