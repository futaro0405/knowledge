# CSSスタイリング
現在、ホームページにはスタイルがありません。
Next.jsアプリケーションをスタイリングする様々な方法を見ていきましょう。

この章では以下のトピックを扱います。
* アプリケーションにグローバルCSSファイルを追加する方法
* TailwindとCSSモジュールという2つの異なるスタイリング方法
* `clsx`ユーティリティパッケージを使用してクラス名を条件付きで追加する方法

# グローバルスタイル
`/app/ui`フォルダ内に`global.css`というファイルがあります。
このファイルを使用して、アプリケーションの**すべての**ルートにCSSルールを追加できます。
例えば、CSSリセットルール、サイト全体のリンクなどのHTML要素のスタイルなどです。

`global.css`はアプリケーションのどのコンポーネントにもインポートできますが、通常はトップレベルのコンポーネントに追加するのが良い習慣です。
Next.jsでは、これはルートレイアウトです（後で詳しく説明します）。

`/app/layout.tsx`に移動し、`global.css`ファイルをインポートしてアプリケーションにグローバルスタイルを追加します。

**/app/layout.tsx**
```tsx
import '@/app/ui/global.css';
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

開発サーバーを実行したまま、変更を保存してブラウザでプレビューしてください。
ホームページは次のようになるはずです。

![[Pasted image 20241010195529.png]]

しかし、CSSルールを追加していないのに、スタイルはどこから来たのでしょうか？
`global.css`の中を見ると、いくつかの`@tailwind`ディレクティブがあることに気づくでしょう。

**/app/ui/global.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

# Tailwind

Tailwindは、TSXマークアップ内で直接ユーティリティクラスを素早く記述できるようにすることで、開発プロセスを加速させるCSSフレームワークです。
Tailwindでは、クラス名を追加することで要素をスタイリングします。
例えば、`"text-blue-500"`クラスを追加すると、`<h1>`テキストが青色になります：

```html
<h1 className="text-blue-500">I'm blue!</h1>
```

CSSスタイルはグローバルに共有されますが、各クラスは各要素に個別に適用されます。
つまり、要素を追加または削除しても、個別のスタイルシートの管理、スタイルの衝突、アプリケーションの規模が大きくなるにつれてCSSバンドルのサイズが増大することを心配する必要がありません。

`create-next-app`を使用して新しいプロジェクトを開始する際、Next.jsはTailwindを使用するかどうか尋ねます。
「はい」を選択すると、Next.jsは必要なパッケージを自動的にインストールし、アプリケーションでTailwindを設定します。

`/app/page.tsx`を見ると、例でTailwindクラスを使用しているのがわかります。

**/app/page.tsx**
```jsx
import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
 
export default function Page() {
  return (
    // These are Tailwind classes:
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
    // ...
  )
}
```

Tailwindを初めて使用する場合でも心配する必要はありません。
時間を節約するため、使用するすべてのコンポーネントのスタイルは既に設定済みです。

Tailwindを試してみましょう！
以下のコードをコピーして、`/app/page.tsx`の`<p>`要素の上に貼り付けてください。

**/app/page.tsx**
```jsx
<div
  className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black"
/>
```


従来のCSSルールを記述したり、スタイルをJSXから分離したい場合は、CSSモジュールが適切な代替手段となります。

# CSSモジュール
CSSモジュールは、自動的に一意のクラス名を作成することでCSSをコンポーネントにスコープし、スタイルの衝突を心配する必要がなくなります。

このコースではTailwindを使用し続けますが、先ほどのクイズと同じ結果をCSSモジュールを使用して達成する方法を見てみましょう。

`/app/ui`内に`home.module.css`という新しいファイルを作成し、以下のCSSルールを追加します。

**/app/ui/home.module.css**

```css
.shape {
  height: 0;
  width: 0;
  border-bottom: 30px solid black;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
}
```

次に、`/app/page.tsx`ファイル内でスタイルをインポートし、追加した`<div>`のTailwindクラス名を`styles.shape`に置き換えます。

**/app/page.tsx**
```jsx
import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';
 
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className={styles.shape} />
    // ...
  )
}
```

変更を保存し、ブラウザでプレビューしてください。
以前と同じ形が表示されるはずです。

TailwindとCSSモジュールは、Next.jsアプリケーションのスタイリングに最もよく使われる2つの方法です。
どちらを使用するかは好みの問題で、同じアプリケーション内で両方を使用することも可能です！

CSSモジュールは、デフォルトでCSSクラスをコンポーネントにローカルにスコープし、スタイリングの競合リスクを減少させます。

# `clsx`ライブラリを使用したクラス名の切り替え
状態やその他の条件に基づいて要素を条件付きでスタイリングする必要がある場合があります。

`clsx`は、クラス名を簡単に切り替えることができるライブラリです。
詳細については公式ドキュメントを確認することをお勧めしますが、基本的な使用方法は以下の通りです。

- `status`を受け取る`InvoiceStatus`コンポーネントを作成するとします。statusは`'pending'`または`'paid'`です。
- `'paid'`の場合は緑色、`'pending'`の場合は灰色にしたいとします。

`clsx`を使用して、以下のように条件付きでクラスを適用できます。

**/app/ui/invoices/status.tsx**
```jsx
import clsx from 'clsx';
 
export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-sm',
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-green-500 text-white': status === 'paid',
        },
      )}
    >
    // ...
)}
```

# その他のスタイリングソリューション

これまで議論したアプローチに加えて、Next.jsアプリケーションを以下の方法でスタイリングすることもできます。

- Sass：`.css`ファイルと`.scss`ファイルをインポートできます。
- CSS-in-JSライブラリ：styled-jsx、styled-components、emotionなどがあります。

詳細については、CSSドキュメントをご覧ください。

**2** 第2章を完了しました

お疲れ様でした！Next.jsアプリケーションをスタイリングする様々な方法について学びました。

次のチャプター 3: フォントと画像の最適化

ヒーロー画像とカスタムフォントを追加して、ホームページの作業を続けます。