# publicメソッド
クラスの外部からでも自由に呼び出せるメソッド。  
initializeメソッド以外のインスタンスメソッドはデフォルトでpublicメソッドになる。  

```
class User
  private
  def hello
    'Hello'
  end
end

user = User.hello
# => error
```

Ruby 2.7からselfをつけてprivateメソッドを呼び出すことができるようになった。  

```
class User
  def hello
    'Hello,I am #{self.name}'
  end

  private
  def name
    'Alice'
  end
end

user = User.new
user.hello
#=>"Hello,I am Alice"
```