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
end
```

**xxxx_create_line_foods.rb**

```ruby:db/migrate/xxx_create_line_foods.rb
db/migrate/xxx_create_line_foods.rb123456789101112131415               Copied!class CreateLineFoods < ActiveRecord::Migration[6.0]
  def change
    create_table :line_foods do |t|
      # --- ここから追加 ---
      t.references :food, null: false, foreign_key: true
      t.references :restaurant, null: false, foreign_key: true
      t.references :order, foreign_key: true
      t.integer :count, null: false, default: 0
      t.boolean :active, null: false, default: false

      t.timestamps
      # --- ここまで追加 ---
    end
  end
end
```