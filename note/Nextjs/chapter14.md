# アクセシビリティの向上
前章では、エラー（404エラーを含む）をキャッチしてユーザーにフォールバックを表示する方法を見てきました。  
しかし、まだ解決すべき別の部分があります：フォームのバリデーションです。  
Server Actionsを使用したサーバーサイドのバリデーションの実装方法と、Reactの`useActionState`フックを使用してフォームエラーを表示する方法を、アクセシビリティを念頭に置きながら見ていきましょう！  

この章では... 以下のトピックを扱います：  

1. Next.jsで`eslint-plugin-jsx-a11y`を使用してアクセシビリティのベストプラクティスを実装する方法。
2. サーバーサイドのフォームバリデーションを実装する方法。
3. Reactの`useActionState`フックを使用してフォームエラーを処理し、ユーザーに表示する方法。

これらのトピックを通じて、アプリケーションのアクセシビリティを向上させ、より良いユーザー体験を提供する方法を学びます。  
フォームのバリデーションとエラー表示は、ユーザビリティとアクセシビリティの両面で重要な要素です。  

# アクセシビリティとは何か？
アクセシビリティとは、障害のある人を含むすべての人が使用できるようにウェブアプリケーションを設計し実装することを指します。  
これは、キーボードナビゲーション、セマンティックHTML、画像、色、動画など、多くの領域をカバーする広範なトピックです。  

このコースではアクセシビリティについて深く掘り下げませんが、Next.jsで利用可能なアクセシビリティ機能と、アプリケーションをよりアクセシブルにするためのいくつかの一般的な実践方法について説明します。  

> アクセシビリティについてさらに学びたい場合は、[web.dev](https://web.dev/)による「[Learn Accessibility](https://web.dev/learn/accessibility/)」コースをお勧めします。  

# Next.jsでのESLintアクセシビリティプラグインの使用
Next.jsは、アクセシビリティの問題を早期に発見するためにESLint設定に`eslint-plugin-jsx-a11y`プラグインを含んでいます。  
このプラグインは、`alt`テキストのない画像、`aria-*`および`role`属性の不適切な使用などを警告します。  

オプションとして、これを試したい場合は、`package.json`ファイルに`next lint`をスクリプトとして追加してください：  

**/package.json**
```json
"scripts": {
    "build": "next build",
    "dev": "next dev",
    "start": "next start",
    "lint": "next lint"
},
```

そして、ターミナルで`pnpm lint`を実行します：

```Terminal
pnpm lint
```

これにより、プロジェクトのESLintのインストールと設定が案内されます。  
今`pnpm lint`を実行すると、以下の出力が表示されるはずです：  

```terminal
✔ No ESLint warnings or errors
```

しかし、`alt`テキストのない画像があった場合はどうなるでしょうか？試してみましょう！  
`/app/ui/invoices/table.tsx`に移動し、画像から`alt`プロパティを削除します。  
エディタの検索機能を使って`<Image>`をすぐに見つけることができます：  

**/app/ui/invoices/table.tsx**
```jsx
<Image
  src={invoice.image_url}
  className="rounded-full"
  width={28}
  height={28}
  alt={`${invoice.name}'s profile picture`} // Delete this line
/>
```

ここで再度`pnpm lint`を実行すると、以下の警告が表示されるはずです：

```terminal
./app/ui/invoices/table.tsx
45:25  Warning: Image elements must have an alt prop,
either with meaningful text, or an empty string for decorative images. jsx-a11y/alt-text
```

リンターの追加と設定は必須のステップではありませんが、開発プロセスでアクセシビリティの問題を発見するのに役立ちます。  

# フォームのアクセシビリティ改善
フォームのアクセシビリティを向上させるために、すでに以下の3つのことを行っています：  

1. **セマンティックHTML**: `<div>`の代わりにセマンティック要素（`<input>`, `<option>`など）を使用しています。これにより支援技術（AT）が入力要素に焦点を当て、ユーザーに適切な文脈情報を提供できるようになり、フォームのナビゲーションと理解が容易になります。
2. **ラベリング**: `<label>`と`htmlFor`属性を含めることで、各フォームフィールドに説明的なテキストラベルが付けられます。これにより文脈を提供してAT対応が向上し、ユーザーがラベルをクリックして対応する入力フィールドにフォーカスできるようになり、使いやすさも向上します。
3. **フォーカスアウトライン**: フィールドがフォーカスされたときにアウトラインが表示されるように適切にスタイリングされています。これはページ上のアクティブな要素を視覚的に示すため、キーボードユーザーとスクリーンリーダーユーザーの両方がフォーム上の位置を理解するのに役立つ、アクセシビリティにとって重要な要素です。`tab`キーを押すことで確認できます。

これらの実践は、多くのユーザーにとってフォームをよりアクセシブルにするための良い基盤となります。  
しかし、**フォームのバリデーション**と**エラー**については対応していません。  

# フォームバリデーション
`http://localhost:3000/dashboard/invoices/create`にアクセスし、空のフォームを送信してみてください。  
何が起こるでしょうか？  

エラーが発生します！  
これは、空のフォーム値をServer Actionに送信しているためです。  
クライアントまたはサーバーでフォームを検証することで、これを防ぐことができます。  

## クライアントサイドバリデーション
クライアントでフォームを検証する方法はいくつかあります。  
最も簡単な方法は、フォームの`<input>`と`<select>`要素に`required`属性を追加して、ブラウザが提供するフォームバリデーションに依存することです。  

例えば：

**/app/ui/invoices/create-form.tsx**
```jsx
<input
  id="amount"
  name="amount"
  type="number"
  placeholder="Enter USD amount"
  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
  required
/>
```

フォームを再度送信してみてください。  
空の値でフォームを送信しようとすると、ブラウザが警告を表示します。  

この方法は一般的に問題ありません。一部の支援技術がブラウザのバリデーションをサポートしているためです。

クライアントサイドバリデーションの代替として、サーバーサイドバリデーションがあります。次のセクションでその実装方法を見ていきましょう。今のところ、`required`属性を追加した場合は削除してください。  

## サーバーサイドバリデーション
フォームをサーバーで検証することで、以下のことが可能になります：  

- データベースに送信する前に、データが期待される形式であることを確認できます。
- クライアントサイドのバリデーションをバイパスする悪意のあるユーザーのリスクを減らせます。
- 何が_有効な_データとみなされるかについて、単一の信頼できる情報源を持てます。

`create-form.tsx`コンポーネントで、`react`から`useActionState`フックをインポートします。  
`useActionState`はフックなので、`"use client"`ディレクティブを使用してフォームをクライアントコンポーネントに変更する必要があります：  

**/app/ui/invoices/create-form.tsx**
```tsx
'use client';
 
// ...
import { useActionState } from 'react';
```

フォームコンポーネント内で、`useActionState`フックは：

- 2つの引数を取ります：`(action, initialState)`
- 2つの値を返します：`[state, formAction]` - フォームの状態と、フォーム送信時に呼び出される関数

`useActionState`の引数として`createInvoice`アクションを渡し、`<form action={}>` 属性内で`formAction`を呼び出します。  

**/app/ui/invoices/create-form.tsx**
```tsx
// ...
import { useActionState } from 'react';
 
export default function Form({ customers }: { customers: CustomerField[] }) {
  const [state, formAction] = useActionState(createInvoice, initialState);
 
  return <form action={formAction}>...</form>;
}
```

`initialState`は任意のものを定義できますが、この場合は`message`と`errors`という2つの空のキーを持つオブジェクトを作成し、`actions.ts`ファイルから`State`型をインポートします：  

**/app/ui/invoices/create-form.tsx**
```tsx
// ...
import { createInvoice, State } from '@/app/lib/actions';
import { useActionState } from 'react';
 
export default function Form({ customers }: { customers: CustomerField[] }) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createInvoice, initialState);
 
  return <form action={formAction}>...</form>;
}
```

これは最初は分かりにくいかもしれませんが、サーバーアクションを更新すると理解しやすくなります。  
今すぐそれを行いましょう。  

`action.ts`ファイルで、Zodを使用してフォームデータを検証できます。  
`FormSchema`を以下のように更新してください：  

**/app/lib/actions.ts**
```ts
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});
```

- `customerId` - Zodは既に顧客フィールドが空の場合にエラーを投げます（`string`型を期待しているため）。ユーザーが顧客を選択しない場合のフレンドリーなメッセージを追加しましょう。
- `amount` - 金額の型を`string`から`number`に強制変換しているため、文字列が空の場合は0がデフォルト値になります。`.gt()`関数を使用して、常に0より大きい金額をZodに要求しましょう。
- `status` - Zodは既にステータスフィールドが空の場合にエラーを投げます（"pending"または"paid"を期待しているため）。ユーザーがステータスを選択しない場合のフレンドリーなメッセージも追加しましょう。

次に、`createInvoice`アクションを更新して、`prevState`と`formData`の2つのパラメータを受け取るようにします：  

**/app/lib/actions.ts**
```ts
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
 
export async function createInvoice(prevState: State, formData: FormData) {
  // ...
}
```

- `formData` - 以前と同じです。
- `prevState` - `useActionState`フックから渡された状態を含みます。この例では、アクション内では使用しませんが、必須のプロップです。

次に、Zodの`parse()`関数を`safeParse()`に変更します：

**/app/lib/actions.ts**
```ts
export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // ...
}
```

`safeParse()`は`success`または`error`フィールドを含むオブジェクトを返します。  
これにより、このロジックを`try/catch`ブロック内に置かずに、バリデーションをより適切に処理できます。  

データベースに情報を送信する前に、フォームフィールドが正しく検証されたかを条件文でチェックします：  

**/app/lib/actions.ts**
```ts
export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // ...
}
```

`validatedFields`が成功しなかった場合、Zodからのエラーメッセージを含む関数を早期に返します。  

> tip: `validatedFields`をconsole.logで出力し、空のフォームを送信して、その構造を確認してみてください。

最後に、フォームの検証を`try/catch`ブロックの外で個別に処理しているので、データベースエラーに対して特定のメッセージを返すことができます。  
最終的なコードは以下のようになるはずです：  

**/app/lib/actions.ts**
```ts
export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

素晴らしいです。次に、フォームコンポーネントにエラーを表示しましょう。`create-form.tsx`コンポーネントに戻り、フォームの`state`を使用してエラーにアクセスできます。

各特定のエラーをチェックする**三項演算子**を追加します。例えば、顧客フィールドの後に以下を追加できます：

**/app/ui/invoices/create-form.tsx**
```tsx
<form action={formAction}>
  <div className="rounded-md bg-gray-50 p-4 md:p-6">
    {/* Customer Name */}
    <div className="mb-4">
      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
        Choose customer
      </label>
      <div className="relative">
        <select
          id="customer"
          name="customerId"
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          defaultValue=""
          aria-describedby="customer-error"
        >
          <option value="" disabled>
            Select a customer
          </option>
          {customers.map((name) => (
            <option key={name.id} value={name.id}>
              {name.name}
            </option>
          ))}
        </select>
        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
      </div>
      <div id="customer-error" aria-live="polite" aria-atomic="true">
        {state.errors?.customerId &&
          state.errors.customerId.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>
    // ...
  </div>
</form>
```

> tip: コンポーネント内で`state`をconsole.logで出力し、すべてが正しく接続されているか確認できます。フォームが今はクライアントコンポーネントになっているので、Dev Toolsのコンソールを確認してください。

上記のコードでは、以下のariaラベルも追加しています：

1. `aria-describedby="customer-error"`: これは`select`要素とエラーメッセージのコンテナの間に関係を確立します。`id="customer-error"`を持つコンテナが`select`要素を説明していることを示します。スクリーンリーダーは、ユーザーが`select`ボックスを操作する際にこの説明を読み上げ、エラーを通知します。
2. `id="customer-error"`: この`id`属性は、`select`入力のエラーメッセージを保持するHTML要素を一意に識別します。これは`aria-describedby`が関係を確立するために必要です。
3. `aria-live="polite"`: `div`内のエラーが更新されたとき、スクリーンリーダーはユーザーに丁寧に通知するべきであることを示します。コンテンツが変更されたとき（例えば、ユーザーがエラーを修正したとき）、スクリーンリーダーはこれらの変更を通知しますが、ユーザーを中断しないように、ユーザーが操作していないときにのみ通知します。

これらのaria属性は、アクセシビリティを向上させ、支援技術を使用するユーザーがフォームとそのエラーメッセージをより良く理解し、操作できるようにするために重要です。  

# 練習：ariaラベルの追加
上記の例を使用して、残りのフォームフィールドにエラーを追加してください。  
また、フィールドが欠けている場合は、フォームの下部にメッセージを表示する必要があります。  
UIは以下のようになるはずです：

![[Pasted image 20241012234053.png]]

準備ができたら、`pnpm lint`を実行して、ariaラベルを正しく使用しているか確認してください。

自分自身に挑戦したい場合は、この章で学んだ知識を使用して、`edit-form.tsx`コンポーネントにフォームバリデーションを追加してみてください。

以下の作業が必要です：

1. `edit-form.tsx`コンポーネントに`useActionState`を追加する。
2. Zodからのバリデーションエラーを処理するように`updateInvoice`アクションを編集する。
3. コンポーネントにエラーを表示し、アクセシビリティを向上させるためにariaラベルを追加する。

準備ができたら、以下のコードスニペットを展開して解決策を確認してください：

## 回答

**/app/ui/invoices/edit-form.tsx**
```tsx
// ...
import { updateInvoice, State } from '@/app/lib/actions';
import { useActionState } from 'react';
 
export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
  const initialState: State = { message: null, errors: {} };
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);
  const [state, formAction] = useActionState(updateInvoiceWithId, initialState);
 
  return <form action={formAction}></form>;
}
```

**/app/lib/actions.ts**
```ts
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
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

# 認証の追加
前章では、フォームバリデーションを追加し、アクセシビリティを向上させることで請求書ルートの構築を完了しました。  
この章では、ダッシュボードに認証を追加します。  

この章で扱うトピック：

1. 認証とは何か
2. NextAuth.jsを使用してアプリに認証を追加する方法
3. ミドルウェアを使用してユーザーをリダイレクトし、ルートを保護する方法
4. Reactの`useActionState`を使用して保留状態とフォームエラーを処理する方法

# 認証とは何か？
認証は今日の多くのウェブアプリケーションの重要な部分です。  
これは、システムがユーザーが主張する通りの人物であるかを確認する方法です。  

安全なウェブサイトでは、ユーザーの身元を確認するために複数の方法を使用することがよくあります。  
例えば、ユーザー名とパスワードを入力した後、サイトがデバイスに確認コードを送信したり、Google認証システムなどの外部アプリを使用したりすることがあります。  
この2要素認証（2FA）はセキュリティを向上させます。  
誰かがパスワードを知ったとしても、あなたの固有のトークンなしではアカウントにアクセスできません。  

## 認証 vs 認可
ウェブ開発では、認証と認可は異なる役割を果たします：  

- **認証**は、ユーザーが主張する通りの人物であることを確認することです。ユーザー名とパスワードのような、あなたが持っているもので身元を証明します。
- **認可**は次のステップです。ユーザーの身元が確認されると、認可はアプリケーションのどの部分を使用できるかを決定します。

つまり、認証はあなたが誰であるかを確認し、認可はアプリケーション内で何ができるか、何にアクセスできるかを決定します。  

# ログインルートの作成
まず、アプリケーションに`/login`という新しいルートを作成し、以下のコードを貼り付けてください：  

**/app/login/page.tsx**
```tsx
import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
```

このページでは`<LoginForm />`をインポートしていますが、これは後ほどこの章で更新します。  

# NextAuth.js
アプリケーションに認証を追加するために [NextAuth.js](https://nextjs.authjs.dev/)を使用します。  
NextAuth.jsは、セッション管理、サインインとサインアウト、その他の認証の側面に関わる多くの複雑さを抽象化します。  
これらの機能を手動で実装することもできますが、そのプロセスは時間がかかり、エラーが発生しやすいです。  
NextAuth.jsはこのプロセスを簡素化し、Next.jsアプリケーションの認証に統一されたソリューションを提供します。  

# NextAuth.jsのセットアップ
以下のコマンドをターミナルで実行して、NextAuth.jsをインストールします：  

```terminal
pnpm i next-auth@beta
```

ここでは、Next.js 14と互換性のある`beta`バージョンのNextAuth.jsをインストールしています。  

次に、アプリケーション用の秘密鍵を生成します。この鍵はクッキーの暗号化に使用され、ユーザーセッションのセキュリティを確保します。ターミナルで以下のコマンドを実行して生成できます：


```terminal
openssl rand -base64 32
```

そして、`.env`ファイルで、生成した鍵を`AUTH_SECRET`変数に追加します：

**.env**
```
AUTH_SECRET=your-secret-key
```

本番環境で認証を機能させるには、Vercelプロジェクトの環境変数も更新する必要があります。  
Vercelで環境変数を追加する方法については、この[ガイド](https://vercel.com/docs/projects/environment-variables)を参照してください。  

## pagesオプションの追加

プロジェクトのルートに`auth.config.ts`ファイルを作成し、`authConfig`オブジェクトをエクスポートします。  
このオブジェクトにはNextAuth.jsの設定オプションが含まれます。  
現時点では、`pages`オプションのみを含めます：  

**/auth.config.ts**
```ts
import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
} satisfies NextAuthConfig;
```

`pages`オプションを使用して、カスタムのサインイン、サインアウト、エラーページのルートを指定できます。  
これは必須ではありませんが、`pages`オプションに`signIn: '/login'`を追加することで、ユーザーはNextAuth.jsのデフォルトページではなく、カスタムのログインページにリダイレクトされます。  

このセットアップにより、NextAuth.jsの基本的な設定が完了し、カスタムログインページを使用する準備が整います。  

# Next.jsミドルウェアを使用したルートの保護
次に、ルートを保護するロジックを追加します。  
これにより、ログインしていないユーザーがダッシュボードページにアクセスするのを防ぎます。  

**/auth.config.ts**
```ts
import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
```

`authorized`コールバックは、Next.jsミドルウェアを介してページへのアクセスが許可されているかを検証するために使用されます。  
リクエストが完了する前に呼び出され、`auth`と`request`プロパティを含むオブジェクトを受け取ります。`auth`プロパティにはユーザーのセッションが含まれ、`request`プロパティには受信リクエストが含まれます。

`providers`オプションは、異なるログインオプションをリストする配列です。今のところ、NextAuth設定を満たすために空の配列になっています。「資格情報プロバイダーの追加」のセクションで詳しく学びます。

次に、`authConfig`オブジェクトをミドルウェアファイルにインポートする必要があります。プロジェクトのルートに`middleware.ts`というファイルを作成し、以下のコードを貼り付けてください：

/middleware.ts

typescript

Copy

`import NextAuth from 'next-auth'; import { authConfig } from './auth.config'; export default NextAuth(authConfig).auth; export const config = {   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'], };`

ここでは、`authConfig`オブジェクトでNextAuth.jsを初期化し、`auth`プロパティをエクスポートしています。また、ミドルウェアの`matcher`オプションを使用して、特定のパスで実行されるように指定しています。

この作業にミドルウェアを使用する利点は、ミドルウェアが認証を検証するまで保護されたルートのレンダリングが開始されないことです。これにより、アプリケーションのセキュリティとパフォーマンスの両方が向上します。