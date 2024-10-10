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

*/app/page.tsx*
```jsx
<div
  className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black"
/>
```


従来のCSSルールを記述したり、スタイルをJSXから分離したい場合は、CSSモジュールが適切な代替手段となります。

