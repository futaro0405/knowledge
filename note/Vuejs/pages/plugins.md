# プラグイン
プラグインは、Vueにアプリケーションレベルの機能を追加するための自己完結的なコードです。
プラグインのインストール方法は次の通りです。

```javascript
import { createApp } from 'vue'

const app = createApp({})
app.use(myPlugin, {
  /* 省略可能なオプション */
})
```

プラグインの定義は、`install()` メソッドを公開するオブジェクトか、単にインストール関数として動作する関数で行います。
インストール関数は、アプリケーションインスタンスと、`app.use()` に渡された追加のオプション（もしあれば）を受け取ります。

```javascript
const myPlugin = {
  install(app, options) {
    // アプリの設定をする
  }
}
```
## プラグインの適用範囲

厳密に定義されたプラグインの適用範囲はありませんが、以下のシナリオでプラグインが役立ちます：

- `app.component()` や `app.directive()` を使って、1つまたは複数のグローバルコンポーネントやカスタムディレクティブを登録する。
- `app.provide()` を呼び出して、アプリケーション全体でリソースを注入できるようにする。
- `app.config.globalProperties` にグローバルなインスタンスプロパティやメソッドを追加する。
- これらの組み合わせが必要なライブラリ（例: vue-router）。

### プラグインの書き方

独自のVue.jsプラグインの作成方法を理解するために、i18n（国際化）文字列を表示するプラグインの簡単なバージョンを作成します。

まず、プラグインオブジェクトを別ファイルに作成し、エクスポートすることをお勧めします。これはロジックを封じ込めて分離するためです。

```javascript
// plugins/i18n.js
export default {
  install: (app, options) => {
    // プラグインのコードが入る
  }
}
```

翻訳関数を作成し、この関数はドット区切りのキー文字列を受け取り、ユーザーが提供するオプションの中から翻訳された文字列を検索します。
これはテンプレートで使用することを想定しています。

```vue
<template>
  <h1>{{ $translate('greetings.hello') }}</h1>
</template>
```

この関数は全てのテンプレートでグローバルに利用できる必要があるため、プラグインの`app.config.globalProperties`に追加します。

```javascript
// plugins/i18n.js
export default {
  install: (app, options) => {
    // グローバルに利用可能な $translate() メソッドを注入
    app.config.globalProperties.$translate = (key) => {
      // `key` をパスとして使用して
      // `options` 内のネストしたプロパティを取得
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

この `$translate` 関数は、`greetings.hello` のような文字列を受け取り、ユーザーが提供した設定を調べて翻訳された値を返します。

翻訳されたキーを含むオブジェクトは、インストール時に `app.use()` の追加パラメーターとしてプラグインに渡します。

```javascript
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

これにより、`$translate('greetings.hello')` は実行時に `Bonjour!` に置き換えられます。

#### 参照: グローバルなプロパティの拡張

**TIP:** グローバルプロパティはなるべく使わないようにしましょう。様々なプラグインから注入された多くのグローバルプロパティがアプリケーション全体で使われると、混乱が生じやすくなります。

### プラグインを使った Provide / Inject

プラグインは `provide` を使用して、ユーザーに関数や属性を提供することもできます。例えば、翻訳オブジェクトを使用できるようにするため、アプリケーションが `options` 引数へアクセスできるようにします。

```javascript
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.provide('i18n', options)
  }
}
```

これにより、プラグインユーザーは `i18n` キーを使ってコンポーネント内にプラグインのオプションを注入できるようになります。

```vue
<script setup>
import { inject } from 'vue'

const i18n = inject('i18n')

console.log(i18n.greetings.hello)
</script>

```

この方法により、コンポーネントは `i18n` オブジェクトを利用して、翻訳された文字列などの情報にアクセスできます。