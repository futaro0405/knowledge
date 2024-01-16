HTMLの要素をカプセル化し再利用可能なパーツにするためのプラウザのAPI群。  
Reactコンポーネントみたいなものを素のJSで作るイメージ。
## web componetsを構成する技術
Web Componentsを構成する技術は以下の4つ。  
Custom elements、Shadow DOM、ES Modules、HTML Templates
### Custom elements
HTML要素のタグ名を自分で定義できる機能。  
今までは`div`要素にクラス名をつけることで再利用していたが、独自タグを使いまわすだけでパーツを作ることができる。  

```
<my-button class="pink">my button</my-button>
<my-button class="yellow">my button</my-button>
<my-button class="green">my button</my-button>
```

```
.pink>button {
  background-color: pink;
}
.yellow>button {
  background-color: yellow;
}
.green>button {
  background-color: green;
}
```

```
class MyButton extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <style>
        button {
          border: none;

          border-radius: 3px;

          padding: 10px 20px;

        }

      </style>

      <button type="button">${this.innerHTML}</button>

    `;

  }

}

  

customElements.define("my-button", MyButton);

```

  

### CustomElementsのライフサイクルイベント

HTMLElementには各種ライフサイクルイベントハンドラが用意されていて、以下のタイミングで処理を実行することができます。

  

#### constructor()

要素が生成された時に呼ばれます。

  

#### connectedCallback()

要素がdocumentに追加された時に呼ばれます。

Reactで言うところのcomponentDidMount()に当たります。

  

#### disconnectedCallback()

要素がdocumentから削除された時に呼ばれます。

Reactで言うところのcomponentWillUnmount()に当たります。

  

#### attributeChangedCallback(attributeName, oldValue, newValue, namespace)

属性に変更が加えられた時に呼ばれます。observedAttributesで指定された属性のみが監視対象になります。親から何かしら属性が変更された時のキックに使えます。

  

#### adoptedCallback(oldDocument, newDocument)

ownerDocumentが変更された時に呼ばれます。

  

### ライフサイクルイベントのサンプル

ライフサイクルイベントを使って入力されたテキストと同期させるサンプル

  

```

<input type="text" placeholder="input text to change label">

<my-label></my-label>

```

  

```

input {

  width: 200px;

}

```

  

```

class MyLabel extends HTMLElement {

  static get observedAttributes() {

    return [ 'label' ];

  }

  

  constructor() {

    super();

    this.innerHTML = '<p>my label</p>';

  }

  

  connectedCallback() {}

  disconnectedCallback() {}

  

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {

    if (attributeName === "label") {

      this.querySelector("p").textContent = newValue;

    }

  }

  

  adoptedCallback(oldDocument, newDocument) {}

}

  

customElements.define("my-label", MyLabel);

  
  

{

  const input = document.querySelector("input");

  input.oninput = e => {

    document.querySelector("my-label").setAttribute("label", e.target.value);

  }

}

```

  

## Shadow DOM

外界に影響を与えないように要素を隠しこんでしまう機能。  

CSSで指定したセレクタはdocument全体に影響を与えていた。  

Shadow DOMはスコーピングされた要素の中だけにセレクタの影響範囲を絞ることができる。  

Shadow DOMで定義された要素はshadow-rootに要素がぶら下がった形になり、スタイルの適応範囲はshadow-root内に限定されます。

  

```

#shadow-root

  <style>

    button {

      border: none;

      border-radius: 3px;

      padding: 10px 20px;

    }

  </style>

  <button>my button</button>

```

これを回避する方法として、BEMのような命名規則に則ってセレクタを記述する手法が一般的にはとられています。その他にはCSS Modulesのようにセレクタの名前にハッシュ値をプリプロセスで付け加えて一意のセレクタを生成するという方法もあります。

  

```

.block__element--mode { ... }

```

Shadow DOMはそういったワークアラウンドを使わずしてツラミから解放される手段となる(かもしれません)。attachShadowというAPIを使うとshadowRootが使えるようになります。このshadowRootがshadow DOMそのものになります。

```

this.attachShadow({ mode: "open" });

this.shadowRoot.innerHTML = "<button>my button</button>";

```

下のサンプルで示すとおり、Shadow DOMで定義されたボタン以外にはスタイルは適応されていません。

  

```

<my-button class="pink">my button</my-button>

<my-button class="yellow">my button</my-button>

<my-button class="green">my button</my-button>

<button type="button">default button</button>

```

  

```

.pink {

  --color: pink;

}

  

.yellow {

  --color: yellow;

}

  

.green {

  --color: green;

}

```

  

```

class MyButton extends HTMLElement {

  constructor() {

    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `

      <style>

        button {

          border: none;

          border-radius: 3px;

          padding: 10px 20px;

          background-color: var(--color);

        }

      </style>

      <button type="button">${this.innerHTML}</button>

    `;

  }

}

  

customElements.define("my-button", MyButton);

```

  

### CSSカスタムプロパティで外からShadow DOMのスタイルを変更する

色違いのボタンを作りたいなど外から何かしらスタイルに変更を加えたい場合はCSSカスタムプロパティを使う。  

  

```

<style>

  .pink {

    --color: pink;

  }

</style>

<my-button class="pink">my button</my-button>

```

  

```

button {

  background-color: var(--color);

}

```

  

### slot要素でShadow DOMに中身を入れ込む

Shadow DOMを使った要素の場合、slot属性を使って子要素を入れ込みます。

  

```

<my-button>

  <span slot="label">my button</span>

</my-button>

```

Shadow DOM側では以下のようにname属性で名前を指定します。その場所にslot="label"で指定した要素が入り込みます。

  

```

<button type="button">

  <slot name="label" />

</button>

```

  
  

## ES Modules

外部のJSでexportされたオブジェクトなどをimport文で読み込む機能  

使い方は読み込みたいJSファイルでexportで書き出したいオブジェクトやクラスを設定する。  

  

```

export default class MyButton {}

```

import文で読み込みたいJSファイルを指定する。

  

```

import * as Three from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/87/three.module.js';

import MyButton from "my-button.js";

const myButton = new MyButton();

```

  

## HTML Templates

HTML要素をテンプレートとしてdocument上に配置し、使いまわすことができる機能。  

使いまわしたい要素をHTML上で`template`タグで囲う。囲われた要素はDocumentFragmentとしてふるまうので表示されない。  

  

```

<template id="my-button">

  <img src="">

  <button type="button"></buton>

</template>

```

  

使うときは`importNode`を使って要素のクローンを生成する。  

`cloneNode`を使うこともできる。

  

```

const template = document.querySelector("#my-button");

const clone = document.importNode(template.content, true);

clone.querySelector("button").innerText = "my button";

document.body.appendChild(clone);

```

  

# 使用例

Costom Elements,Shadow DOM,ES Modulesでカプセル化された再利用可能なコンポーネントモジュールを作る。  

  

```

<custom-thumbnail

  likes=814

  favorites=791

  comments=205

  page-url="https://pixabay.com/en/sunrise-space-outer-globe-world-earth-su-1756274/"

  preview-url="https://cdn.pixabay.com/photo/2016/10/20/18/35/sunrise-1756274__340.jpg"

  user_id=1962238

  user="qimono"

  id="1756274"

  ></custom-thumbnail>

```

  

```

@import url(https://fonts.googleapis.com/icon?family=Material+Icons);

```

  

```

class CustomThumbnail extends HTMLElement {

  static get observedAttributes() {

    return [ "likes", "favorites", "comments", "page-url", "preview-url", "user_id", "user", "id" ];

  }

  

  constructor() {

    super();

    this.attachShadow({ mode: "open" });

    this.data = {};

  }

  

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {

    this.data[attributeName] = newValue;

    this._render();

  }

  

  _render() {

    this.shadowRoot.innerHTML = `

      <style>

        @import url(https://fonts.googleapis.com/icon?family=Material+Icons);

        a {

          color: #fff;

          text-decoration: none;

        }

        .container {

          position: relative;

          overflow: hidden;

        }

        .info {

          color: #fff;

          display: flex;

          position: absolute;

          bottom: -15px;

          opacity: 0;

          transition: .25s;

          width: 100%;

          justify-content: space-between;

          background: linear-gradient(to top,rgba(0,0,0,.6) 0,rgba(0,0,0,0) 100%);

        }

        .container:hover > .info {

          opacity: 1;

          bottom: 5px;

        }

        .info > * {

          margin: 0 8px 8px;

        }

        .thumb {

          width: 100%;

          display: block;

        }

        .user {

          transition: .25s;

          background-color: rgba(255,255,255,0);

          border-radius: 3px;

          padding: 2px 4px;

        }

        .user:hover {

          background-color: rgba(255,255,255,.3);

        }

        .counter i {

          font-size: 20px;

          margin-left: 8px;

          margin-right: 2px;

        }

      </style>

      <div class="container">

        <a href="${this.data["page-url"]}">

          <img class="thumb" src="${this.data["preview-url"]}">

        </a>

        <div class="info">

          <a class="user" href="${"https://pixabay.com/en/users/" + this.data.user + "-" + this.data.user_id}" class="user">${this.data.user}</a>

          <div class="counter">

            <i class="material-icons">thumb_up</i>${this.data.likes}

            <i class="material-icons">star</i>${this.data.favorites}

            <a href="${this.data["page-url"]}#comments">

              <i class="material-icons">comment</i>${this.data.comments}

            </a>

          </div>

        </div>

      </div>

    `;

  }

}

  

customElements.define("custom-thumbnail", CustomThumbnail);

```

  
  

ref: https://nulab.com/ja/blog/cacoo/web-components/  

ref: https://developer.mozilla.org/ja/docs/Web/API/Web_components