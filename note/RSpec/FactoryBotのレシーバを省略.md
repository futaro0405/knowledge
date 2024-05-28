# レシーバーの"FactoryBot"という記述を省略する

rails_helperに下記のような記述をしておくことで、"FactoryBot"という記述は省略できる。

```ruby:spec/rails_helper.rb
RSpec.configure do |config|
  #下記の記述を追加
  config.include FactoryBot::Syntax::Methods
  #省略
end
```

上記の記述によって、テストの記述は下記のように省略できます。

```
user = build(:user, name: nil)
```

## ref
[factory_botを利用したダミーデータの作成方法](https://qiita.com/sazumy/items/bd900ce5cc00794e13e5)
