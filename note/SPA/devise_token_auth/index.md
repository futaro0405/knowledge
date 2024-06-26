# devise_token_auth
## devise_token_authとは
`devise_token_auth`はRailsおけるトークンベースの認証機能を作成する際に用いられるgemです。
フロントとバックを分けて開発する際に使用されます。

## 環境設定
まずは必要なgemをインストールします。

```
gem "devise"
gem "devise_token_auth"
gem "rack-cors"
```

```
bundle install
```

deviseとdevise_token_authをインストール

```
rails g devise:install
rails g devise_token_auth:install User auth
```

```
rails g controller v1/auth/registrations
```

```ruby:app/controller/api/v1/auth/registrations_controller.rb
class V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
end
```

```ruby:config/route.rb
Rails.application.routes.draw do
	namespace :api do
		namespace :v1 do
			mount_devise_token_auth_for 'User', at: 'auth', controllers:  {
				registrations: 'api/v1/auth/registrations'
			}
		end
	end
end
```

```
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable #　追加
```

```gemfile
group :development do
  gem 'letter_opener_web', '~> 2.0'
end
```

```route.rb
	mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
```

```ruby:config/environments/development.rb
	config.action_mailer.delivery_method = :letter_opener
	config.action_mailer.perform_deliveries = true
```

```ruby:config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # 開発環境の場合は、全てのオリジンからのリクエストを許可する
    if Rails.env.development?
      origins '*'
    else
      origins "example.com"
    end

    resource '*',
      headers: :any,
      expose: ["access-token", "expiry", "token-type", "uid", "client"],
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

フロント側

```jsx:app.jsx
import React, { useState } from 'react';
import axios from 'axios';

function UserSignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth', {
        // パラメータとして送っているのはemailとpasswordの二つのみ。
        email: email,
        password: password
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
}

export default UserSignUp;
```

```ruby:app/controllers/api/v1/auth/registrations_controller.rb
class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  private
  def sign_up_params
    params.require(:registration).permit(:email, :password)
  end
end
```

普通にエラー

```
POST http://localhost:3000/api/v1/auth 500 (Internal Server Error)
```

