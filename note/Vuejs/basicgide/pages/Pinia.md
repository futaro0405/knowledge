## Piniaが必要な理由
グローバル変数で定義してもいいが、どこから呼び出しているのかわからなくなることがあるため推奨しない。
Piniaを使用することでわかりやすく管理できる

![[Pasted image 20240911204329.png]]

## Piniaを使ってStoreを定義する
グローバルに管理する場所のことを`store`という
Piniaではstoreを複数持つことができるため、役割ごとにstoreを定義する
役割ごとにファイルを分けて定義する
例：`stores/counter.js`,`stores/user.js`

piniaから提供されている`defineStore`にユニークな定数を定義(`counter`)
必ず、returnでオブジェクトを返す必要がある
このオブジェクトには外部から操作したいオブジェクトを全て入れる必要がある

そして、defineStoreは必ず名前付きexportで`use__Store`の形をとる

```js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounterStore = defineStore('counter', () => {
	const count = ref(0)
	return {
		count: count
	}
})

```

使用する場合

```html
<script setup>
import { useCounterStore } from './store/counter'

const counterStore = useCounterStore()
console.log(counterStore.count)
</script>
<template>
	<button @click="counterStore.count++">+1</button>
	<p>{{ counterStore.count }}</p>
</template>
```
## 「State」と「Getters」と「Actions」
defineStoreの第二引数は`<script setup></script>`と同じように書ける

```js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounterStore = defineStore('counter', () => {
	const count = ref(0)
	const doubleCount = computed(() => count.value * 2)
	function increment() {
		count.value++
	}
	return {
		count,
		doubleCount,
		increment
	}
})
```

```html
<script setup>
import { useCounterStore } from './store/counter'

const counterStore = useCounterStore()
console.log(counterStore.count)
</script>
<template>
	<button @click="counterStore.increment">+1</button>
	<p>{{ counterStore.count }}</p>
	<p>{{ counterStore.doubleCount }}</p>
</template>
```

Piniaにとって __State__ はrefオブジェクト
__Getters__ はcomputedオブジェクト
__Actions__ は関数

注意点はstore内で定義したrefオブジェクトは必ずreturnに含めるべき

