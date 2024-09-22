# リアクティビティ
下記のような簡単なコードでリアクティビティを考えます。
後からaが更新されているがconsoleにはaが更新される前の値を参照したcが表示されます。
これは至極当たり前のことですが、vuejsで扱う上では直感的ではありません。

```js
let a = 1
let b = 2
let c = a + b // 3
a = 4
console.log(c)
```

何かの値が更新された時にそれに付随する値も更新するような動きのことを __リアクティビティ__ と言います。

Vuejsではどのようにリアクティビティを実現するかというと`ref()`関数を扱うことで実現します。
```js
import { ref } from 'vue'

let price = ref(9.99)
function increment() {
	price += 1
}
```

vuejsでリアクティビティを実現するためにはデータをオブジェクトで扱う必要がある

![[Pasted image 20240905205739.png]]

そのため、リアクティビティオブジェクトに値を代入する場合は下記のようにする必要がある
```js
<script>
price.value = 9.99
</script>
```

`<template>`内は自動的に`.value`がつくため記述する必要がない
`.value`をつけてしまうと`price.value.value`になるため値が正しく表示されない

```html
<template>
	<p>{{price - 1}}</p>
</template>
```

オブジェクトをリアクティブな値として扱うこともできます。
その場合も`<templete>`内でも`.value`を省略できます。
```html
<script>
const info = ref({
	students: 1000,
	rating: 4
})
console.log(info.value.students)
</script>

<template>
	<p>Students: {{ info.students }}</p>
</template>
```

このような元々がオブジェクトの値なんだから２度デマしなくてもいい
`reactive()`関数を使ってオブジェクトを扱うようにする

```html
<script>
const instructor = reactive({
	name: 'Takashi',
	age: 25
})
console.log(instructor.age)
</script>

<template>
<h2>Instructor: {{ instructor.age }}</h2>
</template>
```

これは`ref()`オブジェクトはgetter、setterを使ってリアクティブオブジェクトを実現しているのに対して、
`reactive()`オブジェクトはproxyを使って実現しているから
という違いがある

ただし、refオブジェクトがオブジェクトを扱った時もproxyを用いて実現されます。

reactiveオブジェクトに値を追加する場合
```
instructor.bio = 'hello'
```
またリアクティブオブジェクト内にレアクティブオブジェクトを使うこともできる
この時も正しくレアクティブオブジェクトとして扱われる
```js
const instructor = reactive({
	name: 'YOSHIKI',
	age: 25,
	sns: {
		twitter: '@yoshiki',
		youtube: '@yoyopi'
	}
})
```

reactiveオブジェクト内にrefオブジェクトを扱うこともできる
この場合はvalueを省略できる

```js
const instructor = reactive({
	name: 'YOSHIKI',
	age: 25,
	sns: {
		twitter: '@yoshiki',
		youtube: '@yoyopi'
	}
	email: ref('yoshiki@mail.com')
})
console.log(instructor.email)
```

このように自動でvalueが付けられる
ただし、refオブジェクトを再度代入する場合は内示的にvalueが付けられないことに注意する
```js
instructor.email = ref('info@mail.com')
```

ただしこの自動でvalueがつく動きは配列の時には機能しない

```js
const items = reactive([ref(1), ref(2), ref(3)])
console.log(items[0].value)
```

配列はさまざまなメソッドがあるため、それらと競合して煩わしい動きをしないようにするため

```js
const items = reactive([ref(1), ref(2), 3])
items.reverse()
// [3, ref(2), ref(1)]としたいため[ref(3), ref(2), 1]となる危険性がある
```
