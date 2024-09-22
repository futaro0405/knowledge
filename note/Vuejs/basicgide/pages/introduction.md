# はじめに
## Vue.jsとは
「__webのユーザーインターフェースを簡単に作るためのJavaScrptフレームワーク__」のことをいいます。

ここであらかじめ覚えてほしいことは、JavaScriptはブラウザ側で処理を実行するということです。
なので、同じアプリ内の別のページを表示させる時もUIの処理はVuejsが行うため、ページごとにサーバにアクセスするということはありません。

![[Pasted image 20240821105242.png]]
この点はサーバ側でUIを構築しているRailsやPythonとは異なる動きをしていることに注意しよう。

このように最初の1度だけサーバ側にリクエストを送信して、それ以降はブラウザ側でUIの処理をするようなアプリケーションのことを __シングルページアプリケーション（SPA）__ と言います。

__フレームワーク__ とは
枠組みという意味合いになります。
必要な処理はすでに作られていて、あとは中身をカスタマイズするだけで簡単に複雑はUIを開発できるというようなものです。

![[Pasted image 20240821111321.png]]
## Vuejsのしくみ
VuejsはコンポーネントというUIごとに分割したものを、うまく組み合わせてアプリケーションを組み立てます。
このときにコンポーネントごとに`.vue`ファイルに分割することで管理しやすくします。
このファイルのことを __単一ファイルコンポーネント(SingleFile Components/SFC)__ と呼びます。

`.vue`ファイルはこのままではプラウザ側で読み込むことができません。
読み込めるようにコンパイルする必要があります。今回は、この作業を手軽に行ってくれるツール __vite__ を使っていきます。
## 開発環境を整える
このviteはJavaScriptの実行環境が必要です。
Node.jsをインストールしていない場合はしておいてください。
今回は割愛します。
必要に応じてvscode、npmもインストールしてください。

vuejs公式がviteを使ってvuejsの環境を構築するコマンドをあらかじめ用意してくれています。
いくつか質問に回答すると環境を作ってくれます。

```bash
npm run create vue@latest

Project name: ... vue-lesson
Add TypeScript? ... No / Yes
Add JSX Support? ... No / Yes
Add Vue Router for Single Page Application development? ... No / Yes
Add Pinia for state management? ... No / Yes
Add Vitest for Unit Testing? ... No / Yes
Add an End-to-End Testing Solution? » No
Add ESLint for code quality? ... No / Yes
Add Prettier for code formatting? ... No / Yes
Add Vue DevTools 7 extension for debugging? (experimental) » No / Yes
```

これで開発環境が整いました。

```bash
cd vue-lesson
npm install
npm run format
npm run dev
```
## Vueアプリの構造を理解しよう
`index.html`では読み込まれている`main.js`ではvueから提供されている`createApp`が呼び出されています。
この`createApp()`関数を呼び出すことがvuejsを扱う上での第一ステップになります。
`createApp()`にApp