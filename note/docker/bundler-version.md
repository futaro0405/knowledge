```bash
Calling `DidYouMean::SPELL_CHECKERS.merge!(error_name => spell_checker)' has been deprecated. Please call `DidYouMean.correct_error(error_name, spell_checker)' instead.
Bundler version x.x.xx
```

Dockerfileを更新しbundlerのversionを更新
```Dockerfile
RUN bundle install
```
この部分を修正
```Dockerfile
ENV BUNDLER_VERSION 2.5.5
RUN gem update --system \
    && gem install bundler -v $BUNDLER_VERSION \
    && bundle install -j 4
```
修正したら`docker compose build`