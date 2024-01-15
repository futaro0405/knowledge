# モジュールを利用した名前空間の作成
## 名前空間を分けて名前の衝突を防ぐ
モジュールのもうひとつの使い方は __名前空間（ネームスペース）__ としての使い方。  
モジュール構文の中にクラスを定義すると「そのモジュールに属するクラス」という意味になるため、同名のクラスであっても外側のモジュール名さえ異なれば名前の衝突が発生しない。  

```
module Baseball
  class Second
    def initialize(player, uniform_number)
      @player = player
      @uniform_number = uniform_numver
    end
  end
end

module Clock
  class Second
    def initialize(digits)
      @digits = digits
    end
  end
end
```

モジュールに属するクラスは`モジュール名::クラス名`で参照する。  

```
Baseball::Second.new('Alice', 13)
Clock::Second.new(13)
```

## 名前空間でグループやカテゴリを分ける
名前空間は名前の衝突を防ぐためだけでなく、クラスのグループ分け・カテゴリ分けをする目的で使われる場合もある。  

```
require "active_support/core__ext/string/conversions"

module ActiveRecord
  module Associations
    class AliasTracker
      # 省略
```

なお、クラス定義やモジュール定義を保存するファイルパスは、慣習として名前空間をディレクトリ名に、クラス名やモジュール名をファイル名にそれぞれ対応させる。その場合、ディレクトリ名、ファイル名はスネークケースにする。  

## 入れ子なしで名前空間付きのクラスを定義する
名前空間として使うモジュールがすでにどこかで定義されている場合は、モジュール構文やクラス構文を入れ子にしなくても`モジュール名::クラス名`の形で定義することもできる。  

```
module Baseball
end

class Baseball::Second
end
```

