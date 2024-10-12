# エラーハンドリング
前の章でサーバーアクションを使ってデータを操作する方法を学びました。  
この章では、JavaScriptの`try/catch`ステートメントとNext.jsのAPIを使ってエラーを適切に処理する方法を見ていきます。  
## この章で扱うトピック：
- **特別な`error.tsx`ファイル**の使用方法：ルートセグメント内でエラーをキャッチし、ユーザーにフォールバックUIを表示する方法。
- **`notFound`関数と`not-found`ファイル**の使用方法：存在しないリソースに対して404エラーを処理する方法。

# サーバーアクションへの`try/catch`追加
まず、サーバーアクションにJavaScriptの`try/catch`ステートメントを追加して、エラーを適切に処理できるようにしましょう。  

すでに方法を知っている場合は、数分かけてサーバーアクションを更新してください。  
必要であれば、以下のコードを参考にしてください：  

## 回答

**/app/lib/actions.ts**
```ts
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

**/app/lib/actions.ts**
```ts
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 
  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

**/app/lib/actions.ts**
```ts
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}
```

`redirect`が`try/catch`ブロックの外側で呼び出されていることに注目してください。  
これは、`redirect`がエラーをスローして動作するためであり、`catch`ブロックに捕まってしまうからです。  
これを避けるには、`try/catch`の後に`redirect`を呼び出します。  
`try`が成功した場合のみ、`redirect`に到達します。  

次に、サーバーアクション内でエラーがスローされた場合に何が起こるかを確認しましょう。  
例えば、`deleteInvoice`アクションの先頭でエラーをスローしてみます。  

**/app/lib/actions.ts**
```ts
export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice');
 
  // Unreachable code block
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice' };
  }
}
```

請求書を削除しようとすると、localhostでエラーが表示されるはずです。  
テストが終わったら、このエラーは削除して、次のセクションに進む前に取り除いてください。  

開発中にこれらのエラーを見ることは、潜在的な問題を早期にキャッチできるため役立ちます。  
しかし、ユーザーにエラーを表示して、アプリケーションが突然停止するのを避け、引き続き動作できるようにしたいです。  

これが、Next.jsの[`error.tsx`](https://nextjs.org/docs/app/api-reference/file-conventions/error)ファイルが活躍する場面です。  

# `error.tsx`でのすべてのエラー処理
`error.tsx`ファイルは、ルートセグメントのUIバウンダリを定義するために使用できます。  
これは予期せぬエラーに対する**キャッチオール**として機能し、ユーザーにフォールバックUIを表示することができます。  

`/dashboard/invoices`フォルダ内に、`error.tsx`という新しいファイルを作成し、以下のコードを貼り付けてください：  

**/dashboard/invoices/error.tsx**
```tsx
'use client';
 
import { useEffect } from 'react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}
```

上記のコードについて、いくつか注意点があります：

- **"use client"** - `error.tsx`はクライアントコンポーネントである必要があります。
- 2つのプロップを受け取ります：
    - `error`：このオブジェクトはJavaScriptのネイティブ [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)オブジェクトのインスタンスです。
    - `reset`：これはエラーバウンダリをリセットする関数です。実行されると、この関数はルートセグメントの再レンダリングを試みます。

請求書の削除を再度試みると、以下のようなUIが表示されるはずです：

![[Pasted image 20241012224552.png]]

# `notFound`関数を使用した404エラーの処理
エラーを適切に処理するもう一つの方法は、`notFound`関数を使用することです。  
`error.tsx`が**すべての**エラーをキャッチするのに便利である一方、`notFound`は存在しないリソースを取得しようとした場合に使用できます。  

例えば、http://localhost:3000/dashboard/invoices/2e94d1ed-d220-449f-9f11-f0bbceed9645/edit にアクセスしてみてください。   
これはデータベースに存在しない偽のUUIDです。  

`error.tsx`が定義されている`/invoices`の子ルートであるため、すぐに`error.tsx`が発動するのがわかります。  

しかし、より具体的にしたい場合は、404エラーを表示して、ユーザーが参照しようとしているリソースが見つからないことを伝えることができます。  

`data.ts`の`fetchInvoiceById`関数内で、返される`invoice`をコンソールログに出力することで、リソースが見つからないことを確認できます：  

**/app/lib/data.ts**
```ts
export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    // ...
 
    console.log(invoice); // Invoice is an empty array []
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}
```

請求書がデータベースに存在しないことがわかったので、`notFound`を使用して処理しましょう。  `/dashboard/invoices/[id]/edit/page.tsx`に移動し、`'next/navigation'`から`{ notFound }`をインポートします。  

そして、請求書が存在しない場合に`notFound`を呼び出すための条件文を使用できます：

**/dashboard/invoices/[id]/edit/page.tsx**
```typescript
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { updateInvoice } from '@/app/lib/actions';
import { notFound } from 'next/navigation';
 
export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);
 
  if (!invoice) {
    notFound();
  }
 
  // ...
}
```

素晴らしいです！  
これで、特定の請求書が見つからない場合、`<Page>`はエラーをスローします。  
ユーザーにエラーUIを表示するために、`/edit`フォルダ内に`not-found.tsx`ファイルを作成してください。  

