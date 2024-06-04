# useCallback/React.memo
## useCallbackとは
useCallbackはパフォーマンス向上のためのフック。
メモ化したコールバック関数を返す。

useEffectと同じように、依存配列の要素のいずれかが変化した場合のみ、メモ化した値を再計算する。
### メモ化とは
同じ結果を返す処理について、初回のみ処理を実行記録しておき、値が必要となった2回目以降は、前回の処理結果を計算することなく呼び出し値を得られるようにすること。

イベントハンドラーのようなcallback関数をメモ化し、不要に生成される関数インスタンスの作成を抑制、再描画を減らすことにより、都度計算しなくて良くなることからパフォーマンス向上が期待できる。
### 基本形

```jsx
useCallback(callbackFunction, [deps]);
```

sampleFuncは、再レンダーされる度に新しく作らるが、a,bが変わらない限り、作り直す必要はありません。
```jsx
const sampleFunc = () => {doSomething(a, b)}
```

usecallbackを使えば、依存配列の要素a,bのいずれかが変化した場合のみ、以前作ってメモ化したsampleFuncの値を再計算する。
一方で全て前回と同じであれば、前回のsampleFuncを再利用する。
```jsx
const sampleFunc = useCallback(
	() => {doSomething(a, b)}, [a, b]
);
```

