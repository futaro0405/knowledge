# 新しいプロジェクトの作成
パッケージマネージャーとして`pnpm`の使用をお勧めします。
`pnpm`は`npm`や`yarn`より高速で効率的です。
`pnpm`がインストールされていない場合は、次のコマンドでグローバルにインストールできます。

```bash
npm install -g pnpm
```


Next.jsアプリを作成するには、ターミナルを開き、プロジェクトを保存したいフォルダに`cd`で移動し、以下のコマンドを実行します：

ターミナル

Copy

`npx create-next-app@latest nextjs-dashboard --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example" --use-pnpm`

このコマンドは`create-next-app`を使用します。これはNext.jsアプリケーションをセットアップするコマンドラインインターフェース（CLI）ツールです。上記のコマンドでは、このコースのスターター例を`--example`フラグで指定しています。