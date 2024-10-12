# 検索とページネーションの追加
前章では、ストリーミングを使用してダッシュボードの初期読み込みパフォーマンスを向上させました。  
次は`/invoices`ページに移り、検索とページネーションを追加する方法を学びましょう！  

この章では... 以下のトピックを扱います：  

1. Next.jsのAPI（`useSearchParams`、`usePathname`、`useRouter`）の使用方法を学ぶ。
2. URL検索パラメータを使用して検索とページネーションを実装する。

これらのトピックを通じて、ユーザーがインボイスを効率的に検索し、ナビゲートできるようにする方法を学びます。  

# 開始コード
`/dashboard/invoices/page.tsx`ファイルに以下のコードを貼り付けてください：  

**/app/dashboard/invoices/page.tsx**
```tsx
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
 
export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      {/*  <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense> */}
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}
```

このページと作業するコンポーネントについて理解してください：

1. `<Search/>`：ユーザーが特定のインボイスを検索できます。
2. `<Pagination/>`：ユーザーがインボイスページを移動できます。
3. `<Table/>`：インボイスを表示します。

検索機能はクライアントとサーバーにまたがります。ユーザーがクライアントで検索すると、URLパラメータが更新され、サーバーでデータが取得され、新しいデータでテーブルがサーバー上で再レンダリングされます。  

# URLの検索パラメータを使用する理由
上記のように、検索の状態を管理するためにURLの検索パラメータを使用します。  
クライアントサイドの状態で行うことに慣れている場合、このパターンは新しく感じるかもしれません。  

URLパラメータで検索を実装することには、いくつかの利点があります：  

- **ブックマーク可能で共有可能なURL**：検索パラメータがURLにあるため、ユーザーは検索クエリやフィルターを含むアプリケーションの現在の状態をブックマークして、将来の参照や共有に使用できます。
- **サーバーサイドレンダリングと初期ロード**：URLパラメータはサーバーで直接利用して初期状態をレンダリングできるため、サーバーレンダリングの処理が容易になります。
- **分析とトラッキング**：検索クエリとフィルターが直接URLにあるため、追加のクライアントサイドロジックなしでユーザーの行動を追跡しやすくなります。

# 検索機能の追加
これらは検索機能を実装するために使用するNext.jsのクライアントフックです：  

- `useSearchParams`
	- 現在のURLのパラメータにアクセスできます。
	- 例えば、URL `/dashboard/invoices?page=1&query=pending` の検索パラメータは `{page: '1', query: 'pending'}` のようになります。
- `usePathname`
	- 現在のURLのパス名を読み取れます。
	- 例えば、ルート `/dashboard/invoices` に対して、`usePathname` は `'/dashboard/invoices'` を返します。
- `useRouter`
	- クライアントコンポーネント内でプログラム的にルート間のナビゲーションを可能にします。
	- 使用できる[multiple methods](https://nextjs.org/docs/app/api-reference/functions/use-router#userouter)があります。

実装手順の概要は以下の通りです：

1. ユーザーの入力を取得する。
2. 検索パラメータでURLを更新する。
3. URLと入力フィールドを同期させる。
4. 検索クエリを反映してテーブルを更新する。

## ユーザーの入力を取得する
`<Search>`コンポーネント（`/app/ui/search.tsx`）を開くと、以下のことに気づくでしょう：  

- `"use client"` - これはクライアントコンポーネントで、イベントリスナーやフックを使用できます。
- `<input>` - これは検索入力欄です。

新しい`handleSearch`関数を作成し、`<input>`要素に`onChange`リスナーを追加します。  
`onChange`は入力値が変更されるたびに`handleSearch`を呼び出します。  

**/app/ui/search.tsx**
```jsx
'use client';
 
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
 
export default function Search({ placeholder }: { placeholder: string }) {
  function handleSearch(term: string) {
    console.log(term);
  }
 
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
```

Developer Toolsでコンソールを開き、検索フィールドに入力して正しく動作しているかテストしてください。  
コンソールに検索語が表示されるはずです。  

素晴らしいです！ユーザーの検索入力を取得できています。  
次は、検索語でURLを更新する必要があります。  

## 検索パラメータでURLを更新する
`'next/navigation'`から`useSearchParams`フックをインポートし、変数に割り当てます：

**/app/ui/search.tsx**
```javascript
'use client';
 
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';
 
export default function Search() {
  const searchParams = useSearchParams();
 
  function handleSearch(term: string) {
    console.log(term);
  }
  // ...
}
```

`handleSearch`内で、新しい[`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)インスタンスを作成します：  

**/app/ui/search.tsx**
```javascript
'use client';
 
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';
 
export default function Search() {
  const searchParams = useSearchParams();
 
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
  }
  // ...
}
```

`URLSearchParams`は、URLクエリパラメータを操作するためのユーティリティメソッドを提供するWeb APIです。複雑な文字列リテラルを作成する代わりに、これを使用して`?page=1&query=a`のようなパラメータ文字列を取得できます。

次に、ユーザーの入力に基づいてパラメータ文字列を`set`します。入力が空の場合は、それを`delete`します：

**/app/ui/search.tsx**
```tsx
'use client';
 
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';
 
export default function Search() {
  const searchParams = useSearchParams();
 
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
  }
  // ...
}
```

これでクエリ文字列が準備できました。  
Next.js の `useRouter` と `usePathname` フックを使って、URLを更新できます。  

`next/navigation` から `useRouter` と `usePathname` をインポートし、`handleSearch` 内で `useRouter()` の `replace` メソッドを使ってください。  

**/app/ui/search.tsx**
```tsx
'use client';
 
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
 
export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
 
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }
}
```

ここでの処理内容を分解すると次の通りです：  

- `${pathname}` は現在のパスで、今回の場合だと `"/dashboard/invoices"` です。
- ユーザーが検索バーに入力すると、`params.toString()` がその入力をURLに適した形式に変換します。
- `replace(${pathname}?${params.toString()})` により、ユーザーの検索データを含むURLに更新されます。たとえば、ユーザーが「Lee」で検索した場合、URLは `/dashboard/invoices?query=lee` になります。
- このURLの更新は、Next.jsのクライアントサイドナビゲーションによってページをリロードせずに行われます（ページ間のナビゲーションの章で学んだ内容です）。

## URLと入力欄の同期を保つ
URLと入力欄が同期され、共有時に入力欄が自動で入力されるようにするために、`searchParams`から値を読み取り、`defaultValue`として入力欄に渡すことができます：  

**/app/ui/search.tsx**
```jsx
<input
  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
  placeholder={placeholder}
  onChange={(e) => {
    handleSearch(e.target.value);
  }}
  defaultValue={searchParams.get('query')?.toString()}
/>
```

### `defaultValue` と `value` / 制御されたコンポーネント vs. 非制御コンポーネント
入力欄の値を状態で管理している場合、`value` 属性を使って制御されたコンポーネントにします。  
これは、Reactが入力欄の状態を管理することを意味します。  

しかし、状態を使用していない場合は`defaultValue`を使えます。  
これにより、ネイティブの入力欄が自分の状態を管理します。  
検索クエリを状態ではなくURLに保存するため、この方法で問題ありません。  

## テーブルの更新
最後に、検索クエリを反映するためにテーブルコンポーネントを更新する必要があります。  

請求書のページに戻ってください。  

ページコンポーネントは[`searchParams` というプロップを受け取る](https://nextjs.org/docs/app/api-reference/file-conventions/page)ので、現在のURLパラメータを `<Table>` コンポーネントに渡すことができます。  

**/app/dashboard/invoices/page.tsx**
```tsx
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
 
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
 
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}
```

`<Table>` コンポーネントに移動すると、`query` と `currentPage` の2つのプロップが `fetchFilteredInvoices()` 関数に渡されているのが確認できます。  
この関数は、クエリに一致する請求書を返します。  

**/app/ui/invoices/table.tsx**
```tsx
// ...
export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage);
  // ...
}
```

これらの変更が完了したら、実際に試してみましょう。  
検索語句を入力するとURLが更新され、サーバーに新たなリクエストが送信され、サーバー上でデータが取得されます。  
そして、クエリに一致する請求書のみが返されます。  

### `useSearchParams()` フックと `searchParams` プロップの使い分け
検索パラメータを抽出する方法が2つあることに気づいたかと思います。  
どちらを使うかは、クライアント側とサーバー側のどちらで作業しているかによります。  

- `<Search>` はクライアントコンポーネントなので、クライアントからパラメータにアクセスするために `useSearchParams()` フックを使用しました。
- `<Table>` はサーバーコンポーネントで独自のデータを取得するため、ページから `searchParams` プロップを渡しています。

一般的なルールとして、クライアントからパラメータを読み込みたい場合は `useSearchParams()` フックを使用すると、サーバーに戻る必要がないため便利です。  

### ベストプラクティス：**デバウンシング**
おめでとうございます！  
Next.jsでの検索機能が実装できました！  
ですが、最適化のためにできることがまだあります。  

`handleSearch` 関数内に以下の `console.log` を追加してみてください。  

**/app/ui/search.tsx**
```tsx
function handleSearch(term: string) {
  console.log(`Searching... ${term}`);
 
  const params = new URLSearchParams(searchParams);
  if (term) {
    params.set('query', term);
  } else {
    params.delete('query');
  }
  replace(`${pathname}?${params.toString()}`);
}
```

