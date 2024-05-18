# concern
ModelやControllerを構成する一部の概念や機能を実装するためのモジュールのこと。
特定の概念や機能を有するロジックをModelやControllerとは分離させ実装することができる。

## 使用例
### 通常のConcern
```ruby:app/models/concerns/searchable.rb
module Searchable
		extend ActiveSupport::Concern

		def search(query)
				where("name LIKE ?", "%#{query}%")
		end
end
```

```ruby:app/controllers/users_controller.rb
class UsersController < ApplicationController
		include Searchable

		def index
		    if params[:query].present?
		      @users = search(params[:query])
		    else
		      @users = User.all
		    end
		end
end
```
