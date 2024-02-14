## Userモデル作成
```bash
bin/rails g midel user name:string email:string password_digest:string
```
## migration修正
```ruby
def change
	create_table :users do |t|
		t.string :name, null: false
		t.string :email, null: false
		t.string :password_digest, null: false

		t.timestamps
		t.index :email, uniqe: true
	end
end
```
## パスワード
```Gemfile
gem 'bcrypt', '~> 3.1.7'
```

```ruby:app/models/user.rb
class User < ApplicationRecord
	has_secure_password
end
```

## Userモデルにadminフラグ追加
```
bin/rails g migration add_admin_to_users
```

```
def change
	add_column :users, :admin, :boolean, default: false, null: false
```

## controllerを作成
```
bin/rails g controller Admin::Users new edit show index
```

```config/routes.rb
Rails.application.routes.draw do
	namespace :admin do
		resources :users
	end

	root to: 'tasks#index'
	...
end
```
各機能作りこみ
```app/controllers/admin/user_controller.rb
	def new
		@user = User.new 
	end
	def create 
		@user = User.new(user_params)
		if @user.save
			redirect_to admin_user_url(@user), notice: "ユーザー「#{@user.name}」を登録しました"
			else
				render :new
			end
	end

	private
	def user_params
		params.require(:user).permit(:name, :email, :admin, :password, :password_confimation)
	end
end
```
```app/views/admin/users/new.rb

```
Userクラスに検証を追加
```app/models/user.rb
class User < ...
	has_secure_password

	validates :name, presemce: true
	validates :email, presemce: true, uniqueness: true
end
```
残りのCRUD機能を追加
```app/controllers/admin/users_controller.rb
...
```
```app/views/admin/users/index.html.rb
...
```
```app/views/admin/users/new.html.rb
...
```
```app/views/admin/users/edit.html.rb
...
```
```app/views/admin/users/_form.html.rb
...
```
```app/views/admin/users/show.html.rb
...
```
```config/locales/ja.yml
	user:
		id: ID
		name: 名前
		...
```
## login
|                                    |        |         |         |
| ---------------------------------- | ------ | ------- | ------- |
| ログインフォーム表示               | GET    | /login  | new     |
| formから送られた情報を元にログイン | POST   | /login  | create  |
| ログアウト                         | DELETE | /logout | destroy |

### SessionsController
```
bin/rails g controller Sessions new
```
route修正
```config/routes.rb
	get '/login', to: 'sessions#new'
	...
```
ログイン画面
```app/views/sessions/new.html.rb
...
```
ログイン実行
```config/routes.rb
	post '/login', to: 'sessions#create'
	
```
```app/controllers/sessions_controller.rb
	def create
		user = User.find_by(email: session_params[:email])

		if user&.authenticate(sessions_params[:password])
			session[:user_id] = user.id
			redirect_to root_url, notice: 'loginしました'
		else
			render :new
		end
	end

	private

	def sesion_params
		params.require(:session).permit(:email, :password)
	end
```
ログインしていれば下記で取得できる
```
User.find_by(id: session[:user_id])
```

```app/controllers/application_controller.rb
class ... 
	helper_method :current_user
	
	private

	def current_user
		@current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
	end
end
```
logout
`session[:user_id]`に`nil`が入っている状態にする
sessionからuser_idを消す
```
session.delete(:user_id)
```
その他の情報もまとめて消す
```
reset_session
```

```config/routes.rb
	...
	delete '/logout', to: 'session#destroy'
	...
```
```app/controllers/sessions_controller.rb
	...
	def destroy
		reset_session
		redirect_to root_url, notice: 'logout'
	end
	...
```
```app/views/layouts/application.html.rb
... 
```
未ログイン状態の処理
filter
```app/controllers/application_controller.rb
	before_action :login_required

	priveate
	def login_required
		redirect_to login_url unless current_user
	end
```
login画面を除外
```app/controllers/sessions_controller.rb
	skip_before_action :login_requied
```
ログインユーザーのみにする
```
bin/rails g migration AddUserIdTasks
```

```db/migrate/xxx_AddUserIdTasks.rb
	def up
		execute 'DELETE FROM tasks;'
		add_reference :tasks, :user, null: false, index: true
	end

	def down
		remove_reference :tasks, :user, index: true
	end
```
Rails Association
UserとTasksの関係は1対多なので
```app/models/user.rb
...
	has_many :tasks
...
```

```app/models/task.rb
...
	belongs_to :user
...
```
`has_many`
Userのidを外部キーとして抱えるようなTaskがあり、複数登録可能とする
`belongs_to`
TaskがUserに所属しておりidを外部キーとして抱えることを表す
この定義でUserクラスのインスタンスに対して`user.tasks`で一覧を得られる
`task.user`でひもづいたUserオブジェクトが得られる

userにひもづいたTaskデータを扱う
```app/controllers/tasks_controller.rb
	def create
		@task = current_user.task.new(task_params)

		if @task.save
			redirect_to @task, notice: "#{@task.name}"
		else
			render :new
		end
	end
```
```app/controllers/tasks_controller.rb
	def index
		@tasks = current_user.tasks
	end
```

`Task.find(params[:id])`
修正
`current_user.tasks.find(params[:id])`

adminのみに管理機能
```app/views/layouts/application.html.rb
	<% if current_user.admin? %>
```
adminuserのみが使えるようにする
```app/controllers/admn/users_controller.rb
class Admin::UsersController ... 
	before_action :require_admin
	...
	private
	...
	def require_admin
		redirect_to root_url unless current_user.admin?
	end
end
```
アクションが存在しないときのようにHTTPステータスコードに404を返すコードでもいい

最初の管理者ユーザーを作る
```bash
User.Create!(name: 'admin', email: 'admin@example.com', password: 'password', password_confimation: 'password', admin: true)
```

