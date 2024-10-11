# ページ間のナビゲーション
前章では、ダッシュボードのレイアウトとページを作成しました。  
今度は、ユーザーがダッシュボードのルート間を移動できるようにリンクを追加しましょう。  

この章では以下のトピックを扱います。

- `next/link`コンポーネントの使用方法
- `usePathname()`フックを使用してアクティブなリンクを表示する方法
- Next.jsでのナビゲーションの仕組み

## なぜナビゲーションを最適化するのか？
従来、ページ間のリンクには`<a>`HTML要素を使用していました。  
現在、サイドバーのリンクは`<a>`要素を使用していますが、ブラウザでホーム、請求書、顧客ページ間を移動する際に何が起こるか注目してください。  

お分かりでしょうか？  
各ページのナビゲーションごとに完全なページリフレッシュが発生しています！  

# `<Link>`コンポーネント

Next.jsでは、`<Link />`コンポーネントを使用してアプリケーション内のページ間をリンクできます。  
`<Link>`を使用すると、JavaScriptで[クライアントサイドナビゲーション](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works)を行うことができます。  

`<Link />`コンポーネントを使用するには、`/app/ui/dashboard/nav-links.tsx`を開き、[`next/link`](https://nextjs.org/docs/app/api-reference/components/link)から`Link`コンポーネントをインポートします。  
そして、`<a>`タグを`<Link>`で置き換えます。

**/app/ui/dashboard/nav-links.tsx**
```jsx
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
 
// ...
 
export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
```

ご覧のように、`Link`コンポーネントは`<a>`タグの使用と似ていますが、`<a href="…">`の代わりに`<Link href="…">`を使用します。  
変更を保存し、localhostで動作するか確認してください。  
これで、完全なリフレッシュを見ることなくページ間を移動できるはずです。  
アプリケーションの一部がサーバーでレンダリングされていますが、完全なページリフレッシュはなく、Webアプリのように感じられます。  
なぜでしょうか？

## 自動コード分割とプリフェッチング
ナビゲーション体験を向上させるために、Next.jsはルートセグメントごとにアプリケーションを自動的にコード分割します。  
これは、ブラウザが初期ロード時にすべてのアプリケーションコードを読み込む従来のReact [SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)とは異なります。  

ルートごとにコードを分割することで、ページが分離されます。  
特定のページでエラーが発生しても、アプリケーションの残りの部分は引き続き動作します。  

さらに、本番環境では、[`<Link>`](https://nextjs.org/docs/api-reference/next/link)コンポーネントがブラウザのビューポートに表示されるたびに、Next.jsはバックグラウンドでリンク先のルートのコードを自動的に**プリフェッチ**します。  
ユーザーがリンクをクリックする頃には、目的のページのコードがすでにバックグラウンドで読み込まれており、これによりページ遷移がほぼ瞬時に行われます！  

[ナビゲーションの仕組みについて](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works)詳しくは、ドキュメントをご覧ください。  

# パターン：アクティブリンクの表示
ユーザーが現在いるページを示すために、アクティブリンクを表示するのは一般的なUIパターンです。  
これを実現するには、URLからユーザーの現在のパスを取得する必要があります。  
Next.jsは[`usePathname()`](https://nextjs.org/docs/app/api-reference/functions/use-pathname)というフックを提供しており、これを使用してパスをチェックし、このパターンを実装できます。  

`usePathname()`はフックなので、`nav-links.tsx`をクライアントコンポーネントに変更する必要があります。  
ファイルの先頭にReactの`"use client"`ディレクティブを追加し、`next/navigation`から`usePathname()`をインポートします。  

**/app/ui/dashboard/nav-links.tsx**
```jsx
'use client';
 
import {
  UserGroupIcon,
  HomeIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
 
// ...
```

次に、`<NavLinks />`コンポーネント内で、パスを`pathname`という変数に割り当てます。

**/app/ui/dashboard/nav-links.tsx**
```jsx
export default function NavLinks() {
  const pathname = usePathname();
  // ...
}
```

 [CSS styling](https://nextjs.org/learn/dashboard-app/css-styling)の章で紹介した`clsx`ライブラリを使用して、リンクがアクティブな場合に条件付きでクラス名を適用できます。  
`link.href`が`pathname`と一致する場合、リンクは青色のテキストと薄い青色の背景で表示されるべきです。  

以下が`nav-links.tsx`の最終的なコードです。  

**/app/ui/dashboard/nav-links.tsx**
```jsx
'use client';
 
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
 
// ...
 
export default function NavLinks() {
  const pathname = usePathname();
 
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
```

保存してlocalhostを確認してください。アクティブリンクが青色でハイライトされているはずです。  
