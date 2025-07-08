DynamicLinks周辺の現在の実装
認可URL作成（バックエンド）
↓
認可URLにリダイレクト（アプリ）
↓
ログイン情報入れて連携許可（外部サービス）
↓
`https://app.newtrish.ai/auth/asken/callback` にコールバック（外部サービス）
↓
`https://app.newtrish.ai/auth/asken/callback` から `https://newtrish.page.link/asken` にリダイレクト（ `app.newtrish.ai` のWebサーバ？）
↓
アプリを開く（DynamicLinks）
↓
認可情報の整合性確認依頼（アプリ）
↓
認可情報のDB保存（バックエンド）
↓
連携が完了しました（アプリ）

各社のcallbackをdynamicLinksの物からoneLinkの物にかえたらおーけーっぽいけど、それどこでやってるん？
`app.newtrish.ai` のwebサーバとかしらんぞ…
`newtrish-static` これか
LPが乗ってることしかしらんかったｗｗ

改修内容です。
- DynamicLinksをAppsFlyerのonelinkに代替
- APIレベルを上げる（Android）
- 課金周りのエラー調査＆修正 現在のDynamicLink周りの動作フロー

`newtrish-static` にあるdynamicLinkのurlをappsflyerの物に書き換えたらとりあえずは動作する（はず）
Dev用OneLinkURL:
`https://newtrish-develop.onelink.me/ZKwO/linkage`