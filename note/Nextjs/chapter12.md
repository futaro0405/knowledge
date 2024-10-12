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

