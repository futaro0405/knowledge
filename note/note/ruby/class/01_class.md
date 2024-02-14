# オブジェクト指向プログラミングの用語
- クラス
- オブジェクト
- インスタンス
- レシーバ
- メソッド
- メッセージ
- 状態（ステート）
- 属性（アトリビュート、プロパティ）

## クラス
クラスは一種のデータ型で、Rubyではオブジェクトは必ず何らかのクラスに所属している。  
クラスが同じであれば、保持している属性（データ項目）や使えるメソッドは原則同じになります。

## オブジェクト、インスタンス、レシーバ
同じクラスから作られたオブジェクトは同じ属性やメソッドを持つが、属性の中に保持されるデータはオブジェクトによって異なる。

```
alice = User.new('Alice', 'Ruby', 20)
bob = User.new('Bob', 'Python', 30)

# どちらもfull_nameメソッドを持つが、保持しているデータが異なるので戻り値は異なる
alice.full_name
# => "Alice Ruby"

Bob.full_name
# => "Bob Python"
```

このように、クラスを元に作られたデータの塊を __オブジェクト__ と呼ぶ。  
場合によっては __インスタンス__ と呼ぶ場合もある。  
メソッドとの関係を説明する場合にはオブジェクトのことを __レシーバ__ と呼ぶ。
メソッドを呼び出された側というニュアンスを出したいときによく使われる。

## メソッド、メッセージ
オブジェクトが持つ動作や振る舞いを __メソッド__ と呼ぶ。

## 状態（ステート）
オブジェクトごとに保持されるデータのこと。

## 属性（アトリビュート、プロパティ）
オブジェクトから取得（もしくはオブジェクトに設定）できる値のこと。  
多くの場合、属性の名前は名詞になっている。  
```
class User
  # first_nameの読み書きを許可
  attr_accessor :first_name
end
user = User.new('Alice', 'Ruby', 20)
user.first_name # => "Alice"

# first_name を変更する
user.first_name = 'ありす'
user.first_name # => "ありす"
```

# クラスの定義
Rubyのクラス定義は次のように行う。  
クラス名は必ず大文字ではじめ、慣習としてキャメルケースで書くのが一般的。

```
# Userクラスの定義
class User
end

# OrderItemクラスの定義
class OrderItem
end
```

# オブジェクトの作成とinitializeオブジェクト
クラスからオブジェクトを作成する場合は`new`メソッドを使う。
```
User.new
```
この時に呼ばれるのが`initialize`メソッド。  
インスタンスを初期化するために実行したい処理があれば`initialize`メソッドで実行する。  

```
class User
  def initialize
    puts 'Initialized.'
  end
end

User.new
# => "Initialized."
```

`initialize`メソッドはデフォルトでprivateメソッドになっているため外部から呼び出すことはできない。  
`initialize`メソッドに引数をつけると、`new`メソッドを呼ぶ時も引数が必要。

```
class User
  def initialize(name, age)
    puts "name: #{name}, age: #{age}"
  end
end

User.new
# => error

User.new('Alice', 20)
# => name: Alice, age: 20
```

# インスタンスメソッドの定義
インスタンスメソッドはクラスのインスタンスに対して呼び出すことができるメソッド。  

```
class User
  # インスタンスメソッドの定義
  def hello
    "Hello"
  end
end

user = User.new
# インスタンスメソッドの呼び出し
user.hello # => "Hello"
```

# インスタンス変数とアクセサメソッド
クラスの内部では __インスタンス変数__ を使うことができる。  
__インスタンス変数__ とは同じインスタンス（同じオブジェクト）の内部で共有される変数。  
Rubyでは`@`で始まる変数がインスタンス変数になる。  

```
class User
  def initialize(name)
    # インスタンス作成時に渡された名前をインスタンス変数に保存
    @name = name
  end

  def hello
    # インスタンス変数に保存されている名前を表示
    "Hello, I am #{@name}."
  end
end

user = User.new('Alice')
user.hello # => "Hello, I am Alice"
```

`@`や`@@`、`$`といったプレフィックス（接頭辞）がつかない変数はローカル変数になる。  
`@@`はクラス変数のプレフィックス、`$`はグローバル変数のプレフィックス。  
また、アルファベットの大文字で始まる識別子は定数とみなされる。  

インスタンス変数はクラスの外部空参照することができない。  
もし参照する場合は参照用のメソッドを作成する必要がある。  

同じく、インスタンス変数の内容を外部から変更したい場合も変更用のメソッドを定義する。  

```
class User
  def initialize(name)
    @name = name
  end

  # @nameを外部から参照するメソッド
  def name
    @name
  end

  # @nameを外部から変更するメソッド
  def name=(value)
    @name = value
  end
end

user = User.new('Alice')
# 変数に代入しているように見えるが、name=メソッドを呼び出す
user.name = 'Bob'
user.name # => "Bob"
```

nameメソッドのように値を読みだすメソッドを __ゲッターメソッド__、name=メソッドのように値を書き込むメソッドを __セッターメソッド__ と呼ぶ。  
__ゲッターメソッド__、__セッターメソッド__ を総称して __アクセサメソッド__ と呼ぶ。  
単純にインスタンス変数の内容を外部から読み書きするのであれば、`attr_accessor`メソッドを使い、退屈なアクセスメソッドの定義を省略することができる。  
```
class User
  # @name を読み書きするメソッドが自動的に定義される
  attr_accessor :name

  def initialize(name)
    @name = name
  end
end

user = User.new('Alice')

user.name = 'Bob'
user.name # => "Bob"
```
インスタンス変数の内容を読み取り専用にする場合は`attr_accessor`の代わりに`attr_reader`メソッドを使う。  
```
class User
  # 読み取り用のメソッドだけ定義
  attr_reader :name

  def initialize(name)
    @name = name
  end
end

user = User.new('Alice')
# @nameの参照できる
user.name # => "Alice"

# @nameを変更しようとするとエラー
user.name = 'Bob' # => error
```

書き込み専用にしたい場合は`attr_writer`メソッドを使う。  
```
class User
  # 読み取り用のメソッドだけ定義
  attr_writer :name

  def initialize(name)
    @name = name
  end
end

user = User.new('Alice')
# @nameの変更はできる
user.name = 'Bob'

# @nameを参照しようとするとエラー
user.name # => error
```

カンマで複数の引数を渡すと、複数のインスタンス変数に対するアクセサメソッドを定義することもできる。  

```
class User
  # @nameと@ageへのアクセサメソッドを定義
  attr_accessor :name, :age

  def initialize(name, age)
    @name = name
    @age = age
  end
end

user = User.new('Alice', 20)
user.name # => "Alice"
user.age = 30
```

# クラスメソッドの定義
クラス構文の内部でメソッドを定義するとインスタンスメソッドになる。  
インスタンスメソッドはそのクラスのインスタンスに対して呼び出すことができるメソッドであり、インスタンス変数を読み書きする場合はインスタンスメソッドを定義する。  

そのクラスに関連するがインスタンスに含まれるデータは使わないメソッドを定義したい場合がある。  
その場合はクラスメソッドを定義する。  
クラスメソッドを定義する方法の1つは、以下のようにメソッド名の前に`self.`をつける。  

```
class クラス名
  def self.クラスメソッド
    # クラスメソッドの処理
  end
end
```

もう1つの方法は`class << self`から`end`の間にメソッドを書く方法。

```
class クラス名
  class << self
    def クラスメソッド
      # クラスメソッドの処理
    end
  end
end
```

クラスメソッドを呼び出す場合はクラス名の直後にドット（`.`）をつけてメソッドを呼び出す。  
```
クラス名.メソッド名
```

例：
```
class User
  def initialize(name)
    @name = name
  end

  # クラスメソッド
  def self.create_users(names)
    names.map do |name|
      User.new(name)
    end
  end

  # インスタンスメソッド
  def hello
    "Hello, I am #{@name}."
  end
end

names = ['Alice','Bob', 'Carol']
users = User.create_users(names)
users.earh do |user|
  puts user.hello
end
```

# 定数
クラスの中には定数を定義することもできる。  
定数は必ず大文字出始める必要がある。慣習的にアルファベットの大文字と数字、アンダースコアで構成されることが多い。

```
class Product
  DEFAULT_PRICE = 0

  attr_reader :name, :price

  def initialize(name, price = DEFAULT_PRICE)
    @name = name
    @price = price
  end
end

priduct = Product.new('A free movie')
product.price # => 0
```

# `self`キーワード
Rubyにはインスタンス自身を表す`self`キーワードがある。  
メソッドの内部でほかのメソッドを呼び出す場合は暗黙的に`self`に対してメソッドを呼び出す。  
そのため`self`は省略可能だが、明示的につけてメソッドを呼び出してもよい。  

```
class User
  attr_accessor :name

  def initialize(name)
    @name = name
  end

  # selfなしでnameメソッドを呼ぶ
  def hello
    "Hello, I am #{name}."
  end

  # selfつきでnameメソッドを呼ぶ
  def hi
    "Hi, I am #{self.name}."
  end

  # 直接インスタンス変数の@nameにアクセスする
  def my_name
    "My name is #{@name}."
  end
end
```

# `self`の付け忘れで不具合が発生するケース
値をセットするname=メソッドの場合は話が異なる。  

```
class User
  attr_accessor :name

  def initialize(name)
    @name=name
  end

  def rename_to_bob
    name = 'Bob'
  end

  def rename_to_carol
    self.name = 'Carol'
  end

  def rename_to_dave
    @name = 'Dave
  end
end

# bobだけリネームされない
user = User.new('Alice')
user.rename_to_bob
user.name # => "Alice"

user.rename_to_carol
user.name # => "Carol"

user.rename_to_dave
user.name # => "Dave"
```

「nameというローカル変数に"Bob"という文字列を代入」と解釈されてしまう。  
なので、name=のようなセッターメソッドを呼び出したい場合は、必ずselfをつける必要がある。  

# クラスメソッドの内部やクラス構文直下の`self`
クラス定義内に登場する`self`は場所によって「そのクラスのインスタンス自身」を表したり、「クラス自身」を表したりする。  

```
class Foo
  puts "クラス構文直下のself：#{self}"

  def self.bar
    puts "クラスメソッド内のself：#{self}"
  end

  def baz
    puts "インスタンスメソッド内のself：#{self}"
  end
end
# => "クラス構文直下のself：Foo"

Foo.bar
# => "クラスメソッド内のself：Foo"

foo = Foo.new
foo.baz
# => "クラスメソッド内のself：#<Foo:0x000000012da3e2f0>"
```

クラス構文直下とクラスメソッド内でのselfは「Fooクラス自身」、インスタンスメソッドのselfは「Fooクラスのインスタンス」を表す。  
次のようなコードはエラーになる。

```
class Foo
  # クラスメソッドからインスタンスメソッドのbazを呼び出す
  def self.bar
    self.baz
  end

  # インスタンスメソッドからクラスメソッドのbarを呼び出す
  def baz
    self.bar
  end
end

# selfが異なるためクラスメソッドのbarからはインスタンスメソッドのbazは呼び出せない
Foo.bar
# => error

# selfが異なるためインスタンスメソッドのbazからはクラスメソッドのbarは呼び出せない
foo = Foo.new
foo.baz
# => error
```

これはselfを省略して呼び出した場合も同じ。  
`self`がどちらからも「クラス自身」なるため、クラス構文の直下ではクラス構文は呼び出せる。  
ただし、クラスメソッドを定義した後にクラスメソッドを呼び出す必要がある。  
