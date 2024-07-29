# スロット
スロットは、Vue.jsコンポーネントのテンプレートの一部を動的に入れ替えることができる強力な機能です。
スロットを使用することで、コンポーネントの外部からテンプレートの一部を提供できるようになります。
これにより、再利用可能で柔軟なコンポーネントを作成できます。
## 基本的なスロットの使用方法
たとえば、以下のような`<FancyButton>`コンポーネントを考えてみましょう。
このコンポーネントは`<button>`要素とスタイルを提供しますが、内部のコンテンツは親コンポーネントから提供されるようにします。
### 親コンポーネント
```vue
<template>
  <FancyButton>
    Click me! <!-- スロットコンテンツ -->
  </FancyButton>
</template>
```
### FancyButtonコンポーネント
```vue
<template>
  <button class="fancy-btn">
    <slot></slot> <!-- スロットアウトレット -->
  </button>
</template>
```

この例では、`<slot>`要素がスロットアウトレットを表し、ここに親コンポーネントが提供するスロットコンテンツ（`Click me!`）が挿入されます。

最終的なレンダリング結果は以下のようになります:
```html
<button class="fancy-btn">Click me!</button>
```
## 複数の要素やコンポーネントを渡す
スロットコンテンツにはテキストだけでなく、複数の要素や他のコンポーネントも含めることができます。
### 親コンポーネント
```vue
<template>
  <FancyButton>
    <span style="color:red">Click me!</span>
    <AwesomeIcon name="plus" />
  </FancyButton>
</template>

```

この例では、スロットコンテンツとして`<span>`要素と`<AwesomeIcon>`コンポーネントが渡されます。
これにより、`<FancyButton>`コンポーネントは外側のスタイルを維持しつつ、内部のコンテンツを柔軟に変更できるようになります。

スロットは、ネイティブのWeb Componentsの`<slot>`要素に触発されたもので、Vue.jsではさらに拡張された機能が提供されています。
これにより、スロットは多様なコンテンツやレイアウトを扱うのに適したツールとなっています。

## レンダースコープ
スロットコンテンツは親コンポーネントのスコープで定義され、親コンポーネントのデータやメソッドにアクセスできます。
しかし、子コンポーネント内のデータやメソッドにはアクセスできません。
### レンダースコープの例
次の例を見てみましょう:
```vue
<template>
  <span>{{ message }}</span>
  <FancyButton>{{ message }}</FancyButton>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello, Vue!'
    };
  }
}
</script>
```

この例では、`<span>`と`<FancyButton>`の両方で`{{ message }}`が使われています。
両方とも同じ内容である`"Hello, Vue!"`をレンダリングします。
これは、スロットコンテンツが親コンポーネントのスコープに依存しているためです。
### スロットコンテンツのスコープ

スロットコンテンツは親コンポーネントのテンプレート内で定義されるため、親のデータやメソッドにアクセスできます。
しかし、スロットコンテンツは子コンポーネント内のデータにはアクセスできません。
Vueテンプレートのスコープルールは、JavaScriptのレキシカルスコープに似ています。
つまり、テンプレート内の式はそれが定義されたスコープのデータやメソッドにのみアクセスできます。

このスコープの分離は、コンポーネントの再利用性とモジュール性を高めるために重要です。
子コンポーネントは外部からの影響を最小限に抑えつつ、内部の実装を隠蔽することができます。

## フォールバックコンテンツ
Vueのスロットには、フォールバックコンテンツを設定することができます。
これは、スロットに何もコンテンツが提供されなかった場合にのみレンダリングされるデフォルトの内容です。
フォールバックコンテンツは、コンポーネントが期待通りに動作しない場合や、特定のメッセージを表示したい場合に役立ちます。
### フォールバックコンテンツの例
次の例では、`<SubmitButton>`コンポーネントが定義されています。
このコンポーネントのスロットに何もコンテンツが提供されなかった場合、フォールバックコンテンツとして"送信"というテキストが表示されます。

```vue
<template>
  <button type="submit">
    <slot>
      送信 <!-- フォールバックコンテンツ -->
    </slot>
  </button>
</template>

<script>
export default {
  name: 'SubmitButton'
}
</script>
```

フォールバックコンテンツは、スロットが空の場合に表示されるデフォルトの内容として非常に便利です。
これにより、コンポーネントのユーザーがスロットに何も渡さなくても適切なメッセージやデフォルトの振る舞いを提供できます。

## 名前付きスロット
名前付きスロットを使うと、コンポーネントの異なる部分に異なるコンテンツを挿入できるため、より複雑なレイアウトを作成する際に便利です。
名前付きスロットを定義するために、`<slot>` 要素に `name` 属性を付けることで、スロットアウトレットを識別します。
また、親コンポーネント側で `v-slot` ディレクティブを使用してスロットコンテンツを渡します。
### 名前付きスロットの例
以下は、`<BaseLayout>` コンポーネントの例です。
このコンポーネントは、`header`、`default`、`footer` という3つのスロットを持っています。
#### `<BaseLayout>` コンポーネント
```vue
<template>
  <div class="container">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot> <!-- デフォルトスロット -->
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'BaseLayout'
}
</script>
```
#### 親コンポーネントでの使用例
親コンポーネントでは、以下のように `<BaseLayout>` コンポーネントを使用して、各スロットにコンテンツを渡します。

```vue
<template>
  <BaseLayout>
    <template #header>
      <h1>Here might be a page title</h1>
    </template>

    <p>A paragraph for the main content.</p>
    <p>And another one.</p>

    <template #footer>
      <p>Here's some contact info</p>
    </template>
  </BaseLayout>
</template>

<script>
export default {
  name: 'ParentComponent'
}
</script>
```

この場合、`<BaseLayout>` コンポーネントは以下のようにレンダリングされます。
```html
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

このように、名前付きスロットを使うことで、コンポーネントの各部分に異なるコンテンツを柔軟に挿入できます。
また、名前のないスロットはデフォルトスロットと呼ばれ、省略形として `<template #default>` とすることができます。
名前付きスロットを使うことで、より複雑なテンプレートを整理しやすくなり、コンポーネントの再利用性が向上します。

## 条件付きスロット
条件付きスロットは、特定のスロットが提供されている場合にのみコンテンツをレンダリングするために使用します。
これは、`$slots` プロパティと `v-if` ディレクティブを組み合わせることで実現できます。
### 例: 条件付きスロットを持つ `<Card>` コンポーネント
```vue
<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </div>
    
    <div v-if="$slots.default" class="card-content">
      <slot></slot>
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card'
}
</script>
```

この例では、`<Card>` コンポーネントは `header`、`default`、`footer` のスロットを持ち、これらのスロットが提供されている場合にのみ対応する部分がレンダリングされます。
### 動的なスロット名
動的なディレクティブの引数は、`v-slot` にも使用できます。
これにより、動的にスロット名を指定できます。

```vue
<template>
  <BaseLayout>
    <template v-slot:[dynamicSlotName]>
      <!-- コンテンツ -->
    </template>
  </BaseLayout>
</template>

<script>
export default {
  data() {
    return {
      dynamicSlotName: 'header'
    }
  }
}
</script>
```

このコードは、`dynamicSlotName` が `'header'` の場合、`<slot name="header">` にコンテンツを挿入します。

### スコープ付きスロット

スコープ付きスロットは、スロットコンテンツが親コンポーネントからだけでなく、子コンポーネントからもデータを受け取れるようにします。スコープ付きスロットを使用することで、コンポーネントのロジックをカプセル化しつつ、コンテンツのレンダリング方法を親コンポーネントに委譲することが可能です。

#### 例: スコープ付きスロットを使用する `<MyComponent>`

```vue
<template>
  <div>
    <slot :text="greetingMessage" :count="1"></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      greetingMessage: 'Hello'
    }
  }
}
</script>

```
#### 親コンポーネントでの使用
```vue
<template>
  <MyComponent v-slot="{ text, count }">
    {{ text }} {{ count }}
  </MyComponent>
</template>

```

この例では、`<MyComponent>` が `greetingMessage` と `count` をスロットプロパティとして提供し、親コンポーネントがそれを受け取って使用しています。

### 名前付きスコープ付きスロット

名前付きスロットとスコープ付きスロットを組み合わせて使用する場合、スロットプロパティは `v-slot:name="slotProps"` の形式でアクセスできます。

```vue
<template>
  <MyComponent>
    <template #header="headerProps">
      {{ headerProps.message }}
    </template>

    <template #footer="footerProps">
      {{ footerProps.info }}
    </template>
  </MyComponent>
</template>

```
### レンダーレスコンポーネント

レンダーレスコンポーネントは、視覚的な出力を持たず、ただロジックをカプセル化するだけのコンポーネントです。これにより、データ処理ロジックを他のコンポーネントに移譲できます。

#### 例: マウストラッキングのレンダーレスコンポーネント
```vue
<template>
  <MouseTracker v-slot="{ x, y }">
    マウスの座標: {{ x }}, {{ y }}
  </MouseTracker>
</template>
```

このように、スコープ付きスロットやレンダーレスコンポーネントを利用することで、柔軟で再利用可能なコンポーネント設計が可能になります。