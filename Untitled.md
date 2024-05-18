```ruby:notification.rb
class Notification < ApplicationRecord
  belongs_to :user
  belongs_to :action, polymorphic: true
end
```

```ruby:user.rb
class User < ApplicationRecord
  has_many :notifications, dependent: :destroy
end
```

```ruby:post.rb
class Post < ApplicationRecord
  belongs_to :user
end
```

```ruby:like.rb
class Like < ApplicationRecord
  belongs_to :user
  belongs_to :post
  has_one :notification, as: :action, dependent: :destroy

  after_create :create_notification

  private

    def create_notification
    Notification.create(user: post.user, action: self, action_type: self.class.name )
  end
end

```

```ruby:comment.rb
class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :post
  has_one :notification, as: :action, dependent: :destroy
end
```

```ruby:repost.rb
class Repost < ApplicationRecord
  belongs_to :user
  belongs_to :post
  has_one :notification, as: :action, dependent: :destroy
end
```
