# フォントと画像の最適化
前章では、Next.jsアプリケーションのスタイリング方法を学びました。  
カスタムフォントとヒーロー画像を追加して、ホームページの作業を続けましょう。  

この章では... 以下のトピックを扱います。  

- `next/font`でカスタムフォントを追加する方法
- `next/image`で画像を追加する方法
- Next.jsでのフォントと画像の最適化方法
# なぜフォントを最適化するのか？
フォントはウェブサイトのデザインで重要な役割を果たしますが、プロジェクトでカスタムフォントを使用すると、フォントファイルのフェッチとロードが必要になるため、パフォーマンスに影響を与える可能性があります。  

[累積レイアウトシフト（CLS）](https://vercel.com/blog/how-core-web-vitals-affect-seo)は、Googleがウェブサイトのパフォーマンスとユーザー体験を評価するために使用する指標です。  
フォントの場合、ブラウザが最初にフォールバックまたはシステムフォントでテキストをレンダリングし、その後カスタムフォントがロードされると入れ替わることでレイアウトシフトが発生します。  
この入れ替わりにより、テキストのサイズ、間隔、またはレイアウトが変更され、周囲の要素が移動する可能性があります。  

Next.jsは、`next/font`モジュールを使用すると、アプリケーション内のフォントを自動的に最適化します。  
ビルド時にフォントファイルをダウンロードし、他の静的アセットと共にホストします。  
つまり、ユーザーがアプリケーションを訪れた際、パフォーマンスに影響を与えるフォントの追加ネットワークリクエストがありません。  
# プライマリフォントの追加
アプリケーションにカスタムGoogleフォントを追加して、どのように機能するか見てみましょう！  

`/app/ui`フォルダ内に`fonts.ts`という新しいファイルを作成します。  
このファイルは、アプリケーション全体で使用するフォントを保持するために使用します。  

`next/font/google`モジュールから`Inter`フォントをインポートします。  
これがプライマリフォントになります。  
次に、ロードしたい[サブセット](https://fonts.google.com/knowledge/glossary/subsetting)を指定します。  
この場合は`'latin'`です。  

**/app/ui/fonts.ts**
```ts
import { Inter } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });
```

最後に、`/app/layout.tsx`の`<body>`要素にフォントを追加します。

**/app/layout.tsx**
```tsx
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
```

`Inter`を`<body>`要素に追加することで、フォントはアプリケーション全体に適用されます。  
ここでは、フォントを滑らかにするTailwindの[`antialiased`](https://tailwindcss.com/docs/font-smoothing)クラスも追加しています。  
このクラスの使用は必須ではありませんが、見栄えが良くなります。  

ブラウザに移動し、開発者ツールを開いて`body`要素を選択してください。  
スタイルの下に`Inter`と`Inter_Fallback`が適用されているのが確認できるはずです。  

# **練習：二次フォントの追加**
アプリケーションの特定の要素にフォントを追加することもできます。  

今度はあなたの番です！  
`fonts.ts`ファイルに`Lusitana`という二次フォントをインポートし、`/app/page.tsx`ファイルの`<p>`要素に適用してください。  
以前のようにサブセットを指定することに加えて、フォントの**ウェイト**も指定する必要があります。  

準備ができたら、以下のコードスニペットを展開して解答を確認してください。  

> **ヒント**
> - フォントに渡すウェイトオプションが不明な場合は、コードエディタのTypeScriptエラーを確認してください。
> - Google Fontsウェブサイトで`Lusitana`を検索し、利用可能なオプションを確認してください。
> - 複数のフォントの追加とオプションの完全なリストについては、ドキュメントを参照してください。

## 回答
**/app/page.tsx**
```tsx
import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
 
export default function Page() {
  return (
    // ...
    <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
      {/* Add Hero Images Here */}
      <Image
        src="/hero-desktop.png"
        width={1000}
        height={760}
        className="hidden md:block"
        alt="Screenshots of the dashboard project showing desktop version"
      />
      <Image
        src="/hero-mobile.png"
        width={560}
        height={620}
        className="block md:hidden"
        alt="Screenshot of the dashboard project showing mobile version"
      />
    </div>
    //...
  );
}
```

# 推奨読書
これらのトピックについてはさらに多くのことを学ぶことができます。  
リモート画像の最適化やローカルフォントファイルの使用などが含まれます。  
フォントと画像についてさらに深く掘り下げたい場合は、以下を参照してください。

- 画像最適化ドキュメント
- フォント最適化ドキュメント
- 画像によるWeb性能の改善（MDN）
- Webフォント（MDN）
- Core Web VitalsがSEOに与える影響

There's a lot more to learn about these topics, including optimizing remote images and using local font files. If you'd like to dive deeper into fonts and images, see:

- [Image Optimization Docs](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Font Optimization Docs](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Improving Web Performance with Images (MDN)](https://developer.mozilla.org/en-US/docs/Learn/Performance/Multimedia)
- [Web Fonts (MDN)](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Web_fonts)
- [How Core Web Vitals Affect SEO](https://vercel.com/blog/how-core-web-vitals-affect-seo)