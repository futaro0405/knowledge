# There is 1 other session using the database
## エラー内容
```
PG::ObjectInUse: ERROR:  database "myapp_development" is being accessed by other users
DETAIL:  There are 2 other sessions using the database.
Couldn't drop database 'myapp_development'
rails aborted!
ActiveRecord::StatementInvalid: PG::ObjectInUse: ERROR:  database "myapp_development" is being accessed by other users
DETAIL:  There are 2 other sessions using the database.


Caused by:
PG::ObjectInUse: ERROR:  database "myapp_development" is being accessed by other users
DETAIL:  There are 2 other sessions using the database.

Tasks: TOP => db:drop:_unsafe
(See full trace by running task with --trace)
```

## 解決策

```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE pid <> pg_backend_pid() AND datname = 'myapp_development';
```
