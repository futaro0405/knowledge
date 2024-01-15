# 例外処理のベストプラクティス
## 安易に`rescue`を使わない
全ての例外を`rescue`すべきではない。Railsのようなフレームワークでは例外発生時の共通処理が最初から組み込まれている。  
自分で`rescue`するよりフレームワークに例外処理を委ねるほうが、不適切な実装を回避できる。  

## `rescue`したら情報を残す
状況によっては`rescue`すべきケースは存在する。  
その場合、後で原因調査できるように例外時の状況を確実に記録に残すようにする。  
最低でも発生した例外のクラス名、エラーメッセージ、バックトレースの3つはログやターミナルに出力すべき。  
これらの情報は`full_message`メソッドを使うと一度に取り出せる。  

```
# 大量のユーザにメールを送信する
users.each do |user|
  begin
    send_mail_to(user)
  rescue => e
    puts e.full_message
  end
end
```

## 例外処理の対象範囲と対象クラスをできるだけ絞り込む
例外処理を書く場合は、例外が発生しそうな箇所と発生しそうな例外クラスをあらかじめ予想し、その予想を例外処理のコードに反映させる。  
このコードであれば、Dateオブジェクトの作成に失敗したときだけ例外が捕捉される。  
また、捕食される例外はArgmentErrorクラスに限定しているためそれ以外の例外は異常終了扱いとなる。

```
def convert_reiwa_to_date(reiwa_text)
  m = reiwa_text.match(/令和(?<jp_year>\d+)年(?<month>\d+)月(?<day>\d+)日/)
  year = m[:jp_year].to_i + 2018
  month = m[:month].to_i
  day = m[:day].to_i
  begin
    Date.new(year,mnth,day)
  rescue ArgumentError
    nil
  end
end

convert_reiwa_to_date('令和3年12月31日') #=> <Date: 2021-12-31((2459580j,0s,0n),+0s,2299161)>
convert_reiwa_to_date('令和3年99月99日') #=> nil
```

## 例外処理よりも条件分岐を使う
例外の発生がある程度予想できる処理であれば、実際に実行する前に問題の有無を確認できる場合がある。  
Dateオブジェクトの作成でも、`Date.valid_date?`メソッドで正しい日付かどうかを確認できる。  
`begin~rescue`を使うより条件分岐を使ったほうが可読性やパフォーマンスの面で有利。  

```
require 'date'

def convert_reiwa_to_date(reiwa_text)
  m = reiwa_text.match(/令和(?<jp_year>\d+)年(?<month>\d+)月(?<day>\d+)日/)
  year = m[:jp_year].to_i + 2018
  month = m[:month].to_i
  day = m[:day].to_i
  if Date.valid_date?(year, month, day)
    Date.new(year, month, day)
  end
end

convert_reiwa_to_date('令和3年12月31日') #=> <Date: 2021-12-31((2459580j,0s,0n),+0s,2299161)>
convert_reiwa_to_date('令和3年99月99日') #=> nil
```

## 予期しない条件は異常終了させる
`case`文で条件分岐を作る場合は、どんなパターンがやってくるか事前に分かっていることが多い。  
そういう場合は`when`節で想定可能なパターンを網羅し`else`節では「想定外のパターン」として例外を発生させる。  

```
# elseに入ったら例外を発生させる
def currency_of(country)
  case country
  when :japan
    'yen'
  when :us
    'dollar'
  when :india
    'rupee'
  else
    raise ArgumentError,"無効な国名です #{country}"
  end
end
```

## 例外処理も手を抜かずにテストする
例外処理は「例外的状況」に対する処理。  
「例外的な状況」でしか呼び出されないため、テストしづらいケースも多いがテストがおざなりにならないようにする。  


```
def some_method
  1 / 0
  rescue => e
    puts "ERROR! #{e.full_mesasge}
  end
end

# rescue節で別の例外が起きたため、本来出力されるべきErrorの文字が出力されない
some_method
#=> NoMethodError
```

rescue節で別の予期せぬ例外が発生すると、肝心な場面で例外処理が「例外的な状況」に対処できなくなる。  
rescue節のコードもきっちりテストを行い、正常に実行できるように検証する。  
