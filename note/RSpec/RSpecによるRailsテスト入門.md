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

### rspec binstubを使ってコマンドを短くする
binstubを作成して短いコマンドで実行できるようにする

```bash
bundle binstubs rspec-core
```

このコマンドを実行することでbinディレクトリ内にrspecの実行ファイルが作成される。

### ジェネレータ
`rails generate`コマンドを使ってコードを追加する際にRSpec用のファイルも作ってもらうように設定する。
その他も不要なファイルを作成されないようにする。

```ruby:config/application.rb
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
このコードを書くとspec全体でファクトリが使えるようになる。

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
Homeコントローラはまだサインインしていない人のために、アプリケーションのホームページを返す仕事です。

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
テストスイートにこのヘルパーモジュールを組み込みましょう。
`spec/rails_helper.rb`を開き、次のような設定を追加してください。

```ruby:spec/rails_helper.rb
RSpec.configure do |config|
	# 設定ブロックの他の処理は省略 ...

	# コントローラスペックで Devise のテストヘルパーを使⽤する
	config.include Devise::Test::ControllerHelpers, type: :controller
end
```

この状態でテストを実行してもまだ失敗します。
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
`have_http_status`マッチャはすでに使っていますし、302というレスポンスコードもちょっと前の失敗メッセージに出てきました。
2つ目のスペックでは`redirect_to`という新しいマッチャを使っています。
ここではコントローラが認証されていないリクエストの処理を中断し、Deviseが提供しているログイン画面に移動させていることを検証しています。
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
この属性値はユーザーがプロジェクトの編集画面で入力する値を想定したものです。
`FactoryBot.attributes_for(:project)`はプロジェクトファクトリからテスト用の属性値をハッシュとして作成します。
ここではテストの結果をわかりやすくするために、ファクトリに定義されたnameのデフォルト値を独自の値で上書きしています。
それからユーザーのログインをシミュレートし、元のプロジェクトのidと一緒に新しいプロジェクトの属性値をparamsとしてPATCHリクエストで送信しています。
最後にテストで使った`@project`の新しい値を検証します。
`reload`メソッドを使うのはデータベース上の値を読み込むためです。
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
今回は認可されていないユーザーが他のユーザーのプロジェクトにアクセスしようとしたときのテストと同じ方法でテストデータをセットアップしています。
それから、テストの内部ではプロジェクトの名前が変わっていないことを最初に検証し、それから認可されていないユーザーがダッシュボード画面にリダイレクトされることを検証しています。
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

		# サインイン画面にリダイレクトすること
		it "redirects to the sign-in page" do
			project_params = FactoryBot.attributes_for(:project)
			patch :update, params: { id: @project.id, project: project_params }
			expect(response).to redirect_to "/users/sign_in"
		end
	end
end
```

オブジェクトを作成し、それからコントローラを使った変更を試みます。
試みは失敗し、かわりにユーザーはログイン画面にリダイレクトさせられます。


ユーザーの入力を受け付けるアクションがもう1つあります。
次はdestroyアクションを見てみましょう。
これはupdateによく似ています。
認可されたユーザーであれば自分のプロジェクトは削除できますが、他のユーザーのプロジェクトは削除できません。
ゲストの場合は一切アクセスできません。

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

このテストに出てきた新しい点は、destroyメソッドにはDELETEリクエストでアクセスしているところぐらいです。

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

### HTML以外の出⼒を扱う
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
つまり、`application/json`の`Content-Type`でレスポンスを返してくれるのです。

ただし、厳密には`application/json; charset=utf-8`のように文字コード情報も一緒に付いてきます。
そこで、このテストでは`include`マッチャを使ってレスポンスの中に`application/json`が含まれていればテストがパスするようにしました。
意図した通りにテストできていることを確認するため、`application/json`を`text/html`に変えてみましょう。

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
この章ではRails標準のMinitestではなくRSpecを使うため、のちほど設定を変更します。

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
Devise用の設定を追加したときのように、`spec/rails_helper.rb`内に直接設定を書き込まなくても済むのです。
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
`spec/requests/projects_spec.rb`を作成してテストコードを書いてみましょう
（前述の`projects_api_spec.rb`とはファイル名が異なる点に注意してください）。

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

いったい何が起きてるんでしょうか？
このテストではnote1とnote2とnote3をどれも明示的に呼び出していません。
なので、データが作られず、`search`メソッドは何もデータがないデータベースに対して検索をかけます。
当然、検索しても何も見つかりません。
この問題は`search`メソッドを実行する前に`let`で作ったメモを強制的に読み込むようにハックすれば解決できます。

```ruby:spec/models/note_spec.rb
# 一致するデータが1件も見つからないとき
context "when no match is found" do
	# 空のコレクションを返すこと
	it "returns an empty collection" do
		note1
		note2
		note3

		expect(Note.search("message")).to be_empty
		expect(Note.count).to eq 3
	end
end
```

ですが、私に言わせれば、これはまさにハックです。
私たちは読みやすいスペックを書こうと努力しています。
新しく追加した行は読みやすくありません。
そこで、このようなハックをするかわりに、`let!`を使うことにします。

`let`とは異なり、`let!`は遅延読み込みされません。
`let!`はブロックを即座に実行します。
なので、内部のデータも即座に作成されます。
それでは、`let`を`let!`に書き換えましょう。

```ruby:spec/models/note_spec.rb
let!(:note1) {
	FactoryBot.create(:note,
		project: project,
		user: user,
		message: "This is the first note.",
	)
}

let!(:note2) {
	FactoryBot.create(:note,
		project: project,
		user: user,
		message: "This is the second note.",
	)
}

let!(:note3) {
	FactoryBot.create(:note,
		project: project,
		user: user,
		message: "First, preheat the oven.",
	)
}
```

これで先ほどの実験はパスしました。
しかし`let!`にまったく問題がないわけでもありません。

まず、この変更でテストデータが遅延読み込みされない元の状態に戻ってきてしまいました。
この点は今回大した問題にはなっていません。
テストデータを使う`example`は、どちらも正しく実行するために3件全部のメモが必要です。

とはいえ、多少注意する必要はあります。
なぜならすべてのテストが余計なデータを持つことになり、予期しない副作用を引き起こすかもしれないからです。
次に、コードを読む際は`let`と`let!`の見分けが付きにくく、うっかり読み間違えてしまう可能性があります。
繰り返しになりますが、私たちは読みやすいテストスイートを作ろうと努力しています。
もし、みなさんがこのわずかな違いを確認するためにコードを読み返すようであればbeforeとインスタンス変数に戻すことも検討してください。
別にテストで必要なデータを直接テスト内でセットアップしてしまっても、なんら問題はないのです。
こうした選択肢をいろいろ試し、あなたとあなたのチームにとって最適な方法を見つけてください。

### shared_context（contextの共有）
`let`を使うと複数のテストで必要な共通のテストデータを簡単にセットアップすることができます。
⼀⽅、`shared_context`を使うと複数のテストファイルで必要なセットアップを行うことができます。
タスクコントローラのスペックを見てください。
ここで各テストの前に実行されているbeforeブロックが`shared_context`に抜き出す候補のひとつになります。
ですがその前に、インスタンス変数のかわりに`let`を使うようにリファクタリングしておいた方が良さそうです。
というわけで、スペックを次のように変更してください。

```ruby:spec/controllers/tasks_controller_spec.rb
require 'rails_helper'

RSpec.describe TasksController, type: :controller do
	let(:user) { FactoryBot.create(:user) }
	let(:project) { FactoryBot.create(:project, owner: user) }
	let(:task) { project.tasks.create!(name: "Test task") }

	describe "#show" do
		# JSON形式でレスポンスを返すこと
		it "responds with JSON formatted output" do
			sign_in user
			get :show, format: :json,
			params: { project_id: project.id, id: task.id }
			expect(response.content_type).to include "application/json"
		end
	end

	describe "#create" do
		# JSON形式でレスポンスを返すこと
		it "responds with JSON formatted output" do
			new_task = { name: "New test task" }
			sign_in user
			post :create, format: :json,
			params: { project_id: project.id, task: new_task }

			expect(response.content_type).to include "application/json"
		end

		# 新しいタスクをプロジェクトに追加すること
		it "adds a new task to the project" do
			new_task = { name: "New test task" }
			sign_in user

			expect {
				post :create, format: :json,
				params: { project_id: project.id, task: new_task }
			}.to change(project.tasks, :count).by(1)
		end

		# 認証を要求すること
		it "requires authentication" do
			new_task = { name: "New test task" }

			# ここではあえてログインしない ...

			expect {
				post :create, format: :json,
				params: { project_id: project.id, task: new_task }
			}.to_not change(project.tasks, :count)
			expect(response).to_not be_successful
		end
	end
end
```

この最初のリファクタリングで重要な手段は次の通りです。
まずbeforeブロックの中にあった3行をブロックの外に移動します。
それからインスタンス変数を作成するかわりに`let`を使うように変更します。
そして、ファイル内のインスタンス変数を順番に書き換えます。
これはファイル内のインスタンス変数を「検索と置換」すればOKですね
（たとえば、`@project` は`project`に置換します）。
スペックを実行してテストが引き続きパスすることを確認してください。
次に、`spec/support/contexts/project_setup.rb`を新たに作成し次のような`context`を書いてください。

```ruby:spec/support/contexts/project_setup.rb
RSpec.shared_context "project setup" do
	let(:user) { FactoryBot.create(:user) }
	let(:project) { FactoryBot.create(:project, owner: user) }
	let(:task) { project.tasks.create!(name: "Test task") }
end
```

最後にコントローラスペックに戻り、最初に出てくる3行の`let`を次のような1行に置き換えてください。

```ruby:spec/controllers/tasks_controller_spec.rb
require 'rails_helper'

RSpec.describe TasksController, type: :controller do
	include_context "project setup"

	# show と create のテストが続く ...
```

もう一度スペックを実行してください。
テストは引き続きパスするはずです。
さあ、これでユーザーやプロジェクトやタスクにアクセスする必要があるスペックは`include_context "project setup"`という新しい`context`を`include`するだけで済みます。

### カスタムマッチャ
ここまではRSpecとrspec-railsが提供しているマッチャで全部の要件を満たすことができました。
そしてこの先もこのまま使い続けられそうな気がします。
ですが、もし自分のアプリケーションで何度も同じテストコードを書いているような場合は、自分で独自のカスタムマッチャを作成したほうが良いかもしれません。
今まで書いてきた既存のテストでは、カスタムマッチャの候補になりそうな部分が少なくともひとつあります。
タスクコントローラのテストではコントローラのレスポンスが`application/json`の`Content-Type`で返ってきていることを何度も検証しています。
RSpecの重要な信条のひとつは、人間にとっての読みやすさです。
ですので、カスタムマッチャを使って読みやすさを改善してみましょう。
ではこれから新しいマッチャを作っていきます。
まず、`spec/support/matchers/content_type.rb`というファイルを追加してください。
最初はシンプルに始めて、それから徐々にマッチャの機能を充実させていきます。

```ruby:spec/support/matchers/content_type.rb
RSpec::Matchers.define :have_content_type do |expected|
	match do |actual|
		content_types = {
			html: "text/html",
			json: "application/json",
		}
		actual.content_type.include? content_types[expected.to_sym]
	end
end
```

マッチャは必ず名前付きで定義され、その名前をスペック内で呼び出すときに使います。
今回は`have_content_type`という名前にしました。

マッチャには`match`メソッドが必要です。
典型的なマッチャは2つの値を利用します。
1つは期待される値（`expected value`、マッチャをパスさせるのに必要な結果）で、もう1つは実際の値（`actual value`、テストを実行するステップで渡される値）です。
ここでは、短く省略した`Content-Type`（`:html`または`:json`）で`content_types`ハッシュ内の`Content-Type`値を取り出し、それが実際の`Content-Type`に含まれることを期待します。
含まれていればテストはパスし、含まれていなければテストは失敗します。
ではこのカスタムマッチャを使ってみましょう。
タスクコントローラのスペックを開き、新しいマッチャを使うように変更します。

```ruby:spec/controllers/tasks_controller_spec.rb
require 'rails_helper'

RSpec.describe TasksController, type: :controller do
	include_context "project setup"

	describe "#show" do
		# JSON 形式でレスポンスを返すこと
		it "responds with JSON formatted output" do
			sign_in user
			get :show, format: :json,
			params: { project_id: project.id, id: task.id }
			expect(response).to have_content_type :json
		end
	end

	describe "#create" do
		# JSON 形式でレスポンスを返すこと
		it "responds with JSON formatted output" do
			new_task = { name: "New test task" }
			sign_in user
			post :create, format: :json,
			params: { project_id: project.id, task: new_task }
			expect(response).to have_content_type :json
		end

		# 残りのスペックが続く ...
	end
end
```

今から読みやすさを改善していきましょう。
まず最初に`Content-Type`のハッシュを`match`メソッドの外に切り出します。
RSpecではマッチャー内でヘルパーメソッドを定義し、コードをきれいにすることができます。

```ruby:spec/support/matchers/content_type.rb
RSpec::Matchers.define :have_content_type do |expected|
	match do |actual|
		begin
			actual.content_type.include? content_type(expected)
		rescue ArgumentError
			false
		end
	end

	def content_type(type)
		types = {
			html: "text/html",
			json: "application/json",
		}

		types[type.to_sym] || "unknown content type"
	end
end
```

もう一度テストを実行し、先ほどと同じ方法でテストを失敗させてみてください。
マッチャのコードはちょっと読みやすくなりましたが、出力はまだ読みやすくありません（訳 注: 同じ出力結果になります）。

この点も改善可能です。
RSpecのカスタムマッチャのDSLではmatchメソッドに加えて、失敗メッセージ（failure message）と、否定の失敗メッセージ（negated failure message）を定義するメソッドが用意されています。
つまり、`to`や`to_not`で失敗したときの報告方法を定義できるのです。

```ruby:spec/support/matchers/content_type.rb
RSpec::Matchers.define :have_content_type do |expected|
	match do |actual|
		begin
			actual.content_type.include? content_type(expected)
		rescue ArgumentError
			false
		end
	end

	failure_message do |actual|
		"Expected \"#{content_type(actual.content_type)} " +
		"(#{actual.content_type})\" to be Content Type " +
		"\"#{content_type(expected)}\" (#{expected})"
	end

	failure_message_when_negated do |actual|
		"Expected \"#{content_type(actual.content_type)} " +
		"(#{actual.content_type})\" to not be Content Type " +
		"\"#{content_type(expected)}\" (#{expected})"
	end

	def content_type(type)
		types = {
			html: "text/html",
			json: "application/json",
		}

		types[type.to_sym] || "unknown content type"
	end
end
```

テストは引き続きパスするはずです。
ですが、わざと失敗させてみると、出力内容が改善されています。

```
Failures:
	1) TasksController#show responds with JSON formatted output
			Failure/Error: expect(response).to_not have_content_type :json
			Expected "unknown content type (application/json; charset=utf-8)"
			to not be Content Type "application/json" (json)
```

ちょっと良くなりましたね。
結果として受け取ったレスポンス（`application/json`の`Content- Type`）はマッチャに渡した`Content-Type`を含んでいます。
ですが、（わざと失敗させているため）それは期待していないレスポンスです。
スペックに戻って`to_not`を`to`に戻し、それから`:json`のかわりに`:html`を渡してください。
スペックを実行してみましょう。

```
Failures:
	1) TasksController#show responds with JSON formatted
			output Failure/Error: expect(response).to have_content_type :html
			Expected "unknown content type (application/json; charset=utf-8)"
			to be Content Type "text/html" (html)
```

読みやすさが改善されました。
最後にもうひとつだけ改善しておきましょう。
`have_content_type`はちゃんと動作していますが、`be_content_type`でも動くようにすると良いかもしれません。
マッチャはエイリアスを作ることができます。
カスタムマッチャの最終バージョンはこのようになります。

```ruby:spec/support/matchers/content_type.rb
RSpec::Matchers.define :have_content_type do |expected|
	match do |actual|
		begin
			actual.content_type.include? content_type(expected)
		rescue ArgumentError
			false
		end
	end

	failure_message do |actual|
		"Expected \"#{content_type(actual.content_type)} " +
		"(#{actual.content_type})\" to be Content Type " +
		"\"#{content_type(expected)}\" (#{expected})"
	end

	failure_message_when_negated do |actual|
		"Expected \"#{content_type(actual.content_type)} " +
		"(#{actual.content_type})\" to not be Content Type " +
		"\"#{content_type(expected)}\" (#{expected})"
	end

	def content_type(type)
		types = {
			html: "text/html",
			json: "application/json",
		}

		types[type.to_sym] || "unknown content type"
	end
end

RSpec::Matchers.alias_matcher :be_content_type , :have_content_type
```

以上でカスタムマッチャは完成です。
これはいいアイデアでしょうか？
たしかにテストは確実に読みやすくなりました。
「レスポンスが`Content-Type JSON`になっていることを期待する（Expect response to be content type JSON ）」は、「レスポンスの`Content-Type`が`application/json`を含んでいる（Expect response content type to include application/json）」よりも改善されています。
ですが、新しいマッチャがあると、メンテナンスしなければならないコードが増えます。
カスタムマッチャにはその価値があるでしょうか？
その結論はあなたとあなたのチームで決める必要があります。
しかし何にせよ、これでみなさんは必要になったときにカスタムマッチャを作ることができるようになりました。

> カスタムマッチャ作りにハマっていく前に、`shoulda-matchers gem`も一度見ておいてください。このgemはテストをきれいにする便利なマッチャをたくさん提供してくれます。特に役立つのがモデルとコントローラのスペックです。みなさんが必要とするマッチャは、すでにこのgemで提供されているかもしれません。たとえば、第3章で書いたスペックのいくつかは、`it { is_expected.to validate_presence_of :name }`のように、短くシンプルに書くことができます。

### aggregate_failures（失敗の集約）
この章よりも前の章で、私はモデルとコントローラのスペックは各`example`につきエクスペクテーションを1つに制限したほうが良いと書きました。
一方、システムスペックとリクエストスペックでは、機能の統合がうまくできていることを確認するために、必要に応じてエクスペクテーションをたくさん書いても良い、と書きました。
ですが、単体テストでもいったんコーディングが完了してしまえば、この制限が必ずしも必要ないことがあります。
また、 統合テストでも`Launchy`（第6章参照）に頼ることなく、失敗したテストのコンテキストを収集すると役に立つことが多いです。
ここで問題となるのは、RSpecはテスト内で失敗するエクスペクテーションに遭遇すると、そこで即座に停止して失敗を報告することです。
残りのステップは実行されません。
しかし、RSpec 3.3では __aggregate_failures （失敗の集約）__ という機能が導入され、他のエクスペクテーションも続けて実行することができます。
これにより、そのエクスペクテーションが失敗した原因がさらによくわかるかもしれません。
まず、__aggregate_failures__ によって、低レベルのテストがきれいになるケースを見てみましょう。
第5章では`Project`コントローラを検証するためにこのようなテストを書きました。

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

		# 残りのスペックは省略 ...
	end
end
```

このふたつのテストでやっていることはほとんど同じです（第5章でもそのように説明しています）。
なので、どちらか一方を選択して、2つのテストを1つに集約することができます。
まずは説明のために、2つのテストを次のようにまとめてください。
その際、`sign_in`のステップをコメントアウトすることをお忘れなく（これは一時的な変更です）。

```ruby:spec/controllers/projects_controller_spec.rb
# 正常にレスポンスを返すこと
it "responds successfully" do
	# sign_in @user
	get :index
	expect(response).to be_successful
	expect(response).to have_http_status "200"
end
```

このスペックを実行すると予想通り最初のエクスペクテーションで失敗します。
2番目のエクスペクテーションも失敗するはずですが、このままでは絶対に実行されません。
そこで、この2つのエクスペクテーションを集約してみましょう。

```ruby:spec/controllers/projects_controller_spec.rb
# 正常にレスポンスを返すこと
it "responds successfully" do
	# sign_in @user
	get :index
	aggregate_failures do
		expect(response).to be_successful
		expect(response).to have_http_status "200"
	end
end
```

それからもう一度スペックを実行します。

```
Failures:
	1) ProjectsController#index as an authenticated user responds successfully
			Got 2 failures from failure aggregation block.
			# ./spec/controllers/projects_controller_spec.rb:14:in `block (4 levels) in <main>' 
			
	1.1) Failure/Error: expect(response).to be_successful
				expected `#<ActionDispatch::TestResponse:0x0000000119cf28
				...省略...>.successful?` to be truthy, got false
				# ./spec/controllers/projects_controller_spec.rb:15:in `block (5 levels) in <main>' 
	1.2) Failure/Error: expect(response).to have_http_status "200"
				expected the response to have status code 200 but it was 302
				# ./spec/controllers/projects_controller_spec.rb:16:in `block (5 levels) in <main>'
```

これでどちらのエクスペクテーションも実行されました。
そして、どうしてレスポンスが成功として返ってこなかったのか、追加の情報を得ることもできました。
`sign_in`の行のコメントを外し、テストをグリーンに戻してください。
私は統合テストで`aggregate_failures`をよく使います。
`aggregate_failures`を使えば、同じコードを何度も実行して遅くなったり、複雑なセットアップを複数のテストで共有したりせずに、テストが失敗した複数のポイントを把握することができます。
たとえば第6章で説明した、プロジェクトを作成するシナリオでエクスペクテーションの一部を集約してみましょう。

```ruby:spec/system/projects_spec.rb
require 'rails_helper'

RSpec.describe "Projects", type: :system do
	# ユーザーは新しいプロジェクトを作成する
	scenario "user creates a new project" do
		user = FactoryBot.create(:user)
		# この章で独⾃に定義したログインヘルパーを使う場合
		# sign_in_as user
		# もしくは Devise が提供しているヘルパーを使う場合
		sign_in user
		visit root_path

		expect {
			click_link "New Project"
			fill_in "Name", with: "Test Project"
			fill_in "Description", with: "Trying out Capybara"
			click_button "Create Project"
		}.to change(user.projects, :count).by(1)

		aggregate_failures do
			expect(page).to have_content "Project was successfully created"
			expect(page).to have_content "Test Project"
			expect(page).to have_content "Owner: #{user.name}"
		end
	end
end
```

こうすると、何らかの原因でフラッシュメッセージが壊れても、残りの2つのエクスペクテーションは続けて実行されます。
ただし、注意すべき点がひとつあります。
それは、`aggregate_failures`は失敗するエクスペクテーションにだけ有効に働くのであって、テストを実行するために必要な一般的な実行条件には働かないということです。
上の例でいうと、もし何かがおかしくなってNew Projectのリンクが正しくレンダリングされなかった場合は、Capybaraはエラーを報告します。

```
Failures:
	1) Projects user creates a new project
			Failure/Error: click_link "New Project"
			
	Capybara::ElementNotFound:
		Unable to find link "New Project"
```

言い換えるなら、ここでやっているのはまさに失敗するエクスペクテーションの集約であり、失敗全般を集約しているわけではありません。
とはいえ、私は`aggregate_failures`を気に入っており、自分が書くテストではこの機能をよく使っています。

### テストの可読性を改善する
統合テストはさまざまな構成要素を検証します。
UIも（JavaScriptとの実行ですらも）、アプリケーションロジックも、データベース操作も、ときには外部システムとの連携も、全部ひとつのテストで検証できます。
これはときに、だらだらしたテストコードになったり、テストコードが読みづらくなったり、何が起きているか理解するために手前や後ろのコードを行ったり来たりすることにつながります。
第6章で作成したテストを見直してください。
このテストではタスクの完了を実行するUIを検証しました。
その中でも特に、タスクの完了や未完了をマークするステップと、その処理が期待どおりに実行されたか検証するやり方を見直してみてください。

```ruby:spec/system/tasks_spec.rb
# ユーザーがタスクの状態を切り替える
scenario "user toggles a task", js: true do

	# セットアップとログインは省略 ...

	check "Finish RSpec tutorial"
	expect(page).to have_css "label#task_#{task.id}.completed"
	expect(task.reload).to be_completed

	uncheck "Finish RSpec tutorial"
	expect(page).to_not have_css "label#task_#{task.id}.completed"
	expect(task.reload).to_not be_completed
end
```

これぐらいであればそこまで可読性は悪くないかもしれません。
ですが、この機能が今後もっと複雑になったらどうでしょうか？

たとえば、タスクが完了したときにもっと詳細な情報を記録する必要が出てきた場合を考えてみてください。
タスクを完了状態にしたユーザーの情報や、いつタスクが完了したのか、といった情報を記録する必要が出てきた場合などです。
この場合、新しく追加された属性に対してそれぞれ、データベースの状態とUIの表示を確認するために新しい行を追加する必要が出てきます。
また、チェックボックスのチェックが外されたときは逆の検証を同じようにする必要があります。

こうなると、今はまだ小さいテストも、あっという間に長くなってしまいます。
このような場合は、スペックを読むときにコードの前後を行ったり来たりせずに済むよう、各ステップを独立したヘルパーメソッドに抽出することができます。
新しくエクスペクテーションを追加する場合は、テストコード内に直接埋め込むのではなく、このヘルパーメソッドに追加します。

これは「 __シングルレベルの抽象化を施したテスト（testing at a single level of abstraction）__ 」として知られるテクニックです。

このテクニックの基本的な考えはテストコード全体を、内部で何が起きているのか抽象的に理解できる名前を持つメソッドに分割することです。
あくまで抽象化が目的なので、内部の詳細を見せる必要はありません。
では、`spec/system/tasks_spec.rb`内のだらだらしたコードを次のように整理してみましょう。

```ruby:spec/system/tasks_spec.rb
require 'rails_helper'

RSpec.describe "Tasks", type: :system do
	let(:user) { FactoryBot.create(:user) }
	let(:project) {
		FactoryBot.create(:project,
		name: "RSpec tutorial",
		owner: user)
	}
	let!(:task) { project.tasks.create!(name: "Finish RSpec tutorial") }

	# ユーザーがタスクの状態を切り替える
	scenario "user toggles a task", js: true do
		sign_in user
		go_to_project "RSpec tutorial"

		complete_task "Finish RSpec tutorial"
		expect_complete_task "Finish RSpec tutorial"

		undo_complete_task "Finish RSpec tutorial"
		expect_incomplete_task "Finish RSpec tutorial"
	end

	def go_to_project(name)
		visit root_path
		click_link name
	end

	def complete_task(name)
		check name
	end

	def undo_complete_task(name)
		uncheck name
	end

	def expect_complete_task(name)
		aggregate_failures do
			expect(page).to have_css "label.completed", text: name
			expect(task.reload).to be_completed
		end
	end

	def expect_incomplete_task(name)
		aggregate_failures do
			expect(page).to_not have_css "label.completed", text: name
			expect(task.reload).to_not be_completed
		end
	end
end
```

テストをもっと読みやすくするために、この新バージョンでは何カ所かリファクタリングをしています。
まず、テストデータの作成はテスト内から上側の`let`と`let!`メソッドに移動させています。
それからテストの各ステップを別々のメソッドに切り出しました。
ユーザーとしてログインし、続いてテスト対象のプロジェクトに移動します。
それから最後に目的のステップを実⾏し、各ステップについて独⾃に作成したエクスペクテーションを実⾏します。
具体的にはタスクを完了済みにし、本当に完了済みになっているか確認します。
そして完了済みのタスクを元に戻し、今度は未完了になっているか確認します。
テストはとてもシンプルに読めるようになりました。
私たちが実際にどうやって必要なアクションを実⾏しているのかという詳細は、別のメソッドに追い出されています。
どうでしょう、よくなりましたか？
個⼈的には新しいテストはとても読みやすくなっている点が気に⼊っています。
もしかするとプログラミングを知らない⼈がこのテストを読んでも、何をやっているのかある程度理解できるかもしれません。
もしタスクを完了したり未完了にしたりする⽅法を変更する場合でも、変更を加えるのはヘルパーメソッドだけで済みます。
これも新バージョンの良いところです。
新しく作ったヘルパーメソッドは同じファイルの他のテストで再利⽤できる点もいいですね。
たとえば、もしタスクを追加したり削除したりするシナリオを追加する場合でも、このヘルパーメソッドを再利⽤できます（この新しいテストは演習問題としてみなさんにやってもらいます！）。
ですが、このアプローチについてはちょっと不満に感じている点もあります。
私はこの変更でテストデータを準備するために`let!`を使ったところがあまり好きではありません。
これは必ずしも「シングルレベルの抽象化を施したテスト」の良い効果とは⾔えないでしょう。
この点については、ファイルにさらにシナリオを追加していく際に、テストデータの作成⽅法を引き続き改善していけると思います。
また、私は過去にこのアプローチが過剰に使われているケースを⾒てきました。
過剰に使われてしまうと、ヘルパーメソッドが何をやって、何を検証しているのか理解するのにテストスイートの中⾝を詳細に確認しなければなりません。
私に⾔わせれば、こうなってしまうと可読性を上げるための努⼒が、かえって可読性を 下げることになっています。
私は「シングルレベルの抽象化を施したテスト」の考え⽅は好きです。
ですが、みなさんはRSpecやCapybaraに慣れるまで、必ずしも使う必要はないと考えています。
ここで覚えておいてほしいことは、アプリケーション側のコードと同様、テストスイートのコードも⾃分のスキルが向上するにつれて改善されていく、ということです。

## 速くテストを書き、速いテストを書く
プログラミングに関する格言の中で私が気に入っているものの1つは、「まず動かし、次に正しくし、それから速くする（Make it work, make it right, make it fast）」です。

最初のほうの章では、とりあえずテストが動くようにしました。
それから第8章ではテストをリファクタリングして、コードの重複をなくすテクニックを説明しました。

この章では先ほどの格言でいうところの速くするパートを説明します。
私は速いという用語を2つの意味で使っています。

1つはもちろん、スペックの実行時間です。
本書のサンプルアプリケーションとテストスイートは徐々に大きくなってきています。
このまま何もせずに開発を進めれば、テストはうんざりするぐらい遅くなっていくことでしょう。
よって目標としたいのは、RSpecの可読性や堅牢なテストスイートによってもたらされる安心感を損なうことなく、RSpecの実行時間を十分満足できる速さに保つことです。

そして、私が意図する2つめのスピードは、意味がわかりやすくてきれいなスペックを開発者としていかに素早く作るか、ということです。

### RSpecの簡潔な構文
ここまでに書いてきたスペックのいくつかをもう一度見直してみてください。
特に、モデルスペックに注目してみましょう。
私たちはこれまでいくつかのベストプラクティスに従い、テストにはわかりやすいラベルを付け、1つの`example`に1つのエクスペクテーションを書いてきました。
これらは全部目的があってやってきたことです。
ここまで見てきたような明示的なアプローチは、私がテストの書き方を学習したときのアプローチを反映しています。

こうしたアプローチを使えば、自分のやっていることが理解しやすいはずです。
しかし、RSpecにはキーストロークを減らしながらこうしたベストプラクティスを実践し続けられるテクニックがあります。

1つ前の章では、テストデータを宣言するオプションとして`let`があることを説明しました。
もう1つのメソッドである`subject`も同じように呼ばれますが、ユースケースがちょっと異なります。
`subject`はテストの対象物（subject）を宣言します。
そして、そのあとに続く`example`内で暗黙的に何度でも再利用することができます。
私たちは第3章からここまでずっと、`it`を長い記法で使い続けてきました。
長い記法とはすなわち、文字列としてテストの説明を自然言語で記述するアプローチのことです。
ですが、この`it`はただのRubyのメソッドです。
みなさんもすでに気づいているかもしれませんが、このメソッドはブロックを受け取り、そのブロックの中にはいくつかのテストのステップを含めることができます。
これはつまり、シンプルなテストケースであればテストコードを1行にまとめることができるかもしれないということです！
これを実現するために、ここではRSpecの`is_expected`メソッドを利用します。
`is_expected`は`expect`(`something`)によく似ていますが、こちらはワンライナーのテスト（1行で書くテスト）を書くために使われます。

`is_expected`を使うと、次のようなテストが

```ruby
	it "returns a user's full name as a string" do
		user = FactoryBot.build(:user)

		expect(user.name).to eq "Aaron Sumner" 
	end
```

以下のように少しだけ簡潔に書き換えることができます。

```ruby
subject(:user) { FactoryBot.build(:user) }
it { is_expected.to satisfy { |user| user.name == "Aaron Sumner" } }
```

このようにしても結果は同じです。
また、`subject`はあとに続くテストで暗黙的に再利用できるので、各`example`で何度も打ち直す必要がありません。
とはいえ、私は自分のテストスイートでこの簡潔な構文を使うことはそれほど多くありません。
また、`subject`が1つのテストでしか使われない場合も`subject`を使いません。
ですが、`Shoulda Matchers`と一緒に使うのは⼤好きです。
`Shoulda`というのはそれ⾃体が単体のテスティングフレームワークで、RSpecと完全に置き換えて使うことができるものでした。
`Shoulda` はすでに開発が⽌まっていますが、ActiveModelやActiveRecord、ActionControllerに使える豊富なマッチャのコレクションは独⽴したgemに切り出され、RSpec（もしくは`Minitest`）で利⽤することができます。
このgemを⼀つ追加すれば、3⾏から5⾏あるスペックを1〜 2⾏に減らすことができる場合があります。
`Shoulda Matchers`を使うには、まずgemを追加しなければなりません。
Gemfile内のテスト関係のgemのうしろに、このgemを追加してください。

```Gemfile
group :test do
	# Railsで元から追加されているgemは省略
	
	gem 'launchy' gem 'shoulda-matchers',
end
```

コマンドラインから`bundle`コマンドを実行したら、この新しいgemを使うようにテストスイートを設定する必要があります。
`spec/rails_helper.rb`を開き、ファイルの一番最後に以下のコードを追加してください。
ここでは、RSpecとRailsでShoulda Matchersを使うことを宣言しています。

```ruby:spec/rails_helper.rb
Shoulda::Matchers.configure do |config|
	config.integrate do |with|
		with.test_framework :rspec with.library :rails
	end
end
```

さあこれでスペックを短くすることができます。
Userモデルのスペックにある、4つのバリデーションのテストから始めましょう。
`Shoulda Matchers`を使えば、このテストがたった4行になります！

```ruby:spec/models/user_spec.rb
it { is_expected.to validate_presence_of :first_name }
it { is_expected.to validate_presence_of :last_name }
it { is_expected.to validate_presence_of :email }
it { is_expected.to validate_uniqueness_of(:email).case_insensitive }
```

ここでは`Shoulda Matchers`が提供する2つのマッチャ（`validate_presence_of`と`validate_uniqueness_of`）を使ってテストを書いています。
emailのユニークバリデーションはDeviseによって設定されているので、バリデーションは大文字と小文字を区別しないこと（not case sensitive）をスペックに伝える必要があります。
`case_insensitive` が付いているのはそのためです。
次にProjectモデルのスペックに注目してみましょう。
具体的には以前書いた、ユーザーは同じ名前のプロジェクトを複数持つことができないが、ユーザーが異なれば同じ名前のプロジェクトがあっても構わない、というテストです。
`Shoulda Matchers` を使えば、このテストを1個かつ1行のテストにまとめることができます。

```ruby:spec/models/project_spec.rb
it { is_expected.to validate_uniqueness_of(:name).scoped_to(:user_id) }
```

モデルをテス トファーストで開発するときによく使います。
たとえば、ウィジェット（widget ） という新しいモデルが出てきたとします。
そんなとき、私はスペックを開き、ウィジェットがどんな振る舞いを持つのか考えます。
それから次のようなテストを書きます。

```ruby
	it { is_expected.to validate_presence_of :name }
	it { is_expected.to have_many :dials }
	it { is_expected.to belong_to :compartment }
	it { is_expected.to validate_uniqueness_of :serial_number }
```

### エディタのショートカット
プログラミングを習得する上で非常に重要なことは、自分が使っているエディタを隅から隅まで理解することです。
私はコーディングするときは（そして執筆するときも）たいていAtomを使っています。
さらに、スニペットを作る構文も必要最小限は理解したので、テストを書くときによく使うコードもほとんどタイプせずに済ませることができます。
たとえば、`desc`と入力してタブキーを押すと、私のエディタは`describe...end` のブロックを作成します。
さらに、カーソルはブロック内に置かれ、適切な場所にコードを追加できるようになっています。
もしあなたもAtomを使っているのであれば、Everyday Rails RSpec Atom パッケージをインストールして私が使っているショートカットを試してみることができます。
全スニペットの内容を知りたい場合はパッケージのドキュメントを参照してください。
Atom以外のエディタを使っている場合は、多少時間をかけてでも用意されているショートカットを使えるようになってください。
また、最初から用意されているショートカットだけでなく、自分自身でショートカットを定義する方法も学習しておきましょう。
お決まりのコードをタイプする時間が少なくなればなるほど、時間あたりのビジネスバリューが増えていきます！

### モックとスタブ
モックとスタブの使用、そしてその背後にある概念は、それだけで大量の章が必要になりそうなテーマです（一冊の本になってもおかしくありません）。
インターネットで検索すると、正しい使い方や間違った使い方について人々が激しく議論する場面に出くわすはずです。
また、多くの人々が2つの用語を定義しようとしているのもわかると思います。
ただし、うまく定義できているかどうかは場合によりけりです。
私が一番気気に入っている定義は次の通りです。

- __モック（mock）__ は本物のオブジェクトのふりをするオブジェクトでテストのために使われます。モックは __テストダブル（test doubles）__ と呼ばれる場合もあります。モックはこれまでファクトリやPOROを使って作成したオブジェクトの代役を務めます（訳注：英語の “double” には「代役」や「影武者」の意味があります）。しかし、モックはデータベースにアクセスしない点が異なります。よって、テストにかかる時間は短くなります。
- __スタブ（stub）__ はオブジェクトのメソッドをオーバーライドし、事前に決められた値を返します。つまりスタブは、呼び出されるとテスト用に本物の結果を返すダミーメソッドです。スタブをよく使うのはメソッドのデフォルト機能をオーバーライドするケースです。特にデータベースやネットワークを使う処理が対象になります。

RSpecには多機能なモックライブラリが最初から用意されています。
みなさんはもしかすると、`Mocha`のようなその他のモックライブラリをプロジェクトで使ったことがあるかもしれません。
第4章以降でテストデータを作成するのに使ってきたFactoryBotにもスタブオブジェクトを作るメソッドが用意されています。
この項ではRSpec標準のモックライブラリに焦点を当てます。
例をいくつか見てみましょう。
メモ（Note）モデルでは`delegate`を使ってメモに`user_name`という属性を追加しました。
ここまでに学んだ知識を使うと、この属性がちゃんと機能していることをテストするために、次のようなコードを書くことができます。

```ruby:spec/models/note_spec.rb
	# 名前の取得をメモを作成したユーザーに委譲すること
	it "delegates name to the user who created it" do
		user = FactoryBot.create(:user, first_name: "Fake", last_name: "User") 
		note = Note.new(user: user) expect(note.user_name).to eq "Fake User" 
	end
```

このコードではUserオブジェクトを永続化する必要があります。
これはテストで使うfirst_nameとlast_nameというユーザーの属性にアクセスするためです。
この処理に必要な時間はほんのわずかです。
ですが、セットアップのシナリオが複雑になったりすると、わずかな時間もどんどん積み重なって無視できなくなるかもしれません。
モックはこのように、データベースにアクセスする処理を減らすためによく使われます。
さらに、このテストはNoteモデルのテストですが、Userモデルの実装を知りすぎています。
はたしてこのテストの中でUserモデルのnameがfirst_nameとlast_nameから導出されていることを意識する必要があるのでしょうか？
本来であれば関連を持つUserモデルがnameという文字列を返すことを知っていればいいだけのはずです。
以下はこのテストの修正バージョンです。
このコードではモックのユーザーオブジェクトと、テスト対象のメモに設定したスタブメソッドを使っています。

```ruby:spec/models/note_spec.rb
# 名前の取得をメモを作成したユーザーに委譲すること
it "delegates name to the user who created it" do
	user = double("user", name: "Fake User")
	note = Note.new

	allow(note).to receive(:user).and_return(user) 
	expect(note.user_name).to eq "Fake User"
end
```

ここでは永続化したユーザーオブジェクトをテストダブルに置き換えています。
テストダブルは本物のユーザーではありません。
実際、このオブジェクトを調べてみると、Doubleという名前のクラスになっていることに気づくはずです。
テストダブルはnameというリクエストに反応する方法しか知りません。
説明のためにエクスペクテーションをテストに1つ追加してみてください。

```ruby:spec/models/note_spec.rb
# 名前の取得をメモを作成したユーザーに委譲すること
it "delegates name to the user who created it" do
	user = double("user", name: "Fake User")
	note = Note.new

	allow(note).to receive(:user).and_return(user)
	expect(note.user_name).to eq "Fake User"
	expect(note.user.first_name).to eq "Fake"
end
```

このテストコードは元のコード（つまりモックに置き換える前のコード）であればパスしますが、このコードでは失敗します。

```
1) Note delegates name to the user who created it
	Failure/Error: expect(note.user.first_name).to eq "Fake"
	#<Double "user"> received unexpected message :first_name with
	(no args)
```

テストダブルはnameに反応する方法しか知りません。
なぜならNoteモデルが動作するために必要なコードはそれだけだからです。
というわけで、先ほど追加した`expect`は削除してください。


さて、次はスタブについてみてみましょう。
スタブは`allow`を使って作成しました。

この行はテストランナーに対して、このテスト内のどこかで`note.user`を呼び出すことを伝えています。
実際に`user.name`が呼ばれると、`note.user_id`の値を使ってデータベース上の該当するユーザーを検索し、見つかったユーザーを返却する代わりに、`user`という名前のテストダブルを返すだけになります。
結果として私たちは、テスト対象のモデルの外部に存在する実装の詳細から独立し、なおかつ2つのデータベース呼び出しを取り除いたテストを手に入れることができました。
このテストはユーザーを永続化することもありませんし、データベース上のユーザーを検索しにいくこともありません。
このアプローチに対する非常に一般的で正しい批判は、もし`User#name`というメソッドの名前を変えたり、このメソッドを削除したりしても、このテストはパスし続けてしまう、という点です。
みなさんも実際に試してみてください。

`User#name`メソッドをコメントアウトし、テストを実行してみるとどうなるでしょうか？
ベーシックなRSpecのテストダブルは、代役になろうとするオブジェクトにスタブ化しようとするメソッドが存在するかどうかを検証しません。

この問題を防止するには、かわりに __検証機能付きのテストダブル（verified double）__ を使用します。
このテストダブルがUserのインスタンスと同じように振る舞うことを検証してみましょう（ここではUserの最初の1文字が大文字になっている点に注目してください。これは検証機能付きのテストダブルが動作するために必要な変更点です）。

```ruby:spec/models/note_spec.rb
# 名前の取得をメモを作成したユーザーに委譲すること
it "delegates name to the user who created it" do
	user = instance_double("User", name: "Fake User")
	note = Note.new
	allow(note).to receive(:user).and_return(user)
	expect(note.user_name).to eq "Fake User"
end
```

この状態でnameメソッドに何か変更を加えるとテストは失敗します。

```
1) Note delegates name to the user who created it
	Failure/Error: user = instance_double("User", name: "Fake User")
	the User class does not implement the instance method: name.
	Perhaps you meant to use `class_double` instead?
```

今回の実験では、別に`class_double`を使おうとしていたわけではありません（訳注：エラーメッセージの最後に「もしかすると`class_double`を使おうとしましたか？」という文言が表示されています）。
ですので、コメントアウトしたnameメソッドを元に戻して、テストを元通りにすればOKです。

テスト内でオブジェクトをモック化するためにテストダブルを使う場合、できるかぎり検証機能付きのテストダブルを使うようにしてください。
これを使えば、誤ってテストがパスしてしまう問題を回避することができます。
RSpecで構築された既存のテストスイートが存在するコードベースで開発したことがある人や、他のテストチュートリアルをやったことがある人は、コントローラのテストでモックやスタブが頻繁に使われていることに気づいたかもしれません。
実際、私はコントローラのテストではデータベースにアクセスすることを過剰に避けようとする開発者を過去に何人か見てきました（正直に白状すると、私もやったことがあります）。

以下はデータベースにまったくアクセスせずにコントローラのメソッドをテストする例です。
ここで使われているNoteコントローラのindexアクションはジェネレータが作った元のindexアクションから変更されています。
具体的には、アクションの内部でNoteモデルのsearchスコープを呼びだして結果を集め、それをブラウザに返却しています。

この機能をまったくデータベースにアクセスしない形でテストしてみましょう。
それがこちらです。

```ruby:spec/controllers/notes_controller_spec.rb
require 'rails_helper'

RSpec.describe NotesController, type: :controller do
	let(:user) { double("user") }
	let(:project) { instance_double("Project", owner: user, id: "123") }

	before do
		allow(request.env["warden"]).to receive(:authenticate!).and_return(user)
		allow(controller).to receive(:current_user).and_return(user)
		allow(Project).to receive(:find).with("123").and_return(project)
	end

	describe "#index" do
		# ⼊⼒されたキーワードでメモを検索すること
		it "searches notes by the provided keyword" do
			expect(project).to receive_message_chain(:notes, :search).with("rotate tires")
			get :index,
			params: { project_id: project.id, term: "rotate tires" }
		end
	end
end
```

順を追ってコードを見ていきましょう。
まず、`let`を利用してテストで使うuserとprojectを遅延定義しています（`let`については第8章で説明しました）。
モック化されたuserに対してはメソッドをまったく呼び出さないので、ここでは問題なく通常のテストダブルを使うことができます。
⼀⽅、projectに関してはownerとidの属性を使うので、検証機能付きのテストダブルを使ったほうが安全です。

次に、beforeブロックの中では最初にDeviseが用意してくれる`authenticate!`と`current_user`メソッドをスタブ化しています。
なぜなら、これはパスワードによって保護されたページだからです。
さらに、Active Recordが提供している`Project.find`メソッドもスタブ化しています。
モック化するのは、データベースを検索するかわりにモックのprojectを返すためです。
これにより、`Project.find(123)`がテスト対象のコード内のどこかで呼ばれても、本物のプロジェクトオブジェクトではなく、テストダブルのprojectが代わりに返されるようになります。

最後に、コントローラのコードが期待どおりに動作することを検証しなければなりません。
このケースでは、projectに関連するnotesが持つsearchスコープが呼ばれることと、その際の検索キーワード（term）が同名のパラメータの値に一致することを検証しています。
この検証は以下のコードで実現しています。

```ruby:spec/controllers/notes_controller_spec.rb
expect(project).to receive_message_chain(:notes, :search).with("rotate tires")
```

ここでは`receive_message_chain`を使って`project.notes.search`を参照しています。
ここで覚えておいてほしいことが1つあります。

それは、このエクスペクテーションはアプリケーションコードを実際に動かす前に追加しないとテストがパスしないということです。

ここでは`allow`ではなく`expect`を使っているので、もしこのメッセージチェーン（連続したメソッド呼び出し）が呼び出されなかった場合はテストが失敗します。

このテストコードや、テスト対象のコントローラのコードでちょっと遊んでみてください。
テストを失敗させる方法を見つけて、RSpecがどんなメッセージを出力するのか調べてみましょう。

さて、ここでこの新しいテストコードの実用性について考えてみましょう。
このテストは速いでしょうか？
ええ、ずっと速いはずです。
ユーザーとプロジェクトをデータベース内に作成し、ユーザーをログインさせ、必要なパラメータを使ってコントローラのアクションを呼び出すことに⽐べれば、このテストは間違いなく速いでしょう。
テストスイートにこのようなテストがたくさんあるなら、データベース呼び出しを必要最小限にすることで、テストの実行がだんだん遅くなる問題を回避することができます。

一方、このコードはトリッキーでちょっと読みづらいです。
Deviseの認証処理をスタブ化する部分など、セットアップ処理のいくつかは定型的なコードなので、メソッドとして抽出できるかもしれません。

ですが、このセットアップコードはアプリケーションコード内でオブジェクトを作成して保存する方法とはかなり異なるものです。

こうなると、テストコードを読み解くのが大変です。
特に初学者は間違いなく苦労することでしょう。

また、ここではモック化に関する有名な原則も無視しています。
それは「⾃分で管理していないコードをモック化するな（Don’t mock what you don’t own）」という原則です。
つまり、 ここでは私たちが自分で管理していないサードパーティライブラリの機能を2つモック化しています。

具体的にはDeviseが提供している認証レイヤーと、Active Recordの`find`メソッドです。
この2つの機能をスピードの向上とコードの分離を目的としてモック化しています。
私たちはこのサードパーティライブラリを自分たちで管理していないにも関わらずモック化しました。
そのため、アプリケーションを壊してしまうような変更がライブラリに入っても、テストコードはその問題を報告してくれないかもしれません。

とはいえ、自分のアプリケーションで管理していないコードをモック化することに意味があるときもあります。

たとえば、時間のかかるネットワーク呼び出しを実行する必要があったり、レートリミットを持つ外部APIとやりとりする必要があったりする場合、モック化はそうしたコストを最小化してくれます。
テストとRailsの経験が増えてくると、そういったインターフェースと直接やりとりするコードを作成し、アプリケーション内でそのコードが使われている部分をスタブ化するテクニックを有益だと考えるようになるかもしれません。
ですがその場合でも、⾃分が書いたコードを高コストなインターフェースと直接やりとりさせるテストもある程度残すようにしてください。

この話題は本書の範疇（もしくは本書の小さなサンプルアプリケーションのスコープ）を超えてしまいますが…。
いろいろ話してきましたが、もしあなたがモックやスタブにあまり手を出したくないのであれば、それはそれで心配しないでください。

本書でやっているように、基本的なテストにはRubyオブジェクトを使い、複雑なセットアップにはファクトリを使う、というやり方でも大丈夫です。

スタブはトラブルの原因になることもあります。
重要な機能を気軽にスタブ化してしまうと、結果として実際には何もテストしていないことになってしまいます。
テストがとても遅くなったり、再現の難しいデータ（たとえば次の章である程度実践的な例を使って説明する外部APIやwebサービスなど）をテストしたりするのでなければ、オブジェクトやファクトリを普通に使うだけで十分かもしれません。

### タグ
たとえば、これからこのサンプルアプリケーションに新しい機能を追加することになったとします。
このときに書くテストコードにはいくつかのモデルとコントローラに対する単体テストと、ひとつの統合テストが含まれます。

新しい機能を開発している最中はテストスイート全体を実行するのは避けたいと考えるでしょう。
ですが、各テストを1つずつ実行していくのも面倒です。
このような場合は、RSpecのタグ機能が使えます。

タグを使うと、特定のテストだけを実行し、それ以外はスキップするようにフラグを立てることができます。
こうした用途では`focus`という名前のタグがよく使われます。
実行したいテストに対して次のようにしてタグを付けてください。

```ruby
# クレジットカードを処理すること
it "processes a credit card", focus: true do
	# example の詳細
end
```

こうすると、コマンドラインから`focus`タグを持つスペックだけを実行することができます。

```bash
bundle exec rspec --tag focus
```

特定のタグをスキップすることもできます。
たとえば、特別遅い統合テストを今だけ実行したくない場合は、それがわかるようなタグを遅いテストに付けて、それからチルダを付けてタグの指定をひっくり返します（訳注：シェルによっては`--tag "∼slow"`のようにチルダ付きのタグをダブルクオートで囲む必要があります）。

```bash
bundle exec rspec --tag ~slow
```

こうすると`slow`というタグが付いたテスト以外の全テストを実行します。
タグは`describe`や`context`ブロックに付けることもできます。
その場合はブロック内の全テストにそのタグが適用されます。

> `focus`タグはコミットする前に忘れずに削除してください。また、新しい機能が完成したと判断する前に、必ずタグなしでテストスイート全体を実行するようにしてください。一方で、`slow`のようなタグはしばらくコードベースに残しておいても便利かもしれません。

もし、`focus`タグを頻繁に利用するようになったら、1つでも`focus`タグの付いたテストがあるときに、そのタグを利用するようRSpecを設定することもできます。
もし`focus`タグの付いた`example`が1つも見つからなければ、テストスイート全体を実行します。

```ruby:spec/spec_helper.rb
RSpec.configure.do |config|
	config.filter_run_when_matching :focus
	# 他の設定が続く ... 
end
```

特定のタグが付いた`example`は常にスキップするよう、RSpecを設定することもできます。
たとえば次のように設定します。

```ruby:spec/spec_helper.rb
RSpec.configure do |config|
	config.filter_run_excluding slow: true
	# 他の設定が続く ...
end
```

この場合でもコマンドラインから`slow`タグの付いたテストだけを明示的に実行することは可能です。

```bash
 bundle exec rspec --tag slow
```

### 不要なテストを削除する
もし、あるテストが目的を果たし、今後の回帰テストでも使う必要がないと確信できるなら、そのテストを削除してください！
もし、何かしらの理由でそれを本当に残したいと考えているが、日常的には実行する必要はないなら、そのスペックに`skip`のマークを付けてください。

```ruby
# ⼤量のデータを読み込むこと
it "loads a lot of data" do 
	# 今後不要（なのでスキップする）
	skip "no longer necessary"

	# スペックのコードが続く。ただし実⾏はされない 
end
```

私はテストをコメントアウトするよりも、スキップするほうを推奨します。
なぜなら、スキップされたスペックはテストスイートを実行したときにそのことが表示されるため、スキップしていることを忘れにくくなるからです。

とはいえ、不必要なコードは単純に削除するのが良いのは間違いありません（ただし、その確信がある場合に限ります）。 
RSpec3.0より前のRSpecでは、この機能は`pending`メソッドとして提供されていました。
`pending` は今でも使えますが、機能は全く異なっています。
現在の仕様では`pending`されたspecはそのまま実行されます。
そのテストが途中で失敗すると、pending（保留中）として表示されます。
しかし、テストがパスすると、そのテストは失敗とみなされます。

### テストを並列に実⾏する
私は実行に30分かかるテストスイートを見たことがあります。
また、もっと遅いテストスイートがある話もたくさん耳にしました。

すでに遅くなってしまったテストスイートを実行するよい方法は、`ParallelTests gem`を使ってテストを並列に実行することです。
`ParallelTests`を使うと、テストスイートが複数のコアに分割され、格段にスピードアップする可能性があります。
30分かかるテストスイートを6コアに分けて実行すれば、7分ぐらいまで実行時間が短くなります。
これは劇的な効果があります。
特に、遅いテストを個別に改善していく時間がない場合に最適です。
私はこのアプローチが好きですが、注意も必要です。
なぜならこのテクニックを使うと、怪しいテストの習慣を隠してしまうことがあるからです。
もしかすると、遅くて高コストな統合テストを使いすぎたりしているのかもしれません。
テストスイートを高速化するときは`ParallelTests`だけを頼るのではなく、本書で紹介したその他のテクニックも併用するようにしましょう。

### Railsを取り外す
モックやタグの活用はどちらもテストスイートの実行時間を減らすためのものでした。
しかし究極的には、処理を遅くしている大きな要因の1つはRails自身です。
テストを実行するときは毎回Railsの一部、もしくは全部を起動させる必要があります。
`Spring gem` をインストールし（ただし、Rails 6.1以前であればデフォルトでインストールされています）、`binstub` を使って`Spring`経由でRSpecを実行すれば、起動時間を短くすることができます。

しかし、もし本当にテストスイートを高速化したいなら、Railsを完全に取り外すこともできます。
`Spring`を使うとフレームワークを読み込んでしまいますが（ただし1回だけ）、フレームワークを読み込まないこちらのソリューションなら、フレームワークをまったく読み込まないので、さらにもう1歩高速化させることができます。

この話題は本書の範疇を大きく超えてしまいます。
なぜならあなたのアプリケーションアーキテクチャ全体を厳しく見直す必要があるからです。

また、これはRails初心者に説明する際の個人的なルールも破ることになります。
つまり、Railsの規約を破ることは可能な限り避けなければならない、という私自身のルールも破ることになるわけです。

それでもこの内容について詳しく知りたいのであれば、Corey Hainesの講演とDestroy All Softwareを視聴することをお勧めします。

## その他のテスト
私たちはこれまで、プロジェクト管理アプリケーション全体に対して堅牢なテストスイートを構築してきました。
モデルとコントローラをテストし、システムスペックを通じてviewと組み合わせた場合もテストしました。
リクエストスペックを使った、外部向けAPIのテストもあります。
しかし、まだカバーしていないテストが少し残っています。
メモ（Note）モデルにあるファイルアップロード機能や、メール送信機能、ジオコーディング（緯度経度）連携のテストはどうすればいいでしょうか？
こうした機能もテストできます！

### ファイルアップロードのテスト
添付ファイルのアップロードはWebアプリケーションでよくある機能要件の1つです。
Rails 5.2からはActive Storageと呼ばれるファイルアップロード機能が標準で提供されるようになりました。
本書のサンプルアプリケーションでもActive Storageを使用しています。
このほかにもCarrierWaveやShrineといったgemを使ってファイルアップロード機能を実装する方法もあります（もしくは自分で独自に作るという手もあります）。
しかし、どうやってテストすれば良いでしょうか？
本書ではActive Storageを使ったテスト方法を紹介しますが、基本的なアプローチは他のライブラリを使う場合でも同じです。
では、メモ機能をテストするシステムスペックから始めましょう。

```ruby:spec/system/notes_spec.rb
require 'rails_helper'

RSpec.describe "Notes", type: :system do
	let(:user) { FactoryBot.create(:user) }
	let(:project) {
		FactoryBot.create(:project,
			name: "RSpec tutorial",
			owner: user)
	}

	# ユーザーが添付ファイルをアップロードする
	scenario "user uploads an attachment" do
		sign_in user
		visit project_path(project)
		click_link "Add Note"
		fill_in "Message", with: "My book cover"
		attach_file "Attachment", "#{Rails.root}/spec/files/attachment.jpg"
		click_button "Create Note"
		expect(page).to have_content "Note was successfully created"
		expect(page).to have_content "My book cover"
		expect(page).to have_content "attachment.jpg (image/jpeg"
	end
end
```

これは今まで書いてきた他のシステムスペックととてもよく似ています。
ですが、今回はCapybaraの`attach_file`メソッドを使って、ファイルを添付する処理をシミュレートしています。
最初の引数は入力項目のラベルで、2つ目の引数がテストファイルのパスです。
ここでは`spec/files`という新しいディレクトリが登場しています。
この中にテストで使う小さなJPEGファイルが格納されています。
このディレクトリ名は何でも自由に付けられます。
他にはたとえば、`spec/fixtures`という名前が付けられることもあるようです。
ファイルの名前も自由です。
ただし、このファイルは忘れずにバージョン管理システムにコミットしておいてください。
そうしないと他の開発者がテストを実行したときに、テストが失敗してしまうからです。
テストファイルが指定された場所に存在すれば、この新しいスペックは問題なくパスするはずです。
ところで、Active Storageでは`config/storage.yml`でアップロードしたファイルの保存先を指定します。
特に変更していなければ、テスト環境では`tmp/storage`になっているはずです。

```taml:config/storage.yml
test:
	service: Disk
	root: <%= Rails.root.join("tmp/storage") %>

local:
	service: Disk
	root: <%= Rails.root.join("storage") %>
```

`tmp/storage`ディレクトリを開いて、なんらかのディレクトリやファイルが作成されていることを確認してみてください。
ただし、ディレトリ名やファイルは推測されにくい名前になっているため、どのファイルがどのテストで作成されたのか探し当てるのは少し難しいかもしれません。
今のままだと、テストを実行するたびにファイルが増えていってしまうため、テストの実行が終わったら、アップロードされた古いファイルは自動的に削除されるようにしておくと良いと思います。
`spec/rails_helper.rb`に以下の設定を追加してください。

```ruby:spec/rails_helper.rb
RSpec.configure do |config|
	# このブロック内の他の設定は省略 ...

	# テストスイートの実⾏が終わったらアップロードされたファイルを削除する 
	config.after(:suite) do 
		Pathname(ActiveStorage::Blob.service.root).each_child do |path| 
			path.rmtree if path.directory?
		end
	end
end
```

さあ、これでテストが終わった時点でRSpecがこのディレクトリとその中身を削除してくれます。
さらに、偶然この中のファイルがバージョン管理システムにコミットされてしまわないよう、プロジェクトの`.gitignore`に設定を追加しておくことも重要です。
Active Storageの場合はRailsが最初から設定を追加してくれているので、念のため確認するだけでOKですが、他のライブラリを使ってアップロード機能を実現するときはこうした設定追加を忘れないようにしてください。

```.gitignore
# Ignore uploaded files in development.
/storage/*
!/storage/.keep
/tmp/storage/*
!/tmp/storage/
!/tmp/storage/.keep
```

さて、Active Storageのことはいったん忘れて、ここでやった内容を振り返ってみましょう。
最初はファイルアップロードのステップを含む、スペックファイルを作成しました。
さらに、スペック内ではテストで使うファイルを添付しました。
次に、テスト専用のアップロードパスを設定（確認）しました。
最後に、テストスイートが終わったらファイルを削除するようにRSpecを設定しました。
この3つのステップはシステムレベルのテストでファイルアップロードを実行するための基本的なステップです。

もしみなさんがActive Storageを使っていない場合は、自分が選んだアップロード用ライブラリのドキュメントを読み、この3つのステップを自分のアプリケーションに適用する方法を確認してください。
もし自分でファイルアップロードを処理するコードを書いている場合は、アップロード先のディレクトリを変更するために、`allow`メソッド（第9章を参照）でスタブ化できるかもしれません。
もしくはアップロード先のパスを実行環境ごとの設定値として抜き出す方法もあるでしょう。
最後に、もしテスト内で何度もファイル添付を繰り返しているのであれば、そのモデルをテストで使う際に、添付ファイルを属性値に含めてしまうことを検討した方がいいかもしれません。
たとえば、Noteファクトリにこのアプローチを適用する場合は、第4章で説明したトレイトを使って実現することができます。

```ruby:spec/factories/notes.rb
FactoryBot.define do
	factory :note do
		message { "My important note." }
		association :project
		user { project.owner }

		trait :with_attachment do
			attachment { Rack::Test::UploadedFile.new( \
				"#{Rails.root}/spec/files/attachment.jpg", 'image/jpeg') }
		end
	end
end
```

Active Storageを使っている場合は上のように`Rack::Test::UploadedFile.new`の引数に添付ファイルが存在するパスと`Content-Type`を指定ます。
こうすればテスト内で`FactoryBot.create(:note, :with_attachment)`のように書くことで、ファイルが最初から添付された新しいNoteオブジェクトを作成することができます。
モデルスペックを開き、次のテストを追加してください。

```ruby:spec/models/note_spec.rb
require 'rails_helper' RSpec.describe Note, type: :model do
	# 他のテストは省略 ...

	# 添付ファイルを1件添付できる
	it 'has one attached attachment' do
		note = FactoryBot.create :note, :with_attachment 
		expect(note.attachment).to be_attached 
	end
```

### バックグラウンドワーカーのテスト
私たちのプロジェクト管理アプリケーションを利用している、架空の会社の架空のマーケティング部が、CMを流したり、広告を打ったりする参考情報を得るために、私たちに対してユーザーに関する位置情報を集めてくるように依頼してきたとします。
個人情報の扱いや利用規約に関する詳細は法務部に任せるとして、とりあえず私たちはlocation属性をユーザーモデルに追加してこの機能を完成させました。
この機能はユーザーがログインしたときに外部のジオコーディングサービスにアクセスし、町や州、国といった情報を取得します。
今回新たに加わっされます。
そたこの処理はActive Jobを使ってバックグラウンドで実行のため、ユーザーはこの処理が終わるまで待たされることはありません。

このような遅い処理をバックグラウンドで実行するのは、比較的シンプルかつ効果的な方法で、Webアプリケーションのパフォーマンスを高く保つことができます。
ですが、メインフローからプロセスを切り分けるということは、テストの方法を少し変える必要があることを意味します。
幸いなことに、Railsとrspec-railsはさまざまなレベルのテストにおいて、Active Jobワーカーをテストする、便利なサポート機能を提供してくれています。

まず、統合テストから始めましょう。
私たちはまだユーザーのログイン処理を明示的にテストしていません。
そこで、`bin/railsgrspec:systemsign_in`を実行して、テストを作成します。
それから、次のようなテストコードを書いてください。

```ruby:spec/system/sign_ins_spec.rb
require 'rails_helper'

RSpec.describe "Sign in", type: :system do
	let(:user) { FactoryBot.create(:user) }
	before do
		ActiveJob::Base.queue_adapter = :test
	end

	# ユーザーのログイン
	scenario "user signs in" do
		visit root_path
		click_link "Sign In"
		fill_in "Email", with: user.email
		fill_in "Password", with: user.password
		click_button "Log in"

		expect {
			GeocodeUserJob.perform_later(user)
		}.to have_enqueued_job.with(user)
	end
end
```

このコードにはActive Jobとバックグラウンドのジオコーディング処理に関連する部分が2箇所あります。
まず、rspec-railsではバックグラウンドジョブをテストするために、`queue_adapter`に`:test`を指定する必要があります。
これがないとテストは次のような例外を理由付きで`raise`します（訳注：下の例外メッセージには「ActiveJobマッチャを使うには、`ActiveJob::Base.queue_adapter=:test`を設定してください」と書いてあります）。

```
StandardError:
	To use ActiveJob matchers set `ActiveJob::Base.queue_adapter = :test`
```

ここではよく目立つようにbeforeブロックでこのコードを実行しましたが、`scenario`の中で実行しても構いません。
なぜなら、このファイルにはテストが一つしかないからです。
また、複数のファイルでテストキューを使う場合は、第8章で紹介したテストをDRYにするテクニック（訳注：`shared_context`のこと）を使って実験することもできます。

次に、ジョブが実際にキューに追加されたことを確認する必要があります。
rspec-railsではこの確認に使えるマッチャがいくつか用意されています。
ここでは`have_enqueued_job`を使い、正しいジョブが正しい入力値で呼ばれていることをチェックしています。
注意してほしいのは、このマッチャはブロックスタイルの`expect`と組み合わせなければいけないことです。
こうしないと、テストは次のような別の例外を理由付きでraiseします（訳注：下の例外メッセージには「`have_enqueued_job`と`enqueue_job`はブロック形式のエクスペクテーションだけをサポートします」と書いてあります）。

```
ArgumentError:
	have_enqueued_job and enqueue_job only support block expectations
```

さて、これでバックグラウンドジョブがアプリケーションの他の部分と正しく連携できていることをチェックできました。
今度はもっと低レベルのテストを書いて、ジョブがアプリケーション内のコードを適切に呼びだしていることを確認しましょう。
このジョブをテストするために、新しいテストファイルを作成します。

```bash
bin/rails g rspec:job geocode_user
```

この新しいファイルは本書を通じて作成してきた他のテストファイルとよく似ています。

```ruby:spec/jobs/geocode_user_job_spec.rb
require 'rails_helper'

RSpec.describe GeocodeUserJob, type: :job do
	pending "add some examples to (or delete) #{__FILE__}"
end
```

では、このジョブがUserモデルのgeocodeメソッドを呼んでいることをテストしましょう。
pendingになっているテストを次のように書き換えてください。

```ruby:spec/jobs/geocode_user_job_spec.rb
require 'rails_helper'

RSpec.describe GeocodeUserJob, type: :job do
	# user の geocode を呼ぶこと
	it "calls geocode on the user" do
		user = instance_double("User")
		expect(user).to receive(:geocode)
		GeocodeUserJob.perform_now(user)
	end
end
```

このテストでは第9章で説明した`instance_double`を使ってテスト用のモックユーザーを作っています。
それからテスト実行中のどこかのタイミングでこのモックユーザーに対してgeocodeメソッドが呼び出されることをRSpecに伝えています。
最後に、`perform_now`メソッドを使って、このバックグラウンドジョブ自身を呼び出します。
こうすると、ジョブはキューに入らないため、テストの実行結果をすぐに検証できます。

### メール送信をテストする
フルスタックWebアプリケーションの多くは何らかのメールをユーザーに送信します。
このサンプルアプリケーションでは短いウェルカムメッセージに、アプリケーションのちょっとした使い方を添えて送信します。
メール送信は二つのレベルでテストできます。
一つはメッセージがただしく構築されているかどうかで、もう一つは正しい宛先にちゃんと送信されるかどうかです。
このテストでは先ほど新しく学んだ、バックグラウンドワーカーのテストの知識を使います。
なぜならメール送信はバックグラウンドワーカーを利用することが一般的だからです。
最初はMailerにフォーカスしたテストから始めましょう。
今回対象となるMailerは`app/mailers/user_mailer.rb`にあるMailerです。
このレベルのテストでは、送信者と受信者のアドレスが正しいことと、件名とメッセージ本文に大事な文言が含まれていることをテストします。
（もっと複雑なMailerになると、今回の基本的なMailerよりも、もっとたくさんの項目をテストすることになるはずです。）
新しいテストファイルはジェネレータを使って作成します。

```bash
bin/rails g rspec:mailer user_mailer
```

この新しいファイルで注目したいのは、`spec/mailers/user_mailer.rb`にファイルが作成されている点と、次のような定型コードが書かれている点です。

```ruby:spec/mailers/user_mailer_spec.rb
require "rails_helper"

RSpec.describe UserMailer, type: :mailer do
	pending "add some examples to (or delete) #{__FILE__}"
end
```

ここに以下のようなコードを書いていきましょう。

```ruby:spec/mailers/user_mailer_spec.rb
require "rails_helper"

RSpec.describe UserMailer, type: :mailer do
	describe "welcome_email" do
		let(:user) { FactoryBot.create(:user) }
		let(:mail) { UserMailer.welcome_email(user) } 

		# ウェルカムメールをユーザーのメールアドレスに送信すること
		it "sends a welcome email to the user's email address" do
			expect(mail.to).to eq [user.email]
		end

		# サポート⽤のメールアドレスから送信すること
		it "sends from the support email address" do
			expect(mail.from).to eq ["support@example.com"]
		end

		# 正しい件名で送信すること
		it "sends with the correct subject" do
			expect(mail.subject).to eq "Welcome to Projects!"
		end

		# ユーザーにはファーストネームであいさつすること
		it "greets the user by first name" do
			expect(mail.body).to match(/Hello #{user.first_name},/)
		end

		# 登録したユーザーのメールアドレスを残しておくこと
		it "reminds the user of the registered email address" do
			expect(mail.body).to match user.email
		end
	end
end
```

ここではテストデータ、すなわち、テスト対象のユーザーとMailerのセットアップから始まっています。
それから実装された仕様を確認するための小さな単体テストをいくつか書いています。
最初に書いたのは`mail.to`のアドレスを確認するテストです。
ここで注意してほしいのは、`mail.to`の値は文字列の配列になる点です。
単体の文字列ではありません。
`mail.from`も同様にテストします。
このテストではRSpecの`contain`マッチャを使うこともできますが、私は配列の等値性をチェックする方が好みです。
こうすると余計な受信者や送信者が含まれていないことを確実に検証できます。
`mail.subject`のテストはとても単純だと思います。
ここまでは`eq`マッチャを使って何度も文字列を比較してきました。
ですが、`mail.body`を検証する最後の二つのテストでは`match`マッチャを使っている点が少し変わっています。
このテストではメッセージ本文全体をテストする必要はなく、本文の一部をテストすればいいだけです。
最初の`example`では正規表現を使って、フレンドリーなあいさつ（たとえば、Hello,Maggie,のようなあいさつ）が本文に含まれていることを確認しています。
二つ目の`example`でも`match`を使っていますが、この場合は正規表現を使わずに、本文のどこかに`user.email`の文字列が含まれることを確認しているだけです。

繰り返しになりますが、みなさんが書くMailerのスペックの複雑さは、みなさんが作ったMailerの複雑さ次第です。
今回はこれぐらいで十分かもしれませんが、もっとたくさんテストを書いた方がMailerに対して自信が持てるのであれば、そうしても構いません。
さて、今度はアプリケーションの大きなコンテキストの中でMailerをテストする方法を見ていきましょう。
このアプリケーションでは新しいユーザーが作られると、そのたびにウェルカムメールが送信される仕様になっています。
どうすれば、本当に送信されていることを検証できるでしょうか？
高いレベルでテストするなら統合テストでテストできますし、もう少し低いレベルでテストするならモデルレベルでテストできます。
練習として、両方のやり方を見ていきましょう。
最初は統合テストから始めます。
このメッセージはユーザーのサインアップワークフローの一部として送信されます。
それではこのテストを書くための新しいシステムスペックを作成しましょう。

```
bin/rails g rspec:system sign_up
```

次に、ユーザーがサインアップするためのステップと期待される結果をこのファイルに追加します。

```ruby:spec/system/sign_ups_spec.rb
require 'rails_helper'

RSpec.describe "Sign-ups", type: :system do
	include ActiveJob::TestHelper

	# ユーザーはサインアップに成功する
	scenario "user successfully signs up" do
		visit root_path
		click_link "Sign up"

		perform_enqueued_jobs do
			expect {
				fill_in "First name", with: "First"
				fill_in "Last name", with: "Last"
				fill_in "Email", with: "test@example.com"
				fill_in "Password", with: "test123"
				fill_in "Password confirmation", with: "test123"
				click_button "Sign up"
			}.to change(User, :count).by(1)

			expect(page).to \
			have_content "Welcome! You have signed up successfully."
			expect(current_path).to eq root_path
			expect(page).to have_content "First Last" 
		end
		mail = ActionMailer::Base.deliveries.last

		aggregate_failures do
			expect(mail.to).to eq ["test@example.com"]
			expect(mail.from).to eq ["support@example.com"]
			expect(mail.subject).to eq "Welcome to Projects!"
			expect(mail.body).to match "Hello First,"
			expect(mail.body).to match "test@example.com"
		end
	end
end
```

このテストの約3分の2は第6章以降でよく見慣れたものかもしれません。ここではCapybaraを使ってサインアップフォームへの入力をシミュレートしています。
残りの部分はメール送信にフォーカスしています。
メールはバックグラウンドプロセスで送信されるため、テストコードは`perform_enqueued_jobs`ブロックで囲む必要があります。
このヘルパーメソッドは、このスペックファイルの最初でincludeしている`ActiveJob::TestHelper`モジュールが提供しています。
このメソッドを使えば`ActionMailer::Base.deliveries`にアクセスし、最後の値を取ってくることができます。
この場合、最後の値はユーザーが登録フォームに入力したあとに送信されるウェルカムメールになります。
テストしたいメールオブジェクトを取得できれば、残りのエクスペクテーションはMailerに追加した単体テストとほとんど同じです。
実際のところ、統合テストのレベルではここまで詳細なテストは必要ないかもしれません。
ここでは`mail.to`をチェックして適切なユーザーにメールが送信されていることと、`mail.subject`をチェックして適切なメッセージが送信されていることを検証するだけで十分かもしれません。
なぜならその他の詳細なテストはMailerのスペックに書いてあるからです。
これはただ私がRSpecにはこういうやり方もあるということを紹介したかっただけです。
このテストはUserモデルとUserMailerが連携するポイントを直接テストすることでも実現できます。
このアプリケーションでは新しいユーザーが追加されたときに`after_create`コールバックでこの連携処理が発生するようになっています。
なので、ユーザーのモデルスペックにテストを追加することができます。

```ruby:spec/models/user_spec.rb
require 'rails_helper'

RSpec.describe User, type: :model do
	# これより前にある example は省略 ...

	# アカウントが作成されたときにウェルカムメールを送信すること
	it "sends a welcome email on account creation" do
		allow(UserMailer).to \
		receive_message_chain(:welcome_email, :deliver_later)
		user = FactoryBot.create(:user)
		expect(UserMailer).to have_received(:welcome_email).with(user)
	end
end
```

このテストではまず、`receive_message_chain`を使って`deliver_later`メソッドをスタブ化しています。
このメソッドはActive Jobが`UserMailer.welcome_email`に提供してくれるメソッドです。
`receive_message_chain`メソッドについては、第9章でも同じような使い方を説明しています。
次に、テストするユーザーを作成する必要があります。
Mailerはユーザーを作成する処理の一部として実行されるため、その直後にスパイ（spy）を使ってテストします。
スパイは第9章で説明したテストダブルによく似ていますが、テストしたいコードが実行されたあとに発生した何かを確認できる点が異なります。
具体的には、クラス（UserMailer）に対して、期待されたオブジェクト（user）とともに、目的のメッセージ（`:welcome_email`）が呼び出されたかどうかを、`have_received`マッチャを使って検証しています。
なぜスパイを使う必要があるのでしょうか？
これは次のような問題を回避するためです。
すなわち、ここではユーザーを作成してそれを変数に入れる必要がありますが、そうするとテストしようとしているMailerも実行されてしまいます。
つまり、次のようなコードを書いても動かないということです。

```ruby
# アカウントが作成されたときにウェルカムメールを送信すること
it "sends a welcome email on account creation" do
	expect(UserMailer).to receive(:welcome_email).with(user)
	user = FactoryBot.create(:user)
end
```

これは以下のエラーを出して失敗します。

```
Failures:
	1) User sends a welcome email on account creation
			Failure/Error: expect(UserMailer).to
				receive(:welcome_email).with(user)
				
			NameError:
				undefined local variable or method `user' for
				#<RSpec::ExampleGroups::User:0x007fca733cb578>
```

userという変数が作成される前にこの変数を使うことはできません。
ですが、テスト対象のコードを実行せずにuserを作成することもできません。

幸いなことに、スパイを使えばどちらでもない新たなワークフローを選択することができます。

このテストのいいところは、Mailerが正しい場所で、正しい情報とともに呼ばれることを確認するだけで十分であることです。
このテストではいちいちWeb画面を使ってユーザーを作成する必要がありません。
そのため速く実行できます。ですが、短所もあります。

このテストはレガシーコードをテストするために提供されているRSpecのメソッドを使っている点です。
また、スパイを使うとこのテストコードを初めて見た開発者をびっくりさせてしまうかもしれません。

このワークフローを一度見直してみるのもいいかもしれません。
たとえば`deliver_later`を使ってウェルカムメールを送信するのではなく、別のバックグラウンドジョブを使って送信するようにしたり、`after_create`コールバックを削除したりすることも検討してみましょう。

このようなケースでは高いレベルの統合テストを残した状態で低レベルのテストを作成し、アプリケーションコードが適切に連携できていることを確認できたら、統合テストの方は削除してもいいかもしれません。

繰り返しになりますが、開発者には選択肢がいろいろあるのです。

### Webサービスをテストする
ではジオコーディングに戻りましょう。

バックグラウンドジョブのテストは作成しましたが、実装の詳細はまだちゃんとテストできていません。

ジオコーディングの処理は本当に実行されているのでしょうか？
現在の実装コードでは、ユーザーが正常にログインしたあとにジオコーディングがバックグラウンドで実行されます。
ですが、それはユーザーが実行中のアプリケーションサーバーと異なるホストからログインした場合だけです。
位置情報はIPアドレスに基づいてリクエストされます。
そして、繰り返しになりますが、ジオコーディングはアプリケーションの中で実行されているのではありません。
この処理はHTTPコールを経由して外部のジオコーディングサービスに実行してもらっているのです。
そこでテストを追加して本当にジオコーディングサービスにアクセスしていることを検証しましょう。
既存のUserモデルのスペックに新しいテストを追加してください。

```ruby:spec/models/user_spec.rb
require 'rails_helper'

RSpec.describe User, type: :model do

	# これより前のテストは省略 ...

	# ジオコーディングを実⾏すること
	it "performs geocoding" do
		user = FactoryBot.create(:user, last_sign_in_ip: "161.185.207.20")
		expect {
			user.geocode
		}.to change(user, :location).
		from(nil).
		to("New York City, New York, US")
	end
end
```

このテストは第3章で書いた他のテストによく似ています。
静的なIPアドレスを事前に設定したユーザーを作成し、ユーザーに対してジオコーディングを実行し、ユーザーの位置情報が取得できたことを検証しています。
（ちなみに私は上の実験でこのIPアドレスに対応する位置情報をたまたま知りました）

スペックを実行すると、このテストはパスします。
（訳注：ジオコーディングサービスが返す位置情報が変更されるとテストが失敗することがあります。その場合はテストコードを修正してテストがパスするようにしてください）

ですが、一つ問題があります。
この小さなスペックは同じファイルに書かれた他のテストよりも明らかに遅いのです。
なぜだかわかりますか？
このテストではジオコーディングサービスに対して実際にHTTPリクエストを投げます。
そのため、サービスが位置情報を返すまで待ってから新しい値を確認しなければならないのです。
実行速度が遅くなることに加えて、外部のサービスを直接使ってテストすることは別のコストも発生させます。
もしこの外部APIにレートリミットが設定されていたら、レートリミットを超えたタイミングでテストが失敗し始めます。
また、これが有料のサービスだった場合、テストを実行することで実際に利用料金が発生してしまうかもしれません！
__VCR gem__ はこういった問題を軽減してくれる素晴らしいツールです。
[VCR gem](https://github.com/vcr/vcr)を使えばテストを高速に保ち、APIの呼び出しを必要最小限に抑えることができます。
VCRはRubyコードから送られてくる外部へのHTTPリクエストを監視します。
そうしたHTTPリクエストが必要なテストが実行されると、そのテストは失敗します。
テストをパスさせるには、HTTP通信を記録する __カセット__ を作る必要があります。
テストをもう一度実行すると、VCRはリクエストとレスポンスをファイルに記録します。
こうすると今後、同じリクエストを投げるテストはファイルから読み取ったデータを使うようになります。
外部のAPIに新たなリクエストを投げることはありません。

ではVCRをアプリケーションに追加することから始めましょう。
まず、このVCRとVCRによって利用される __WebMock__ をGemfileに追加してください。

```Gemfile
group :test do
	# 他のテスト⽤ gem は省略 ...
	gem 'vcr'
	gem 'webmock'
end
```

[WebMock](https://github.com/bblimke/webmock)はHTTPをスタブ化するライブラリで、VCRは処理を実行するたびにこのライブラリを水面下で利用しています。
__WebMock__ はそれ自体がパワフルなツールですが、説明をシンプルにするため、ここでは詳しく説明しません。
`bundle install` を実⾏して、新しいgemを追加してください。

次に、外部にHTTPリクエストを送信するテストでVCRを使うようにRSpecを設定する必要があります。
`spec/support/vcr.rb`というファイルを新たに作成し、次のようなコードを追加してください。

```ruby:spec/support/vcr.rb
require "vcr"

VCR.configure do |config|
	config.cassette_library_dir = "#{::Rails.root}/spec/cassettes"
	config.hook_into :webmock
	config.ignore_localhost = true
	config.configure_rspec_metadata!
end
```

この新しい設定ファイルではカセット（`cassette`）、すなわち記録されたやりとりをアプリケーションの`spec/cassettes`ディレクトリに保存するように設定しています。
すでに説明したとおり、スタブ化には __WebMock__ を使います。
（ですが、VCRは他の数多くのスタブライブラリをサポートしています）
タスクを完了済みにするAJAXコールなどで使われるlocalhostへのリクエストは無視します。

最後に、RSpecのタグによってVCRが有効になるようにします。
JavaScriptを実行するテストに`js:true`を付けたのと同じように、VCRを使うテストでは`vcr:true`を付けることでVCRが有効化されます。
この設定が済んだら、新しいテストを実行して何が起きるか確認してください。
テストの実行はずっと速くなりますが、次のように失敗してしまいます。

```
Failures:
	1) User performs geocoding
		Failure/Error: user.geocode

		VCR::Errors::UnhandledHTTPRequestError:

=============================
An HTTP request has been made that VCR does not know how to handle:
	GET http://ipinfo.io/161.185.207.20/geo

	There is currently no cassette in use. 
	There are a few ways you can configure VCR to handle this request:
```

VCRが設定されていると、外部へのHTTPリクエストは`UnhandledHTTPRequestError`という例外を起こして失敗するようになります。
この問題を解消するために、`vcr:true`というオプションをテストに追加してください。

```ruby:spec/models/user_spec.rb
# ジオコーディングを実⾏すること
it "performs geocoding", vcr: true do
	user = FactoryBot.create(:user, last_sign_in_ip: "161.185.207.20")
	expect {
		user.geocode
	}.to change(user, :location).
	from(nil).
	to("New York City, New York, US")
end
```

テストを再実行すると、二つの変化が起きるはずです。
1点目はテストがパスするようになることです。
2点目はリクエストとレスポンスの記録が、先ほど設定した`spec/cassettes`ディレクトリのファイルに保存されます。
このファイルをちょっと覗いてみてください。
このファイルはYAMLファイルになっていて、最初にリクエストのパラメータが記録され、そのあとにジオコーディングサービスから返ってきたパラメータが記録されています。
テストをもう1度実行してください。
依然としてテストはパスしますが、今回はカセットファイルの内容を使って実際のHTTPリクエストとレスポンスをスタブ化します。
この例ではモデルスペックで実行されたHTTPトランザクションを記録するためにVCRを使いましたが、テストの1部でHTTPトランザクションが発生するテストであれば、どのレイヤーのどのテストでもVCRを利用することができます。
私はVCRが大好きですが、VCRには短所もあります。
特に、カセットが古びてしまう問題には注意が必要です。
これはつまり、もしテストに使っている外部APIの仕様が変わってしまっても、あなたはカセットが古くなっていることを知る術がない、ということです。
それを知ることができる唯一の方法は、カセットを削除して、もう1度テストを実行することです。
Railsの開発者の多くはプロジェクトのバージョン管理システムからカセットファイルを除外することを選択します。
これは新しい開発者が最初にテストスイートを実行した際に、必ず自分でカセットを記録するようにするためです。
この方法を採用する前に、[一定の頻度でカセットを自動的に再記録する方法](https://benoittgt.github.io/vcr/#/cassettes/automatic_re_recording)を検討しても良いかもしれません。
この方法を使えば、後方互換性のないAPIの変更を比較的早く検知することができます。
また、二つ目の注意点として、APIのシークレットトークンやユーザーの個人情報といった機密情報をカセットに含めないようにしてください。
VCRにはサニタイズ用のオプション⁵⁸が用意されているので、これを使えば機密情報がファイルに保存される問題を回避することができます。
もし、みなさんがカセットをバージョン管理システムにあえて保存するのであれば、この点は非常に重要です。

## テスト駆動開発に向けて
私たちはプロジェクト管理アプリケーションでたくさんのことをやってきました。
本書の冒頭から欲しかった機能はすでにできあがっていましたが、テストは全くありませんでした。

今ではアプリケーションは十分にテストされていますし、もし穴が残っていたとしても、私たちはその穴を調べて塞ぐだけのスキルを身につけています。
しかし、私たちがやってきたことは __テスト駆動開発（TDD）__ でしょうか？
厳密に言えば「いいえ」です。
アプリケーションコードは私たちが最初のスペックを追加する前から存在していました。
私たちが今までやって来たことは __探索的テスト__ に近いものです。
つまり、アプリケーションをより深く理解するためにテストを使っていました。
本当にTDDを練習するにはアプローチを変える必要があります。
すなわち、テストを先に書き、それからテストをパスさせるコードを書き、そしてコードをリファクタリングして今後もずっとコードを堅牢にしていくのです。
その過程で、テストを使ってどういうコーディングをすべきか検討します。
私たちはバグのないソフトウェアを作り上げるために努力しています。
そのソフトウェアは将来新しい要件が発生して変更が入るかもしれません。
さあ、このサンプルアプリケーションでTDDを実践してみましょう！

### フィーチャを定義する
現時点ではプロジェクトを完了済みにする方法は用意されていません。
この機能があれば、ユーザーは完了したプロジェクトを見えない場所に片付けて、現在のプロジェクトだけにフォーカスできるようになるので便利そうです。
次のような二つの機能を追加して、この要件を実装してみましょう。

- プロジェクトを完了済みにするボタンを追加する。
- ログイン直後に表示されるダッシュボード画面では完了済みのプロジェクトを表示しないようにする。

まず最初のシナリオから始めましょう。
コーディングする前に、テストスイート全体を実行し、機能を追加する前に全部グリーンになることを確認してください。
もしパスしないスペックがあれば、本書で身につけたスキルを活かしてスペックを修正してください。
大事なことは開発を進める前にまず、きれいな状態から始められるようにしておくことです。
次に新しいシステムスペックに作業のアウトラインを記述します。
プロジェクトを管理するためのシステムテストファイルはすでに作ってあるので、そこに新しいシナリオを追加できます。
（状況によっては新しくファイルを作った方がいい場合もあります。）
既存のシステムテストファイルを開き、新しいシナリオのスタブを追加してください。

```ruby:spec/system/projects_spec.rb
require 'rails_helper'

RSpec.describe "Projects", type: :system do
# ユーザーは新しいプロジェクトを作成する
	scenario "user creates a new project" do
		# 元のシナリオは省略 ...
	end

	# ユーザーはプロジェクトを完了済みにする
	scenario "user completes a project"
end
```

ファイルを保存し、`bundleexecrspecspec/system/projects_spec.rb`というコマンドでスペックを実行してください。
たぶん予想が付いていると思いますが、RSpecは次のようなフィードバックを返してきます。

```terminal
Projects
	user creates a new project
	user completes a project (PENDING: Not yet implemented)
	
	Pending: (Failures listed here are expected and do not affect your suite's status)
	
	1) Projects user completes a project
		# Not yet implemented
		# ./spec/system/projects_spec.rb:26

Finished in 0.7601 seconds (files took 0.35072 seconds to load)
2 examples, 0 failures, 1 pending
```

新しいシナリオにいくつかステップを追加しましょう。
ここではユーザーがプロジェクトを完了済みにする流れを記述します。
最初に、何が必要で、ユーザーは何をして、それがどんな結果になるのかを考えましょう。

1. プロジェクトを持ったユーザーが必要で、そのユーザーはログインしていないといけない。
2. ユーザーはプロジェクト画面を開き完了（complete）ボタンをクリックする。
3. プロジェクトは完了済み（completed）としてマークされる。

私はときどきテストに必要な情報をコメントとして書き始めます。
こうすれば簡単にコメントをテストコードで置き換えられるからです。

```ruby:spec/system/projects_spec.rb
# ユーザーはプロジェクトを完了済みにする
scenario "user completes a project", focus: true do
	user = FactoryBot.create(:user)
	project = FactoryBot.create(:project, owner: user)
	sign_in user

	visit project_path(project)
	click_button "Complete"

	expect(project.reload.completed?).to be true
	expect(page).to \
		have_content "Congratulations, this project is complete!"
	expect(page).to have_content "Completed"
	expect(page).to_not have_button "Complete"
end
```

この新機能を実現するためのアプリケーションコードはまだ実際に書いていませんが、どのような形で動くのかはすでに記述しています。
まず、Completeと書かれたボタンがあります。
このボタンをクリックするとプロジェクトのcompleted属性が更新され、値がfalseからtrueに変わります。
それからフラッシュメッセージでプロジェクトが完了済みになったことをユーザーに通知します。
さらにボタンがなくなるかわりに、プロジェクトが完了済みになったことを示すラベルが表示されることを確認します。
これがテスト駆動開発の基本です。
テストから先に書き始めることで、コードがどのように振る舞うのかを積極的に考えることができます。

### レッドからグリーンへ
スペックをもう一度実行してください。
テストは失敗します！
ですが、テスト駆動開発の場合、これは良いこととされているので覚えておきましょう。
なぜなら、テストが失敗することで次に作業すべきゴールがわかるからです。
RSpecは失敗した内容をわかりやすく表示してくれます。

```
1) Projects user completes a project
	Failure/Error: click_button "Complete"

	Capybara::ElementNotFound:
		Unable to find button "Complete"
		
		1) Projects user completes a project
			Failure/Error: click_button "Complete"

			Capybara::ElementNotFound:
				Unable to find button "Complete"
```

さて、この状況を前進させる一番シンプルな方法は何でしょうか？
viewに新しいボタンを追加してみるとどうなるでしょう？

```ruby:app/views/projects/_project.html.erb
<h1 class="heading">
	<%= project.name %>
	<%= link_to edit_project_path(project),
				class: "btn btn-light btn-sm btn-inline" do %>
		<span class="bi bi-pencil-fill" aria-hidden="true"></span>
		Edit
	<% end %>
	<button class="btn btn-light btn-sm btn-inline">
		<span class="bi bi-check-lg" aria-hidden="true"></span>
			Complete
	</button>
</h1>
<!-- 残りの view は省略 ... -->
```

テストをもう一度実行し、前に進んだことを確認しましょう。

```
1) Projects user completes a project
	Failure/Error: expect(project.reload.completed?).to be true
	
	NoMethodError:
		undefined method `completed?' for an instance of Project
```

RSpecは次に何をすべきか、ヒントを与えてくれています。

Projectモデルに`completed?`という名前のメソッドを追加してください。
アプリケーションの内容とビジネスロジックによりますが、ここではいくつかの検討事項が浮かび上がってきます。
プロジェクト内のタスクがすべて完了したら、プロジェクトは完了済みになるのでしょうか？
もしそうであれば、`completed?`メソッドをProjectモデルに定義し、プロジェクト内の未完了タスクが空（つまり、プロジェクトは完了済み）か、そうでないか（プロジェクトは未完了の意味）を返すことができます。

ただし、今回は完了済みかどうかは、ボタンをクリックするというユーザーの操作によって決定され、完了済みかどうかのステータスは永続化されることになります。
なので、この値を保存するために、新しいActiveRecordの属性をモデルに追加する必要があるようです。
projectsテーブルにこのカラムを追加するマイグレーションを作成し、それを実行してください。

```bash
bin/rails g migration add_completed_to_projects completed:boolean
bin/rails db:migrate
```

変更を適用したら、新しいスペックをもう一度実行してください。
今度は別の理由で失敗しますが、新しい失敗は私たちが前進していることを意味しています。

```
1) Projects user completes a project
	Failure/Error: expect(project.reload.completed?).to be true

	expected true
	got false
```

ある意味残念なことですが、この高レベルなテストは他のテストと同じように重要な情報を示しています。
みなさんは何が起きているのかもうわかったかもしれませんが、第6章で説明したLaunchyを使ってチェックしてみましょう。
一時的にLaunchyをテストに組み込んでください。

```ruby:spec/system/projects_spec.rb
scenario "user completes a project", focus: true do
	user = FactoryBot.create(:user)
	project = FactoryBot.create(:project, owner: user)
	sign_in user

	visit project_path(project)
	click_button "Complete"
	save_and_open_page
	expect(project.reload.completed?).to be true
	expect(page).to \
		have_content "Congratulations, this project is complete!"
	expect(page).to have_content "Completed"
	expect(page).to_not have_button "Complete"
end
```

興味深いことに、画面がプロジェクト画面から変わっていません。
ボタンをクリックしても何も起きないようですね。
ああそうだ、先ほどviewに`<button>`タグを追加しましたが、このボタンが機能するようにしなければならないのでした。
viewを変更してちゃんと動くようにしていきましょう。

ですが、ここで新たに設計上の判断が必要になります。
データベースに変更を加えるこのボタンのルーティングはどのようにするのが一番良いでしょうか？
コードをシンプルに保ち、Projectコントローラのupdateアクションを再利用することもできますが、ここではフラッシュメッセージが異なるため、まったく同じ振る舞いにはなりません。

そこでコントローラに新しいメンバーアクションを追加することにしましょう。
この新機能のテストがいったんパスすれば、時間が許す限り別の実装を試すことも可能です。

この場合は高いレベルから始めて、だんだん下へ降りていくアプローチが良いと思います。
viewに戻ってボタンを修正しましょう。
`<button>`タグはRailsのbutton_toヘルパーの呼び出しに置き換えてください。

```ruby:app/views/projects/_project.html.erb
<h1 class="heading">
	<%= project.name %>
		<%= link_to edit_project_path(project),
					class: "btn btn-light btn-sm btn-inline" do %>
			<span class="bi bi-pencil-fill" aria-hidden="true"></span>
			Edit
		<% end %>

		<%= button_to complete_project_path(project),
					method: :patch,
					form: { style: "display:inline-block;" },
				class: "btn btn-light btn-sm btn-inline" do %> 
			<span class="bi bi-check-lg" aria-hidden="true"></span>
			Complete
		<% end %>
</h1>

<!-- 残りの view は省略 ... -->
```

スタイルの記述を少し追加したことに加えて、この新しいアクションで呼ばれるルートヘルパーの定義も考えてみました。
それが`complete_project_path`です。
`save_and_open_page`をスペックから削除し、テストをもう一度実行してください。
おっと、新しい失敗メッセージが出ました。

```bash
1) Projects user completes a project
	Failure/Error: <%= button_to complete_project_path(@project), %>
	
			ActionView::Template::Error:
				undefined method `complete_project_path' for
				an instance of #<Class:0x0000000124707b30>
				
```

このエラーはまさにこれから使おうとしている新しいルーティングをまだ定義していないというヒントになっています。
では、routesファイルにルーティングを追加しましょう。

```ruby:config/routes.rb
resources :projects do
	resources :notes
	resources :tasks do
		member do
			post :toggle
		end
	end

	member do
		patch :complete
	end
end
```

ルーティングを追加してからスペックを実行すると、別の新しい失敗メッセージが表示されます。

```
1) Projects user completes a project
		Failure/Error: click_button "Complete"
		
		AbstractController::ActionNotFound:
				The action 'complete' could not be found for ProjectsController
```

RSpecは私たちに何を修正すればいいのか、良いヒントを与えてくれています。
（訳注：エラーメッセージの最後に「ProjectsControllerに`complete`アクションが見つかりません」と出力されています）

ここに書かれているとおり、Projectコントローラに空の`complete`アクションを作成しましょう。
追加する場所はRailsのジェネレータで作成された既存の`destroy`アクションの下にします。

```ruby:app/controllers/projects_controller.rb
def destroy
	# Rails ジェネレータのコードは省略 ...
end

def complete
end
```

中身も書き始めたいという誘惑に駆られますが、テスト駆動開発の信条は「テストを前進させる必要最小限のコードを書く」です。
先ほど、テストはアクションが見つからないと訴えていました。
私たちはそれを追加しました。
テストを実行して、現在の状況を確認してみましょう。

```
1) Projects user completes a project
		Failure/Error: unless @project.owner == current_user
		
		NoMethodError:
				undefined method `owner' for nil
				# ./app/controllers/application_controller.rb:13:in `project_owner?'
```

ちょっと面白い結果になりました。
まったく別のコントローラでテストが失敗しています！
これはなぜでしょうか？
Projectコントローラではアクションを実行する前にいくつかのコールバックを設定しています。
ですが、その中に新しく作ったcompleteアクションを含めていませんでした。
これが失敗の原因です。
というわけで、アクションを追加しましょう。

```ruby:app/controllers/projects_controller.rb
class ProjectsController < ApplicationController
	before_action :set_project, only: %i[ show edit update destroy complete ]
	before_action :project_owner?, except: %i[ index new create ]

	# コントローラのコードは以下省略 ...
```

ではスペックを再実行してください。

```
Failures:
		1) Projects user completes a project
				Failure/Error: expect(project.reload.completed?).to be true
```

この結果は一見、何歩か後退してしまったように見えます。
この失敗メッセージは少し前にも見たんじゃないでしょうか？
ですが実際にはゴールに近づいています。
上の失敗メッセージはコントローラのアクションには到達したものの、そのあとに何も起きなかったことを意味しています。
というわけで、正常系のシナリオを満足させるコードを書いていきましょう。
ここでは何の問題もなくユーザーがプロジェクトを完了済みにできることを前提とします。

```ruby:app/controllers/projects_controller.rb
def complete
	@project.update!(completed: true)
	redirect_to @project,
	notice: "Congratulations, this project is complete!"
end
```

スペックをもう一度実行してください。
もうそろそろ終わりに近づいてきているはずです！

```
Failures:
		1) Projects user completes a project
				Failure/Error: expect(page).to have_content "Completed"
				expected to find text "Completed" in "Toggle navigation
				Project Manager Projects Aaron Sumner Sign Out
				× Congratulations, this project is complete!
				Project 1 Edit Complete A test project. Owner: Aaron Sumner
				Due: October 11, 2017 (7 days from now) Tasks Add Task
				Name Actions Notes Add Note Term"
```

ここに表示されている画面内の文言を読んでいくと、どうやらCompletedという文字列が画面に出力されていないようです。
これはまだこの文字列を追加していないからであり、さらに言うと私たちがやっているのはテスト駆動開発だからです。

ではviewに文字列を追加してみましょう。
先ほど追加したボタンの隣によく目立つラベルの`<span>`タグを追加してください。

```ruby:app/views/projects/_project.html.erb
<h1 class="heading">
	<%= project.name %>
	<%= link_to edit_project_path(project),
				class: "btn btn-light btn-sm btn-inline" do %>
		<span class="bi bi-pencil-fill" aria-hidden="true"></span>
		Edit
	<% end %>

	<%= button_to complete_project_path(project),
				method: :patch,
				form: { style: "display:inline-block;" },
				class: "btn btn-light btn-sm btn-inline" do %>

		<span class="bi bi-check-lg" aria-hidden="true"></span>
			Complete
	<% end %>

	<span class="badge bg-success">Completed</span>
</h1>

<!-- 残りの view は省略 ... -->
```

テストをもう一度実行してください。
失敗しているのは最後のステップだけです！

```
Failures:
		1) Projects user completes a project
		Failure/Error: expect(page).to_not have_button "Complete"
		expected not to find button "Complete", found 1 match: "Complete"
```

プロジェクトは完了済みになっていますが、Completeボタンがまだ表示されたままです。
このままだとユーザーを混乱させてしまうので、完了済みのプロジェクトを開いたときはUIにボタンを表示しないようにすべきです。
viewに新たな変更を加えれば、これを実現できます。

```ruby:app/views/projects/_project.html.erb
<h1 class="heading">
	<%= project.name %>
	<%= link_to edit_project_path(project),class: "btn btn-light btn-sm btn-inline" do %>
		<span class="bi bi-pencil-fill" aria-hidden="true"></span>
		Edit
	<% end %>

	<% unless project.completed? %>
	<%= button_to complete_project_path(project),method: :patch,form: { style: display:inline-block;" },class: "btn btn-light btn-sm btn-inline" do %>
			<span class="bi bi-check-lg" aria-hidden="true"></span>
			Complete
			<% end %>
	<% end %>
	<span class="badge bg-success">Completed</span>
</h1>
```

スペックを実行してください。
・・・ついにパスしました！

```
Projects
		user completes a project
		
Finished in 0.58043 seconds (files took 0.35844 seconds to load)
1 example, 0 failures
```

私はviewのロジックに変更が入ったらブラウザでどうなったのか確認するようにしています
（APIのエンドポイントを書いているときは`curl`かその他のHTTPクライアントでテストします）。
Railsの開発用サーバーが動いていなければ、サーバーを起動してください。
それからプロジェクト画面をブラウザで開いてください。
Completeボタンをクリックすると本当にプロジェクトが完了済みになり、ボタンが表示されなくなることを確認してください
と言いたいところですが、プロジェクトの完了状態にかかわらず、先ほど追加したCompletedのラベルが表示されています！
どうやらこの新機能が完成したと宣言する前に、テストをちょっと変更した方がいいようです。
新しいアクションを実行する前に、Completedのラベルが画面に表示されていないことを確認しましょう。

```ruby:spec/system/projects_spec.rb
# ユーザーはプロジェクトを完了済みにする
scenario "user completes a project" do
	user = FactoryBot.create(:user)
	project = FactoryBot.create(:project, owner: user)
	sign_in user

	visit project_path(project)

	expect(page).to_not have_content "Completed"

	click_button "Complete"

	expect(project.reload.completed?).to be true
	expect(page).to \
		have_content "Congratulations, this project is complete!"
	expect(page).to have_content "Completed"
	expect(page).to_not have_button "Complete"
end
```

こうするとスペックはまた失敗してしまいます。
ですが、これは一時的なものです。

```
Failures:
		1) Projects user completes a project
				Failure/Error: expect(page).to_not have_content "Completed"
				expected not to find text "Completed" in "Toggle navigation
				Project Manager Projects Aaron Sumner Sign Out Project 1 Edit 
				Complete Completed A test project. Owner: Aaron Sumner
				Due: October 11, 2017 (7 days from now) Tasks Add Task
				Name Actions Notes Add Note Term"
```

ボタンの周りに付けていた条件分岐を変更し、ラベルの表示も制御するようにしましょう。

```html:app/views/projects/_project.html.erb
	<h1 class="heading">
		<%= project.name %>
		<%= link_to edit_project_path(project), class: "btn btn-light btn-sm btn-inline" do %>
			<span class="bi bi-pencil-fill" aria-hidden="true"></span>
			Edit
		<% end %>
		<% if project.completed? %>
			<span class="badge bg-success">Completed</span>
		<% else %>
			<%= button_to complete_project_path(project), method: :patch, form: { style: "display:inline-block;" }, class: "btn btn-light btn-sm btn-inline" do %>
				<span class="bi bi-check-lg" aria-hidden="true"></span>
				Complete
			<% end %>
		<% end %>
	</h1>
```

そしてスペックをもう一度実行してください。

```
Projects
		user completes a project
		
Finished in 0.82131 seconds (files took 0.47196 seconds to load)
1 example, 0 failures
```

グリーンに戻りました！
ここまでは一つのスペックだけを実行してきましたが、別のことを始める前はいつもテストスイート全体をチェックするようにすべきです。
`bundle exec rspec`を実行し、今回の変更が既存の機能を何も壊していないことを確認してください。
TDDの最中に`focus:true`タグ、もしくは`:focus`タグを付けていた場合は、それも外すようにしましょう。
テストスイートはグリーンになりました。
これなら大丈夫そうです！

### 外から中へ進む（Going outside-in）
私たちは高レベルの統合テストを使い、途中でソフトウェアがどんな振る舞いを持つべきか検討しながら、この新しい機能を完成させました。
この過程の大半において、私たちは次にどんなコードを書くべきか、すぐにわかりました。
なぜならRSpecがその都度私たちにフィードバックを伝えてくれたからです。

ですが、数回は何が起きていたのかじっくり調べる必要もありました。
今回のケースでは、Launchyがデバッグツールとして大変役に立ちました。

しかし、問題を理解するために、さらにテストを書かなければいけないこともよくあります。
こうやって追加したテストはあなたの書いたコードをいろんなレベルから突っつき、高レベルのテストだけでは集めてくるのが難しい、有益な情報を提供してくれます。
これがまさに、 __外から中へ（outside-in）__ のテストです。

私はいつもこのような方法でテスト駆動開発を進めています。
私はブラウザのシミュレートの実行コストが成果に見合わないと思った場合に、低レベルのテストを活用することもよくやります。
私たちが書いた統合テストは正常系の操作です。
プロジェクトを完了済みにする際、ユーザーはエラーに遭遇することはありませんでした。
では、更新に失敗する場合のテストも高レベルのテストとして新たに追加する必要があるでしょうか？
いいえ、これは追加する必要はないかもしれません。
なぜなら私たちはすでにCompleteボタンが正しく実装され、画面にフラッシュメッセージが正しく表示されていることを確認したからです。
この次はコントローラのテストに降りていって、異常系の操作をいろいろとテストするのが良いかもしれません。

たとえば、適切なフラッシュメッセージが設定され、プロジェクトオブジェクトが変わらないことを検証する、といったテストです。
この場合、すでにコードは書いてあるので、コントローラのテストではプロジェクトを完了済みにする際に発生したエラーも適切に処理されることを確認するだけです。
このテストは既存のProjectコントローラのスペックに追加できます。

```ruby:spec/controllers/projects_controller_spec.rb
require 'rails_helper'

RSpec.describe ProjectsController, type: :controller do
	# 他の describe ブロックは省略 ...

	describe "#complete" do
		# 認証済みのユーザーとして
		context "as an authenticated user" do
			let!(:project) { FactoryBot.create(:project, completed: nil) }

			before do
				sign_in project.owner
			end

			# 成功しないプロジェクトの完了
			describe "an unsuccessful completion" do
				before do 
					allow_any_instance_of(Project).
						to receive(:update).
						with(completed: true).
						and_return(false)
				end

				# プロジェクト画⾯にリダイレクトすること
				it "redirects to the project page" do
					patch :complete, params: { id: project.id }
					expect(response).to redirect_to project_path(project)
				end

				# フラッシュを設定すること
				it "sets the flash" do
					patch :complete, params: { id: project.id }
					expect(flash[:alert]).to eq "Unable to complete project."
				end

				# プロジェクトを完了済みにしないこと
				it "doesn't mark the project as completed" do
					expect {
						patch :complete, params: { id: project.id }
					}.to_not change(project, :completed)
				end
			end
		end
	end
end
```

上の`example`はいずれも失敗をシミュレートするのに十分なものです。
ここで`はallow_any_instance_of`を使って、失敗を再現しました。
`allow_any_instance_of`は第9章で使った`allow`メソッドの仲間です。
このコードではあらゆる（any）プロジェクトオブジェクトに対する`update`の呼び出しに割って入り、プロジェクトの完了状態を保存しないようにしています。
`allow_any_instance_of`は問題を引き起こしやすいメソッドなので、`describe "an unsuccessful completion"`ブロックの中でだけ使われるように注意しなければなりません。
このテストを実行し、何が起きるか見てみましょう。

```
Failures:
		1) ProjectsController#complete as an authenticated user an unsuccessful completion sets the flash
				Failure/Error: expect(flash[:alert]).to eq "Unable to complete
				project." 
					expected: "Unable to complete project."
					got: nil
					(compared using ==)
		# ./spec/controllers/projects_controller_spec.rb:246:in
		`block (5 levels) in <top (required)>'
```

この結果を見ると、ユーザーは期待どおりにリダイレクトされ、プロジェクトも意図した通り、完了済みになっていないようです。
しかし、問題の発生を知らせるメッセージが設定されていません。
アプリケーションコードに戻り、これを処理する条件分岐を追加しましょう。

```ruby:app/controllers/projects_controller.rb
def complete
	if @project.update(completed: true)
		redirect_to @project,
			notice: "Congratulations, this project is complete!"
	else
		redirect_to @project, alert: "Unable to complete project."
	end
end
```

このように変更すれば、新しいテストは全部パスします。
これで正常系も異常系も、どちらもテストすることができました。
ここまでの内容をまとめると、私は「外から中へ」のテストをするときは、高レベルのテストから始めて、ソフトウェアが意図したとおりに動いていることを確認するようにします。
このとき、すべての前提条件とユーザーの入力値は正しいものとします
（つまり正常系）。

今回は統合テストとして、ブラウザのシミュレーションを行うシステムテストの形式を利用しました。
ですが、APIのテストをする場合はリクエストスペックを使います
（第7章を参照）。
それから、低いレベルのテストに降りていき、可能な限り直接、細かい内容をテストします。
今回はコントローラスペックを使いましたが、たいていの場合、モデルを直接テストしても大丈夫です。
このテクニックはビジネスロジックを普通のRailsのモデルやコントローラから取り出して、サービスオブジェクトのような単体のクラスに移動させるかどうか検討する場合にも使えます。

### レッド・グリーン・リファクタのサイクル
新機能はひととおり完成しました。
ですが、これで終わりではありません。
ちゃんとパスするテストコードを使って、ここからさらに自分が書いたコードを改善することができます。
「レッド・グリーン・リファクタ」でいうところの「リファクタ」の段階に到達したわけです。
新しいテストコードを使えば、他の実装方法を検討したり、先ほど書いたコードをきれいにまとめたりすることができます。
リファクタリングは非常に複雑で、詳しく説明し始めると本書の範疇を超えてしまいます。
ですが、検討すべき選択肢はいくつか存在します。
簡単なものから難しいものの順に並べてみましょう。

- 私たちは`projects/_project`のviewに新しい条件分岐を追加しました。この分岐はCompleteボタンを表示するか、もしくはプロジェクトが完了済みであることを表示するかを決めるためのものです。私たちはこのコードをパーシャルviewに抽出して、メインviewをシンプルに保つべきでしょうか？
- プロジェクトを完了させるルーティングを新たに実装する際、私たちは違う形でコントローラを構築する方法についても簡単に議論しました。今回選択した実装方法は本当にベストでしょうか？（この機能をテストするために何をやったのか見直してみると、私はちょっと自信がなくなります。コントローラのテストでActive Recordのメソッドをスタブ化するのは、コントローラが多くのことをやりすぎているヒントかもしれません。）
- ビジネスロジックをコントローラから取り出して他の場所に移動させると、テストがよりシンプルになるかもしれません。ですが、どこがいいでしょうか？Projectモデルに移動して`Project#mark_completed`のような新しいメソッドを作るとシンプルになりそうです。ですが、こういったアプローチを採用しすぎると、巨大なモデルができあがってしまう恐れがあります。別のアプローチとして、プロジェクトを完了済みにすることだけに責任を持つ、サービスオブジェクトにロジックを移動させる方法もあります。そうすれば、このサービスオブジェクトを直接テストするだけで済むので、コントローラを動かす必要がなくなります。
- もしくはまったく異なるコントローラの構成を選択することもできます。既存のコントローラにアクションを追加するかわりに、ネストしたリソースフル（resourceful）なコントローラを新たに作り、updateアクションを定義して親のプロジェクトを完了させるのはどうでしょうか？

別の実装方法を検討する際は、テストを活用してください。
さらに、コードを書いていたときに、テストコードが教えてくれたことも思い出してください。

ほとんどの場合、コードを書く方法は一つだけとは限りません。
いくつかの選択肢があり、それぞれに長所と短所があります。
リファクタリングをするときは、小さくてインクリメンタルな変更を加えていってください。
そして、テストスイートをグリーンに保ってください。
これがリファクタリングの鍵となる手順です。
どんな変更を加えても、テストは常にパスさせる必要があります。
（もしくは、失敗したとしても、それは一時的なものであるべきです。）
リファクタリングの最中は、高いレベルのテストと低いレベルのテストの間を行ったり来たりするかもしれません。
システムスペックから始まり、モデルやコントローラ、もしくは独立したRubyオブジェクトへと対象のレベルが下がっていくこともあります。
対象となるテストのレベルは、アプリケーション内のどこにコードを置くともっとも都合が良いのか、そしてどのレベルのテストが最も適切なフィードバックを返してくれるのかによって、変わってくるものです。

