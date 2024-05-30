```Docker-compose.yml
version: "3.9"
  
services:
  web:
    build: .
    ports:
      - '3000:3000'
    volumes:
      - '.:/rails-docker'
    tty: true
    stdin_open: true
```

```Dockerfile
FROM ruby:3.2.2
RUN apt-get update -qq && apt-get install -y \
  build-essential \
  libpq-dev \
  postgresql-client \
  nodejs \
  npm
  
RUN mkdir /rails-docker
WORKDIR /rails-docker
  
COPY Gemfile /rails-docker/Gemfile
COPY Gemfile.lock /rails-docker/Gemfile.lock
  
RUN bundle install
  
COPY package.json package-lock.json ./
RUN npm install
  
COPY . /rails-docker
```

```entrypoint.sh
#!/bin/bash

set -e
  
# Remove a potentially pre-existing server.pid for Rails.
rm -f /myapp/tmp/pids/server.pid
  
# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
```

```Gemfile
source 'https://rubygems.org'
gem "rails", "~> 7.0.6"
```

```Gemfile.lock
```

```
npm init -y
npm install --save-dev --save-exact react-router-dom axios styled-components react-icons react-toastify
docker-compose up --build -d
```


```
rails new . --force --database=postgresql --webpack=react -T
```

```
docker-compose down
docker-compose up --build -d
```


```
version: "3.9"

volumes:
  db-data:

services:
  web:
    build: .
    ports:
      - '3000:3000'
    volumes:
      - '.:/rails-docker'
    environment:
      - 'DATABASE_PASSWORD=postgres'
    tty: true
    stdin_open: true
    depends_on:
      - db
    links:
      - db

  db:
    image: postgres:12
    volumes:
      - 'db-data:/var/lib/postgresql/data'
    environment:
      - 'POSTGRES_USER=postgres'
      - 'POSTGRES_PASSWORD=postgres'
```


こちらの部分を修正します。
```config/database.yml
default: &default
  adapter: postgresql
  encoding: unicode
  # For details on connection pooling, see Rails configuration guide
  # https://guides.rubyonrails.org/configuring.html#database-pooling
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
```

こちらが修正後です。
```config/database.yml
default: &default
  adapter: postgresql
  encoding: unicode
  host: db
  user: postgres
  port: 5432
  password: <%= ENV.fetch("DATABASE_PASSWORD") %>
  # For details on connection pooling, see Rails configuration guide
  # https://guides.rubyonrails.org/configuring.html#database-pooling
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
```

```
$ docker-compose up -d
$ docker-compose exec web bash
$ # rails db:create
$ # rails g scaffold product name:string price:integer vendor:string
$ # rails db:migrate
$ # rails s -b 0.0.0.0
```