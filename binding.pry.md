## setting
### gem
```
group :development do
  gem 'pry-byebug'
end
```

```yml:docker-compose.yml
version: '3'
services:
...
  web:
    tty: true
    stdin_open: true
...
```

- `stdin_open`
	- 標準入力への接続
- `tty`
	- 標準出力の接続
### 使用方法
処理を止めたい箇所に`binding.pry`を追加して起動する

```tarminal
docker compose up -d
```

```tarminal
docker ps
```

```tarminal
docker attach <container>
```


### コマンド
##### デバックモード終了
```terminal
exit
```

##### attachしたコンテナから抜ける
```terminal
<Ctrl + P>,<Ctrl + Q>
```
