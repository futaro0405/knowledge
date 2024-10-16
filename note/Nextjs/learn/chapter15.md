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
リクエストが完了する前に呼び出され、`auth`と`request`プロパティを含むオブジェクトを受け取ります。  
`auth`プロパティにはユーザーのセッションが含まれ、`request`プロパティには受信リクエストが含まれます。  

`providers`オプションは、異なるログインオプションをリストする配列です。  
今のところ、NextAuth設定を満たすために空の配列になっています。  
「資格情報プロバイダーの追加」のセクションで詳しく学びます。  

次に、`authConfig`オブジェクトをミドルウェアファイルにインポートする必要があります。  
プロジェクトのルートに`middleware.ts`というファイルを作成し、以下のコードを貼り付けてください：  

**/middleware.ts**
```ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
```

ここでは、`authConfig`オブジェクトでNextAuth.jsを初期化し、`auth`プロパティをエクスポートしています。また、ミドルウェアの`matcher`オプションを使用して、特定のパスで実行されるように指定しています。

この作業にミドルウェアを使用する利点は、ミドルウェアが認証を検証するまで保護されたルートのレンダリングが開始されないことです。これにより、アプリケーションのセキュリティとパフォーマンスの両方が向上します。  

## パスワードのハッシュ化
パスワードをデータベースに保存する前にハッシュ化することは良い実践です。  
ハッシュ化は、パスワードを固定長の文字列に変換し、ランダムに見える形にします。  
これにより、ユーザーのデータが露出した場合でもセキュリティの層を提供します。  

`seed.js`ファイルでは、`bcrypt`というパッケージを使用して、ユーザーのパスワードをデータベースに保存する前にハッシュ化しました。  
この章の後半で、ユーザーが入力したパスワードがデータベース内のものと一致するかを比較するために、_再び_このパッケージを使用します。  
ただし、`bcrypt`パッケージ用に別のファイルを作成する必要があります。  
これは、`bcrypt`がNext.jsミドルウェアでは利用できないNode.js APIに依存しているためです。  

`authConfig`オブジェクトを展開する新しいファイル`auth.ts`を作成します：  

**/auth.ts**
```ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
});
```

## 資格情報プロバイダーの追加
次に、NextAuth.jsの`providers`オプションを追加する必要があります。  
`providers`は、GoogleやGitHubなどの異なるログインオプションをリストする配列です。  
このコースでは、Credentials（資格情報）プロバイダーのみを使用することに焦点を当てます。  

Credentialsプロバイダーを使用すると、ユーザーがユーザー名とパスワードでログインできるようになります。  

**/auth.ts**
```typescript
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({})],
});
```

> **注意事項：** Credentialsプロバイダーを使用していますが、一般的には [OAuth](https://authjs.dev/getting-started/providers/oauth-tutorial) や [email](https://authjs.dev/getting-started/providers/email-tutorial)プロバイダーなどの代替プロバイダーを使用することが推奨されています。オプションの完全なリストについては、[NextAuth.js docs](https://authjs.dev/getting-started/providers)を参照してください。

## サインイン機能の追加
`authorize`関数を使用して認証ロジックを処理できます。  
Server Actionsと同様に、`zod`を使用してデータベースでユーザーの存在を確認する前に、メールアドレスとパスワードを検証できます：

**/auth.ts**
```typescript
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
      },
    }),
  ],
});
```

資格情報を検証した後、データベースからユーザーを照会する新しい`getUser`関数を作成します。  

**/auth.ts**
```typescript
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
        }
 
        return null;
      },
    }),
  ],
});
```

次に、`bcrypt.compare`を呼び出してパスワードが一致するかどうかを確認します：  

**/auth.ts**
```typescript
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { sql } from '@vercel/postgres';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
 
// ...
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // ...
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
 
          if (passwordsMatch) return user;
        }
 
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
```

最後に、パスワードが一致する場合はユーザーを返し、一致しない場合は`null`を返してユーザーのログインを防ぎます。  
この実装により、ユーザーの認証プロセスが完成し、セキュアなログイン機能が提供されます。  

## ログインフォームの更新
認証ロジックとログインフォームを接続する必要があります。  
`actions.ts`ファイルに、`authenticate`という新しいアクションを作成します。  
このアクションは`auth.ts`から`signIn`関数をインポートします：  

**/app/lib/actions.ts**
```typescript
'use server';
 
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
 
// ...
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
```

'CredentialsSignin'エラーがある場合、適切なエラーメッセージを表示します。  
NextAuth.jsのエラーについては、[ドキュメント](https://errors.authjs.dev/)で詳細を確認できます。  

最後に、`login-form.tsx`コンポーネントで、Reactの`useActionState`を使用してサーバーアクションを呼び出し、フォームエラーを処理し、フォームの保留状態を表示できます：  

**app/ui/login-form.tsx**
```tsx
'use client';
 
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
 
export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
 
  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <Button className="mt-4 w-full" aria-disabled={isPending}>
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
```

# ログアウト機能の追加
`<SideNav />`にログアウト機能を追加するために、`<form>`要素内で`auth.ts`から`signOut`関数を呼び出します：  

**/ui/dashboard/sidenav.tsx**
```tsx
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
 
export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      // ...
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
```

# 試してみましょう
これで、以下の認証情報を使用してアプリケーションにログインとログアウトができるはずです：

- メールアドレス: `user@nextmail.com`
- パスワード: `123456`
