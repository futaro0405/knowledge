## Dockerfile
```Dockerfile
FROM ruby:3.2.2
RUN apt-get update && apt-get install -y \
	build-essential \
	libpq-dev \
	nodejs \
	postgresql-client \
	yarn
WORKDIR /rails-practice
COPY Gemfile Gemfile.lock /rails-practice/
RUN bundle install
```
## Gemfile
```Gemfile
source 'https//rubygems.org'
gem 'rails', '~>7.0.6'
```
## docker-compose.yml
```docker-compose.yml
version: '3'
services:
	web:
		build: .
		ports:
			- '3000:3000'
		volumes:
			- '.:/rails-practice'
		tty: true
		stdin_open: true
```
## dockerをbuild
```powershell
docker compose up --build -d
```
## railsをsetup
```powershell
docker compose exec bash

rails new . --force --database=postgresql --skip-bundle
exit

docker compose down
docker compose up --build -d
```
## DB setup
```docker-compose.yml
version: '3'
services:
  web:
    build: .
    ports:
      - '3000:3000'
    volumes:
      - '.:/rails-practice'
    environment:
      - DATABASE_PASSWORD=postgres
    tty: true
    stdin_open: true
    depends_on:
      - db
    links:
      - db
  db:
    image: postgres
    volumes:
      - 'db-data:/var/lib/postgresql/data'
volumes:
  db-data:
```

```powershell
docker compose exec web bash

rails db:migrate
```
`config/database.yml`を修正
```config/database.yml
default: &default
  adapter: postgresql
  encoding: unicode
  host: db
  user: postgres
  post: 5432
  password: <%= ENV.fetch("DATABASE_PASSWORD") %>
  # For details on connection pooling, see Rails configuration guide
  # https://guides.rubyonrails.org/configuring.html#database-pooling
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
```
