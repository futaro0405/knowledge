```Docker-compose.yml
version: "3.9"

services:
  web:
    build: .
    ports:
      - '3000:3000'
    volumes:
      - '.:/spa-todo'
    tty: true
    stdin_open: true
```

```Dockerfile
FROM node:14.17.6 as node
FROM ruby:3.2.2
RUN apt-get update -qq && \
  apt-get install -y build-essential \
  libpq-dev \
  postgresql-client \
  vim \
  nodejs \
  npm \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
  
RUN mkdir /spa-todo
WORKDIR /spa-todo
  
COPY Gemfile Gemfile.lock /spa-todo/
  
ENV BUNDLER_VERSION 2.5.5
RUN gem update --system \
    && gem install bundler -v $BUNDLER_VERSION \
    && bundle install -j 4
  
COPY package.json ./
RUN npm install
  
COPY . /spa-todo
  
# Add a script to be executed every time the container starts.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000
  
# Start the main process.
CMD ["rails", "server", "-b", "0.0.0.0"]
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
npm init
npm install --save-dev --save-exact react-router-dom axios styled-components react-icons react-toastify
volta pin node@14.17.6
```


```
rails new . --force --database=postgresql --skip-bundle --webpack=react -T
```
