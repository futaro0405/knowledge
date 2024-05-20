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

