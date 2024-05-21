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