## OSコマンドインジェクション
OSコマンドインジェクションとは、シェル（/bin/sh)呼び出し可能な機能を悪用して攻撃者が勝手にコマンドをサーバー上で実行できる脆弱性のこと

```sh
Open3.capture3("cmd #{params[:p]}", :stdin_data=>"foo\nbar\nbaz\n")
```
[Ruby 3.3 リファレンスマニュアル-Open3-capture3](https://docs.ruby-lang.org/ja/latest/method/Open3/m/capture3.html)より
`;`はコマンドを続けて実行することを意味する。
`params[:p]`に`; xxx`を実行した場合`xxx`コマンドが実行できる。
