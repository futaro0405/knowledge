## model spec
generateを使用してModel Specのファイルを作成します。
下記のコマンドからUser Modelのファイルを作成してください。

```bash
bin/rails g rspec:model user
```

`spec/models/user_rspec.rb`ファイルが作成されたことを確認してください。

```ruby:spec/models/user_spec.rb
require 'rails_helper'

RSpec.describe User, type: :model do
		pending "add some examples to (or delete) #{__FILE__}"
end
```

テストを実行する場合は`bundle exec rspec`コマンドで実行します。
`user_spec.rb`を修正してテストを実装します。

```ruby:spec/models/user_spec.rb
require 'rails_helper'

RSpec.describe User, type: :model do
		# 姓、名、メール、パスワードがあれば有効な状態であること
		it "is valid with a first name, last name, email, and password" do
				user = User.new(
						first_name: "Aaron",
						last_name: "Sumner",
						email: "tester@example.com",
						password: "dottle-nouveau-pavilion-tights-furze",
				)
				expect(user).to be_valid
		end
end
```