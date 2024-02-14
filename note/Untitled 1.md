myapp_development=# select * from items;

|    id    |    name     | price |          description          |         created_at         |         updated_at|
|---|---|---|---|---|---|
 |SYO-0001 | testItem-01 | 12000 | test test test test test test | 2024-01-25 09:07:53.261615 |2024-01-25 09:07:53.514599|
(1 row)

myapp_development=# select * from active_storage_blobs;
 id |             key              | filename  | content_type |      metadata       | service_name | byte_size |         checksum         |         created_at
----+------------------------------+-----------+--------------+---------------------+--------------+-----------+--------------------------+----------------------------
  1 | 85r8tydda1rx9yh2m2z6ymm7a6o6 | dummy.jpg | image/jpeg   | {"identified":true} | local
     |      4675 | TYB8cpVR0OSi1F96WiN/Fw== | 2024-01-25 09:07:53.461841
(1 row)

myapp_development=# select * from active_storage_attachments;
 id | name  | record_type | record_id | blob_id |         created_at
----+-------+-------------+-----------+---------+----------------------------
  1 | image | Item        |         0 |       1 | 2024-01-25 09:07:53.464259
(1 row)

myapp_development=# select * from active_storage_variant_records;
 id | blob_id | variation_digest
----+---------+------------------
(0 rows)