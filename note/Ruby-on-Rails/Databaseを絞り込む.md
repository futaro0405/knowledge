---
tags: ruby-on-Rails database
---
# データを絞り込む
データを絞り込んで検索・更新を行う際は下記の3点を意識する
1. 起点
2. 絞り込み条件
3. 実行部分
## 起点
絞り込みを行うコードのスタート地点。
処理対象のモデルクラスが起点となる。
## 絞り込み条件
| method   | 効果                                                                                     |
| -------- | ---------------------------------------------------------------------------------------- |
| where    | SQLのwhere節。重ねがけするとAND条件として重なっていく                                    |
| order    | SQLのORDER BY節。検索結果の並び順                                                        |
| joins    | SQLのJOIN節。他のテーブルとのJOINを指定する。類似機能として`includes`、`preload`がある。 |
| group    | SQLのGROUP BY節。                                                                        |
| select   | SQLのSELECT節。                                                                          |
| limit    | SQLのLIMIT節。取得個数制限。                                                             |
| distinct | SQLのSELECT節にDISTNCTを追加。                                                           |
| all      | 何もしない検索条件。全権取得の明示                                                       | 
| none     | なにもヒットしない検索条件。                                                                                         |

