# 【Github Actions】Vite+Reactのプロジェクトを自動デプロイしてみた【github Pages】

## はじめに
viteでReactの環境を整えるところまでは順調にできたものの、いざgithub Pagesにデプロイしようとしたところでbuildしたものをどう扱えばいいか戸惑い、手が止まってしまいました。buildしたdistファイルをそのままコミットするわけにもいかず...。
そう思って少し調べたら、viteさん公式がgithub Actionsを使ってデプロイする方法をまとめてくれていました。優秀ですね。
せっかくなので、自分なりに行ったみちすじを残しておこうと思います。

## どうしてうまくデプロイできないのか
どうして簡単にデプロイできないのかの理由は主にこの2つです。

### 問題1：distファイルをコミットしたくない
gitで管理しているものは、できれば開発に関係ないものはcommitしたくありません。そのため、buildしたときに生成されるdistフォルダなどはcommitしたくありません。同じような理由でnode_modulesフォルダなどは`.gitignore`でcommitしないように管理しています。
ですが、Reactのようなbuildを前提としたものはbuildで生成されたものでなければ、githubPagesは正しく表示してくれません。

### 問題2：github PagesのURLにリポジトリ名が含まれる
gitHub PagesのURLは `https://<ユーザー名>.github.io/<リポジトリ名>/` となっており、buildしたものをそのままデプロイしてもリポジトリ名の部分のbasepathがない`https://<ユーザー名>.github.io/**.js`のURLを読み込むため正しくファイルが読み込めません。

では、どのように解決すればいいのでしょうか。
1. github Actionsでpushしたときにdistファイルをデプロイしてもらう
1. viteにbuildの生成物のパスを書き換えてもらう

この方法で簡単に、むしろ以前より楽にデプロイできました。
ここから解説します。

## 設定方法
### 1. vite.config.jsを設定する
viteでプロジェクトを作成したとき、なんかできてた`vite.config.js`。調べてみるとできることがいろいろあるようで超優秀でした。
今回はbasepathの設定のみ記載しますが、生成されるファイル名の設定やpublicディレクトリなどの細かい設定もでき自分好みにカスタマイズできたので、気になる方はご自身で調べてみてください。

修正前の`vite.config.js`はこちら。

```vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

`defineConfig`の中身を書き換えていきます。

```diff_javascript:defineConfig
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES ? 'REPOSITORY_NAME' : './',
  plugins: [react()],
})
```

basepathをgithubのときにリポジトリ名を設定するように修正しました。

###   