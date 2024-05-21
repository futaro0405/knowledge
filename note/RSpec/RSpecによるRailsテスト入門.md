## サンプルアプリケーションのセットアップ

### ソースコードのダウンロード
```
git clone https://github.com/JunichiIto/everydayrails-rspec-jp-2024.git
```

### ディレクトリの移動
```
cd everydayrails-rspec-jp-2024
```

### 使⽤する Ruby バージョンを指定
```
rbenv local 3.3.0
```

### gem のインストールやデータベースのセットアップ等
```
bin/setup
```

### サーバーの起動
```
bin/rails s
```

## RSpecセットアップ
### Gemfile
```Gemfile
group :development, :test do
	gem 'rspec-rails' 
end
```
### テストデータベース
必要に応じてコードを追加
#### SQLite
```yml:config/database.yml
test:
	<<: *default
	detabase: db/test.sqlite3
```
#### MySQL,PostgreSQL
```yml:config/database.yml
test:
	<<: *default
	detabase: projects_test
```

### RSpecの設定
RSpecのインストールする
```bash
bin/rails generate rspec:install
```

RSpecの出力をドキュメント形式に変更する

```.rspec
--require spec_helper
--format documentation
```

### 試す
RSpecの起動
```
bundle exec rspec
```

### binstub
binstubを作成して短いコマンドで実行できるようにする
```bash
bundle binstubs rspec-core
```
このコマンドを実行することでbinディレクトリ内にrspecの実行ファイルが作成される。

### ジェネレータ
`rails generate`コマンドをカスタマイズする

```config/application.rb
require_relative "boot"
require "rails/all"

# Rails が最初から書いているコメントは省略 ...
Bundler.require(*Rails.groups)

module Projects
		class Application < Rails::Application
				config.load_defaults 7.1
				config.autoload_lib(ignore: %w(assets tasks))

				config.generators do |g|
						g.test_framework :rspec,
								fixtures: false,
								view_specs: false,
								helper_specs: false,
								routing_specs: false,
						g.factory_bot false
				end
		end
end
```

- `fixtures: false`
	- テストデータベースにレコードを作成するファイルの作成をスキッ
- `view_specs: false`
	- ビュースペックを作成しない
- `helper_specs: false`
	- ヘルパーファイル⽤のスペックを作成しない
- `routing_specs: false`
	- config/routes.rb⽤のスペックファイルの作成を省略
- `g.factory_bot false`
	- Factory Botのジェネレータを⼀時的に無効化

## model spec
Model specの基本構成

```User modelの要件
describe User do
		# 姓、名、メール、パスワードがあれば有効な状態であること
		it "is valid with a first name, last name, email, and password"
		
		# 名がなければ無効な状態であること
		it "is invalid without a first name"
		
		# 姓がなければ無効な状態であること
		it "is invalid without a last name"
		
		# メールアドレスがなければ無効な状態であること
		it "is invalid without an email address"
		
		# 重複したメールアドレスなら無効な状態であること
		it "is invalid with a duplicate email address"
		
		# ユーザーのフルネームを⽂字列として返すこと
		it "returns a user's full name as a string"
end
```

ベストプラクティス
- 期待する結果をまとめて記述（describe）している。
	- このケースではUserモデルがどんなモデルなのか、そしてどんな振る舞いをするのかということを説明している
- example（itで始まる1⾏）ひとつにつき、結果をひとつだけ期待している。
	- 私がfirst_name、last_name、emailのバリデーションをそれぞれ分けてテストしている点に注意。こうすれば、exampleが失敗したときに問題が起きたバリデーションを特定できる。原因調査のためにRSpecの出力結果を調べる必要はない。少なくともそこまで細かく調べずに済む。
- どのexampleも明示的である。
	- 技術的なことを言うと、itのあとに続く説明用の文字列は必須ではありません。しかし、省略してしまうとスペックが読みにくくなります。
- 各exampleの説明は動詞で始まっている。shouldではない。
	- 期待する結果を声に出して読んでみましょう。
		- User is invalid without a first name（名がなければユーザーは無効な状態である）
		- User is invalid without a last name（姓がなければユーザーは無効な状態である）
		- User returns a user’s full name as a string（ユーザーは文字列としてユーザーのフルネームを返す）
	- 可読性は非常に重要であり、RSpecのキーとなる機能

### model specを作成
Model specを作成するためのファイルを生成する
```bash
bin/rails g rspec:model user
```

`spec/models/user_rspec.rb`ファイルが作成される

```ruby:spec/models/user_spec.rb
require 'rails_helper'

RSpec.describe User, type: :model do
		pending "add some examples to (or delete) #{__FILE__}"
end
```

`bundle exec rspec`コマンドで実行
### RSpec構文
RSpecは`should`構文から`expect`構文にアップデートされた

```ruby:should構文
# 2と1を⾜すと3になること
it "adds 2 and 1 to make 3" do
		(2 + 1).should eq 3
end
```

```ruby:expect構文
# 2と1を⾜すと3になること
it "adds 2 and 1 to make 3" do
		expect(2 + 1).to eq 3
end
```

実際のexapleではどうなるか
```ruby:spec/models/user_spec.rb
RSpec.describe User, type: :model do 4
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

`be_valid`というRSpecのmatcherを使ってmodelが有効な状態を理解できているかを検証している。
Userオブジェクトを作成し、そのオブジェクトを`expect`に渡しmatcherと比較している。
`bundle exec rspec`コマンドから実行

### バリデーションをテストする

```ruby:spec/models/user_spec.rb
# 名がなければ無効な状態であること
it "is invalid without a first name" do
		user = User.new(first_name: nil)
		user.valid?

		expect(user.errors[:first_name]).to include("can't be blank")
end
```

作成したUserに対し、`valid?`メソッドを呼び出すと有効（`valid`）にならずエラーメッセージがついていることを期待（`expect`）する。

ここまででエラーが出ていない。
誤判定でないことを証明するための2つの方法を試す。
1つ目は`to`を`to_not`に変える。
`to_not`と`not_to`は同じ

2つ目はUser Modelのfirst_nameバリデーションをコメントアウトすること

Rspecを再実行すると、失敗が表示される。これはRSpecに対して名を持たないユーザーは無効であると伝えたが、アプリケーション側がその使用を実装していないことを意味する

`:last_name`のバリデーションも同じようなアプローチでテストしてみる

```ruby:spec/models/user_spec.rb
it "is invalid without a last name" do
	user = User.new(last_name: nil)
	user.valid?

	expect(user.errors[:last_name]).to include("can't be blank")
end
```

もっと複雑なテストを書いてみる

```ruby:spec/models/user_spec.rb
it "is invalid with a duplicate email address" do
	User.create(
		first_name: "Joe",
		last_name: "Tester",
		email: "tester@example.com",
		password: "dottle-nouveau-pavilion-tights-furze",
	)

	user = User.new(
		first_name: "Jane",
		last_name: "Tester",
		email: "tester@example.com",
		password: "dottle-nouveau-pavilion-tights-furze",
	)
	user.valid?

	expect(user.errors[:email]).to include("has already been taken")
end
```

Projectモデルに対して複雑なテストを作成してみる

```bash
bin/rails g rspec:model project
```

```ruby:spec/models/project_spec.rb
require 'rails_helper'

RSpec.describe Project, type: :model do
	# ユーザー単位では重複したプロジェクト名を許可しないこと
	it "does not allow duplicate project names per user" do
		user = User.create(
			first_name: "Joe",
			last_name: "Tester",
			email: "joetester@example.com",
			password: "dottle-nouveau-pavilion-tights-furze",
		)

		user.projects.create(
			name: "Test Project",
		)
		new_project = user.projects.build(
			name: "Test Project",
		)

		new_project.valid?

		expect(new_project.errors[:name]).to include("has already been taken")
	end

	# ⼆⼈のユーザーが同じ名前を使うことは許可すること
	it "allows two users to share a project name" do
		user = User.create(
			first_name: "Joe",
			last_name: "Tester",
			email: "joetester@example.com",
			password: "dottle-nouveau-pavilion-tights-furze",
		)

		user.projects.create(
			name: "Test Project",
		)

		other_user = User.create(
			first_name: "Jane",
			last_name: "Tester",
			email: "janetester@example.com",
			password: "dottle-nouveau-pavilion-tights-furze",
		)

		other_project = other_user.projects.build(
			name: "Test Project",
		)

		expect(other_project).to be_valid
	end
end	
```

```ruby:app/models/project.rb
validates :name, presence: true, uniqueness: { scope: :user_id }
```

### インスタンスメソッドをテストする
`@user.name`を呼び出すとフルネームが出力されるようにする

```ruby:app/models/user.rb
def name
	[first_name, last_name].join(' ')
end
```

バリデーションのexampleと同じ基本的なテクニックでこの機能のexampleを作ることができる

```ruby:spec/models/user_spec.rb
it "returns a user's full name as a string" do
	user = User.new(
		first_name: "John",
		last_name: "Doe",
		email: "johndoe@example.com",
	)

	expect(user.name).to eq "John Doe"
end
```

### クラスメソッドとスコープをテストする
渡された文字列でメモ（note）を検索する機能を用意する

```ruby:app/models/note.rb
scope :search, ->(term) {
	where("LOWER(message) LIKE ?", "%#{term.downcase}%")
}
```

```ruby:spec/models/note_spec.rb
require 'rails_helper'

RSpec.describe Note, type: :model do
	# 検索⽂字列に⼀致するメモを返すこと
	it "returns notes that match the search term" do
		user = User.create(
			first_name: "Joe",
			last_name: "Tester",
			email: "joetester@example.com",
			password: "dottle-nouveau-pavilion-tights-furze",
		)
		project = user.projects.create(
			name: "Test Project",
		)
		note1 = project.notes.create(
			message: "This is the first note.",
			user: user,
		)
		note2 = project.notes.create(
			message: "This is the second note.",
			user: user,
		)
		note3 = project.notes.create(
			message: "First, preheat the oven.",
			user: user,
		)

		expect(Note.search("first")).to include(note1, note3)
		expect(Note.search("first")).to_not include(note2)
	end
end
```

`search`スコープは検索文字列に一致するメモのコレクションを返す

### 失敗をテストする
結果が返ってこない文字列で検索した場合のテスト

```ruby:spec/models/note_spec.rb
require 'rails_helper'

RSpec.describe Note, type: :model do
	# 検索結果を検証するスペック...
	# 検索結果が1件も⾒つからなければ空のコレクションを返すこと
	it "returns an empty collection when no results are found" do
		user = User.create(
			first_name: "Joe",
			last_name: "Tester",
			email: "joetester@example.com",
			password: "dottle-nouveau-pavilion-tights-furze",
		)

		project = user.projects.create(
			name: "Test Project",
		)
		note1 = project.notes.create(
			message: "This is the first note.",
			user: user,
		)
		note2 = project.notes.create(
			message: "This is the second note.",
			user: user,
		)
		note3 = project.notes.create(
			message: "First, preheat the oven.",
			user: user,
		)

		expect(Note.search("message")).to be_empty
	end
end
```

### マッチャについて詳しく
これまで４つのマッチャ（ `be_valid`、`eq`、`include`、`be_empty` ）
| macther    | 提供               |
| ---------- | ------------------ |
| `be_valid` | rspec-rails gem    |
| `eq`       | rspec-expectations |
| `include`  | rspec-expectations |
| `be_empty` | rspec-expectations |

### `describe`、`context`、`before`、`after`を使ってスペックを DRY にする
さきほどのNoteモデルのsペックに注目する
`describe`ブロックを`describe Note`ブロックの中に作成する
検索機能にフォーカスするため

```ruby:spec/models/note_spec.rb
require 'rails_helper'

RSpec.describe Note, type: :model do
	# バリデーション⽤のスペックが並ぶ
	# ⽂字列に⼀致するメッセージを検索する
	describe "search message for a term" do
		# 検索⽤の example が並ぶ ...
	end
end
```
2つの`context`ブロックを加えてさらにexampleを切り分ける
exampleのアウトラインを作ると同じようなexampleをひとまとめにして分類できる
```ruby:spec/models/note_spec.rb
require 'rails_helper'

RSpec.describe Note, type: :model do
	# 他のスペックが並ぶ

	# ⽂字列に⼀致するメッセージを検索する
	describe "search message for a term" do
		# ⼀致するデータが⾒つかるとき
		context "when a match is found" do
			# ⼀致する場合の example が並ぶ ...
		end
		# ⼀致するデータが1件も⾒つからないとき
		context "when no match is found" do
			# ⼀致しない場合の example が並ぶ ...
		end
	end
end
```

beforeフックを利用してspecのリファクタリングを完了させる。
beforeブロックの中に書かれたコードは内側の各テストが実行される前に実行される。また、beforeブロックはdescribeやcontextブロックによってスコープが限定される。

```ruby:spec/models/note_spec.rb
require 'rails_helper'

RSpec.describe Note, type: :model do
	before do
		# このファイルの全テストで使⽤するテストデータをセットアップする
	end

	# バリデーションのテストが並ぶ
	# ⽂字列に⼀致するメッセージを検索する
	describe "search message for a term" do
		before do
			# 検索機能の全テストに関連する追加のテストデータをセットアップする
		end

		# ⼀致するデータが⾒つかるとき
		context "when a match is found" do
			# ⼀致する場合の example が並ぶ ...
		end

		# ⼀致するデータが1件も⾒つからないとき
		context "when no match is found" do
			# ⼀致しない場合の example が並ぶ ...
		end
	end
end
```

- before(:each)はdescribeまたはcontextブロック内の各（each）テストの前に実⾏。before(:example) というエイリアスを使うも可。
- before(:all)はdescribeまたはcontextブロック内の全（all）テスト前に⼀回だけ実⾏。かわりにbefore(:context)というエイリアスを使うも可。
- before(:suite)はテストスイート全体の全ファイルを実⾏する前に実⾏。

exampleの実行後に後片付けが必要になるのであれば（たとえば外部サービスとの接続を切断する場合など）、afterフックを使って各exampleのあと（after）に後⽚付けすることも可。
beforeと同様、afterにもeach、all、suiteのオプションがある。
RSpecの場合、デフォルトでデータベースの後片付けをやってくれるので、私はafterを使うことはほとんどありません。

```ruby:spec/models/note_spec.rb
require 'rails_helper'

RSpec.describe Note, type: :model do
	before do
		@user = User.create(
			first_name: "Joe",
			last_name: "Tester",
			email: "joetester@example.com",
			password: "dottle-nouveau-pavilion-tights-furze",
		)

		@project = @user.projects.create(
			name: "Test Project",
		)
	end

	# ユーザー、プロジェクト、メッセージがあれば有効な状態であること
	it "is valid with a user, project, and message" do
		note = Note.new(
			message: "This is a sample note.",
			user: @user,
			project: @project,
		)
		expect(note).to be_valid
	end

	# メッセージがなければ無効な状態であること
	it "is invalid without a message" do
		note = Note.new(message: nil)
		note.valid?

		expect(note.errors[:message]).to include("can't be blank")
	end

	# ⽂字列に⼀致するメッセージを検索する
	describe "search message for a term" do
		before do
			@note1 = @project.notes.create(
				message: "This is the first note.",
				user: @user,
			)
			@note2 = @project.notes.create(
				message: "This is the second note.",
				user: @user,
			)
			@note3 = @project.notes.create(
				message: "First, preheat the oven.",
				user: @user,
			)
		end

		# ⼀致するデータが⾒つかるとき
		context "when a match is found" do
			# 検索⽂字列に⼀致するメモを返すこと
			it "returns notes that match the search term" do
				expect(Note.search("first")).to include(@note1, @note3)
			end
		end

		# ⼀致するデータが1件も⾒つからないとき
		context "when no match is found" do
			# 空のコレクションを返すこと
			it "returns an empty collection" do
				expect(Note.search("message")).to be_empty
			end
		end
	end
end
```

セットアップ処理をbeforeブロックに移動したため、各ユーザーはインスタンス変数にアサインする必要がある。そうしないとテストの中で変数名を指定してデータにアクセスできない。
## まとめ
- 期待する結果は能動形で明示的に記述すること。
	- exampleの結果がどうなるかを動詞を使って説明してください。チェックする結果はexampleひとつに付き１個だけにしてください。
- 起きてほしいことと、起きてほしくないことをテストすること
	- exampleを書くときは両方のパスを考え、その考えに沿ってテストを書いてください。
- 境界値テストをすること
	- もしパスワードのバリデーションが4文字以上10文字以下なら、8文字のパスワードをテストしただけで満足しないでください。4⽂字と10⽂字、そして3⽂字と11⽂字もテストするのが良いテストケースです。（もちろん、なぜそんなに短いパスワードを許容し、なぜそれ以上⻑いパスワードを許容しないのか、と⾃問するチャンスかもしれません。テストはアプリケーションの要件とコードを熟考するための 良い機会でもあります。）
- 可読性を上げるためにスペックを整理すること。
	- describeとcontextはよく似たexampleを分類してアウトライン化します。before ブロックとafterブロックは重複を取り除きます。しかし、テストの場合はDRYであることよりも読みやすいことの⽅が重要です。もし頻繁にスペックファイルをスクロールしていることに気付いたら、それはちょっとぐらいリピートしても問題ないというサインです。


## 意味のあるテストデータの作成
これまではシンプルなテストデータでしたが、複雑なテストシナリオになったときテストデータを簡単にするRubyライブラリを使用して実装していく

### ファクトリ対フィクスチャ
#### フィクスチャ
railsにデフォルトで提供されている機能。
フィクスチャはYAML形式のファイルでサンプルデータを作成する。

```yaml:projects.yml
death_star:
	name: "Death Star"
	description: "Create the universe's ultimate battle station"
	due_on: 2016-08-29
	
rogue_one:
	name: "Steal Death Star plans"
	description: "Destroy the Empire's new battle station"
	due_on: 2016-08-29
```

テストの中で`projects(:rogue_one)`と呼び出すだけで、全属性がセットされた新しいProjectが使えるようになる。
フィクスチャは比較的速く、Railsに最初から付いてきます。
あなたのアプリケーションやテストスイートに余計なものを追加する必要がない。

とはいえ、フィクスチャは実行中のテストでどのようなデータが作成されているかを確認するとき、テストとは別のフィクスチャファイルに保存された値を覚える必要がある。

また、フィクスチャはもろくて壊れやすいという性質がある。テストデータファイルの保守に時間をかけなければならない。

また、フィクスチャのデータをデータベースに読み込む際にActiveRecordを使わない。
つまり、モデルのバリデーションといった重要な機能が無視される。本番環境のデータと一致しなくなる可能性がある。

このような理由からファクトリを使う。

### Factory Bot をインストールする
`rspec-rails`の下にgemを追加する

```Gemfile
group :development, :test do
	# Railsで元から追加されているgemは省略
	gem "rspec-rails"
	gem "factory_bot_rails"
end
```

ジェネレータを使い作られるモデルに対して自動的にファクトリを作成するようにRailsを設定する。
`fixtures: false`を削除

```ruby:config/application.rb
config.generators do |g|
	g.test_framework :rspec,
		view_specs: false,
		helper_specs: false,
		routing_specs: false
end
```

### アプリケーションにファクトリを追加する
Userモデルのファクトリを追加。

```bash
bin/rails g factory_bot:model user
```

以下のようなファイルが作成される。

```ruby:spec/factories/users.rb
FactoryBot.define do
	factory :user do

	end
end
```

不足している情報を追加

```ruby:spec/factories/users.rb
FactoryBot.define do
	factory :user do
		first_name { "Aaron" }
		last_name { "Sumner" }
		email { "tester@example.com" }
		password { "dottle-nouveau-pavilion-tights-furze" }
	end
end
```

テスト内でFactoryBot.create(:user)と書くと新しいユーザーを作成できる。
このコードを書くとsupec全体でファクトリが使えるようになる。

```ruby:spec/models/user_spec.rb
require 'rails_helper'

describe User do
	# 有効なファクトリを持つこと
	it "has a valid factory" do
		expect(FactoryBot.build(:user)).to be_valid
	end

# 他のスペックが並ぶ ... 
end
```

`FactoryBot.build`を使ったため新しいユーザーはインスタンス化されるだけで保存されない。

以下のexampleではテストオブジェクトのemail属性が重複しないことを確認する

```ruby:spec/models/user_spec.rb
# 重複したメールアドレスなら無効な状態であること
it "is invalid with a duplicate email address" do
	FactoryBot.create(:user, email: "aaron@example.com")
	user = FactoryBot.build(:user, email: "aaron@example.com")
	user.valid?

	expect(user.errors[:email]).to include("has already been taken")
end
```

これを検証するためには1つ目のUserがデータベースに保存されている必要がある。
エクスペクテーションを実行する前に`FactoryBot.create`を使って同じメールアドレスのuserを最初に保存している。


### シーケンスを使ってユニークなデータを⽣成する
FactoryBotではシーケンスを使ってこのようなユニークバリデーションを持つフィールドを扱うことができる。
シーケンスはファクトリから新しいオブジェクトを作成するたびにカウンタの値を1つずつ増やしながら、ユニークにならなければならない属性に値を設定する。

```ruby:spec/factories/users.rb
FactoryBot.define do
	factory :user do
		first_name { "Aaron" }
		last_name { "Sumner" }
		sequence(:email) { |n| "tester#{n}@example.com" }
		password { "dottle-nouveau-pavilion-tights-furze" }
	end
end
```

新しいユーザーを作成するたびにユニークで連続したメールアドレスを設定できる。

### ファクトリで関連を扱う
FactoryBotは他のモデルとの関連を扱う場合に便利

```bash
bin/rails g factory_bot:model note
```

```ruby:spec/factories/notes.rb
FactoryBot.define do
	factory :note do
		message { "My important note." }
		association :project
		association :user
	end
end
```

```bash
 bin/rails g factory_bot:model project
```

```ruby:spec/factories/projects.rb
FactoryBot.define do
	factory :project do
		sequence(:name) { |n| "Project #{n}" }
		description { "A test project." }
		due_on { 1.week.from_now }
		association :owner
	end
end
```

```ruby:spec/factories/users.rb
FactoryBot.define do
	factory :user, aliases: [:owner] do
		first_name { "Aaron" }
		last_name { "Sumner" }
		sequence(:email) { |n| "tester#{n}@example.com" }
		password { "dottle-nouveau-pavilion-tights-furze" }
	end
end
```

メモだけのテストの場合でも以下のように使える

```ruby:spec/models/note_spec.rb
require 'rails_helper'

RSpec.describe Note, type: :model do
	# ファクトリで関連するデータを⽣成する
	it "generates associated data from a factory" do
		note = FactoryBot.create(:note)

		puts "This note's project is #{note.project.inspect}"
		puts "This note's user is #{note.user.inspect}"
	end
end
```

この方法ではユーザーが2つ作成される
この理由はメモのファクトリが関連するプロジェクトを作成する際に関連するユーザー（プロジェクトに関連するowner）を作成し、それから2番⽬のユーザー（メモに関連するユーザー）を作成する

```ruby:spec/factories/notes.rb
FactoryBot.define do
	factory :note do
		message { "My important note." }
		association :project
		user { project.owner }
	end
end
```

### ファクトリ内の重複をなくす

FactoryBotでは同じ型を作成するファクトリを複数定義することもできる。
たとえば、スケジュールどおりのプロジェクトとスケジュールから遅れているプロジェクトをテストしたいのであれば、別々の名前を付けてプロジェクトファクトリの引数に渡すことができます。
その際はそのファクトリを使って作成するインスタンスのクラス名と、既存のファクトリと異なるインスタンスの属性値（この例でいうとdue_on属性の値）も指定します。

```ruby:spec/factories/projects.rb
FactoryBot.define do
	factory :project do
		sequence(:name) { |n| "Test Project #{n}" }
		description { "Sample project for testing purposes" }
		due_on { 1.week.from_now }
		association :owner
	end

	# 昨⽇が締め切りのプロジェクト
	factory :project_due_yesterday, class: Project do
		sequence(:name) { |n| "Test Project #{n}" }
		description { "Sample project for testing purposes" }
		due_on { 1.day.ago }
		association :owner
	end

	# 今⽇が締め切りのプロジェクト
	factory :project_due_today, class: Project do
		sequence(:name) { |n| "Test Project #{n}" }
		description { "Sample project for testing purposes" }
		due_on { Date.current.in_time_zone }
		association :owner
	end

	# 明⽇が締め切りのプロジェクト
	factory :project_due_tomorrow, class: Project do
		sequence(:name) { |n| "Test Project #{n}" }
		description { "Sample project for testing purposes" }
		due_on { 1.day.from_now }
		association :owner
	end
end
```

上で定義した新しいファクトリをProjectモデルのスペックで使うことができます。
ここでは魔法のマッチャ`be_late`が登場します。
`be_late`はRSpecに定義されているマッチャではありません。
ですがRSpecは賢いので、projectにlateまたはlate?という名前の属性やメソッドが存在し、それが真偽値を返すようになっていれば`be_late`はメソッドや属性の戻り値がtrueになっていることを検証してくれるのです。

```ruby:spec/models/project_spec.rb
# 遅延ステータス
describe "late status" do
	# 締切⽇が過ぎていれば遅延していること
	it "is late when the due date is past today" do
		project = FactoryBot.create(:project_due_yesterday)
		expect(project).to be_late
	end

	# 締切⽇が今⽇ならスケジュールどおりであること
	it "is on time when the due date is today" do
		project = FactoryBot.create(:project_due_today)
		expect(project).to_not be_late
	end

	# 締切⽇が未来ならスケジュールどおりであること
	it "is on time when the due date is in the future" do
		project = FactoryBot.create(:project_due_tomorrow)
		expect(project).to_not be_late
	end
end
```

新しく作ったファクトリには大量の重複があります。
新しいファクトリを定義するときは毎回プロジェクトの全属性を再定義しなければいけません。
これはつまり、Projectモデルの属性を変更したときは毎回複数のファクトリ定義を変更する必要が出てくるということを意味しています。
FactoryBotには重複を減らすテクニックが2つあります。
1つ目は __ファクトリの継承__ を使ってユニークな属性だけを変えることです。

```ruby:spec/factories/projects.rb
FactoryBot.define do
	factory :project do
		sequence(:name) { |n| "Test Project #{n}" }
		description { "Sample project for testing purposes" }
		due_on { 1.week.from_now }
		association :owner

		# 昨⽇が締め切りのプロジェクト
		factory :project_due_yesterday do
			due_on { 1.day.ago }
		end

		# 今⽇が締め切りのプロジェクト
		factory :project_due_today do
			due_on { Date.current.in_time_zone }
		end

		# 明⽇が締め切りのプロジェクト
		factory :project_due_tomorrow do
			due_on { 1.day.from_now }
		end
	end
end
```

⾒た⽬には少しトリッキーかもしれませんが、これが継承の使い⽅です。
`:project_due_yesterday`と`:project_due_today`と`:project_due_tomorrow`の各ファクトリは継承元となる`:project`ファクトリの内部で入れ子になっています。
構造だけを抜き出すと次のようになり ます。

```
factory :project
	factory :project_due_yesterday
	factory :project_due_today
	factory :project_due_tomorrow
```

継承を使うと`class: Project`の指定もなくすことができます。
なぜならこの構造からFactoryBotは⼦ファクトリでProjectクラスを使うことがわかるからです。
この場合、スペック側は何も変更しなくてもそのままでパスします。
重複を減らすための⼆つ⽬のテクニックは __トレイト（trait）__ を使ってテストデータを構築することです。
このアプローチでは属性値の集合をファクトリで定義します。

```ruby:spec/factories/projects.rb
FactoryBot.define do
	factory :project do
		sequence(:name) { |n| "Test Project #{n}" }
		description { "Sample project for testing purposes" }
		due_on { 1.week.from_now }
		association :owner

		# 締め切りが昨⽇
		trait :due_yesterday do
			due_on { 1.day.ago }
		end

		# 締め切りが今⽇
		trait :due_today do
			due_on { Date.current.in_time_zone } 
		end

		# 締め切りが明⽇
		trait :due_tomorrow do
			due_on { 1.day.from_now }
		end
	end
end
```

トレイトを使うためにはスペックを変更する必要があります。
利⽤したいトレイトを使って次のようにファクトリから新しいプロジェクトを作成してください。

```ruby:spec/models/project_spec.rb
describe "late status" do
	# 締切⽇が過ぎていれば遅延していること
	it "is late when the due date is past today" do
		project = FactoryBot.create(:project, :due_yesterday)
		expect(project).to be_late
	end

	# 締切⽇が今⽇ならスケジュールどおりであること
	it "is on time when the due date is today" do
		project = FactoryBot.create(:project, :due_today)
		expect(project).to_not be_late
	end

	# 締切⽇が未来ならスケジュールどおりであること
	it "is on time when the due date is in the future" do
		project = FactoryBot.create(:project, :due_tomorrow)
		expect(project).to_not be_late
	end
end
```

トレイトを使うことの本当の利点は、複数のトレイトを組み合わせて複雑なオブジェクトを構築できる点です。
トレイトについてはこの後の章でテストデータに関する要件がもっと複雑になってきたときに再度説明します。

### コールバック
FactoryBotの機能をもうひとつ紹介しましょう。
コールバックを使うと、ファクトリがオブジェクトをcreateする前、もしくはcreateした後に何かしら追加のアクションを実⾏できます。
また、createされたときだけでなく、buildされたり、stubされたりしたときも同じように使えます。
適切にコールバックを使えば複雑なテストシナリオも簡単にセットアップできるので、強⼒な時間の節約になります。
ですが、⼀⽅でコールバックは遅いテストや無駄に複雑なテストの原因になることもあります。
そのことを頭の⽚隅に置きつつ、コールバックのよくある使い⽅を⾒てみましょう。
ここでは複雑な関連を持つオブジェクトを作成する⽅法を説明します。FactoryBotにはこうした処理を簡単に⾏うための __create_list__ メソッドが⽤意されています。
コールバックを利⽤して、新しいオブジェクトが作成されたら⾃動的に複数のメモを作成する処理を追加してみましょう。
今回は必要なときにだけコールバックを利⽤するよう、トレイトの中でコールバックを使います。

```ruby:spec/factories/projects.rb
FactoryBot.define do
	factory :project do
		sequence(:name) { |n| "Test Project #{n}" }
		description { "Sample project for testing purposes" }
		due_on { 1.week.from_now }
		association :owner

		# メモ付きのプロジェクト
		trait :with_notes do
			after(:create) { |project| create_list(:note, 5, project: project) }
		end

		# 他のトレイトが並ぶ ...
	end
end
```

__create_list__ メソッドではモデルを作成するために関連するモデルが必要です。
今回はメモの作成に必要なProjectモデルを使っています。
プロジェクトファクトリに新しく定義した __with_notes__ トレイトは、新しいプロジェクトを作成した後にメモファクトリを使って5つの新しいメモを追加します。
それではスペック内でこのトレイトを使う⽅法を⾒てみましょう。
最初はトレイトなしのファクトリを使ってみます。

```ruby:spec/models/project_spec.rb
# たくさんのメモが付いていること
it "can have many notes" do
	project = FactoryBot.create(:project)

	expect(project.notes.length).to eq 5
end
```

このテストは失敗します。
なぜならメモの数が5件ではなくゼロだからです。

そこで __with_notes__ トレイトでセットアップした新しいコールバックを使って、このテス トをパスさせましょう。
```ruby:spec/models/project_spec.rb
# たくさんのメモが付いていること
it "can have many notes" do
	project = FactoryBot.create(:project, :with_notes) 
	
	expect(project.notes.length).to eq 5
end
```

これでテストがパスします。
なぜなら、コールバックによってプロジェクトに関連する5つのメモが作成されるからです。
実際のアプリケーションでこういう仕組みを使っていると、ちょっと情報量の乏しいテストに見えるかもしれません。
ですが、今回の使用例はコールバックが正しく設定されているか確認するのに役立ちますし、この先でもっと複雑なテストを作り始める前のちょうどいい練習にもなります。
とくに、Railsのモデルが入れ子になった他のモデルを属性として持っている場合、コールバックはそうしたモデルのテストデータを作るのに便利です。
ここではFactoryBotのコールバックについてごく簡単な内容しか説明していません。

## コントローラスペック

### コントローラスペックの基本
Homeコントローラはまだサインインしていない⼈のために、アプリケーションのホームページを返す仕事です。

```ruby:app/controllers/home_controller.rb
class HomeController < ApplicationController
	skip_before_action :authenticate_user!
	def index
	end
end
```

コントローラのテストを作成するためにRSpecが提供しているジェネレータを使います。

```bash
bin/rails g rspec:controller home --controller-specs --no-request-specs
```

次のような定型コードが作成されます。

```ruby:spec/controllers/home_controller_spec.rb
require 'rails_helper'

RSpec.describe HomeController, type: :controller do
end
```

コントローラがブラウザのリクエストに対して正常にレスポンスを返すことを確認します。

```ruby:spec/controllers/home_controller_spec.rb
require 'rails_helper'

RSpec.describe HomeController, type: :controller do
	describe "#index" do
		# 正常にレスポンスを返すこと
		it "responds successfully" do
			get :index
			expect(response).to be_successful
		end
	end
end
```

`response`はブラウザに返すべきアプリケーションの全データを保持しているオブジェクトです。
この中にはHTTPレスポンスコードも含まれます。
`be_successful`はレスポンスステータスが成功（200レスポンス）か、それ以外（たとえば500エラー）であるかをチェックします。
ここではコントローラのテストだけを実行したいので、`bundle exec rspec spec/controllers` を使って実⾏します。

特定のHTTPレスポンスコードが返ってきているかどうかも確認できます。
この場合であれば200 OKのレスポンスが返ってきてほしいはずです。
```ruby:spec/controllers/home_controller_spec.rb
# 200レスポンスを返すこと
it "returns a 200 response" do
	get :index
	expect(response).to have_http_status "200"
end
```

### 認証が必要なコントローラスペック
今度はProjectコントローラ用に新しいコントローラスペックを作りましょう。再度ジェネレータを使ってください。

```bash
bin/rails g rspec:controller projects --controller-specs --no-request-specs
```

それから先ほどのhome_controller_spec.rbと同じスペックを追加し ます。

```ruby:spec/controllers/projects_controller_spec.rb
require 'rails_helper'

RSpec.describe ProjectsController, type: :controller do
	describe "#index" do
		# 正常にレスポンスを返すこと
		it "responds successfully" do
			get :index
			expect(response).to be_successful
		end
	
		# 200レスポンスを返すこと
		it "returns a 200 response" do
			get :index
			expect(response).to have_http_status "200"
		end
	end
end
```

スペックを実行すると、Deviseのヘルパーが見つからないというメッセージが表示されます。
Deviseは認証が必要なコントローラのアクションに対して、ユーザーのログイン状態をシミュレートするヘルパーを提供しています。
そのヘルパーはまだ追加されていません。
失敗メッセージにはこの問題に対処する方法が少し詳しく載っています。
テストスイートにこのヘルパーモジュールを組み込みましょう。spec/rails_helper.rbを開き、次のような設定を追加してください。

```ruby:spec/rails_helper.rb
RSpec.configure do |config|
	# 設定ブロックの他の処理は省略 ...

	# コントローラスペックで Devise のテストヘルパーを使⽤する
	config.include Devise::Test::ControllerHelpers, type: :controller
end
```

この状態でテストを実⾏してもまだ失敗します。
ですが、失敗メッセージには新しい情報が載っています。
つまり、ちょっとは前に進んだということです。
どちらのテストも基本的に同じ理由、すなわち、成功を表す200レスポンスではなく、リダイレクトを表す302レスポンスが返ってきているために失敗しているのです。
失敗するのはindexアクションがユーザーのログインを要求しているにもかかわらず、私たちはまだそれをテスト内でシミュレートしていないからです。

すでにDeviseのヘルパーはテストスイートに組み込んであるので、ログイン状態をシミュレートすることができます。
具体的にはテストユーザーを作成し、それからそのユーザーでログインするようにテストに伝えます。
テストユーザーは両方のテストで有効になるようbeforeブロックで作成し、それからログイン状態をシミュレートするためにsign_inヘルパーを使います。

```ruby:spec/controllers/projects_controller_spec.rb
require 'rails_helper'

RSpec.describe ProjectsController, type: :controller do
	describe "#index" do
		before do
			@user = FactoryBot.create(:user)
		end
		
		# 正常にレスポンスを返すこと
		it "responds successfully" do
			sign_in @user
			get :index
			expect(response).to be_successful
		end

		# 200レスポンスを返すこと
		it "returns a 200 response" do
			sign_in @user
			get :index
			expect(response).to have_http_status "200"
		end
	end
end
```

さあ、これでスペックはパスするはずです。
なぜなら、indexアクションには認証済みのユーザーでアクセスしていることになるからです。
ここでちょっとテストをパスさせるためにどうしたのかを考えてみましょう。
テストがパスしたのは必要な変更を加えたあとです。
最初はログインしていなかったので、テストは失敗していました。
アプリケーションセキュリティの観点からすると、認証されていないユーザー（ゲストと呼んでもいいでしょう）がアクセスしたら強制的にリダイレクトされることもテストすべきではないでしょうか。
ここからテストを拡張して、このシナリオを追加することは可能です。
こういうケースはdescribeとcontextのブロックを使うと、テストを整理しやすくなります。
というわけで、次のように変更してみましょう。

```ruby:spec/controllers/projects_controller_spec.rb
require 'rails_helper'

RSpec.describe ProjectsController, type: :controller do
	describe "#index" do
		# 認証済みのユーザーとして
		context "as an authenticated user" do
			before do
				@user = FactoryBot.create(:user)
			end

			# 正常にレスポンスを返すこと
			it "responds successfully" do
				sign_in @user
				get :index

			 expect(response).to be_successful
			end

			# 200レスポンスを返すこと
			it "returns a 200 response" do
				sign_in @user
				get :index
				expect(response).to have_http_status "200"
			end
		end

		# ゲストとして
		context "as a guest" do
			# テストをここに書く
		end
	end
end
```

ここではindexアクションのdescribeブロック内に、⼆つのcontextを追加しました。
1つ目は認証済みのユーザーを扱うcontextです。
テストユーザーを作成するbeforeブロックがこのcontextブロックの内側で入れ子になっている点に注意してください。
それから、スペックを実行して正しく変更できていることを確認してください。
続いて認証されていないユーザーの場合をテストしましょう。
"as a guest"のcontextを変更し、次のようなテストを追加してください。

```ruby:spec/controllers/projects_controller_spec.rb
# ゲストとして
context "as a guest" do
	# 302レスポンスを返すこと
	it "returns a 302 response" do
		get :index
		expect(response).to have_http_status "302"
	end

	# サインイン画⾯にリダイレクトすること
	it "redirects to the sign-in page" do
		get :index
		expect(response).to redirect_to "/users/sign_in"
	end
end
```

最初のスペックは難しくないはずです。
have_http_statusマッチャはすでに使っていますし、302というレスポンスコードもちょっと前の失敗メッセージに出てきました。
⼆つ⽬のスペックではredirect_toという新しいマッチャを使っています。
ここではコントローラが認証されていないリクエストの処理を中断し、Deviseが提供しているログイン画⾯に移動させていることを検証しています。
同じテクニックはアプリケーションの認可機能（つまり、ログイン済みのユーザーが、やりたいことをできるかどうかの判断）にも適⽤できます。
これはコントローラの3⾏⽬で処理されています。

```
before_action :project_owner?, except: %i[ index new create ] 
```

このアプリケーションではユーザーがプロジェクトのオーナーであることを要求します。
では、新しいテストを追加しましょう。
今回はshowアクションのテストです。
⼀つのdescribeブロックと⼆つのcontextブロックを追加してください。

```ruby:spec/controllers/projects_controller_spec.rb
require 'rails_helper'
RSpec.describe ProjectsController, type: :controller do
	# インデックスのテストが並ぶ ...
	describe "#show" do
		# 認可されたユーザーとして
		context "as an authorized user" do
			before do
				@user = FactoryBot.create(:user)
				@project = FactoryBot.create(:project, owner: @user)
			end

			# 正常にレスポンスを返すこと
			it "responds successfully" do
				sign_in @user
				get :show, params: { id: @project.id }
				expect(response).to be_successful
			end
		end

		# 認可されていないユーザーとして
		context "as an unauthorized user" do
			before do
				@user = FactoryBot.create(:user)
				other_user = FactoryBot.create(:user)
				@project = FactoryBot.create(:project, owner: other_user)
			end

			# ダッシュボードにリダイレクトすること
			it "redirects to the dashboard" do
				sign_in @user
				get :show, params: { id: @project.id }
				expect(response).to redirect_to root_path
			end
		end
	end
end
```

今回はテストごとに@projectを作成しました。
最初のcontextではログインしたユーザーがプロジェクトのオーナーになっています。
⼆つ⽬のcontextでは別のユーザーがオーナーになっています。
このテストにはもう⼀つ新しい部分があります。
それはプロジェクトのidをコントローラアクションのparam値として渡さなければいけない点です。
テストを実⾏してパスすることを確認してください。

### ユーザー⼊⼒をテストする
ここまではHTTPのGETリクエストしか使ってきませんでした。
ですがもちろん、ユーザーはPOSTやPATCH、DESTROYといったリクエストでコントローラにアクセスしてくることもあります。
そこで、それぞれについてexampleを追加していきましょう。
最初はPOSTから始めます。
ログイン済みのユーザーであれば新しいプロジェクトが作成でき、ゲストであればアクションへのアクセスを拒否されることを検証します。
では、それぞれについてcontextを追加しましょう。

```ruby:spec/controllers/projects_controller_spec.rb
describe "#create" do
	# 認証済みのユーザーとして
	context "as an authenticated user" do
		before do
			@user = FactoryBot.create(:user)
		end

		# プロジェクトを追加できること
		it "adds a project" do
			project_params = FactoryBot.attributes_for(:project)
			sign_in @user
			expect {
				post :create, params: { project: project_params }
			}.to change(@user.projects, :count).by(1)
		end
	end

	# ゲストとして
	context "as a guest" do
		# 302レスポンスを返すこと
		it "returns a 302 response" do
			project_params = FactoryBot.attributes_for(:project)
			post :create, params: { project: project_params }
			expect(response).to have_http_status "302"
		end

		# サインイン画⾯にリダイレクトすること
		it "redirects to the sign-in page" do
			project_params = FactoryBot.attributes_for(:project)
			post :create, params: { project: project_params }
			expect(response).to redirect_to "/users/sign_in"
		end
	end
end
```

"as a guest"のcontextはindexアクションで書いたテストとよく似ています。
ただし、ここではPOST経由でparamsを渡しています。
とはいえ、各テストで期待される結果はindexアクションのときと同じです。
次にupdateアクションのテストを⾒てみましょう。
ここでは次のようなテストシナリオが書いてあります。
ユーザーは⾃分のプロジェクトは編集できますが、他⼈のプロジェクトは編集できません。
ゲストはどのプロジェクトも編集できません。
テストはちょっと複雑になってきていますが、これまでに説明した内容だけで構成されています。
まず、認可されたユーザーのスペックから始めましょう。

```ruby:spec/controllers/projects_controller_spec.rb
describe "#update" do
	# 認可されたユーザーとして
	context "as an authorized user" do
		before do
			@user = FactoryBot.create(:user)
			@project = FactoryBot.create(:project, owner: @user)
		end

		# プロジェクトを更新できること
		it "updates a project" do
			project_params = FactoryBot.attributes_for(:project, name: "New Project Name")
			sign_in @user
			patch :update, params: { id: @project.id, project: project_params }
			expect(@project.reload.name).to eq "New Project Name"
		end
	end

	# 認可されていないユーザーとゲストユーザーのテストはいったんスキップ ... 
end
```

ここに出てくるテストは⼀つだけです。
既存のプロジェクトの更新が成功したかどうかを検証しています。
最初にユーザーを作成し、それからそのユーザーをプロジェクトにアサインしています。
それからテストの内部でアクションに渡すプロジェクトの属性値を作成しています。
この属性値はユーザーがプロジェクトの編集画⾯で⼊⼒する値を想定したものです。
FactoryBot.attributes_for(:project)はプロジェクトファクトリからテスト⽤の属性値をハッシュとして作成します。
ここではテストの結果をわかりやすくするために、ファクトリに定義されたnameのデフォルト値を独⾃の値で上書きしています。
それからユーザーのログインをシミュレートし、元のプロジェクトのidと⼀緒に新しいプロジェクトの属性値をparamsとしてPATCHリクエストで送信しています。
最後にテストで使った@projectの新しい値を検証します。
reloadメソッドを使うのはデータベース上の値を読み込むためです。
こうしないと、メモリに保存された値が再利⽤されてしまい、値の変更が反映されません。
ここではアクションで渡した値がプロジェクトに設定されていることを検証します。
続いて認可されていないユーザーがプロジェクトを更新しようとしたときのテストを⾒てみましょう。

```ruby:spec/controllers/projects_controller_spec.rb
describe "#update" do
	# 認可されたユーザーのテストは省略 ...

	# 認可されていないユーザーとして
	context "as an unauthorized user" do
		before do
			@user = FactoryBot.create(:user)
			other_user = FactoryBot.create(:user)
			@project = FactoryBot.create(:project,
				owner: other_user,
				name: "Same Old Name"
			)
		end

		# プロジェクトを更新できないこと
		it "does not update the project" do
			project_params = FactoryBot.attributes_for(:project,
				name: "New Name")
			sign_in @user
			patch :update, params: { id: @project.id, project: project_params }
			expect(@project.reload.name).to eq "Same Old Name"
		end

		# ダッシュボードへリダイレクトすること
		it "redirects to the dashboard" do
			project_params = FactoryBot.attributes_for(:project)
			sign_in @user
			patch :update, params: { id: @project.id, project: project_params }
			expect(response).to redirect_to root_path
		end
	end

	# ゲストユーザーのテストは省略 ...
end

```

こちらは先ほどのexampleよりもちょっと複雑です。
今回は認可されていないユーザーが他のユーザーのプロジェクトにアクセスしようとしたときのテストと同じ⽅法でテストデータをセットアップしています。
それから、テストの内部ではプロジェクトの名前が変わっていないことを最初に検証し、それから認可されていないユーザーがダッシュボード画⾯にリダイレクトされることを検証しています。
最後はゲストユーザーのcontextです。
これはとてもシンプルです。

```ruby:spec/controllers/projects_controller_spec.rb
describe "#update" do
	# 認可されている場合と認可されていない場合の context は省略 ... 

	# ゲストとして
	context "as a guest" do
		before do
			@project = FactoryBot.create(:project)
		end

		# 302レスポンスを返すこと
		it "returns a 302 response" do
			project_params = FactoryBot.attributes_for(:project)
			patch :update, params: { id: @project.id, project: project_params }
			expect(response).to have_http_status "302"
		end

		# サインイン画⾯にリダイレクトすること
		it "redirects to the sign-in page" do
			project_params = FactoryBot.attributes_for(:project)
			patch :update, params: { id: @project.id, project: project_params }
			expect(response).to redirect_to "/users/sign_in"
		end
	end
end
```

オブジェクトを作成し、それからコントローラを使った変更を試みます。
試みは失敗し、かわりにユーザーはログイン画⾯にリダイレクトさせられます。

ユーザーの⼊⼒を受け付けるアクションがもう⼀つあります。
次はdestroyアクションを⾒てみましょう。
これはupdateによく似ています。
認可されたユーザーであれば⾃分のプロジェクトは削除できますが、他のユーザーのプロジェクトは削除できません。
ゲストの場合は⼀切アクセスできません。

```ruby:spec/controllers/projects_controller_spec.rb
describe "#destroy" do
	# 認可されたユーザーとして
	context "as an authorized user" do
		before do
			@user = FactoryBot.create(:user)
			@project = FactoryBot.create(:project, owner: @user)
		end

		# プロジェクトを削除できること
		it "deletes a project" do
			sign_in @user
			
			expect {
				delete :destroy, params: { id: @project.id }
			}.to change(@user.projects, :count).by(-1)
		end
	end

	# 認可されていないユーザーとして
	context "as an unauthorized user" do
		before do
			@user = FactoryBot.create(:user)
			other_user = FactoryBot.create(:user)
			@project = FactoryBot.create(:project, owner: other_user)
		end

		# プロジェクトを削除できないこと
		it "does not delete the project" do
			sign_in @user
			expect {
				delete :destroy, params: { id: @project.id }
			}.to_not change(Project, :count)
		end

		# ダッシュボードにリダイレクトすること
		it "redirects to the dashboard" do
			sign_in @user
			delete :destroy, params: { id: @project.id }
			expect(response).to redirect_to root_path
		end
	end

	# ゲストとして
	context "as a guest" do
		before do
			@project = FactoryBot.create(:project)
		end

		# 302レスポンスを返すこと
		it "returns a 302 response" do
			delete :destroy, params: { id: @project.id }

			expect(response).to have_http_status "302"
		end

		# サインイン画⾯にリダイレクトすること
		it "redirects to the sign-in page" do
			delete :destroy, params: { id: @project.id }

			expect(response).to redirect_to "/users/sign_in"
		end

		# プロジェクトを削除できないこと
		it "does not delete the project" do
			expect {
				delete :destroy, params: { id: @project.id }
			}.to_not change(Project, :count) 
		end
	end
end
```

このテストに出てきた新しい点は、destroyメソッドにはDELETEリクエストでアクセス しているところぐらいです。

テストコードを順に読んでみてください。
ここに出てくるのはこの章で何度も出てきてお馴染みのパターンばかりのはずです。
ですが、もしあなたがこのプロジェクト管理アプリケーションをブラウザ上でさわってみたことがあるなら、UIとコントローラに⾷い違いがあることに気づいたかもしれません。
実はUIにはプロジェクトを削除するボタンがないのです！
正直に⽩状すると、これはうっかりミスです。
とはいえ、これはある意味、コントローラレベルのテストにおける⽋点を⽰している例かもしれません。
もしユーザーがアプリケーションの機能の⼀部にアクセスできないとしたら、それはつまり何を意味しているのでしょうか？
この⽋点についてはまたのちほど説明します。

### ユーザー⼊⼒のエラーをテストする
ここまでに追加した認可済みのユーザーに対するテストを思い出してください。
ここまで私たちは正常系の⼊⼒しかテストしませんでした。
ユーザーはプロジェクトを作成、または編集するために有効な属性値を送信したので、Railsは正常にレコードを作成、または更新できました。
ですが、モデルスペックの場合と同じように、何か正しくないことがコントローラ内で起こったときも意図した通りの動きになるか検証するのは良い考えです。
今回の場合だと、もしプロジェクトの作成、または編集時にバリデーションエラーが発⽣したら、何が起きるでしょうか？
こういうケースの⼀例として、認可済みのユーザーがcreateアクションにアクセスしたときのテストを少し変更してみましょう。
まず、テストを⼆つの新しいcontextに分割することから始めます。
⼀つは有効な属性値で、もう⼀つは無効な属性値です。
既存のテストは最初のcontextに移動し、無効な属性については新しくテストを追加します。

```ruby:spec/controllers/projects_controller_spec.rb
describe "#create" do
	# 認可済みのユーザーとして
	context "as an authenticated user" do
		before do
		@user = FactoryBot.create(:user)
	end

	# 有効な属性値の場合
	context "with valid attributes" do
		# プロジェクトを追加できること
		it "adds a project" do
			project_params = FactoryBot.attributes_for(:project)
			sign_in @user
			expect {
				post :create, params: { project: project_params }
			}.to change(@user.projects, :count).by(1)
			end
		end

		# 無効な属性値の場合
		context "with invalid attributes" do
			# プロジェクトを追加できないこと
			it "does not add a project" do
				project_params = FactoryBot.attributes_for(:project, :invalid)
				sign_in @user
				expect {
					post :create, params: { project: project_params }
				}.to_not change(@user.projects, :count)
			end
		end
	end

	# 他の context は省略 ...
end
```

新しいテストではプロジェクトファクトリの新しいトレイトも使っています。
こちらも追加しておきましょう。

```ruby:spec/factories/projects.rb
FactoryBot.define do
	factory :project do
		sequence(:name) { |n| "Test Project #{n}" }
		description "Sample project for testing purposes"
		due_on 1.week.from_now
		association :owner

		# 既存のトレイトが並ぶ ...

		# 無効になっている
		trait :invalid do
			name { nil }
		end
	end
end
```

これでcreateアクションを実⾏したときに、名前のないプロジェクトの属性値が送信さ れます。
この場合、コントローラは新しいプロジェクトを保存しません。

### HTML 以外の出⼒を扱う
コントローラの責務はできるだけ⼩さくすべきです。
ただし、コントローラが担うべき責務の⼀つに、適切なフォーマットでデータを返す、という役割があります。
ここまでにテストしたコントローラのアクションはすべてtext/htmlフォーマットでデータを返していました。

ですが、テストの中ではそのことを特に意識していませんでした。
簡単に説明するために、ここではTaskコントローラを⾒ていきます。
TaskコントローラはRailsのscaffoldで作成され、デフォルトで定義されたCRUDアクションにはほとんど変更を加えていません。

ですので、HTMLとJSONの両⽅のフォーマットでリクエストを受け付け、レスポンスを返すことができます。

JSONに限定したテストを書くとどうなるか、今から⾒ていきましょう。
Taskコントローラ⽤のスペックファイルはまだ作成していません。
ですが、ジェネレー タを使えば簡単に作成できます。

```bash
bin/rails g rspec:controller tasks --controller-specs --no-request-specs 
```

それから、ここまでに学んだ認証機能のテストと、データを送信するテストの知識を使えば、シンプルなテストを追加することができます。
今回のテストはJSONを扱うコントローラのテストを網羅的に説明するものではありません。
ですが、コントローラのスペックファイルで何をどうすればいいか、という参考情報に はなると思います。
まず、コントローラのshowアクションを⾒てみましょう。

```ruby:spec/controllers/tasks_controller_spec.rb
require 'rails_helper'

RSpec.describe TasksController, type: :controller do
	before do 
		@user = FactoryBot.create(:user)
		@project = FactoryBot.create(:project, owner: @user)
		@task = @project.tasks.create!(name: "Test task")
	end

	describe "#show" do
		# JSON 形式でレスポンスを返すこと
		it "responds with JSON formatted output" do
			sign_in @user
			get :show, format: :json,
			params: { project_id: @project.id, id: @task.id } 
			expect(response.content_type).to include "application/json"
		end
	end

# 他のテストは省略 ...
end
```

セットアップはこの章ですでに説明した他のスペックとほとんど同じです。
必要なデータはユーザーとプロジェクト（ユーザーがアサインされる）とタスク（プロジェクトがアサインされる）の3つです。
それから、テストの中でユーザーをログインさせ、GETリクエストを送信してコントローラのshowアクションを呼びだしています。

このテストのちょっとだけ新しい点は、デフォルトのHTML形式のかわりに`format: :json`というオプションでJSON形式であることを指定しているところです。
こうするとコントローラは⾔われたとおりにリクエストを処理します。
つまり、application/jsonのContent-Typeでレスポンスを返してくれるのです。

ただし、厳密には application/json; charset=utf-8のように⽂字コード情報も⼀緒に付いてきます。
そこで、このテストではincludeマッチャを使ってレスポンスの中にapplication/jsonが含まれていればテストがパスするようにしました。
意図した通りにテストできていることを確認するため、application/jsonをtext/htmlに変えてみましょう。

案の定、テストは失敗するはずです。
次に、createアクションがJSONを処理できることを確認するテストをいくつか追加してみましょう。

```ruby:spec/controllers/tasks_controller_spec.rb
require 'rails_helper'

RSpec.describe TasksController, type: :controller do
	before do
		@user = FactoryBot.create(:user)
		@project = FactoryBot.create(:project, owner: @user)
		@task = @project.tasks.create!(name: "Test task")
	end

	# show のテストは省略 ...

	describe "#create" do
		# JSON 形式でレスポンスを返すこと
		it "responds with JSON formatted output" do
			new_task = { name: "New test task" }
			sign_in @user
			post :create, format: :json,
			params: { project_id: @project.id, task: new_task }
			expect(response.content_type).to include "application/json"
		end

		# 新しいタスクをプロジェクトに追加すること
		it "adds a new task to the project" do
			new_task = { name: "New test task" }
			sign_in @user
			expect {
				post :create, format: :json,
				params: { project_id: @project.id, task: new_task } 
			}.to change(@project.tasks, :count).by(1)
		end

		# 認証を要求すること
		it "requires authentication" do
			new_task = { name: "New test task" }
			# ここではあえてログインしない ...
			expect {
				post :create, format: :json,
				params: { project_id: @project.id, task: new_task }
			}.to_not change(@project.tasks, :count)
			expect(response).to_not be_successful 
		end
	end
end
```

セットアップは同じですが、今回はPOSTリクエストをコントローラのcreateアクションに送信しています。
また、この章ですでに説明した⽅法でtaskのパラメータも⼀緒に送信しています。

そして、ここでもやはりJSON形式でリクエストを送信するようにオプションを指定する必要があります。
それから、JSON形式でも「リクエストを送信して本当にデータベースに保存されるか？」もしくは「ユーザーがログインしていない状態であればデータベースへの保存が中断されるか？」というようなチェックができます。

### まとめ
コントローラのテストは簡単に追加していくことができます。
ですが、すぐに⼤きくなって⼿に負えなくなることもよくあります。

今回は実際のアプリケーションでよくあるコントローラのテストシナリオをいくつか説明しました。
ですが、私が開発しているアプリケーションでは、コントローラのテストはアクセス制御が正しく機能しているか確認するテストに限定するようにしています。
この章で説明したテストでいうと、認可されていないユーザーとゲストに対するテストが該当します。
認可されているユーザーに関しては、より上のレベルのテストで検証できます。
また、コントローラのテストはRailsやRSpecから完全にはなくなっていないものの、最近では時代遅れのテストになってしまいました。
Projectコントローラのdestroyアクションをテストしたときのことを思い出してください。
あれはテストは作ったものの、結局UIが⽤意されていなかった、というオチでした。
この件はコントローラのテストに限界があることの⼀例です。

私からのアドバイスをまとめると、コントローラのテストは対象となる機能の単体テストとして最も有効活⽤できるときだけ使うのがよい、ということです。
ただし、使いすぎないように注意してください。

## システムスペックでUIをテストする
現時点で私たちはプロジェクト管理ソフトウェアのテストをかなりたくさん作ってきました。
RSpecのインストールと設定を終えたあと、モデルとコントローラの単体テストを作りました。
テストデータを生成するためにファクトリも使いました。

さて今度はこれら全部を一緒に使って __統合テスト__ を作ります。
言い換えるなら、モデルとコントローラが他のモデルやコントローラとうまく一緒に動作することを確認します。
このようなテストをRSpecでは __システムスペック（system specs）__ と呼んでいます。

システムスペックは __受入テスト__ 、または __統合テスト__ と呼ばれることもあります。
この種のテストでは開発したソフトウェア全体が1つのシステムとして期待どおりに動くことを検証します。
システムスペックのコツを一度つかめば、Railsアプリケーション内の様々な機能をテストできるようになります。
またシステムスペックはユーザーから上がってきたバグレポートを再現させる際にも利用できます。
嬉しいことに、あなたは堅牢なシステムスペックを書くために必要な知識をほとんど全部身につけています。
システムスペックの構造はモデルやコントローラとよく似ているからです。
Factory Botを使ってテストデータを生成することもできます。

この章では __Capybara__ を紹介します。
Capybara は⼤変便利なRubyライブラリで、システムスペックのステップを定義したり、アプリケーションの実際の使われ方をシミュレートしたりするのに役立ちます。
本章ではシステムスペックの基礎を説明します。

### なぜシステムスペックなのか？
私たちは大変長い時間をかけてコントローラのテストに取りくんできました。
にもかかわらず、なぜ別のレイヤーをテストしようとするのでしょうか？
それはなぜなら、コントローラのテストは比較的シンプルな __単体テスト__ であり、結局アプリケーションのごく一部をテストしているに過ぎないからです。

システムスペックはより広い部分をカバーし、実際のユーザーがあなたのコードとどのようにやりとりするのかを表現します。
言い換えるなら、システムスペックではたくさんの異なる部品が統合されて、1つのアプリケーションになっていることをテストします。
Rails5.1以降のRailsでは __システムテスト（system test）__ という名前で、このタイプのテストがセットアップ時にデフォルトでサポートされています。

内容的にはこの章で説明するシステムスペックとほとんど同じです。
この章ではRails標準のMinitest ではなくRSpecを使うため、のちほど設定を変更します。

### システムスペックで使用するgem
前述のとおり、ここではブラウザの操作をシミュレートするために __Capybara__ を使います。
Capybaraを使うとリンクをクリックしたり、Webフォームを入力したり、画面の表示を検証したりすることができます。
Rails5.1以降のRailsであればCapybaraはすでにインストールされています。
なぜならCapybaraはシステムテストでも利用されるからです。
念のためGemfileを開き、テスト環境にCapybaraが追加されていることを確認してください。

```Gemfile
group :test do
	gem 'capybara'
	# その他の gem は省略 ...
end
```

これまでに見てきたgemとは異なり、CapybaraにはRailsの開発環境で実行可能なジェネレータは用意されていないため、Capybaraが追加されているのはテスト環境だけです。これにより、開発環境のメモリ消費を少し軽くすることができます。

### システムスペックの基本
Capybaraを使うと高レベルなテストを書くことができます。
Capybaraでは`click_link`や`fill_in`、`visit`といった理解しやすいメソッドが提供されていて、アプリケーションで必要な機能のシナリオを書くことができるのです。

今から実際にやってみましょう。
ここではジェネレータを使って新しいテストファイルを作成します。
最初に`rails generate rspec:system projects`とコマンドラインに入力してください。
作成されたファイルは次のようになっています。

```ruby
require 'rails_helper'

RSpec.describe "Projects", type: :system do
	before do
		driven_by(:rack_test)
	end

	pending "add some scenarios (or delete) #{__FILE__}"
end
```

この新しいスペックファイルのbeforeブロックには `driven_by(:rack_test)` というコードが書かれています。
このコードはあとで削除しますが、いったんこのままにしておきます。
次にテストを書いてみましょう。
このシステムスペックが何をしてどう動くか、あなたは予想できますか？

```ruby:spec/system/projects_spec.rb
require 'rails_helper'

RSpec.describe "Projects", type: :system do
	before do
		driven_by(:rack_test)
	end

	# ユーザーは新しいプロジェクトを作成する
	scenario "user creates a new project" do
		user = FactoryBot.create(:user)

		visit root_path
		click_link "Sign in"
		fill_in "Email", with: user.email
		fill_in "Password", with: user.password
		click_button "Log in"

		expect {
			click_link "New Project"
			fill_in "Name", with: "Test Project"
			fill_in "Description", with: "Trying out Capybara"
			click_button "Create Project"

			expect(page).to have_content "Project was successfully created"
			expect(page).to have_content "Test Project"
			expect(page).to have_content "Owner: #{user.name}"
		}.to change(user.projects, :count).by(1)
	end
end
```

このSpecのステップを順番に見ていくと、最初に新しいテストユーザーを作成し、次にログイン画面からそのユーザーでログインしています。
それからアプリケーションの利用者が使うものとまったく同じWebフォームを使って新しいプロジェクトを作成しています。

これはシステムスペックとコントローラスペックの重要な違いです。
コントローラスペックではユーザーインターフェースを無視して、パラメータを直接コントローラのメソッドに送信します。

この場合のメソッドは複数のコントローラと複数のアクションになります。
具体的には`home#index`、`sessions#new`、`projects#index`、`projects#new`、それに`projects#create`です。

しかし、結果は同じになります。
新しいプロジェクトが作成され、アプリケーションはそのプロジェクト画面へリダイレクトし、処理の成功を伝えるフラッシュメッセージが表示され、ユーザーはプロジェクトのオーナーとして表示されます。
ひとつのスペックで全部できています！

ここで`expect{}`の部分に少し着目してください。
この中ではブラウザ上でテストしたいステップを明示的に記述し、それから、結果の表示が期待どおりになっていることを検証しています。
ここで使われているのはCapybaraの __DSL__ です。
自然な英文になっているかというとそうでもありませんが、それでも理解はしやすいはずです。
`expect{}`ブロックの最後では`change`マッチャを使って最後の重要なテスト、つまり「ユーザーがオーナーになっているプロジェクトが本当に増えたかどうか」を検証しています。

> `click_button`を使うと、起動されたアクションが完了する前に次の処理へ移ってしまうことがあります。そこで、`click_button`を実⾏した`expect{}`の内部で最低でも1個以上のエクスペクテーションを実⾏し、処理の完了を待つようにするのが良いでしょう。このサンプルコードでもそのようにしています。

`scenario`は`it`と同様に`example`の起点を表しています。
`scenario`の代わりに、標準的な`it`構文に置き換えることもできます。
RSpecのドキュメントにあるシステムスペックの説明では`it`が使われています。
以下は変更後のコード例です。

```ruby:spec/system/projects_spec.rb
require 'rails_helper' RSpec.describe "Projects", type: :system do
	# before ブロックの記述は省略 ...

	it "user creates a new project" do
		# example の中⾝ ..
```

個人的には、このまま（訳注:`it "user creates...`のままにしておくこと）だと英文として不完全で読みづらいので、説明の文言を`it "creates a new project as a user"`のように変更することも検討すべきだと思います。
また、もうひとつの代替案として、`describe`や`context`ブロックを使い、ブロック内のテストが`as a user`（ユーザーとして）であることを明示するのも良いかもしれません。
このようにいくつかの選択肢がありますが、本書では`scenario`を使うことにします。


システムスペックでは1つの`example`、もしくは1つのシナリオで複数のエクスペクテーションを書くのは全く問題ありません。

一般的にシステムスペックの実行には時間がかかります。
これまでに書いてきたモデルやコントローラの小さな`example`に比べると、セットアップや実行にずっと時間がかかります。

また、テストの途中でエクスペクテーションを追加するのも問題ありません。
たとえば、1つ前のSpecの中で、ログインの成功がフラッシュメッセージで通知されることを検証しても良いわけです。
しかし本来、こういうエクスペクテーションを書くのであれば、ログイン機能の細かい動きを検証するために専用のシステムスペックを用意する方が望ましいでしょう。

### CapybaraのDSL
先ほど作ったテストでは読者のみなさんはすでにお馴染みであろうRSpecの構文（`expect`）と、ブラウザ上の操作をシミュレートするCapybaraのメソッドを組み合わせて使いました。
このテストではページを訪問し（`visit`）、ハイパーリンクにアクセスするためにリンクをクリックし（`click_link`）、フォームの入力項目に値を入力し（`fill_in`と`with`）、ボタンをクリックして入力値を処理しました（`click_button`）。
ですが、Capybaraでできることはもっとたくさんあります。
以下のサンプルコードはCapybaraのDSLが提供しているその他のメソッドの使用例です。

```ruby
# 全種類のHTML要素を扱う
scenario "works with all kinds of HTML elements" do
	# ページを開く
	visit "/fake/page"
	# リンクまたはボタンのラベルをクリックする
	click_on "A link or button label"
	# チェックボックスのラベルをチェックする
	check "A checkbox label"
	# チェックボックスのラベルのチェックを外す
	uncheck "A checkbox label"
	# ラジオボタンのラベルを選択する
	choose "A radio button label"
	# セレクトメニューからオプションを選択する
	select "An option", from: "A select menu"
	# ファイルアップロードのラベルでファイルを添付する
	attach_file "A file upload label", "/some/file/in/my/test/suite.gif"

	# 指定したCSSに⼀致する要素が存在することを検証する
	expect(page).to have_css "h2#subheading"
	# 指定したセレクタに⼀致する要素が存在することを検証する
	expect(page).to have_selector "ul li"
	# 現在のパスが指定されたパスであることを検証する
	expect(page).to have_current_path "/projects/new"
end
```

セレクタのスコープを制限することもできます。
その場合はCapybaraの`within`を使ってページの一部分に含まれる要素を操作します。

```html
<div id="node">
	<a href="http://nodejs.org">click here!</a>
</div>

<div id="rails">
	<a href="http://rubyonrails.org">click here!</a>
</div>
```

上のようなHTMLでは次のようにしてアクセスしたいclick here!のリンクを選択できます。

```ruby
within "#rails" do
	click_link "click here!"
end
```

もしテスト内で指定したセレクタに合致する要素が複数見つかり、Capybaraにあいまいだ（ambiguous）と怒られたら、`within`ブロックで要素を内包し、あいまいさをなくしてみてください。
また、Capybaraにはさまざまな`find`メソッドもあります。
これを使うと値を指定して特定の要素を取り出すこともできます。
たとえば次のような感じです。

```ruby
language = find_field("Programming language").value

expect(language).to eq "Ruby"

find("#fine_print").find("#disclaimer").click
find_button("Publish").click
```

ここで紹介したCapybaraのメソッドは、私が普段よく使うメソッドです。
ですが、テスト内で使用できるCapybaraの全機能を紹介したわけではありません。
全容を知りたい場合は[Capybara DSLのドキュメント](https://github.com/teamcapybara/capybara#the-dsl)を参照してください。また、このドキュメントを便利なリファレンスとして手元に置いておくのもいいでしょう。
これ以降の章でも、まだ紹介していない機能をもうちょっと使っていきます。

### システムスペックをデバッグする
Capybaraのコンソール出力を読めば、どこでテストが失敗したのか調査することができます。
ですが、それだけでは原因の一部分しかわからないことがときどきあります。
たとえば次のシステムスペックを見てください。
この場合、ユーザーはログインしていないのでテストは失敗します。

```ruby
# ゲストがプロジェクトを追加する
scenario "guest adds a project" do
	visit projects_path
	click_link "New Project"
end
```

ですが、出力結果を見ると本当の原因に関する手がかりが載っていません。
出力結果からわかることは、ページに要求されたリンクがない（Unable to find link “New Project”）ということだけです。

```log
Failures: 
	1) Projects guest adds a project
		Failure/Error: click_link "New Project"

		Capybara::ElementNotFound:
			Unable to find link "New Project"
			# 残りのスタックトレースは省略 ...
```

`driven_by`メソッドで`:rack_test`を指定した場合、Capybaraはヘッドレス ブラウザ（訳 注: UIを持たないブラウザ）を使ってテストを実行するため、処理ステップを1つずつ目で確認することはできません。
ですが、Railsがブラウザに返したHTMLを見ることはできます。
次のように`save_and_open_page`をテストが失敗する場所の直前に挟み込んでみてください。

```ruby
scenario "guest adds a project" do
	visit projects_path
	save_and_open_page
	click_link "New Project"
end
```

この状態でテストを実行すると、同じ理由でテストは失敗するものの、新しい情報が手に入ります。

```
File saved to
	/Users/asumner/code/examples/projects/tmp/capybara/capybara-201702142134493032685652.html.
Please install the launchy gem to open the file automatically.
	guest adds a project (FAILED - 1)
```

 コマンドライン、または使用しているマシンのGUIから保存されたファイルをブラウザ上で開いてください。

なるほど！ボタンにアクセスできないのは、ユーザーがログインしていなかったからですね。
プロジェクト一覧画面ではなく、ログイン画面にリダイレクトされていたわけです。

この機能はとても便利ですが、毎回手作業でファイルを開く必要はありません。
コンソール出力にも書いてあるとおり、__Launchy gem__ をインストールすれば自動的に開くようになります。
Gemfileにこのgemを追加し、`bundle install`を実⾏してください。

```Gemfile
group :test do
	# Railsで元から追加されている gem は省略
	
	gem 'launchy'
end
```

こうすれば`save_and_open_page`をSpec内で呼びだしたときに、Launchyが保存されたHTMLを自動的に開いてくれます。

ブラウザを起動する必要がない場合や、ブラウザを起動できないコンテナ環境などでは代わりに`save_page`メソッドを使ってください。
このメソッドを使うとHTMLファイルが`tmp/capybara`に保存されます。
ブラウザは起動しません。
`save_and_open_page`や`save_page`はデバッグ用のメソッドです。
システムスペックがパスするようになったら、それ以上のチェックは不要です。
なので、不要になったタイミングでこのメソッド呼び出しは全部削除してください。
削除しないままバージョン管理ツールにコミットしてしまわないよう注意しましょう。

### JavaScriptを使った操作をテストする
というわけで、私たちはシステムスペックを使ってプロジェクトを追加するUIが期待どおりに動作することを検証しました。
ここで紹介した方法を使えば、Web画面上の操作の大半をテストすることができます。ここまでCapybaraはシンプルなブラウザシミュレータ（つまりドライバ）を使って、テストに書かれたタスクを実行してきました。
このドライバは`Rack::Test`というドライバで、速くて信頼性が高いのですが、JavaScriptの実行はサポートしていません。
本書のサンプルアプリケーションでは1箇所だけJavaScriptに依存する機能があります。それはタスクの隣にあるチェックボックスをクリックするとそのタスクが完了状態になる、という機能です。
新しいスペックを書いてこの機能をテストしてみましょう。
システムスペックのジェネレータを使うか、もしくは自分の手で次のような`spec/system/tasks_spec.rb`という新しいファイルを追加してください。

```ruby:spec/system/tasks_spec.rb
require 'rails_helper'

RSpec.describe "Tasks", type: :system do
	# ユーザーがタスクの状態を切り替える
	scenario "user toggles a task", js: true do
		user = FactoryBot.create(:user)
		project = FactoryBot.create(:project,
			name: "RSpec tutorial",
			owner: user)
		task = project.tasks.create!(name: "Finish RSpec tutorial")

		visit root_path
		click_link "Sign in"
		fill_in "Email", with: user.email
		fill_in "Password", with: user.password
		click_button "Log in"

		click_link "RSpec tutorial"
		check "Finish RSpec tutorial"

		expect(page).to have_css "label#task_#{task.id}.completed"
		expect(task.reload).to be_completed

		uncheck "Finish RSpec tutorial"
		expect(page).to_not have_css "label#task_#{task.id}.completed"
		expect(task.reload).to_not be_completed
	end
end
```

最初に説明した`projects_spec.rb` ではbeforeブロックで`:rack_test`というドライバを指定していましたが、今回はこのあと別の方法でドライバを指定するため`driven_by`メソッドの記述はなくしています。

加えて、ここでは`js: true`というオプション（タグ）を渡しています。
このようにして、指定したテストに対してJavaScriptが使えるドライバを使うようにタグを付けておきます。

このサンプルアプリケーションでは __selenium-webdriver gem__ を使います。
このgemはRails 5.1以降のRailsにはデフォルトでインストールされていて、CapybaraでもデフォルトのJavaScriptドライバになっています。
使用するドライバは`driven_by`メソッドを使ってテストごとに変更することができます。
ですが、私は可能な限りシステム全体の共通設定とします。
今からその共通設定を追加していきましょう。
`rails_helper.rb`ファイルはきれいな状態を保っておきたいので、今回は独立したファイルに新しい設定を書くことにします。
RSpecはこのようなニーズをサポートしてくれているので、簡単な方法で有効化することができます。
`spec/rails_helper.rb`内にある以下の行のコメントを外してください。

```ruby:spec/rails_helper.rb
Dir[Rails.root.join('spec', 'support', '**', '*.rb')].sort.each { |f| require f }
```

こうするとRSpec関連の設定ファイルを`spec/support`ディレクトリに配置することができます。
Devise⽤の設定を追加したときのように、`spec/rails_helper.rb`内に直接設定を書き込まなくても済むのです。
それでは`spec/support/capybara.rb`という新しいファイルを作成し、次のような設定を追加しましょう。

```ruby:spec/support/capybara.rb
RSpec.configure do |config|
	config.before(:each, type: :system) do
		driven_by :rack_test
	end

	config.before(:each, type: :system, js: true) do
		driven_by :selenium_chrome
	end
end
```

ここではブラウザを使った基本的なテストでは高速な`Rack::Test`ドライバを使い、より複雑なブラウザ操作が必要な場合はJavaScriptが実行可能なドライバ（ここでは`selenium- webdriver`とChrome）を設定するようにしています。
どちらのドライバを使用するのかはタグで識別します。
デフォルトでは`Rack::Test`ドライバを使いますが、`js: true`のタグが付いているテストに限り、`selenium-webdriver`とChromeを使う設定になっています。

このほかにChromeとやりとりするインターフェースになる`ChromeDriver`が必要になります。
最新版の`selenium-webdriver`を使用すると自動的に適切なバージョンの`ChromeDriver` をダウンロードしてくれるため特別な設定は不要です。

さあ、これで準備が整いました。
実際にやってみましょう。
新しく作ったスペックを実行してみてください。

```bash
bundle exec rspec spec/system/tasks_spec.rb
```

設定がうまくいっていれば、Chromeのウィンドウが新しく立ち上がります（ただし、現在開いている他のウィンドウのうしろに隠れているかもしれません）。
ウィンドウ内ではサンプルアプリケーションが開かれ、目に見えない指がリンクをクリックし、フォームの入力項目を入力し、タスクの完了状態と未完了状態を切り替えます。
素晴らしい！
テストはパスしましたが、このテストの遅さに注目してください！
これはJavaScriptを実行するテストと、`Selenium`を使うテストのデメリットです。
一方で、セットアップは比較的簡単ですし、私たち自身が自分の手で操作する時間に比べたら、こちらのほうがまだ速いです。
ですが、もし1つのテストを実行するのに（私のマシンで）8秒以上かかるのであれば、この先JavaScriptを使う機能とそれに対応するテストを追加していったら、どれくらいの時間がかかるでしょうか？
JavaScriptドライバはだんだん速くなっているので、そのうちいつか`Rack::Test`と同等のスピードで実行できるようになるかもしれません。
ですが、それまでは必要なときにだけ、テスト上でJavaScriptを有効にする方が良い、というのが私からのアドバイスです。
最後の仕上げとして、私たちのシステムスペックではデフォルトで`Rack::Test`ドライバを使うようになったため、`projects_spec.rb`のbeforeブロックは削除しても大丈夫です。
`projects_spec.rb`からbeforeブロックを削除すると次のようになります。

```ruby:spec/system/projects_spec.rb
require 'rails_helper'

RSpec.describe "Projects", type: :system do
	# ユーザーは新しいプロジェクトを作成する
	scenario "user creates a new project" do
		user = FactoryBot.create(:user)

		visit root_path
		click_link "Sign in"
		fill_in "Email", with: user.email
		fill_in "Password", with: user.password
		click_button "Log in"

		expect {
			click_link "New Project"
			fill_in "Name", with: "Test Project"
			fill_in "Description", with: "Trying out Capybara"
			click_button "Create Project"

			expect(page).to have_content "Project was successfully created"
			expect(page).to have_content "Test Project"
			expect(page).to have_content "Owner: #{user.name}"
		}.to change(user.projects, :count).by(1)
	end
end
```

修正が終わったら、このスペックを実行してみてください。
```bash
bundle exec rspec spec/system/projects_spec.rb
```
beforeブロックを削除したあともこれまでと同様にChromeが起動することなくテストが完了すればOKです。

### ヘッドレスドライバを使う
テストの実行中にブラウザのウィンドウが開くのはあまり望ましくないケースがよくあります。
たとえば、GitHub Actionsや Travis CI、Jenkins のような __継続的インテグレーション（CI）__ 環境で実行する場合、先ほど作ったテストは __CLI（コマンドラインインターフェース）__ 上で実行する必要があります。
ですが、CLI上では新しいウィンドウを開くことはできません。
こういった要件に対応するため、Capybaraはヘッドレスドライバを使えるようになっています。
そこでChromeのヘッドレスモードを使ってテストを実行するよう、`spec/support/capybara.rb`を編集して次のようにドライバを変更してください。

```ruby:spec/support/capybara.rb
config.before(:each, type: :system, js: true) do
	driven_by :selenium_chrome_headless
end
```

さあこれでブラウザのウィンドウを開くことなく、JavaScriptを使うテストを実行できるようになりました。
実際にスペックを実⾏してみてください。

```bash
bundle exec rspec spec/system/tasks_spec.rb
```

設定がうまくいっていれば、Chromeのウィンドウが表示されることなくテストが完了するはずです。

### JavaScriptの完了を待つ
デフォルトではCapybaraはボタンが現れるまで2秒待ちます。
2秒待っても表示されなければ諦めます。
次のようにするとこの秒数を好きな長さに変更できます。

```ruby:spec/support/capybara.rb
Capybara.default_max_wait_time = 15
```

上の設定では待ち時間を15秒に設定しています。
この設定は`spec/support/capybara.rb`ファイルに書いてテストスイート全体に適用することができます（ただし、みなさんのアプリケーションが本書のサンプルアプリケーションと同じやり方でCapybaraを設定していることが前提になります。つまり、このファイルは`spec/rails_helper.rb`によって読み込まれる場所に配置される必要があります）。
しかし、この変更はテストスイートの実行がさらに遅くなる原因になるかもしれないので注意してください。
もしこの設定を変えたいと思ったら、必要に応じてその都度`using_wait_time`を使うようにしたほうがまだ良いかもしれません。
たとえば次のようなコードになります。

```ruby
# 本当に遅い処理を実行する
scenario "runs a really slow process" do
	using_wait_time(15) do
		# テストを実⾏する
	end
end
```

いずれにしても基本的なルールとして、処理の完了を待つためにRubyの`sleep`メソッドを使うのは避けてください 。

### スクリーンショットを使ってデバッグする
システムスペックでは`take_screenshot`メソッドを使って、テスト内のあらゆる場所でシミュレート中のブラウザの画像を作成することができます。
ただし、このメソッドはJavaScriptドライバ（本書でいうところの`selenium-webdriver`です）を使うテストでしか使用できない点に注意してください。

画像ファイルはデフォルトで`tmp/capybara`に保存されます。
また、テストが失敗したら、⾃動的にスクリーンショットが保存されます！
この機能はヘッドレスブラウザで実行している統合テストをデバッグするのに大変便利です。

### システムスペックとフィーチャスペック
システムスペックが導入されたのはRSpec Rails3.7からです。
そして、システムスペックはその背後でRails 5.1から導入されたシステムテストを利用しています。
それ以前はフィーチャスペック（feature specs）と呼ばれるRSpec Rails独自の機能を使って統合テストを書いていました。
フィーチャスペックは見た目も機能面もシステムスペックに非常によく似ています。

では、どちらのスペックを使うのが良いのでしょうか？
もし、みなさんがまだ統合テストを一度も書いたことがないのなら、フィーチャスペックではなく、システムスペックを使ってください。
ですが、フィーチャスペックも廃止されたわけではありません。
昔から保守されているRailsアプリケーションではフィーチャスペックを使い続けている可能性もあります。
そこで、このセクションでは簡単にシステムスペックとフィーチャスペックの違いを説明しておきます。
たとえば、この章の最初に紹介したシステムスペックのコード例をフィーチャスペックを使って書いた場合は次のようなコードになります。

```ruby:spec/features/projects_spec.rb
require 'rails_helper'

RSpec.feature "Projects", type: :feature do
	# ユーザーは新しいプロジェクトを作成する
	scenario "user creates a new project" do
		user = FactoryBot.create(:user)

		visit root_path
		click_link "Sign in"
		fill_in "Email", with: user.email
		fill_in "Password", with: user.password
		click_button "Log in"

		expect { 
			click_link "New Project"
			fill_in "Name", with: "Test Project"
			fill_in "Description", with: "Trying out Capybara"
			click_button "Create Project"

			expect(page).to have_content "Project was successfully created"
			expect(page).to have_content "Test Project"
			expect(page).to have_content "Owner: #{user.name}"
		}.to change(user.projects, :count).by(1)
	end
end
```

⼀⾒、システムスペックとほとんど違いがありませんが、次のような点が異なります。

- `spec/system`ではなく`spec/features`にファイルを保存する
- `describe`メソッドではなく`feature`メソッドを使う
- `type:`オプションに`:system`ではなく`:feature`を指定する

ですが、`scenario`メソッドの内部はシステムスペックと全く同じです。
このほかにもフィーチャスペックには以下のような違いがあります。

- `let`や`let!`のエイリアスとして`given`や`given!`が使える
- `before`のエイリアスとして`background`が使える
- スクリーンショットを撮る場合、`save_screenshot`は使えるが、`take_screenshot`は使えない
- テストが失敗してもスクリーンショットは自動的に保存されない（明示的に`save_screenshot`メソッドを呼び出す必要があります）

フィーチャスペックはまだ使えますが、レガシーな機能になりつつあるため、早めにシステムスペックに移行する方が良いと思います。
フィーチャスペックをシステムスペックに移行する場合は次のような手順に従ってください。

1. Rails5.1以上かつ、RSpec Rails 3.7以上になっていることを確認する
2. システムスペックで使用するCapybara、Selenium Webdriverといったgemはなるべく最新のものを使うようにアップデートする
3. `js: true`のタグが指定された場合にドライバが切り替わるように設定を変更する（この章で紹介した`spec/support/capybara.rb`を参照してください）
4. `spec/features`ディレクトリを`spec/system`にリネームする
5. 各スペックのタイプを`type: :feature`から`type: :system`に変更する
6. 各スペックで使われている`feature`を`describe`に変更する
7. 各スペックで使われている`background`を`before`に変更する
8. 各スペックで使われている`given`/`given!`を`let`/`let!`に変更する
9. 各スペックで使われている`scenario`を`it`に変更する（この変更は任意です）
10. `spec/rails_helper.rb`の`config.include`などで、`type: :feature`になっている設定があれば`type: :system`に変更する

移行作業が終わったらテストスイートを実行してみてください。
移行後のシステムスペックはきっとパスするはずです。

## リクエストスペックでAPIをテストする
最近ではRailsアプリケーションが外部向けAPIを持つことも増えてきました。
たとえば、RailsアプリケーションはJavaScriptで作られたフロントエンドやネイティブモバイルアプリケーション、サードパーティ製アドオンのバックエンドとしてAPIを提供することがあります。
こうしたAPIはこれまでにテストしてきたサーバーサイド出力によるUIに追加される形で提供されることもありますし、UIのかわりに提供されることもあります。
そして、みなさんのような開発者がAPIを利用し、顧客はAPIが高い信頼性を持っていることを望みます。
ですのでやはり、みなさんはAPIもテストしたくなるはずです！
堅牢で開発者に優しいAPIの作り方は本書の範疇を超えてしまいますが、APIのテストについてはそうではありません。
嬉しいことに、もしみなさんがここまでにコントローラスペックやシステムスペックの章を読んできたのであれば、APIをテストするために必要な基礎知識はすでに習得しています。

### リクエストスペックとシステムスペックの比較
最初に、こうしたテストはどのように使い分けるべきなのでしょうか？
JSON（またはXML）の出力はコントローラスペックで直接テストすることができます。

みなさん自身のアプリケーションでしか使われない専用のシンプルなメソッドであれば、この方法で十分かもしれません。
⼀⽅、より堅牢なAPIを構築するのであれば、第6章で説明したシステムスペックによく似た統合テストが必要になってきます。

ですが、違うところもいくつかあります。
RSpecの場合、今回の新しいAPI関連のテストは`spec/requests`ディレクトリに配置するのがベストです。
これまでに書いたシステムスペックとは区別しましょう。
リクエストスペックではCapybaraも使いません。
Capybaraはブラウザの操作をシミュレートするだけであり、プログラム上のやりとりは特にシミュレートしないからです。
かわりに、コントローラのレスポンスをテストする際に使ったHTTP動詞に対応するメソッド（get 、post 、delete 、patch）を使います。
本書のサンプルアプリケーションにはユーザーのプロジェクト一覧にアクセスしたり、新しいプロジェクトを作成したりするための簡単なAPIが含まれています。
どちらのエンドポイントもトークンによる認証を使います。
サンプルコードは`app/controllers/api/projects_controller.rb`で確認できます。
あまり難しいことはやっていませんが、先ほども述べたとおり、本書はテストの本であって、堅牢なAPIを設計するための本ではありません。

### GETリクエストをテストする
最初の例では、最初に紹介したエンドポイントにフォーカスします。
このエンドポイントは認証完了後、クライアントにユーザーのプロジェクト一覧を含むJSONデータを返します。
RSpecにはリクエストスペック用のジェネレータがあるので、これを使ってどういったコードが作成されるのか見てみましょう。
コマンドラインから次のコマンドを実行してください。

```bash
bin/rails g rspec:request projects_api 
```

新しく作られた`spec/requests/projects_apis_spec.rb`を開き、中を見てください。

```ruby:spec/requests/projects_apis_spec.rb
require 'rails_helper'

RSpec.describe "ProjectsApis", type: :request do
	describe "GET /projects_apis" do
		it "works! (now write some real specs)" do
			get projects_apis_path

			expect(response).to have_http_status(200)
		end
	end
end
```

一見すると、コントローラスペックにそっくりですね。
しかし、すぐに思いますが、リクエストスペックではコントローラスペック以上にできることがたくさんあります。

RSpecはファイル名を複数形にしていますが、APIが複数形になるのはちょっと不自然なように思います（つまり、project APIsにするか、project APIにするか）。
なので、私はいつも最初にファイル名をリネームします。
というわけで、ファイル名を`spec/requests/projects_api_spec.rb`に変更し、新しいテストを追加してください。

```ruby:spec/requests/projects_api_spec.rb
require 'rails_helper'

RSpec.describe 'Projects API', type: :request do
	# 1件のプロジェクトを読み出すこと
	it 'loads a project' do
		user = FactoryBot.create(:user)
		FactoryBot.create(:project, name: "Sample Project")
		FactoryBot.create(:project, name: "Second Sample Project", owner: user)

		get api_projects_path, params: {
			user_email: user.email,
			user_token: user.authentication_token
		}

		expect(response).to have_http_status(:success)

		json = JSON.parse(response.body)
		expect(json.length).to eq 1

		project_id = json[0]["id"]
		get api_project_path(project_id), params: {
			user_email: user.email,
			user_token: user.authentication_token
		}

		expect(response).to have_http_status(:success)

		json = JSON.parse(response.body)

		expect(json["name"]).to eq "Second Sample Project"

		# などなど
	end
end
```

上のサンプルコードはコントローラスペックっぽさが薄れ、システムスペックっぽいパターンになっています。
この新しいスペックがリクエストスペックです。
最初はサンプルデータを作成しています。
ここでは1人のユーザーと2件のプロジェクトを作成しています。
一方のプロジェクトは先ほどのユーザーがオーナーで、もうひとつのプロジェクトは別のユーザーがオーナーになっています。

次に、HTTP GETを使ったリクエストを実行しています。
コントローラスペックと同様、ルーティング名に続いてパラメータ（params）を渡しています。
このAPIではユーザーのメールアドレスとサインインするためのトークンが必要になります。
パラメータにはこの2つの値を含めています。
ですが、コントローラスペックとは異なり、今回は好きなルーティング名を何でも使うことができます。
リクエストスペックはコントローラに結びつくことはありません。
これはコントローラスペックとは異なる点です。
なので、テストしたいルーティング名をちゃんと指定しているか確認する必要も出てきます。
それから、テストは返ってきたデータを分解し、取得結果を検証します。
データベースには2件のプロジェクトが格納されていますが、このユーザーがオーナーになっているのは1件だけです。
そのプロジェクトのIDを取得し、2番目のAPIコールでそれを利用します。
このAPIは1件のプロジェクトに対して、より多くの情報を返すエンドポイントです。
このAPIはコールするたびに再認証が必要になる点に注意してください。
ですので、メールアドレスとトークンは毎回パラメータとして渡す必要があります。
最後に、このAPIコールで返ってきたJSONデータをチェックし、そのプロジェクト名とテストデータのプロジェクト名が一致するか検証しています。
そしてここではちゃんと一致します。

### POSTリクエストをテストする
次のサンプルコードではAPIにデータを送信しています。

```ruby:spec/requests/projects_api_spec.rb
require 'rails_helper'

RSpec.describe 'Projects API', type: :request do

	# 最初のサンプルコードは省略 ...

	# プロジェクトを作成できること
	it 'creates a project' do
		user = FactoryBot.create(:user)

		project_attributes = FactoryBot.attributes_for(:project)

		expect {
			post api_projects_path, params: {
				user_email: user.email,
				user_token: user.authentication_token,
				project: project_attributes
			}
		}.to change(user.projects, :count).by(1)

		expect(response).to have_http_status(:success)
	end
end
```

やはりここでもサンプルデータの作成から始まっています。
今回は1人のユーザーと有効なプロジェクトの属性を集めたハッシュが必要です。
それからアクションを実行して期待どおりの変化が発生するかどうか確認しています。
この場合はユーザーが持つ全プロジェクトの件数が1件増えることを確認します。
今回のアクションはプロジェクトAPIにPOSTリクエストを送信することです。
認証用のパラメータを送信する点はGETリクエストの場合と同じですが、今回はさらにプロジェクトの属性も含んでいます。
それから最後にレスポンスのステータスをチェックしています。

### コントローラスペックをリクエストスペックで置き換える
ここまで見てきたサンプルコードではAPIをテストすることにフォーカスしていました。
しかしAPIに限らず、第5章で作成したコントローラスペックをリクエストスペックで置き換えることも可能です。
既存のHomeコントローラのスペックを思い出してください。
このスペックは簡単にリクエストスペックに置き換えることができます。
`spec/requests/home_spec.rb`にリクエストスペックを作成し、次のようなコードを書いてください。

```ruby:spec/requests/home_spec.rb
require 'rails_helper'

RSpec.describe "Home page", type: :request do
	# 正常なレスポンスを返すこと
	it "responds successfully" do
		get root_path
		expect(response).to be_successful
		expect(response).to have_http_status "200"
	end
end
```

もう少し複雑な例も見てみましょう。
たとえばProjectコントローラのcreateアクションのテストは次のようなリクエストスペックに書き換えることができます。
`spec/requests/projects_spec.rb`を作成してテストコードを書いてみましょう（前述の`projects_api_spec.rb`とはファイル名が異なる点に注意してください）。

```ruby:spec/requests/projects_spec.rb
require 'rails_helper'

RSpec.describe "Projects", type: :request do
	# 認証済みのユーザーとして
	context "as an authenticated user" do
		before do
			@user = FactoryBot.create(:user)
		end

		# 有効な属性値の場合
		context "with valid attributes" do
			# プロジェクトを追加できること
			it "adds a project" do
				project_params = FactoryBot.attributes_for(:project)
				sign_in @user

				expect {
					post projects_path, params: { project: project_params }
				}.to change(@user.projects, :count).by(1)
			end
		end

		# 無効な属性値の場合
		context "with invalid attributes" do
			# プロジェクトを追加できないこと
			it "does not add a project" do
				project_params = FactoryBot.attributes_for(:project, :invalid)
				sign_in @user
				expect {
					post projects_path, params: { project: project_params }
				}.to_not change(@user.projects, :count)
			end
		end
	end
end
```

コントローラスペックとの違いはごくわずかです。
リクエストスペックではProjectコントローラのcreateアクションに直接依存するのではなく、具体的なルーティング名を指定してPOSTリクエストを送信します。

それ以外はコントローラスペックとまったく同じコードです。
API⽤のコントローラとは異なり、このコントローラでは標準的なメールアドレスとパスワードの認証システムを使っています。
なので、この仕組みがちゃんと機能するように、ちょっとした追加の設定がここでも必要になります。
今回はDeviseのsign_inヘルパーをリクエストスペックに追加します。
[Deviseのwikiページにあるサンプルコード](https://github.com/plataformatec/devise/wiki/How-To:-sign-in-and-out-a-user-in-Request-type-specs-(specs- tagged-with-type:-:request))を参考にしてこの設定を有効にしてみましょう。
まず、`spec/support/request_spec_helper.rb`という新しいファイルを作成します。

```ruby:spec/support/request_spec_helper.rb
module RequestSpecHelper
	include Warden::Test::Helpers

	def self.included(base)
		base.before(:each) { Warden.test_mode! }
		base.after(:each) { Warden.test_reset! }
	end

	def sign_in(resource)
		login_as(resource, scope: warden_scope(resource))
	end

	def sign_out(resource)
		logout(warden_scope(resource))
	end

	private

	def warden_scope(resource)
		resource.class.name.underscore.to_sym
	end
end
```

それから`spec/rails_helper.rb`を開き、先ほど作成したヘルパーメソッドをリクエストスペックで使えるようにします。

```ruby:spec/rails_helper.rb
# 最初のセットアップコードは省略 ...

RSpec.configure do |config|
	# 他の設定は省略 ...

	# Devise のヘルパーメソッドをテスト内で使⽤する
	config.include Devise::Test::ControllerHelpers, type: :controller
	config.include RequestSpecHelper, type: :request
end
```

`bundle exec rspec spec/requests`コマンドを実行して新しく追加したテストを動かしてみてください。
いつものようにエクスペクテーションをいろいろ変えて遊んでみましょう。
テストを失敗させ、それからまた元に戻してみましょう。
さあこれでみなさんはコントローラスペックとリクエストスペックの両方を書けるようになりました。

では、どちらのテストを書くべきでしょうか？
第5章でもお話ししたとおり、私はコントローラスペックよりも統合スペック（システムスペックとリクエストスペック）を強くお勧めします。
なぜならRailsにおけるコントローラスペックは重要性が低下し、かわりにより高いレベルのテストの重要性が上がってきているためです。
こうしたテストの方がアプリケーションのより広い範囲をテストすることができます。

とはいえ、コントローラレベルのテストを書く方法は人によってさまざまです。
なので、とりあえずどちらのテストも書けるように練習しておいた方が良いと思います。
実際、みなさんはこれでどちらのテストも書けるようになりました。

## スペックをDRYに保つ
みなさんがここまでに学んだ知識を使って自分のアプリケーションにテストを書いていけば、しっかりしたテストスイートがきっとできあがるはずです。

しかし、コードはたくさん重複しています。
いわば、 __Don’t Repeat Yourself (DRY)__ 原則を破っている状態です。
アプリケーションコードと同様、テストスイートをきれいにすることも検討しましょう。

この章ではRSpecが提供しているツールを使い、複数のテストをまたがってコードを共有する⽅法を説明します。
また、どのくらいDRYになるとDRYすぎるのかについても説明します。

### サポートモジュール
ここまでに作ったシステムスペックをあらためて見てみましょう。
今のところ、たった2つのスペックしか書いていませんが、どちらのテストにもユーザーがアプリケーションにログインするステップが含まれています。

```ruby
	visit root_path
	click_link "Sign in"
	fill_in "Email", with: user.email
	fill_in "Password", with: user.password
	click_button "Log in"
```

もしログイン処理が変わったらどうなるでしょうか？
たとえば、ボタンのラベルが変わるような場合です。

こんな単純な変更であっても、いちいち全部のテストコードを変更しなければいけません。
この重複をなくすシンプルな方法は __サポートモジュール__ を使うことです。
ではコードを新しいモジュールに切り出してみましょう。
`spec/support`ディレクトリに`login_support.rb`という名前のファイルを追加し、次のようなコードを書いてください。

```ruby:spec/support/login_support.rb
module LoginSupport

	def sign_in_as(user)
		visit root_path
		click_link "Sign in"
		fill_in "Email", with: user.email
		fill_in "Password", with: user.password
		click_button "Log in"
	end
end

RSpec.configure do |config|
	config.include LoginSupport
end
```

このモジュールにはメソッドがひとつ含まれます。
コードの内容は元のテストで重複していたログインのステップです。
モジュールの定義のあとには、RSpecの設定が続きます。
ここでは`RSpec.configure`を使って新しく作ったモジュールを`include`しています。
これは必ずしも必要ではありません。
テスト毎に明示的にサポートモジュールを`include`する方法もあります。
たとえば次のような感じです。

```ruby:spec/system/projects_spec.rb
require 'rails_helper'

RSpec.describe "Projects", type: :system do
	include LoginSupport

	# ユーザーは新しいプロジェクトを作成する
	scenario "user creates a new project" do
		# ... 
	end
end
```

これでログインのステップが重複している2つのスペックをシンプルにすることができます。
また、この先で同じステップが必要になるスペックでも、このヘルパーメソッドを使うことができます。
たとえば、プロジェクトのシステムスペックは次のように書き換えられます。

```ruby:spec/system/projects_spec.rb
require 'rails_helper'

RSpec.describe "Projects", type: :system do
	# ユーザーは新しいプロジェクトを作成する
	scenario "user creates a new project" do
		user = FactoryBot.create(:user)
		sign_in_as user

		expect {
			click_link "New Project"
			fill_in "Name", with: "Test Project"
			fill_in "Description", with: "Trying out Capybara"
			click_button "Create Project"
		}.to change(user.projects, :count).by(1)

		expect(page).to have_content "Project was successfully created"
		expect(page).to have_content "Test Project"
		expect(page).to have_content "Owner: #{user.name}"
	end
end
```

共通のワークフローをサポートモジュールに切り出す方法は、コードの重複を減らすお気に入りの方法の1つで、とくに、システムスペックでよく使います。
モジュール内のメソッド名は、コードを読んだときに目的がぱっとわかるような名前にしてください。
もしメソッドの処理を理解するために、いちいちファイルを切り替える必要があるのなら、それはかえってテストを不便にしてしまっています。

ここで適用したような変更は過去にもやっています。
それが何だかわかりますか？
Deviseはログインのステップを完全に省略できるヘルパーメソッドを提供しています。
これを使えば、特定のユーザーに対して即座にセッションを作成できます。
これを使えばUIの操作をシミュレートするよりずっと速いですし、ユーザーがログイン済みになっていることがテストを実行する上での重要な要件になっている場合は大変便利です。
別の見方をすれば、ここでテストしたいのはプロジェクトの機能であって、ユーザーの機能やログインの機能ではない、ということもできます。
これを有効化するために `rails_helper.rb`を開き、他のDeviseの設定に続けて次のようなコードを追加してください（訳注: `Devise::Test::IntegrationHelpers` の行を追加します）。

```ruby:spec/rails_helper.rb
RSpec.configure do |config|
	# 他の設定は省略 ... 
	
	# Devise のヘルパーメソッドをテスト内で使⽤する
	config.include Devise::Test::ControllerHelpers, type: :controller
	config.include RequestSpecHelper, type: :request
	config.include Devise::Test::IntegrationHelpers, type: :system
end
```

これで今回独自に作った`sign_in_as`メソッドを呼び出す部分は、Deviseの`sign_in`ヘルパーで置き換えることができます。

```ruby:spec/system/projects_spec.rb
require 'rails_helper'

RSpec.describe "Projects", type: :system do
	# ユーザーは新しいプロジェクトを作成する
	scenario "user creates a new project" do
		user = FactoryBot.create(:user)
		sign_in user

		# 残りのシナリオが続く ...

	end
end
```

ではシステムスペックを実行して、何が起きるか見てみましょう。

```
Projects
	user creates a new project (FAILED - 1)
	
Failures:
	1) Projects user creates a new project
		Failure/Error: click_link "New Project"

		Capybara::ElementNotFound:
			Unable to find link "New Project"

		# スタックトレースは省略 ...
```

いったい何が起こったかわかりますか？
もしわからなければ、`save_and_open_page`メソッドを各スペックで失敗している`click_link`メソッドの直前で呼び出してください（訳注： 真っ白の画面が立ち上がりますが、後述する理由により、これは想定通りの挙動です）。
これはどうやら独自に作ったログインヘルパーと、ヘルパーに切り出す前の元のステップでは、ログイン後にユーザーのホームページに遷移する副作用があったようです。
しかし、Deviseのヘルパーメソッドではセッションを作成するだけなので、どこからワークフローを開始するのかテスト内で明示的に記述しなければなりません（訳注: `sign_in user`に続けて、`visit root_path` を追加します）。

```ruby:spec/system/projects_spec.rb
require 'rails_helper'

RSpec.describe "Projects", type: :system do
	# ユーザーは新しいプロジェクトを作成する
	scenario "user creates a new project" do
		user = FactoryBot.create(:user)
		sign_in user

		visit root_path

		# 残りのシナリオが続く ...

	end
end
```

このあとも同じようなコードを書いていく点に注意してください。
独自のサポートメソッドのような仕組みを利用する場合、テスト内で明示的に次のステップを記述するのは基本的によい考えです。
そうすることで、ワークフローが文書化されます。
繰り返しになりますが、今回のサンプルコードではユーザーがログイン済みになっていることは、あくまでセットアップ上の要件にすぎません。
ログインのステップ自体はテスト上の重要な機能になっているわけではない、という点を押さえておきましょう。
今回使ったDeviseのヘルパーメソッドはこのあとのテストでも使っていきます。

### letで遅延読み込みする
私たちはここまでに`before`ブロックを使ってテストをDRYにしてきました。
`before`ブロックを使うと`describe`や`context`ブロックの内部で、各テストの実行前に共通のインスタンス変数をセットアップできます。

この方法も悪くはないのですが、まだ解決できていない問題が2つあります。
第一に、`before`の中に書いたコードは`describe`や`context`の内部に書いたテストを実行するたびに毎回実行されます。
これはテストに予期しない影響を及ぼす恐れがあります。
また、そうした問題が起きない場合でも、使う必要のないデータを作成してテストを遅くする原因になることもあります。

第二に、要件が増えるにつれてテストの可読性を悪くします。
こうした問題に対処するため、RSpecは`let`というメソッドを提供しています。
`let`は呼ばれたときに初めてデータを読み込む、__遅延読み込み__ を実現するメソッドです。

`let`は`before`ブロックの外部で呼ばれるため、セットアップに必要なテストの構造を減らすこともできます。
`let`の使い方を説明するために、タスクモデルのモデルスペックを作成してみましょう。
このスペックはまだ作成していませんでした。
`rspec:model`ジェネレータを使うか、`spec/models`に自分でファイルを作るかして、スペックファイルを作成してください。
（ジェネレータを使う場合は、タスク用の新しいファクトリも作られるはずです。）
それから次のようなコードを書いてください。

```ruby:spec/models/task_spec.rb
require 'rails_helper'

RSpec.describe Task, type: :model do
	let(:project) { FactoryBot.create(:project) }

	# プロジェクトと名前があれば有効な状態であること
	it "is valid with a project and name" do
		task = Task.new(
			project: project,
			name: "Test task",
		)

		expect(task).to be_valid
	end

	# プロジェクトがなければ無効な状態であること
	it "is invalid without a project" do
		task = Task.new(project: nil)
		task.valid?

		expect(task.errors[:project]).to include("must exist")
	end

	# 名前がなければ無効な状態であること
	it "is invalid without a name" do
		task = Task.new(name: nil)
		task.valid?

		expect(task.errors[:name]).to include("can't be blank")
	end
end
```

今回は4行目にある`let`を使って必要となるプロジェクトを作成しています。
しかし、プロジェクトが作成されるのはプロジェクトが必要になるテストだけです。

最初のテストはプロジェクトを作成します。
なぜなら9⾏⽬でprojectが呼ばれるからです。

projectは4行目の`let`で作られた値を呼び出します。
`let`は新しいプロジェクトを作成します。
テストの実行が終わると、12行目以降のテストではプロジェクトが取り除かれます。
他の2つのテストではプロジェクトを使いません。

実際、テストは「プロジェクトがなければ無効な状態であること」というテストなので、本当にプロジェクトがいらないのです。
なので、この2つのテストではプロジェクトはまったく作成されません。

`let`を使う場合はちょっとした違いがあります。
beforeブロックでテストデータをセットアップする際は、インスタンス変数に格納していたことを覚えていますか？
`let`を使ったデータに関してはこれが当てはまりません。

なので、9行目を見てみると、`@project`ではなく、`project`でデータを呼び出しています。
`let`は必要に応じてデータを作成するので、注意しないとトラブルの原因になることもあります。
たとえば、メモ（Note）のモデルスペックをファクトリと`let`を使ってリファクタリングしてみましょう。

```ruby:spec/models/note_spec.rb
require 'rails_helper'

RSpec.describe Note, type: :model do
	let(:user) { FactoryBot.create(:user) }
	let(:project) { FactoryBot.create(:project, owner: user) }

	# ユーザー、プロジェクト、メッセージがあれば有効な状態であること
	it "is valid with a user, project, and message" do
		note = Note.new(
			message: "This is a sample note.",
			user: user,
			project: project,
		)
		
		expect(note).to be_valid
	end

	# メッセージがなければ無効な状態であること
	it "is invalid without a message" do
		note = Note.new(message: nil) 
		note.valid?

		expect(note.errors[:message]).to include("can't be blank")
	end

	# ⽂字列に⼀致するメッセージを検索する
	describe "search message for a term" do
		let(:note1) {
			FactoryBot.create(:note,
				project: project,
				user: user,
				message: "This is the first note.", 
			)
		}

		let(:note2) {
			FactoryBot.create(:note,
				project: project,
				user: user,
				message: "This is the second note.",
			) 
		}

		let(:note3) {
			FactoryBot.create(:note,
				project: project,
				user: user,
				message: "First, preheat the oven.",
			)
		}

		# ⼀致するデータが⾒つかるとき
		context "when a match is found" do
			# 検索⽂字列に⼀致するメモを返すこと
			it "returns notes that match the search term" do
				expect(Note.search("first")).to include(note1, note3)
			end
		end

		# ⼀致するデータが1件も⾒つからないとき
		context "when no match is found" do
			# 空のコレクションを返すこと
			it "returns an empty collection" do
				expect(Note.search("message")).to be_empty
			end
		end
	end
end
```

コードがちょっときれいになりましたね。
なぜならbeforeブロックでインスタンス変数をセットアップする必要がなくなったからです。
実行してみると一発でテストがパスします！
しかし1つ問題があります。
ためしに`returns an empty collection`のテストで次の一行（訳 注: `expect(Note.count).to eq 3`）を追加してみましょう。

```ruby:spec/models/note_spec.rb
# ⼀致するデータが1件も⾒つからないとき
context "when no match is found" do
	# 空のコレクションを返すこと
	it "returns an empty collection" do
		expect(Note.search("message")).to be_empty
		expect(Note.count).to eq 3
	end
end
```

続けてスペックを実行します。
```
Failures:
	1) Note search message for a term when no match is found returns an empty collection
		Failure/Error: expect(Note.count).to eq 3
			expected: 3
			got: 0
			
			(compared using ==)
		# ./spec/models/note_spec.rb:56:in `block (4 levels) in <top (required)>'
```
