---
tags: ruby-on-Rails database
---
# `find` method
各モデルの`id`を検索キーとしてデータを取得するメソッド。
# `find_by` method
各モデルをid以外で検索するメソッド。
複数の検索条件を指定可。
返ってくるデータは最初に条件に合致した1件のみ。
# `where` method
各モデルを`id`以外の条件で検索するメソッド。
該当データをすべて取得する。