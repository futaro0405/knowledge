# TypeScriptとVue.jsを合わせる

```html
<script setup lang="ts">
function add(a: number, b: number) {
    return a + b
}
</script>
<template>
    <button @click="add(3, 5)">add</button>
</template>
```

## ref()とTypeScriptを一緒に使う方法
ref()オブジェクトは初期値の値で自動的に型を推論してくれるようになっている
複雑な値を代入する必要がある場合は型引数を渡す必要がある

```html
<script setup lang="ts">
import { ref } from 'vue'

const count = ref<number | string>(0)
count.value = 'hello'
</script>
<template>
    <p>{{ count }}</p>
</template>
```

## computed()とTypeScriptを一緒に使う方法
computed()は明示的に型引数を渡すことをしなくても複雑な型に対応してくれる
型引数を渡すことで型の違いに気づきやすくもなる

```html
<script setup lang="ts">
import { computed, ref } from 'vue'

const count = ref(0)
const doubleCount = computed<number>(() => {
    if (count.value > 3) return 100
    return count.value * 2
})
</script>
<template>
    <p>{{ doubleCount }}</p>
</template>
```
## イベントハンドラとTypeScript
eventオブジェクト（引数）をおく場合、型を明示的に記す必要がある
イベント名をhoverすると確認できるためその型を指定する

```html
<script setup lang="ts">
import { computed, ref } from 'vue'

const count = ref(0)
const doubleCount = computed<number>(() => {
    if (count.value > 3) return 100
    return count.value * 2
})

function countUp(event: MouseEvent) {
    count.value++
}
</script>
<template>
    <button @click="countUp">+1</button>
    <p>count: {{ Count }}</p>
    <p>doubleCount: {{ doubleCount }}</p>
</template>
```
## PropsとTypeScript

```html:ChildComp.vue
<script setup lang="ts">
defineProps({
    title: {
        type: String,
        required: true
    }
})
</script>
<template>
    <p>Child</p>
</template>

```

```html:App.vue
<script setup lang="ts">
import { ref } from 'vue'
import ChildComp from './ChildComp.vue'
const courseTitle = ref('Vue.js Couse')
</script>
<template>
    <ChildComp :title="courseTitle" />
</template>

```

このようにdefinProps内でPropsのtypeを定義する方法を使用しない

```js
defineProps<{
    title: string
}>()
```

また、型を定義して当てはめても可

```js
interface Course {
    title: string
}
defineProps<Couse>()
```

この時、`require`はデフォルトでtrueになる
falseにする場合はオフショナルプロパティ(?)を使う

```js
interface Course {
    title?: string
}
defineProps<Couse>()
```

defaultは`withDefaults`を使う

```js
interface Course {
    title?: string
}
withDefaluts(defineProps<Course>(), {
    title: 'default course'
})
```

## defineModel()とTypeScript

```html:ChildComp.vue
<script setup lang="ts">
const model = defineModel({type: string, required: true})
</script>
<template>
    <input v-model="model" type="text">
    <p>{{ model }}</p>
</template>

```

```html:App.vue
<script setup lang="ts">
import { ref } from 'vue'
import ChildComp from './ChildComp.vue'
const userInput = ref('')
</script>
<template>
    <ChildComp v-model="userInput" />
    <p>{{ userInput }}</p>
</template>

```

これをtypeScriptに

```html:ChildComp.vue
<script setup lang="ts">
const model = defineModel<string>({required: true})
</script>
<template>
    <input v-model="model" type="text">
    <p>{{ model }}</p>
</template>

```

```html:App.vue
<script setup lang="ts">
import { ref } from 'vue'
import ChildComp from './ChildComp.vue'
const userInput = ref('')
</script>
<template>
    <ChildComp v-model="userInput" />
    <p>{{ userInput }}</p>
</template>

```
## emitとTypeScript

```html:ChildComp.vue
<script setup lang="ts">
defineEmits({'update'})
</script>
<template>
    <button @click="$emit('update', 100)">button</button>
</template>
```
typescriptに

引数なし
```html
<script setup lang="ts">
defineEmits<{
    update: []
}>()
</script>
<template>
    <button @click="$emit('update')">button</button>
</template>
```

引数あり
countと名前をつけることも可
わかりやすいからつけよう

```html
<script setup lang="ts">
defineEmits<{
    update: [count: number]
}>()
</script>
<template>
    <button @click="$emit('update', 100)">button</button>
</template>
```