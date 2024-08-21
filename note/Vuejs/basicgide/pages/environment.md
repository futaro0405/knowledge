# Vuejsをはじめる
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

