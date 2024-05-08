# duplicate key value violates unique constraint

```
select setval('users_id_seq',(select max(id) from users));
```

## ref
["duplicate key value violates unique constraint"の対応方法](https://qiita.com/SNobu/items/2c97cb264c21a45c65bf)

