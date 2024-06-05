```
rails g migration CreateRestaurants
rails g migration CreateFoods
rails g migration CreateOrders
rails g migration CreateLineFoods
```

## migration
```ruby:db/migrate/xxx_create_restaurants.rb
def change
	create_table :restaurants do |t|
		t.string :name, null: false
		t.integer :fee, null: false, default: 0
		t.integer :time_required, null: false

		t.timestamps
	end
end
```

```ruby:db/migrate/xxx_create_foods.rb
def change
	create_table :foods do |t|
		t.references :restaurant, null: false, foreign_key: true
		t.string :name, null: false
		t.integer :price, null: false
		t.text :description, null: false

		t.timestamps
	end
end
```

```ruby:db/migrate/xxxx_create_orders.rb
def change
	create_table :orders do |t|
		t.integer :total_price, null: false, default: 0
		t.timestamps
	end
end
```

```ruby:db/migrate/xxx_create_line_foods.rb
def change
	create_table :line_foods do |t|
		t.references :food, null: false, foreign_key: true
		t.references :restaurant, null: false, foreign_key: true
		t.references :order, foreign_key: true
		t.integer :count, null: false, default: 0
		t.boolean :active, null: false, default: false
		
		t.timestamps
	end
end
```

```bash
rails db:migrate
```

## Model
```
rails g model restaurant
rails g model food
rails g model order
rails g model line_food
```
### models/restaurant.rb
```ruby:app/models/restaurant.rb
has_many :foods
has_many :line_foods, through: :foods

validates :name, :fee, :time_required, presence: true
validates :name, length: { maximum: 30 }
validates :fee, numericality: { greater_than: 0 }
```
### models/food.rb
```ruby:app/models/food.rb
belongs_to :restaurant
belongs_to :order, optional: true
has_one :line_food
```
### models/line_food.rb
```ruby:app/models/line_food.rb
belongs_to :food
belongs_to :restaurant
belongs_to :order, optional: true

validates :count, numericality: { greater_than: 0 }

scope :active, -> { where(active: true) }
scope :other_restaurant, -> (picked_restaurant_id) { where.not(restaurant_id: picked_restaurant_id) }

def total_amount
food.price * count
end
```
```rb
belongs_to :order, optional: true
```
`optional: true`関連付けが任意。関連付け先が存在しなくてもいい
