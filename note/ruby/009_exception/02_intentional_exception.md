# 意図的に例外を発生させる
例外は捕捉するだけでなく、コードの中で意図的に発生させることができる。  
例外を発生させる場合は`raise`メソッドを使う。  

```
def currency_of(country)
  case country
  when :japan
    'yen'
  when :us
    'dollar'
  when :india
    'repee'
  else
    raise "無効な国名です。 #{country}"
  end
end

currency_of(:italy)
#=> 無効な国名です。itary (RuntimeError)
```

raiseメソッドに文字列を渡すと、その文字列がエラーメッセージになる。  
文字列は省略可能可能ですが、その場合、原因がわかりずらくなるため、通常は原因を特定しやすいメッセージをつける。  
raiseメソッドに文字列だけを渡したときRuntimeErrorクラスの例外が発生する。  
第一引数に例外クラス、第二引数にエラーメッセージを渡すとRuntimeErrorクラス以外の例外クラスで例外を発生させることができる。  

```
~
  else
    raise ArgumentError, "無効な国名です #{country}"
  end
end

currency_of(:itary)
#=> 無効な国です italy (ArgumentError)
```

もしくはraiseメソッドに例外クラスのインスタンスを渡す方法がある。  

```
~
  else
    raise ArgumentError.new("無効な国名です #{country}")
  end
end

currency_of(:itary)
#=> 無効な国名です italy (ArgumentError)
```

