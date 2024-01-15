# 繰り返し処理用の制御構造
## break
`break`を使うと繰り返し処理を脱出できる。

```
numbers = [1, 2, 3, 4, 5].shuffle
numbers.each do |n|
  puts n
  break if n == 5
end
```

`break`に引数を渡すとその繰り返し処理の戻り値になる。

```
ret =
  while true
    break
  end
ret #=> nil

ret =
  while true
    break 123
  end
ret #=> 123
```

## throwとcatchを使った大域脱出
一気に外側のループまで脱出したい場合は`throw`メソッドと`catch`メソッドをつかう。
例外処理とは関係ない。

```
fruits = ['apple', 'melon', 'orange']
numbers = [1, 2, 3]

catch:done do
  fruits.shuffle.each do |fruit|
    numgers.shuffle.each do |n|
      puts "#{fruit}, #{n}"
      if fruit == 'orange' && n == 3
      throw:done
    end
  end
end
```
タグには通常シンボルを使用する。
throwとcatchのタグが一致しない場合はエラーが発生します。

```
fruits = ['apple', 'melon', 'orange']
numbers = [1, 2, 3]

catch:done do
  fruits.shuffle.each do |fruit|
    numgers.shuffle.each do |n|
      puts "#{fruit}, #{n}"
      if fruit == 'orange' && n == 3
      throw:foo
    end
  end
end

#=> uncaught throw:foo(UncaughtThrowError)
```

`throw`メソッドに第2引数を渡すと`catch`メソッドの戻り値になる。

```
ret =
  catch :done do
    throw :done
  end
ret #=>nil

ret =
  catch :done do
    throw :done, 123
  end
ret #=>123
```

`catch`、`throw`は繰り返し初ッりと無関係に利用することができる。
実際は繰り返し処理の大域脱出で使われることが多い。

## 繰り返し処理で使う`break`と`return`の違い
`break`は「繰り返し処理からの脱出」になるが、`return`は繰り返し処理だけでなく「メソッドからの脱出」になる。
また、`return`を呼び出した場所がメソッドの内部でなければエラーになる。

```
[1, 2, 3].each do |n|
  puts n
  return
end
#=> 1
# unexpected return (LocalJumpError)
```

挙動が複雑になるため積極的に活用するテクニックではない。

## `next`
繰り返し処理を途中で中断し次の繰り返し処理にすすめる場合葉`next`をつかう。

```
numbers = [1, 2, 3, 4, 5]
numbers.each do |n|
  # 偶数であれば中断して次の繰り返し処理に進む
  next if n.even?
  puts n
end

#=> 1
# 3
# 5
```

## `redo`
繰り返し処理をやり直したい場合は`redo`を使う。
その回の繰り返い処理の最初に戻るという意味。

```
foods = ['ピーマン', 'トマト', 'セロリ']
foods.each do |food|
  print "#{food}は好きですか？=>"
  # sampleは配列からランダムに1要素を取得するメソッド
  anser = ['はい','いいえ'].sample
  puts answer

  # はいと答えなければもう一度聞き直す
  redo unless answer == 'はい'
end

#=> ピーマンは好きですか？=>いいえ
# ピーマンは好きですか？=>はい
# トマトは好きですか？=>はい
# ピーマンは好きですか？=>いいえ
# セロリは好きですか？=>はい
```

`redo`を使う場合、意図せず無限ループをつくってしまうことがある。
回避策として次のような回数制限をつける。

```
foods = ['ピーマン', 'トマト', 'セロリ']
count = 0
foods.each do |food|
  print "#{food}は好きですか？=>"
  # sampleは配列からランダムに1要素を取得するメソッド
  anser = ['はい','いいえ'].sample
  puts answer
  count +=1

  redo if answer != 'はい' && count < 2
end
```

