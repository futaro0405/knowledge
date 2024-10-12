# データの変更
前章では、URL検索パラメータとNext.jsのAPIを使用して検索とページネーションを実装しました。  
請求書の作成、更新、削除機能を追加して、請求書ページの作業を続けましょう！  

この章では... 以下のトピックを扱います：  

1. React Server Actionsとは何か、そしてデータを変更するためにどのように使用するか。
2. フォームとServer Componentsの連携方法。
3. ネイティブの`formData`オブジェクトを扱うベストプラクティス（型のバリデーションを含む）。
4. `revalidatePath` APIを使用してクライアントキャッシュを再検証する方法。
5. 特定のIDを持つ動的ルートセグメントを作成する方法。

これらのトピックを通じて、データの変更と動的ルーティングについて学んでいきます。  

# Server Actionsとは何か？
React Server Actionsを使用すると、サーバー上で直接非同期コードを実行できます。  
これにより、データを変更するためのAPIエンドポイントを作成する必要がなくなります。  
代わりに、サーバー上で実行される非同期関数を書き、それをクライアントコンポーネントやサーバーコンポーネントから呼び出すことができます。  

セキュリティはウェブアプリケーションにとって最優先事項であり、様々な脅威に対して脆弱になる可能性があります。  
ここでServer Actionsが役立ちます。  
Server Actionsは効果的なセキュリティソリューションを提供し、異なる種類の攻撃から保護し、データを安全に保ち、認可されたアクセスを確保します。  
Server Actionsは、POSTリクエスト、暗号化されたクロージャ、厳密な入力チェック、エラーメッセージのハッシュ化、ホスト制限などの技術を通じてこれを実現し、これらすべてが協働してアプリケーションの安全性を大幅に向上させます。  

# Server ActionsとフォームOBの使用
Reactでは、`<form>`要素の`action`属性を使用してアクションを呼び出すことができます。  
アクションは自動的にネイティブの[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)オブジェクトを受け取り、キャプチャされたデータを含みます。  

例えば：

```jsx
// Server Component
export default function Page() {
  // Action
  async function create(formData: FormData) {
    'use server';
 
    // Logic to mutate data...
  }
 
  // Invoke the action using the "action" attribute
  return <form action={create}>...</form>;
}
```

Server Componentの中でServer Actionを呼び出す利点は、プログレッシブエンハンスメントです。  
クライアント側でJavaScriptが無効になっていても、フォームは機能します。  

# Next.jsとServer Actions
Server Actionsは、Next.jsの[キャッシング](https://nextjs.org/docs/app/building-your-application/caching)システムと深く統合されています。  
フォームがServer Actionを通じて送信される際、そのアクションを使用してデータを変更できるだけでなく、`revalidatePath`や`revalidateTag`などのAPIを使用して関連するキャッシュを再検証することもできます。  

これにより、データの更新と同時にキャッシュの一貫性を保つことができ、アプリケーションのパフォーマンスと最新性を効果的に管理できます。  

# 請求書の作成
新しい請求書を作成するための手順は以下の通りです：  

1. ユーザーの入力を取得するフォームを作成する。
2. Server Actionを作成し、フォームから呼び出す。
3. Server Action内で、`formData`オブジェクトからデータを抽出する。
4. データを検証し、データベースに挿入できるように準備する。
5. データを挿入し、エラーを処理する。
6. キャッシュを再検証し、ユーザーを請求書ページにリダイレクトする。

## 新しいルートとフォームの作成
まず、`/invoices`フォルダ内に、`page.tsx`ファイルを持つ`/create`という新しいルートセグメントを追加します：  

![[Pasted image 20241012172557.png]]

新しい請求書を作成するためにこのルートを使用します。  
`page.tsx`ファイル内に以下のコードを貼り付け、内容を確認してください：  

**/dashboard/invoices/create/page.tsx**
```jsx
import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
```

このページは`customers`をフェッチし、それを`<Form>`コンポーネントに渡すサーバーコンポーネントです。  
時間を節約するために、`<Form>`コンポーネントは既に作成されています。  

`<Form>`コンポーネントに移動すると、フォームには以下の要素があることがわかります：  

- **customers**のリストを持つ1つの`<select>`（ドロップダウン）要素。
- **amount**用の`type="number"`の`<input>`要素1つ。
- statusのための`type="radio"`の`<input>`要素2つ。
- `type="submit"`のボタン1つ。

`http://localhost:3000/dashboard/invoices/create` で、以下のUIが表示されるはずです：

![[Pasted image 20241012172707.png]]

## Server Actionの作成
素晳らしいです。次に、フォームが送信されたときに呼び出されるServer Actionを作成しましょう。   

`lib`ディレクトリに移動し、`actions.ts`という新しいファイルを作成します。  
このファイルの先頭にReactの`use server`ディレクティブを追加します：  

**/app/lib/actions.ts**
```typescript
'use server';
```

`'use server'`を追加することで、ファイル内のすべてのエクスポートされた関数をServer Actionsとしてマークします。  
これらのサーバー関数は、クライアントコンポーネントとサーバーコンポーネントの両方でインポートして使用できます。  

Server Actionsをサーバーコンポーネント内に直接記述することもできますが、このコースでは別のファイルにまとめて管理します。  

`actions.ts`ファイルに、`formData`を受け取る新しい非同期関数を作成します：  

**/app/lib/actions.ts**
```typescript
'use server';
 
export async function createInvoice(formData: FormData) {}
```

次に、`<Form>`コンポーネントで、`actions.ts`ファイルから`createInvoice`をインポートします。  
`<form>`要素に`action`属性を追加し、`createInvoice`アクションを呼び出します。  

**/app/ui/invoices/create-form.tsx**
```jsx
import { customerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createInvoice } from '@/app/lib/actions';
 
export default function Form({
  customers,
}: {
  customers: customerField[];
}) {
  return (
    <form action={createInvoice}>
      // ...
  )
}
```

### 知っておくと良いこと
HTMLでは、`action`属性にURLを渡します。  
このURLは、フォームデータが送信される先（通常はAPIエンドポイント）です。  
しかし、Reactでは、`action`属性は特別なプロップとみなされます  
つまり、Reactはその上に構築してアクションを呼び出せるようにしています。  
裏側では、Server Actionsは`POST` APIエンドポイントを作成します。  
これが、Server Actionsを使用する際に手動でAPIエンドポイントを作成する必要がない理由です。  

## `formData`からのデータ抽出
`actions.ts`ファイルに戻り、`formData`の値を抽出する必要があります。  
[いくつかの方法](https://developer.mozilla.org/en-US/docs/Web/API/FormData/append)がありますが、この例では [`.get(name)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData/get)メソッドを使用しましょう。  

**/app/lib/actions.ts**
```typescript
'use server';
 
export async function createInvoice(formData: FormData) {
  const rawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };
  // Test it out:
  console.log(rawFormData);
}
```

### ヒント
多くのフィールドがあるフォームを扱っている場合は、JavaScriptの [`Object.fromEntries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries)と [`entries()`](https://developer.mozilla.org/en-US/docs/Web/API/FormData/entries)メソッドの使用を検討するとよいでしょう。  
例： `const rawFormData = Object.fromEntries(formData.entries())`

すべてが正しく接続されているか確認するために、フォームを試してみてください。  
送信後、入力したデータがターミナルにログ出力されるはずです。  

これでデータがオブジェクトの形になったので、扱いやすくなりました。  

## データの検証と準備
フォームデータをデータベースに送信する前に、正しい形式と正しい型であることを確認する必要があります。  
以前のコースで説明したように、請求書テーブルは以下の形式のデータを期待しています：  

**/app/lib/definitions.ts**
```typescript
export type Invoice = {
  id: string; // Will be created on the database
  customer_id: string;
  amount: number; // Stored in cents
  status: 'pending' | 'paid';
  date: string;
};
```

現時点では、フォームから`customer_id`、`amount`、`status`のみを取得しています。  

### 型の検証と変換
フォームからのデータがデータベースで期待される型と一致することを検証することが重要です。  
例えば、アクション内に`console.log`を追加すると：  

```
console.log(typeof rawFormData.amount);
```

`amount`の型が`number`ではなく`string`であることに気づくでしょう。  
これは、`type="number"`の`input`要素が実際には数値ではなく文字列を返すためです。  

型の検証を処理するには、いくつかの選択肢があります。  
手動で型を検証することもできますが、型検証ライブラリを使用すると時間と労力を節約できます。  
この例では、TypeScriptファーストの検証ライブラリであるZodを使用します。  
Zodはこのタスクを簡単にしてくれます。  

`actions.ts`ファイルで、Zodをインポートし、フォームオブジェクトの形状に一致するスキーマを定義します。  
このスキーマは、データベースに保存する前に`formData`を検証します。  

**/app/lib/actions.ts**
```ts
'use server';
 
import { z } from 'zod';
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });
 
export async function createInvoice(formData: FormData) {
  // ...
}
```

`amount` フィールドは、文字列から数値に強制的に変換（変更）されるように特に設定されており、その型も検証されます。   
その後、`rawFormData` を `CreateInvoice` に渡して型を検証できます。  

**/app/lib/actions.ts**
```ts
// ...
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
}
```

### 値をセントで保存する
通常、JavaScriptの浮動小数点エラーを排除し、より高い精度を確保するために、金銭的な値はセント単位でデータベースに保存するのが良いプラクティスです。

では、金額をセントに変換しましょう。  

**/app/lib/actions.ts**
```ts
// ...
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
}
```

### 新しい日付を作成する  
最後に、請求書の作成日用に「YYYY-MM-DD」形式の新しい日付を作成しましょう。  

**/app/lib/actions.ts**
```ts
// ...
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
}
```

# データベースへのデータ挿入  
必要な値がすべて揃ったので、新しい請求書をデータベースに挿入するためのSQLクエリを作成し、変数を渡すことができます：  

**/app/lib/actions.ts**
```typescript
import { z } from 'zod';
import { sql } from '@vercel/postgres';
 
// ...
 
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
}
```

現在のところ、エラー処理は行っていません。  
次の章でそれを行います。それでは、次のステップに進みましょう。  

# 再検証とリダイレクト  
Next.jsには、[クライアントサイドのルーターキャッシュ](https://nextjs.org/docs/app/building-your-application/caching#router-cache)があり、ルートセグメントをユーザーのブラウザに一定時間保存します。  
[プリフェッチ](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#1-prefetching)とともに、このキャッシュはユーザーがルート間を迅速に移動できるようにし、サーバーへのリクエスト数を減少させます。  

請求書のルートに表示されているデータを更新しているため、このキャッシュをクリアしてサーバーへの新しいリクエストをトリガーしたいと考えています。  
これを実現するためには、Next.jsの[`revalidatePath`](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)関数を使用します：  

**/app/lib/actions.ts**
```typescript
'use server';
 
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
 
// ...
 
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
 
  revalidatePath('/dashboard/invoices');
}
```

データベースが更新されると、`/dashboard/invoices`パスが再検証され、サーバーから新しいデータが取得されます。  

また、この時点でユーザーを`/dashboard/invoices`ページにリダイレクトしたいと考えています。  
これにはNext.jsの [`redirect`](https://nextjs.org/docs/app/api-reference/functions/redirect)関数を使用します：  

**/app/lib/actions.ts**
```typescript
'use server';
 
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
 
// ...
 
export async function createInvoice(formData: FormData) {
  // ...
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

おめでとうございます！  
初めてのサーバーアクションを実装しました。  
新しい請求書を追加してテストしてみてください。  
すべてが正常に動作していれば、次のことが期待できます：  

- 送信後、`/dashboard/invoices`ルートにリダイレクトされる。
- テーブルの一番上に新しい請求書が表示される。

# 請求書の更新  
請求書を更新するフォームは、請求書を作成するフォームと似ていますが、データベース内のレコードを更新するために請求書IDを渡す必要があります。  
では、請求書IDを取得して渡す方法を見ていきましょう。  

請求書を更新するために行う手順は次のとおりです：  

1. 請求書IDを使用して新しい動的ルートセグメントを作成します。
2. ページパラメーターから請求書IDを読み取ります。
3. データベースから特定の請求書を取得します。
4. 請求書データでフォームを事前に入力します。
5. データベース内の請求書データを更新します。

## 請求書IDを使用した動的ルートセグメントの作成  
Next.jsでは、正確なセグメント名がわからない場合やデータに基づいてルートを作成したい場合に、動的ルートセグメントを作成できます。  
これは、ブログ投稿のタイトルや製品ページなどに利用されます。  
動的ルートセグメントは、フォルダ名を角括弧で囲むことで作成できます。  
たとえば、`[id]`、`[post]`、または`[slug]`などです。  

`/invoices`フォルダ内に`[id]`という新しい動的ルートを作成し、その中に`edit`という新しいルートを作成して`page.tsx`ファイルを追加します。  
ファイル構成は次のようになります：  

![[Pasted image 20241012184800.png]]

`<Table>`コンポーネントでは、請求書のIDをテーブルレコードから受け取る`<UpdateInvoice />`ボタンがあります。

**/app/ui/invoices/table.tsx**
```typescript
export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  return (
    // ...
    <td className="flex justify-end gap-2 whitespace-nowrap px-6 py-4 text-sm">
      <UpdateInvoice id={invoice.id} />
      <DeleteInvoice id={invoice.id} />
    </td>
    // ...
  );
}
```

次に、`<UpdateInvoice />`コンポーネントに移動し、`Link`の`href`を更新してIDプロップを受け取るようにします。  
テンプレートリテラルを使用して、動的ルートセグメントへのリンクを作成できます：  

**/app/ui/invoices/buttons.tsx**
```tsx
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
 
// ...
 
export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
```

## ページパラメーターから請求書IDを読み取る  
`<Page>`コンポーネントに以下のコードを追加します：

**/app/dashboard/invoices/[id]/edit/page.tsx**
```typescript
import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
```

このコードは、`/create`ページに似ていますが、異なるフォーム（`edit-form.tsx`ファイル）をインポートしている点が異なります。  
このフォームには、顧客名、請求金額、ステータスのデフォルト値が事前入力されるべきです。  
フォームフィールドにデータを事前入力するには、IDを使用して特定の請求書を取得する必要があります。  

`page`コンポーネントは、`searchParams`に加えて`params`というプロップも受け取ることができ、これを使用してIDにアクセスします。  
以下のように`<Page>`コンポーネントを更新して、`params`プロップを受け取るようにします：  

**/app/dashboard/invoices/[id]/edit/page.tsx**
```typescript
import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  // ...
}
```

