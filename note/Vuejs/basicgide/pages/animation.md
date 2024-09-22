# 前提知識
webにおいてアニメーションを適応されるには`CSS Transition`と`CSS Animation`を使用した方法と、純粋にjavascriptでアニメーションを適用される方法がある
## CSS Transition
何かしらのCSSプロパティが変わった時にその変化をなだからなアニメーションにする

```html
<script setup>
const isShow = ref(true)
</script>

<template>
<h1>Animation</h1>
<h2
class="animation"
:class="{ opasity-80: isShow, opasity-20: !isShow }"
>CSS Transition</h2>

<button @click="isShow = !isShow"></button>
</template>

<style scoped>
.animation {
    transition: opatity 1s;
}
.opasity-80 {
    opatity: 0.8;
}
.opasity-80 {
    opatity: 0.2;
}
</style>
```

## CSS Animation
CSS Transitonとは異なり、先にアニメーションの部分を作る  
このアニメーションは`@keyframes`で定義する
定義したアニメーションを`animation: slide 1s;`のように指定してアニメーションを適応する
```html
<script setup>
const isShow = ref(true)
</script>

<template>
<h1>Animation</h1>
<h2
class="animation"
:class="{ slide: isShow }"
>CSS Transition</h2>

<button @click="isShow = !isShow"></button>
</template>

<style scoped>
.slide {
    animation: slide 1s;
}
@keyframes slide {
    0% {
        transform: translateX(0);
    }
    50% {
        transform: translateX(100px);
    }
    100% {
        transform: translateX(0);
    }
}
</style>
```

# Transitionコンポーネント
`<Transition></Transition>`を使用することで容易にアニメーションを実装できる
Transitionコンポーネント直下には要素が１つしか許容されない

Transitionコンポーネントは直下の要素が`v-if`,`v-show`などで表示非表示が切り替わる時、
もしくは動的コンポーネントになっていて表示する値が変わった時、
`key`要素が指定されていて、keyの値が変わって要素が作り直された時
この４つの状態の変化でTransitonコンポーネントは機能する

Transitionコンポーネントはアニメーションの段階で６つのクラスを付与する。
CSS TransitionとCSS Animationどちらを使うかで使い方が異なる
`v-enter-from`
要素が表示される時のアニメーション
表示されはじめに付与されるクラス
`v-enter-active`
要素が表示される時のアニメーション
要素が表示される時のCSS Transitonを記載する
`v-enter-to`
要素が表示される時のアニメーション
表示され終わりに付与されるクラス
`v-leave-from`
要素が消える時のアニメーション
消えはじめに付与されるクラス
`v-leave-active`
要素が消える時のアニメーション
要素が消える時のCSS Transitonを記載する
`v-leave-to`
要素が消える時のアニメーション
消え終わり付与されるクラス

```html
<script setup>
const isShow = ref(true)
</script>

<template>
<h1>Animation</h1>
<button @click="isShow = !isShow"></button>
<Transition>
    <p v-if="isShow">Hello</p>
</Transition>
</template>

<style scoped>
.v-enter-from {
    opacity: 0;
}
.v-enter-active {
    transition: opcity 1s;
}
.v-enter-to {
    opacity: 1;
}
.v-leave-from {
    opacity: 1;
}
.v-leave-active {
    transition: opcity 1s;
}
.v-leave-to {
    opacity: 0;
}
</style>
```
Transitionコンポーネントに`name`を付与することができる

CSS Animationを使用する場合は

```html
<script setup>
const isShow = ref(true)
</script>

<template>
<h1>Animation</h1>
<button @click="isShow = !isShow"></button>
<Transition name="slide">
    <p v-if="isShow">Hello</p>
</Transition>
</template>

<style scoped>
.slide-enter-active {
    animation: slide 1s;
}
.slide-leave-active {
    animation: slide 1s reverse;
}
@keyframes slide {
    0% {
        transform: translateX(20px)
    }
    100% {
        transform: translateX(0)
    }
}
</style>
```
## 初期表示の時にアニメーションをつける
Transitionコンポーネントに`appear`

## クラスの名前を自由に変更する`Animate.css`
Transitionコンポーネントに使用されているcssクラス名を変更することができます。
```html
<Transition 
    enter-from-class="efrom hello"
    enter-active-class="eactive"
    enter-to-class="eto"
    leave-from-class="lfrom"
    leave-active-class="lactive"
    leave-to-class="lto"
>
    <p v-if="isShow">Hello</p>
</Transition>
```
このようにすることでクラス名を独自に使用することができる
もちろん複数適用することもできる　

これらの独自クラス名はAnimate.cssライブラリを適応するときに便利です。

```html
<Transition enter-active-class="animate__animated animate__bound">
  <p v-if="isShow">Hello</p>
</Transition>
```

## modeを使って２つの要素が切替わるときにきれいにアニメーションする

```html
<Transition>
  <p v-if="isShow">ON</p>
  <p v-else>OFF</p>
</Transition>
```
ボタンを押すとONとOFFが切替わるようになっているが、
片方が消え切る前にもう片方が表示されてしまう
`mode`を使用するとよい
```html
<Transition mode="out-in">
  <p v-if="isShow">ON</p>
  <p v-else>OFF</p>
</Transition>
```
`out-in`:
要素が消えてから次の要素が出現
`in-out`:
次の要素が出現してから前の要素が消える

注意点
このときTransitionコンポーネントの中身は直接書かれている必要がある。

```html:NG.vue
<Transition mode="out-in">
  <TmpCom />
</Transition>
```

`<slot />`の場合は問題なく動く

```html
<Transition mode="out-in">
  <slot />
</Transition>
```
## 6つのTransitionコンポーネントが発生させるイベント
Transitonコンポーネントはアニメーション時にイベントを発生させている

```html
<script setup>
function beforeEnter(el) {
  console.log('beforeEnter', el)
}
</script>
<template>
<Transition
  @before-enter="beforeEnter"
  @enter="enter"
  @after-enter="afterEnter"
  @before-leave="beforeLeave"
  @leave="leave"
  @after-leave="afterLeave"
>
  <p v-if="isShow">ON</p>
</Transition>
</template>
```
`@before-enter`:
要素が表示される直前に実行されるイベント

`@enter`:
before-enterが実行された１フレーム後

`@after-enter`:
表示されるアニメーションが終わった時に実行されるイベント

`@before-leave`:
要素が消える直前に実行されるイベント

`@leave`:
before-leaveが実行された１フレーム後

`@after-leave`:
要素が消えた後に実行されるイベント

## JavaScriptで要素の表示時や消える時にアニメーションをつける方法

これらのイベントの第一引数には小要素のDOMが入る
第二引数には`done`を呼び出し、doneが実行されるタイミングがアニメーションの終わり

```html
<script setup>
function beforeEnter(el) {
  el.style.transform = 'translateX(30px)'
}

function enter(el, done) {
  let translateXValue = 30
  const intervalId = setInterval(() => {
    translateXValue -= 1
    el.style.transform = `translateX(${translateXValue}px)`
    if (translateXValue === 0) {
      clearInterval(intervalId)
      done()
    }
  }, 20)
}

// 0は書かなくてもいいので省略
// function beforeLeave(el) {
//   el.style.transform = 'translateX(0px)'
// }

function leave(el, done) {
  let translateXValue = 0
  const intervalId = setInterval(() => {
    translateXValue += 1
    el.style.transform = `translateX(${translateXValue}px)`
    if (translateXValue === 30) {
      clearInterval(intervalId)
      done()
    }
  }, 20)
}
</script>
<template>
<Transition
  @before-enter="beforeEnter"
  @enter="enter"
  @before-leave="beforeLeave"
  @leave="leave"
>
  <p v-if="isShow">ON</p>
</Transition>
</template>
```

javascriptだけでアニメーションを行う場合は`css="false"`プロパティを指定することを推奨

```html
<template>
<Transition
:css="false"
  @before-enter="beforeEnter"
  @enter="enter"
  @before-leave="beforeLeave"
  @leave="leave"
>
  <p v-if="isShow">ON</p>
</Transition>
</template>
```

要素が連続で押されるとアニメーションがギザギザする
原因はenterのアニメーション実行中にleaveが実行されるため
`enter-cancelled`を使用する

```html
<script setup>
function beforeEnter(el) {
  el.style.transform = 'translateX(30px)'
}

let intervalId

function enter(el, done) {
  let translateXValue = 30
  intervalId = setInterval(() => {
    translateXValue -= 1
    el.style.transform = `translateX(${translateXValue}px)`
    if (translateXValue === 0) {
      clearInterval(intervalId)
      done()
    }
  }, 20)
}

function enterCancelled(el) {
  clearInterval(intervalId)
}

function leave(el, done) {
  let translateXValue = 0
  const intervalId = setInterval(() => {
    translateXValue += 1
    el.style.transform = `translateX(${translateXValue}px)`
    if (translateXValue === 30) {
      clearInterval(intervalId)
      done()
    }
  }, 20)
}
</script>
<template>
<Transition
  @before-enter="beforeEnter"
  @enter="enter"
  @enter-cancelled="enterCancelled"
  @before-leave="beforeLeave"
  @leave="leave"
>
  <p v-if="isShow">ON</p>
</Transition>
</template>
```
leave中に次のアニメーションを始めてもギザギザしないのは
消える要素と入ってくる要素が別の要素として判定されるから
`v-show`を使用する場合は同じ要素なので、その時は`leave-cancelled`を使用する

## `<TransitionGroup>`を使ってリストに対してアニメーションをつける

```html
<script setup>
const fruits = ref(['Apple', 'Banana', 'Grape'])
const newFruit = ref('')
</script>

<template>
<h1>Animation</h1>
<input v-model="newFruit" type="text" />
<button @click="fruits.unshift(newFruit)">add</button>
<TransitionGroup>
	<div v-for="(fruit, index) in fruits" :key="fruit" @click="fruits.splice(index, 1)">
		{{ fruit }}
	</div>
</TransitionGroup>
</template>
```

`mode`は使えない
`tag="div"`を使用すると`<TransitonGroup>`はdivタグとして作成される
TransionGroupには`v-mode`クラスがある
要素が追加、削除された時の周りの要素
どのように滑らかにするか
```
.fade-mode {
	transition: transform 1s;
}
```
これで滑らかにアニメーションしてくれるが、削除の時は滑らかには動かない
```
.fade-mode {
	transition: transform 1s;
}
.fade-leave-active {
	position: absolute;
}
```

これで動く