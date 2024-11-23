ReactとGoを使っての開発へようこそ。
このコースでは、Reactのフロントエンドを使用してシングルページアプリケーションを構築する方法を学びます。
Reactはバージョン18、React Routerはバージョン6を使用し、そのフロントエンドの全データはGoで構築されたREST APIおよびGraphQLから供給されます。
この詳細については後ほど説明します。

このコースで学ぶことは何か？
Reactを網羅し、シングルページアプリケーションを構築するために必要なコンポーネント、ステート、フック、refsといった重要な事項をカバーします。

コースの最初のセクションでは、従来のクラスを用いた方法と、最新の関数型コンポーネントとフックを用いた方法の両方を使ってReactアプリケーションを構築する方法を学びます。

次に、Go（一般的に「Golang」と呼ばれる）でREST APIのバックエンドを構築し、Postgresデータベースの上に構築します。また、GraphQLの導入についても取り上げ、PostgresをバックエンドとしたグラフデータベースからフロントエンドでGraphQLを使用してクエリを実行します。GraphQLは近年ますます人気を集めています。

このアプリケーションでは、JOTS、JWT、JSON Webトークンを使ってユーザー認証を行います。また、リフレッシュトークンを導入し、ユーザーが再度ユーザー名やパスワードを入力しなくても自動的に再認証されるようにします。

では、なぜReactを使うのでしょうか？

まず、Reactは比較的学びやすいです。複雑ではなく、現在では基本的なJavaScriptです。クラスを除いてしまえば、JavaScriptとフックのみです。
Reactアプリケーションを作成する上で最も重要なことは、コンポーネントの動作を理解することです。
なぜなら、Reactにおいてすべてはコンポーネント、つまり再利用可能なコンポーネントだからです。
例えば、このコースではいくつかのフォームを作成しますが、手作業でフォームを作るのではなく、テキスト入力用のコンポーネントや、チェックボックス用のコンポーネント、セレクト用のコンポーネントなどを作成し、それらを必要なだけ再利用してフォームを構築していきます。

つまり、賢いコンポーネントを構築することで、フォームがより便利になり、構築も容易になります。

Reactは非常に高速で、アプリケーションを構築する際には常に良い点です。
理解に少し時間がかかる概念として、**単方向データフロー**がありますが、これはほとんどのシングルページアプリケーションで一般的です。また、Reactには大規模なユーザーコミュニティがあるため、リソースやサポートを見つけるのが比較的簡単です。

次に、なぜGoを選ぶのかについて説明します。

Goは近年非常に人気が高まっており、バックエンドアプリケーションを構築するための非常に人気のある言語です。
このコースで行う内容そのものです。
Goは非常に学びやすく理解しやすい言語であり、特に並行処理のサポートが標準で組み込まれている点が、他のほとんどの言語より優れています。
唯一、Rustが同等またはそれに近いと言えるでしょう。

Goは型安全な言語であり、例えば整数型の変数を宣言すると、その変数には整数のみを格納できます。JavaScriptやPHPのような言語から移行してきた人にとっては新しいかもしれませんが、コードをバグが少なくなるようにします。

最後に、Goは単一のバイナリにコンパイルされます。
つまり、アプリケーションの構築が完了した後、バックエンドアプリケーションは1つのファイルをサーバーにコピーして起動するだけで動作します。
それが私たちのバックエンドAPIになります。

このコースでは何を構築するのでしょうか？
シングルページアプリケーションを構築し、ユーザー認証、レコードの追加、更新、削除といった標準的な機能を備えたものを作成します。
バックエンドはGoで書かれ、JSONとGraphQLの両方を扱い、フロントエンドはReactで構築されます。
最後に、JSON Webトークン（JOTS）を使ってサイトを保護します。

では、具体的にどんなアプリケーションを作るのか見ていきましょう。
このコースの第2セクションで構築するアプリケーションがこちらです。
最初のセクションはReactの基本的な練習です。

見た目の面ではあまり魅力的ではないかもしれませんが、このコースはグラフィックデザインのコースではなく、Reactでアプリケーションを構築し、Goでバックエンドを構築する方法を学ぶコースです。

アプリケーションでは映画をブラウズして、今夜見る映画を探せます。
映画のリストが表示され、少数しか選択肢はありませんが、コースの目的には十分です。
例えば、「ゴッドファーザー」をクリックすると、映画の写真、説明、関連情報が表示されます。
非常にシンプルです。

また、ジャンル別に映画をブラウズすることもできます。
例えば、冒険映画だけを見たいときには、恐らく1本しかありませんね。
「レイダース/失われたアーク《聖櫃》」です。

とてもシンプルですが、ログインもできます。

こちらで「 admin@example.com 」というユーザー名と適切なパスワードでログインしてみます。
現在、画面上部には「ログイン」と表示されており、メニュー項目は3つだけです。
ログインすると、バックエンドに接続し、JSON Webトークンとリフレッシュトークンが返されます。

ログイン後は、機能が増えます。
映画を閲覧するだけでなく、新しい映画を追加できるようになります。
ここで必要な情報をすべて入力し、追加する映画が該当するジャンルをチェックして保存します。
これにより、新しい映画がデータベースに登録されます。

カタログの管理もでき、個々の映画を見て自由に変更を加え、再度保存することも可能です。

最後に、同じデータベースを閲覧する方法として、今回はGraphQLを使用したグラフデータベースも扱います。
GraphQLはフロントエンドのデザイナーに非常に好まれており、必要な情報を得るためにバックエンドをプログラマーに変更してもらう必要がなくなります。

GraphQLの使い方の基本も学びます。
例えば、こちらの映画リストと先ほどのリストの違いは、名前でフィルターできる点です。
例えば、「the」と入力すると、タイトルに「the」を含む映画だけが表示されます。

とても楽しみですね。それでは始めましょう。
# Getting Started with React
## How React Works
では、初めてのReactアプリケーションを作成しましょう。

まず、お気に入りのターミナルを開きます。
ここでは、ターミナルを開いてデスクトップに移動します。
私はMacを使用しているので、デスクトップに移動しますが、作業場所は自由に選んでください。

デスクトップフォルダに移動し、新しいディレクトリを作成します。
ディレクトリ名は`React-apps`とします。
作成したディレクトリに移動し、その中が空であることを確認します。

Reactアプリケーションを作成するにはどうすればいいでしょうか？
幸いにも、Nodeがインストールされていれば非常に簡単です。
次のコマンドを入力します：

```bash
npx create-react-app my-app
```

ここで、`npx`は正しいコマンドです。
これはスペースを空けて入力し、その後に`create-react-app`と、最後にアプリケーションの名前を指定します。
今回は`my-app`とします。

リターンキーを押すと、過去に`create-react-app`のバージョンがインストールされている場合、メッセージが表示されることがあります。
React 18を使用しているため、古いバージョンでは使用できない旨の通知が来るかもしれません。
その際は、以下のコマンドでアンインストールしてください：

```bash
npm uninstall -g create-react-app
```

アンインストールが完了したら、再度以下のコマンドを入力します：

```bash
npx create-react-app my-app
```

この時、`create-react-app`のインストールを確認されることがありますが、Enterを押せばインストールが始まります。

初めてこのコマンドを実行する場合、インストールには数分かかることがありますが、次回以降はかなり速くなります。
インストールが完了するまで待つと、使い方の指示が表示されます。

インストールが完了すると、作成されたディレクトリ（今回は`my-app`という名前で指定したもの）の中で使用できるコマンドが表示されます。
たとえば、`npm start`を実行すると開発サーバーが起動します。
これをすぐに試してみましょう。
それ以外のコマンドについては後で説明します。

では、Visual Studio Codeを開きます。
VS Codeを起動し、新しいウィンドウを作成します。
ファイルブラウザをクリックし、「Open Folder」を選択してデスクトップ上のReactアプリケーションフォルダを見つけます。
先ほど作成した`my-app`フォルダをダブルクリックして開きます。

フォルダの中身を見ていきましょう。
`node_modules`フォルダがありますが、これは編集対象ではないためグレーアウトされています。
これはNodeによってインストールされたパッケージで、Reactが使用します。
中には多くのファイルが含まれていますが、今は無視して構いません。
Nodeがすべて処理してくれます。

次に`public`フォルダがあります。
これを開いてみましょう。
その中には`favicon`が含まれています。
WebアプリケーションやWebページを扱ったことがあるなら、このアイコンが何か知っているでしょう。

それは、Firefoxや他のウェブブラウザのタブに表示される小さなバッジです。
そして、`index.html`も含まれています。

その`index.html`を見てみましょう。
標準的なHTML5の形式で、言語タイプが宣言されています。
`head`セクションには標準的な要素が並んでおり、多くのコメントも含まれています。
その中には、通常のHTMLと異なる点に注目させるコメントもあります。

例えば、5行目の`favicon`へのリンクでは、`href`属性が`%PUBLIC_URL%`となっています。
下の`Apple Touch icon`や`manifest`でも同様の構造になっており、コメントでもそのことが説明されています。

コメントには、「`%`記号で囲まれた`PUBLIC_URL`は、ビルドフェーズ中に`public`フォルダのURLに置き換えられます」とあります。
これは開発フェーズではなく、アプリケーションが完成して本番環境に移す際のビルドフェーズで重要になります。

わかりやすくするために、これらのコメントを削除してHTML本体だけを見てみましょう。
コメントを削除すると、実際のHTMLはあまり多くはありません。
`head`タグの内容を除くと、`<noscript>`タグがあり、「このアプリケーションを使用するにはJavaScriptが必要です」と表示されています。

そして、空の`<div>`要素が1つあり、`id`は`root`です。
この`<div>`は何も含んでいません。

次に、統合ターミナルを開きましょう。

![[Pasted image 20241109223259.png]]

Visual Studio Codeの一部である統合ターミナルを開くと、現在のフォルダ（`my-app`）内のコマンドプロンプトが表示されます。
ここで、`npx create-react-app`によって指示された`npm start`コマンドを実行し、アプリケーションを起動します。
このコマンドにより、Webブラウザが開き、実行中のアプリケーションが表示されます。

表示されたページには、回転するロゴと、「やるべきこと」の簡単な説明、Reactを学ぶためのリンクが見えます。
次に、このページのソースコードを確認してみます。
標準的な「ソースの表示」コマンドを使用してソースを見ると、内容は非常にシンプルであることがわかります。
`<body>`タグには`<noscript>`タグと、空の`id="root"`を持つ`<div>`タグしかありません。
回転するロゴやテキストなどは存在していません。

この状態を閉じて、ソースの代わりにページを「検証」してみましょう。
ページ上で右クリックし、「検証」を選択します。
すると、画面上で実際に見えている内容が表示されます。
`<div id="root">`はもう空ではなく、内部に`class="App"`を持つ`<div>`と`<header>`が含まれています。
その中に画像、段落テキスト、リンクがあります。

これらの要素はどこから来ているのでしょうか？
IDEに戻り、Visual Studio Codeで確認してみましょう。
ターミナルは非表示にしますが、アプリケーションは引き続き実行しておきます。

次に重要なフォルダへ移動します。
`public`フォルダの残りの内容は今は無視しますが、大きな驚きはありません。

`public`フォルダ内には、いくつかの画像、`manifest`ファイル、`robots.txt`ファイルがあり、これらはWebアプリケーションやWebページでは一般的です。

次に`src`フォルダを見てみましょう。
まずは`index.js`ファイルを見てみます。
通常、`index`という名前が付いているファイルがスタートポイントですので、ここから始めましょう。

このファイルは標準的なJavaScriptコードで、JavaScriptアプリケーションを扱ったことがあれば驚くことはほとんどないでしょう。
1行目から始まる`import`文で、`react`を`React`としてインポートしています。
これはReactフレームワークを構成するJavaScriptパッケージの1つで、`node_modules`から取得しています。

次に、`react-dom/client`から`reactDom`をインポートしています。
これは、Reactプロジェクトを構築・保守しやすくするために、複数のパッケージに分割された一部です。

さらに、`./index.css`をインポートしています。
これにより、`index.css`というカスケーディングスタイルシート（CSS）がプロジェクトに取り込まれます。
このCSSは、`body`のフォントを変更し、コードタイプに特定のフォーマットを適用する役割を持っています。

もしこの`import`文をコメントアウトして削除したらどうなるでしょうか？
CSSのインポートを削除しても、アプリケーションは特に問題なく動作し続けます。

エラーメッセージは出ませんが、ターミナルを開いたままにしておけば、再コンパイルされたことがわかります。
ここにそのメッセージがあります。

Webブラウザに戻ってみると、開発ツールを閉じた状態で、フォントが変わっていることがわかります。
ブラウザのデフォルトフォントに戻り、`body`の見た目も少し変わっています。

では、IDEに戻り、コメントアウトした`import`文を元に戻して保存します。
すると、再コンパイルが非常に迅速に行われます。
ブラウザに戻ると、すべてが元通りになり、見た目も良くなります。
`body`全体の境界線がなくなり、フォントも再び適用されました。
開発中、このCSSは非常に役に立つでしょう。

`index.js`ファイルに戻ると、`import`文には特に驚く点はありません。
7行目には`root`という定数があり、`ReactDOM`（2行目でインポートしたもの）から`createRoot`を使ってアプリケーションのルートを作成しています。
特定の場所、つまり`document.getElementById("root")`に基づいて作成されます。
この`root`が何かはすでにわかっているでしょう。
それは`index.html`内の`id="root"`を持つ`<div>`を指しています。
この`<div>`内にWebアプリケーション全体が存在します。

次に、`root.render`がこのファイルで重要な最後の部分です。
`reportWebVitals`については気にしなくても構いません。

実際、この`reportWebVitals`はそのうち削除する予定ですが、今はそのままにしておきます。

`root.render`の中には、開きと閉じの括弧があり、その中に`<React.StrictMode>`タグが開閉し、その間に`<App />`タグがあります。

この`App`とは何でしょうか？
インポートの行を見上げると、`import App from './App';`と記述されています。
そこで`./App`を探すと、`App.js`が見つかります。
これを開くと、Reactの最初のコンポーネントを目にすることになります。
以前の講義で述べたように、Reactではすべてがコンポーネントとして構成されています。
この`App`はその一例です。

`App.js`には2つのインポートがあります。
最初のものはSVG（スケーラブル・ベクター・グラフィック）ファイルをインポートしており、Reactアプリケーションに画像を組み込んでいます。
これは少し奇妙に思えるかもしれませんが、Reactではこのように動作します。
もう1つはCSSファイルをインポートしており、これは標準的なスタイルシートです。

注目すべきは、この関数型コンポーネントです。
React 16以前は、コンポーネントはクラスを使用して作成するのが一般的でしたが、React 16以降、関数型コンポーネントとフックを使う方法が主流になっています。
現在でもクラスを使ったコンポーネントは多くのコードで見られるため、その方法を知っておくことも重要です。

この`App`コンポーネントはフックを含んでいませんが、関数型コンポーネントです。
`App`という名前のシンプルなJavaScript関数があり、25行目で`export default App;`とエクスポートされています。
このエクスポート文によって、`index.js`で`App`としてインポートできるようになります。

`App`関数はHTMLに似たものを返しますが、厳密にはHTMLではなく、JSX（JavaScript XML）と呼ばれるものです。
HTMLに非常に似ていますが、いくつかの違いがあります。

その違いの一つは、6行目の`<div>`タグです。
`class="app"`ではなく、`className="app"`と記述されています。
これは、`class`がJavaScriptでは予約語であり、オブジェクト指向プログラミングの一部だからです。
Reactでは代わりに`className`を使用します。

もう一つの違いは、8行目の`<img>`タグです。
`src`属性には画像のフルパスを記述する代わりに、`{logo}`という単一の中括弧で囲んだ変数が使われています。

この`logo`はJavaScriptの式で、1行目の`import logo`から参照されています。
このインポートによって画像ファイルの適切なパスが取得され、アプリケーションがビルドされてレンダリングされる際に、そのパスがHTML（正確にはJSX）としてブラウザに送信されます。

ブラウザに戻ると、「Edit `src/App.js` and save to reload.」という行があります。
これを変更してみましょう。
「Edit」を「You can edit」に変更し、保存します。
なお、私はVisual Studio Codeの「AutoSave」オプションを有効にしているので、毎回保存する手間が省けます。
これを設定しておくと便利です。

ブラウザに戻ると、すぐに「You can edit `src/App.js` and save to reload.」に変更されていることが確認できます。

他にも多くのファイルがありますが、それぞれを個別に説明するのは避け、もう少し難しいが有用なアプローチを取ります。
次の講義では、これらのファイルのほとんどを削除し、`index.js`の内容をすべて消して、シンプルな「Hello, World」アプリケーションをゼロから構築します。

では、次に進みましょう。

## Hello world with React using Classes
現在、私たちのReactアプリケーションは機能していますが、`npx create-react-app`コマンドで作成したデフォルトアプリケーションとほぼ同じです。
ここまでの作業で、少しコードを変更しただけです。
では、このアプリケーションを少し変えてみましょう。

まず、IDEに戻り、開いているファイルをすべて閉じます。
アプリケーションを実行したままにしておきますが、これからいくつかエラーが発生するのをターミナルで確認できます。
ここから少し複雑にしていきます。

まず、`src`フォルダ内のいくつかのファイルを削除します。
`App.js`、`App.css`、`App.test.js`、`index.css`を削除し、`index.js`だけは残しておきます。
これらをゴミ箱に移動し、削除します。すると、コンパイルエラーが発生しますが、エラーメッセージは「モジュールが見つからない、`App.js`を解決できない」というものです。
これは、`index.js`で存在しないファイルをインポートしているからです。

そのため、インポート文のうち、`react`と`react-dom`以外の不要なインポートを削除します。さらに、コメント行や`reportWebVitals`の行も削除します。まだエラーは残りますが、それは`App`というものを参照しているためです。`App`は存在せず、インポートもしていないためです。

そこで、新しいファイルを`src`フォルダに作成し、`AppClass.js`という名前を付けます。このファイルで新しいコンポーネントを作成しますが、今回は関数型コンポーネントではなく、クラスコンポーネントを使用します。これはReact 16以前の方法です。

コンポーネントを作成するため、次のように入力します：

```javascript
import React, { Component } from 'react';
```

このインポート文は、`React`と`Component`を`react`から取り込むことを示しています。

インポートは完了しましたが、エラーが残っています。
`App`ファイルがまだないため、エラーが続いています。
これについては一旦閉じて、クラスコンポーネントの作成に集中しましょう。

初めてのReactクラスコンポーネントを作成します。
次のコードを入力します：

```javascript
export default class AppClass extends Component {
    render() {
        return (
            <div>
                Hello, World!
            </div>
        );
    }
}
```

ここで`export default`を使用し、`class`というキーワードでクラスを定義しています。
このクラスの名前は`AppClass`で、`Component`を拡張（`extends`）しています。
`Component`はReactに組み込まれているクラスです。

クラスコンポーネントでは必ず`render`関数が必要です。
この関数はJSXを返すもので、今回は単純に「Hello, World!」を返す構造にしています。
`render`関数内のJSXは`<div>`にラップして返されています。

これで基本的なクラスコンポーネントが完成です。

新しいプログラミング言語やプラットフォームを紹介する際に「Hello, World」アプリケーションを作らなかったら、何か悪いことが起こるような気がします。
おそらく教える資格が取り消されるかもしれませんね。
でも、ここではしっかり「Hello, World」アプリケーションを作成しました。

`render`メソッドの後には、必要はないかもしれませんが、私は通常セミコロンを付けるようにしています。
これで`AppClass.js`は完成しました。

ターミナルを開くと、まだエラーが発生しているかもしれません。それは、`App`が定義されていないからです。`index.js`に戻って、次のようにインポート文を追加します：

```javascript
import AppClass from './AppClass';
```

これで、`AppClass`がインポートされました。次に、`index.js`内の`<App />`を`<AppClass />`に変更します。

```javascript
root.render(
    <React.StrictMode>
        <AppClass />
    </React.StrictMode>
);
```

これを保存すると、ターミナルでコンパイルが成功したメッセージが表示されるはずです。
Webブラウザに戻ると、画面には「Hello, World」と表示されています。

特に目新しさはないかもしれませんが、ご覧のとおり、使わないコードを削除してコードを整理しました。
`index.js`を修正して、唯一のコンポーネントである`AppClass`をインポートし、`root.render`内の名前を`<AppClass />`に変更しました。

`AppClass`の定義は`./AppClass`にあり、これは`src`フォルダ内のこのファイルです。
このクラスコンポーネントは非常にシンプルで、`<h1>`タグに囲まれた「Hello, World」を返します。
これがクラスコンポーネントを作成する方法です。

次の講義では、同じことを関数型コンポーネントを使って実現します。それでは、次に進みましょう。

## Hello woeld with React using functional components
現在、単一のクラスコンポーネントがあり、「Hello, World」というテキストをウェブページのタイトルとしてレンダリングするだけのものです。
今回は同じことを行いますが、クラスコンポーネントではなく、関数型コンポーネントを使用します。

ちなみに、ブラウザで [reactjs.org](https://reactjs.org) にアクセスし、今私がクリックしているようにドキュメントリンクを開くと、この公式サイトには多数のクラスコンポーネントの例とリファレンスが載っています。
しかし、beta.reactjs.org という新しいリンク先を訪れると、これがReactの新しい姿であることがわかります。

今後、Reactの公式ドキュメントはクラスコンポーネントではなく、関数型コンポーネントとフック（hooks）を使ったものに移行していく予定です。
これは、Reactの将来が関数型コンポーネントとフックにあることを示しています。

以前のバージョンのこのコースでは、最初はほぼクラスコンポーネントに専念していました。
そして、コースの最後で全てを関数型コンポーネントに変換していました。
しかし、今録画している新しいバージョンでは、Reactの方向性に従って、関数型コンポーネントとフック（hooks）の使用に重点を置きます。

では、IDEに戻りましょう。
このファイルは開いたままにしておいて、`src`フォルダに新しいファイルを作成します。
このファイルは`Hello.js`とします。
これは関数型コンポーネントで書かれた「Hello, World」アプリケーションになります。

どうやって作るのでしょうか？
`AppClass.js`では`React`と`Component`をインポートしましたが、今回は次のようにします：

```javascript
import React, { Fragment } from 'react';
```

`Fragment`はReactで使用されるもので、知っておくべき要素です。
これらはすべて`react`からインポートされる必要があります。

では、関数型コンポーネントを定義するにはどうすれば良いでしょうか？
単にJavaScriptの関数を作成するだけです：

```javascript
function HelloWorld() {
	return (
		<hr />
		<h1>Hello, World</h1>
	);
}
```

この関数は標準的なJavaScript関数で、JSXを返すだけです。
`<h1>`タグで「Hello, World」を表示し、`<hr />`タグで水平線を表示します。

JSXと純粋なJavaScriptの違いとして、JSXではセルフクロージングタグ（`<hr />`など）を正しく閉じる必要があります。
Webページでよく使われる形式では、単に`<hr>`と書くことがあると思いますが、JSXではセルフクロージング形式でなければなりません。

これが関数型コンポーネントの基本的な作り方です。

最初の部分では単に`<hr>`と書いていたかもしれませんが、JSXではすべての開くタグに閉じるタグが必要です。
ですので、`<hr></hr>`と書くこともできますが、多くの場合、セルフクローズタグとして`<hr />`と書くのが一般的です。これも問題なく動作します。

これで水平線が返されますが、さらに`<h1>`タグで「Hello, World」を返したいと思います。
そこで`<h1>Hello, World</h1>`と書くと、エラーが表示されます。
エラーの内容は、「JSX式は1つの親要素を持たなければならない」というものです。

では、これらを1つのタグで囲むにはどうすればいいでしょうか？
先ほどインポートした`Fragment`を使用します。
`Fragment`を開くタグとして使い、その閉じるタグを最後に配置します。
これにより、複数の要素を1つの親要素でラップすることができます。

```javascript
function HelloWorld() {
	return (
		<Fragment>
			<hr />
			<h1>Hello, World</h1>
		</Fragment>
	)
}
```

これで有効なJSXになりました。
見た目を良くするためにインデントを調整します。

React 18では`Fragment`を省略するショートハンドも使用できます。
`<Fragment>`タグを削除し、代わりに空のタグ`<>`と`</>`で囲むことができます：

```javascript
function HelloWorld() {
	return (
		<>
			<hr />
			<h1>Hello, World</h1>
		</>
	)
}
```

これで、複数の要素を1つの親要素でラップするJSXが完成しました。

もちろん、未使用の`Fragment`をインポートしているので、それを元に戻しますが、これまでに紹介した2つの方法に注意を向けたかったのです。

さて、次に必要なことは何でしょうか？
`React`と`Fragment`をインポートし、関数を作成し、必要なJSXを返しています。
しかし、最後に次のような行を追加する必要があります：

```javascript
export default HelloWorld;
```

これで、このコンポーネントを他のファイルからインポートして使用することができます。
これは、関数型コンポーネントで、意図した通りに動作します。

この関数型コンポーネントは、クラスコンポーネントとは少し異なります。
`<hr />`タグを使い、全体を`Fragment`で囲んでいるのはそのためです。
次に`index.js`に戻り、次のようにインポート文を追加します：

```javascript
import HelloWorld from './HelloWorld';
```

そして、`<React.StrictMode>`の中に`<HelloWorld />`を自己閉じタグとして追加します：

```javascript
root.render(
	<React.StrictMode>
		<AppClass />
		<HelloWorld />
	</React.StrictMode>
);
```

この変更を保存したら、ターミナルを開いてコンパイルが成功するか確認します。
問題なくコンパイルされたら、ブラウザでアプリケーションを見てみましょう。
画面には「Hello, World」と2回表示されます。
1つはクラスコンポーネントによるもの、もう1つは関数型コンポーネントによるものです。

ここで「クラスコンポーネントと関数型コンポーネントを同じアプリケーションで使ってもいいのか？」という疑問が浮かぶかもしれません。答えは「全く問題ありません」。
実際、私が現在担当しているクライアントのプロジェクトでは、React 16でクラスコンポーネントを使用して書かれたアプリケーションに、新しい機能を追加する際は関数型コンポーネントとフックを使っています。
これらは問題なく共存し、アプリケーションは正常に動作しています。
最終的にはすべてのコンポーネントを関数型コンポーネントとフックに移行することが目標ですが、急ぐ必要はなく、すべて順調に進んでいます。

このようにして、`AppClass`と`HelloWorld`の2つのコンポーネントが完成しました。
次は、さらに複雑な内容に進んでいきましょう。

## Styling Components
現在、Reactアプリケーションには2つのコンポーネントがあります。
1つはクラスベースのコンポーネントで、「Hello, World」をブラウザに表示します。
もう1つは関数型コンポーネントで、同じく「Hello, World」を表示しますが、その上に水平線を追加しています。
今回は、これらのコンポーネントにスタイリングを追加する方法について説明します。

まず、IDEに戻り、`AppClass.js`を確認します。
このコンポーネントのすべての`<h1>`タグの色を赤に変更したいとします。

新しいCSSファイルを`src`フォルダ内に作成します。
慣例として、このCSSファイルの名前は適用するファイルと同じ名前にします。
したがって、`AppClass.css`という名前にします。
このファイルに次のようなCSSを記述します：

```css
h1 {
	color: red;
}
```

これで`AppClass.js`に対応するCSSファイルを作成しましたが、まだ使用していません。
`AppClass.js`に戻り、次のようにインポート文を追加します：

```javascript
import './AppClass.css';
```

これで`AppClass.js`内にCSSをインポートでき、スタイルが適用されるようになります。
これを保存すると、ブラウザに戻ったときに`AppClass`コンポーネント内の`<h1>`要素が赤色で表示されるようになります。

ブラウザを見てみると、スタイルを1つのコンポーネントに適用したつもりでも、両方のコンポーネントに影響を与えていることがわかります。
これは直感に反するようですが、ReactはCSSやJavaScriptをバンドルして1つのファイルにまとめるため、このようなことが起こります。
この場合、特定のコンポーネントにのみ影響を与えたいのであれば、`h1`タグ全体を再定義するのは避けるべきです。

では、これを修正しましょう。
`AppClass.css`に戻り、`h1`タグの代わりに次のようなクラスを作成します：

```css
.h1-red {
	color: red;
}
```

次に、`AppClass.js`に戻り、この`<h1>`タグにクラスを追加します。
ただし、`class`属性は使わず、`className`属性を使います：

```javascript
<h1 className="h1-red">Hello, World</h1>
```

これで、ブラウザに戻ったときに、スタイルが指定したコンポーネントだけに適用されるようになります。

さらに、このコンポーネントの`<h1>`タグを緑色に変更したい場合は、CSSファイルに新しいクラスを追加します：

```css
.h1-green {
	color: green;
}
```

そして、`AppClass.js`でクラスを更新します：

```javascript
<h1 className="h1-green">Hello, World</h1>
```

これで、この変更が保存され、ブラウザに表示された際に、指定されたコンポーネント内の`<h1>`タグが緑色になります。

それは難しくありません。
IDEに戻り、`src`フォルダ内に新しいCSSファイルを作成し、`HelloWorld.css`と名付けます。このファイルに次のように`h1`タグ用のクラスを宣言します：

```css
.h1-green {
    color: green;
}
```

次に、`HelloWorld.js`に移動し、このCSSファイルをインポートし、`<h1>`タグに適切なクラス名を適用します：

```javascript
import './HelloWorld.css';

function HelloWorld() {
	return (
		<>
			<h1 className="h1-green">Hello, World</h1>
			<hr />
		</>
	);
}
```

これで変更が保存され、ブラウザに戻ると、1つのコンポーネントは赤色、もう1つは緑色の`<h1>`タグが表示されていることを確認できます。

CSSの変更時には、実際のHTMLタグそのものを再定義することが必ずしも良いとは限らないことを覚えておくことが重要です。コンポーネントごとに異なるスタイルを適用したい場合は、そのコンポーネント専用のクラスを作成し、明確な命名規則を使用してどのコンポーネントにどのスタイルが関連しているかを理解しやすくしましょう。

次の講義では、プロジェクトをBootstrap（5.2や5.3などの最新バージョン）を使用するように修正します。それでは、次に進みましょう。

# Using Bootstrap CSS

# Using props:passing data to components 
今回取り組むのは、`props`（プロパティ）の使用についてです。HTMLを書いたことがあれば、実は常に`props`を使用しています。例えば、`<img src="example.jpg" alt="description" />`では、`src`や`alt`はプロパティです。同じ構文をReactアプリケーションで使用します。

現在、`index.js`には`AppClass`と`HelloWorld`の2つのコンポーネントがあります。`AppClass.js`を見てみると、このコンポーネントは単にメッセージを表示するクラスコンポーネントです。ここで、このメッセージをコンポーネント内で直接定義するのではなく、プロパティとして受け取るようにします。

次に、`AppClass.js`内の`<h1>`タグの中身を削除し、その部分をプロパティの参照に置き換えます。次のようにコードを変更します：

```javascript
import React, { Component } from 'react';
import './AppClass.css';

export default class AppClass extends Component {
	render() {
		return (
			<h1 className="h1-red">
				{this.props.message}
			</h1>
		);
	}
}
```

これで、`props`を通じて`message`というプロパティを取得し、その内容を`<h1>`タグ内に表示します。

次に、`index.js`でこの`AppClass`コンポーネントに`props`を渡します：

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppClass from './AppClass';
import HelloWorld from './HelloWorld';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<AppClass message="Hello, from props!" />
		<HelloWorld />
	</React.StrictMode>
);
```

これにより、`AppClass`コンポーネントは`props`として渡されたメッセージを受け取り、`<h1>`タグ内に表示します。
ブラウザで確認すると、`AppClass`の表示が「Hello, from props!」に変更されているはずです。

まず、`AppClass.js`の中で`<h1>`タグ内に次のようにプロパティを参照するコードを書きます：

```javascript
<h1 className="h1-red">
	{this.props.msg}
</h1>
```

これで、`this.props`オブジェクトを通じて、`msg`というプロパティを参照します。
しかし、このプロパティはまだ設定していません。
アプリケーションを再起動して（`npm start`を実行し）、ブラウザに切り替えると、何も表示されていないことが確認できます。
これは、プロパティが設定されていないためです。

次に、`index.js`に戻り、`AppClass`コンポーネントに`msg`プロパティを指定します：

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppClass from './AppClass';
import HelloWorld from './HelloWorld';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<AppClass msg="hello world" />
		<HelloWorld />
	</React.StrictMode>
);
```

これで、`msg`プロパティに「hello world」（小文字の`w`）が設定されました。
`AppClass.js`では、このプロパティを`this.props.msg`として読み込んでいます。

ブラウザに戻ると、「hello world」が小文字の`w`で表示されるはずです。
これで、プロパティを使用してコンポーネントにデータを渡す方法が理解できました。

クラスベースのコンポーネントでの`props`の使用方法を理解したところで、次に関数型コンポーネントでの使用方法を見ていきましょう。
`HelloWorld.js`ファイルでは、`props`を関数のパラメータとして渡すだけです。
これにより、非常に簡単に実装できます。

次のように関数を修正します：

```javascript
function HelloWorld(props) {
	return (
		<>
			<hr />
			<h1 className="h1-green">{props.msg}</h1>
		</>
	);
}
```

`props`を関数の引数として受け取り、その中の`msg`プロパティを`<h1>`タグ内でJavaScript式として使用しています。

次に、`index.js`に移動して、この`HelloWorld`コンポーネントに`msg`プロパティを渡します：

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppClass from './AppClass';
import HelloWorld from './HelloWorld';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<AppClass msg="hello world" />
		<HelloWorld msg="hello again" />
	</React.StrictMode>
);
```

これで、`HelloWorld`コンポーネントは`props`として`msg`を受け取り、画面に「hello again」と表示されるようになります。

ブラウザで確認すると、関数型コンポーネントの表示が期待通りに「hello again」となっていることがわかるはずです。

一つ覚えておくべき点として、クラスベースの`AppClass`コンポーネントでは`this.props.msg`を使用していますが、関数型コンポーネントでは`props.msg`というシンプルな記法でプロパティを参照できます。
これにより、関数型コンポーネントはより直感的で簡潔に書けることがわかります。

クラスベースのコンポーネントであろうと関数型コンポーネントであろうと、`props`は読み取り専用です。
つまり、このコンポーネントは`msg`プロパティの値を変更することはできません。
`AppClass`や`HelloWorld`の中では、`props.msg`は読み取り専用であり、この関数の中ではその値を変更することはできません。

これが`props`を渡す基本的な原則です。
非常にシンプルで、Reactアプリケーションを構築する際、データを下流に押し込むという考え方が重要です。
つまり、親コンポーネントから子コンポーネント、さらにその子コンポーネントへとデータを流します。

今回の例では、`msg`プロパティの値は`index.js`内で設定されています。
この値を`HelloWorld`コンポーネントが認識していますが、他のコンポーネントの`msg`には影響を与えません。
`AppClass`の`msg`と`HelloWorld`の`msg`は互いに関連性がありません。

このように、親コンポーネントから子コンポーネント、さらにはその子コンポーネントへとデータを渡すことで、データの流れが一方向に保たれます。
Reactアプリケーションでは、`props`を使って情報を渡すことが一般的であり、これがデータを安全に管理し、アプリケーション全体を理解しやすくする方法です。

`props`は、それを受け取るコンポーネントにとって読み取り専用です。
ただし、この制限を回避する方法もありますが、それについては後ほど取り上げます。
通常、コンポーネント間で変化する情報に`props`を使用することはあまりありません。

その代わりに使用されるのが`state`です。
`state`は、クラスコンポーネントと関数型コンポーネントでの扱いが異なります。
次の講義では、`state`について詳しく見ていきましょう。

## React and State 1
`state`を試してみましょう。
`state`を使用するためには、イベントや条件付きレンダリングといった他の概念も紹介します。
まず、アプリケーションを少し簡素化してみましょう。

現在、ブラウザでは2つのコンポーネントが表示されていますが、それを簡素化します。
まず、`index.js`から`AppClass`コンポーネントを削除し、実際の`render`関数からも削除します。
これにより、関連する`import`文も削除できます。

これでブラウザに戻ると、アプリケーションがシンプルになり、「hello again」と水平線だけが表示されていることがわかります。
この状態を基に、さらに追加していきます。

次に、`HelloWorld.js`に移動し、`AppClass`を使用していないので、それを閉じて、不要なファイルも閉じておきます。
これで、作業に集中できる状態になります。

`HelloWorld`関数内で`state`を設定するために、`return`を呼び出す前に次のように記述します：

```javascript
import React, { useState } from 'react';

function HelloWorld() {
	// useStateフックを使ってstateを宣言
	const [isTrue, setIsTrue] = useState(false);
	
	return (
		<>
			<h1 className="h1-green">{props.msg}</h1>
			<hr />
		</>
	);
}
```

このコードでは、`useState`フックを使って`isTrue`という`state`変数を宣言しています。
この変数の初期値は`false`です。
`useState`は、関数型コンポーネントで`state`を使用するためのフックであり、2つの要素（`state`変数とその値を更新するための関数）を返します。
このため、分割代入の構文を使用して`isTrue`と`setIsTrue`を取得しています。

この`state`は初期値として`false`を持ち、`setIsTrue`関数を使って`isTrue`の値を更新できます。
変数名に「`set`」を付けることで、`state`を更新する関数であることが直感的にわかります。

`isTrue`を使って、条件付きで表示を変更することもできます。
この例では、`isTrue`が`true`の場合は「State is True!」と表示し、`false`の場合は「Hello, World」と表示されます。

これまでのところ、`useState`を使用して`isTrue`という状態を設定しました。
次に、この`isTrue`を利用して条件付きレンダリングを行います。

`<Fragment>`の中に追加するコードは以下のようになります：

```javascript
function HelloWorld() {
	const [isTrue, setIsTrue] = useState(false);
	
	return (
		<>
			<h1 className="h1-green">{props.msg}</h1>
			<hr />
			{isTrue &&
				<>
					<p>The current value of isTrue is true</p>
				</>
			}
		</>
	);
}
```

ここでは、`{isTrue && (...)}`という構文を使用しています。
この構文はJavaScriptの論理AND演算子を使用しており、`isTrue`が`true`の場合にのみ次の要素をレンダリングします。
`isTrue`が`false`の場合、何も表示されません。

`<p>`タグ内に「The current value of isTrue is true」というメッセージを表示し、`<Fragment>`を使用して要素をラップすることで、複数の要素が1つの親要素内に存在しているようにしています。
これはJSXの要件です。

これで、`isTrue`が`true`であれば「The current value of isTrue is true」と表示され、`false`であれば何も表示されません。

`isTrue`が`false`に設定されている状態で、条件付きレンダリングが動作していることを確認しました。
もし、`isTrue`を`true`に変更すると、条件付きで表示されるメッセージがブラウザに表示されます。
これは、条件付きレンダリングの一例です。
他の方法もありますが、後ほど紹介します。

次に、条件付きレンダリングの下にさらに要素を追加し、ボタンを表示します。
`<a>`タグをボタンのようにスタイリングするために、Bootstrapのクラスを使用します。

以下のコードを`HelloWorld.js`に追加します：

```javascript
function HelloWorld() {
	const [isTrue, setIsTrue] = useState(false);
	
	return (
		<>
			<h1 className="h1-green">{props.msg}</h1>
			<hr />
			{isTrue &&
				<>
					<p>The current value of isTrue is true</p>
				</>
			}
			<a href="#!" className="btn btn-outline-secondary" onclick={toggleTrue}>
				Toggle isTrue
			</a>
		</>
	)
}
```

このコードでは、`<a>`タグに`href="#!"`を設定し、`btn`と`btn-outline-secondary`というBootstrapのクラスを使用して、リンクをボタンのように見せています。
`href`に`#!`を設定することで、リンクをクリックしてもページの移動が発生しません。

これを保存してブラウザで確認すると、スタイリングされたボタンが表示され、条件付きレンダリングの要素が表示されるかどうかは`isTrue`の値に依存します。

このコードの意図を踏まえて、もう少し詳しく説明し、`toggleTrue`関数を見直します。
意図的に詳細に書かれたこのコードは、`isTrue`の状態を反転する方法を説明しています。

以下が、修正したコードです：

```javascript
import React, { useState } from 'react';

function HelloWorld(props) {
	const [isTrue, setIsTrue] = useState(false);

	const toggleTrue = () => {
		if (isTrue) {
			setIsTrue(false);
			return
		}
		setIsTrue(true)
	}
	
	return (
		<>
			<h1 className="h1-green">{props.msg}</h1>
			<hr />
			{isTrue &&
				<>
					<p>The current value of isTrue is true</p>
				</>
			}
			<a href="#!" className="btn btn-outline-secondary" onclick={toggleTrue}>
				Toggle isTrue
			</a>
		</>
	)
}

export default HelloWorld;

```

この`toggleTrue`関数は、`isTrue`が`true`の場合に`setIsTrue(false)`を呼び出して状態を`false`にし、処理を終了します。
`isTrue`が`false`の場合は、`setIsTrue(true)`を呼び出して状態を`true`に変更します。

このコードをブラウザで確認すると、ボタンをクリックするたびに`isTrue`の状態が反転し、条件付きレンダリングによって`<p>`タグが表示されたり消えたりします。

開発者ツールで確認すると、`<p>`タグがDOMから削除されたり追加されたりすることがわかります。
これが、Reactが状態を反映してDOMを更新する仕組みです。

この説明は`state`を使った状態管理の良い例です。
Reactでは、`state`の値が変更されると、その`state`に依存しているコンポーネントや要素が即座に再レンダリングされ、DOMが更新されます。
`state`を利用してDOM要素を条件付きでレンダリングすることにより、表示を完全に削除したり追加したりできます。

コードの詳細を以下に示します：

```javascript
{isTrue &&
	<>
		<p>The current value of isTrue is true</p>
	</>
}
{
	isTrue
	? <p>isTrue is true</p>
	: <p>isTrue is false</p>
}
```

このコードには2つの条件付きレンダリング方法が含まれています：

1. `isTrue && <p>...<p>` のような短絡評価演算子を使用して、`isTrue`が`true`の場合のみ要素を表示する。
2. `isTrue ? <p>isTrue is true</p> : <p>isTrue is false</p>` という三項演算子を使って、`isTrue`が`true`なら「isTrue is true」、`false`なら「isTrue is false」を表示します。

ブラウザで確認すると、ボタンをクリックするたびに`isTrue`の状態が反転し、ページ上の表示が2つの場所で同時に変わることがわかります。
これは、`state`がアプリケーション内で一貫して管理され、すべての関連要素が同期されるためです。

この基本的な例を使って、`state`を用いたリアクティブな表示の管理やイベントハンドリングを学ぶことができました。
次は、より高度な`state`の操作や他のReactフックを組み合わせた実装を見ていきましょう。
## React and State 2
クラスコンポーネントで`state`や条件付きレンダリング、イベントを実装していきます。
クラスコンポーネントは少し冗長ですが、Reactの基本として知っておくことは重要です。

`AppClass.js`を以下のように修正して、`state`を持つクラスコンポーネントに変更します。

- **コンストラクタ**: `constructor`内で`super(props)`を呼び出し、`this.state`を初期化します。これはクラスコンポーネントでの`state`の初期設定です。
- **メソッドのバインド**: `toggleTrue`メソッドを`this`にバインドしています。これは、Reactのクラスコンポーネントでは`this`のコンテキストが正しく参照されるようにするために必要です。
- **`setState`**: 状態を更新するために`this.setState`を使用し、`isTrue`の値を反転させます。
- **レンダリング**: `state`に基づいて条件付きレンダリングを行い、`isTrue`の状態に応じて異なる内容を表示します。

ブラウザで確認すると、クラスコンポーネントでも`isTrue`の状態がトグルされ、条件付きレンダリングが動作することがわかります。
これで、関数コンポーネントとクラスコンポーネントの両方での`state`とイベントハンドリングの実装方法を理解できました。

`constructor`内で`state`を初期化し、`toggleTrue`関数をクラスコンポーネント用に実装していきます。
コード全体を確認し、適切な`this`の参照と`setState`の使用を意識して記述します。

以下が修正後の`AppClass.js`コードです：

```javascript
import React, { Component } from 'react';
import './AppClass.css';

export default class AppClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTrue: false, // 初期状態
        };

        // イベントハンドラのバインド
        this.toggleTrue = this.toggleTrue.bind(this);
    }

    // stateをトグルするメソッド
    toggleTrue() {
        if (this.state.isTrue) {
            this.setState({
                isTrue: false,
            });
            return; // ここで処理を終了
        } else {
            this.setState({
                isTrue: true,
            });
        }
    }

    render() {
        return (
            <>
                <h1 className="h1-red">{this.props.msg}</h1>
                <hr />
                {/* 条件付きレンダリング */}
                {this.state.isTrue && (
                    <>
                        <p>The current value of isTrue is true</p>
                    </>
                )}
                {/* 三項演算子を使った条件付きレンダリング */}
                {this.state.isTrue ? <p>isTrue is true</p> : <p>isTrue is false</p>}
                <hr />
                {/* ボタン */}
                <a href="#!" className="btn btn-outline-secondary" onClick={this.toggleTrue}>
                    Toggle isTrue
                </a>
            </>
        );
    }
}

```

- **コンストラクタ**: `constructor`内で`super(props)`を呼び出し、`this.state`を初期化します。
- **toggleTrueメソッド**: `this.state.isTrue`の状態をチェックし、`this.setState`を使って`isTrue`を反転させます。`this.setState`はReactクラスコンポーネントで`state`を更新するために使用されます。
- **レンダリング**: `state`を使用して条件付きレンダリングを行い、状態に応じて表示を変更します。

このコードを保存してブラウザで確認すると、`Toggle isTrue`ボタンをクリックするたびに、`state`が反転し、それに基づいて表示が更新されることが確認できます。
クラスコンポーネントの構文は関数コンポーネントよりも少し冗長ですが、Reactの基本を理解するためには役立ちます。

アプリケーションは現在、関数コンポーネントやクラスコンポーネントを使用しても正常に動作しています。
関数コンポーネントを使用する形に戻し、「Hello World Jazz」などの名前を意味のあるものに変更しました。
React フックの `useEffect` を使って、リモート API を呼び出してデータを取得する状況をシミュレーションし、取得したデータをアプリの状態に格納しました。
データはオブジェクトの配列で、一覧表示するために `map` を使用して JSX にレンダリングされます。
次回は、フォームを使って新しいデータを追加できるコンポーネントを作成します。
## React and state 4
ID とクラス名を設定し、フォームの自動補完を無効化した入力フィールドを作成しました。
入力したデータを React が取得できるようにするため、フォームの情報を保存する state を定義しました。
`firstName`、`lastName`、`DOB`（生年月日）用に 3 つの state とその更新関数を作成し、それぞれ初期値を空の文字列に設定しました。
フォームを送信するのではなく、React 内でデータをキャプチャして処理する形にしています。
コードはコンパイルされますが、警告が表示されるかもしれません。

```js
const [firstName, setFirstName] =
<input
	type="text"
	name="first-name"
	id="first-naem"
	autoComplete="first-name-new"
	className="form-control"
></iput>
```

ターミナルを見ると、コードはコンパイルされているものの、警告が表示されています。
これは、まだこれらの変数や、それらの状態変数に関連する変更関数を使用していないためです。
しかし、それは問題ありません。情報を保存する場所は確保できました。

次にフォーム要素に戻り、「ユーザーがこの入力フィールドに入力した情報をどのようにして state に格納するか」を考えてみます。
幸いにも、これはとても簡単です。
`onChange` 属性を追加するだけで、変更に関連するイベントを受け取ることができます。
`onChange` に線が引かれているのは、まだ使用されていないためですが、すぐに使います。

このイベントを使って矢印関数を記述し、`setFirstName` を呼び出して、`event.target.value` を渡します。
これで state の `firstName` 変数が更新されます。

この動作を確認するために、フォームの外側に小さな `div` を作成し、「first name」と表示させ、`firstName` 変数の現在の値を表示します。
同様に、`lastName` と `date of birth` にも対応する表示を追加します。
それぞれの `div` を複製して名前を変更し、変数名もそれぞれに変更します。

これがラストネーム、そしてこれが DOB（生年月日）です。
ではフォームを見てみましょう。
ブラウザに戻ると、すべての情報を入力する場所が表示されています。
初期状態では `firstName` という状態変数が空であることが確認できます。
これは初期化時に設定した値です。
しかし、`firstName` フィールドに入力を始めると、その内容が更新されていく様子が確認できます。
完璧です。

これでフォームから情報を取得し、利用できる手段を得ました。とても簡単です。
ここまでで、1 つのテキスト入力と `App.js` コンポーネントの一部としてフォーム要素を設定しましたが、これは問題ありません。
ですが、このような状況では、テキスト入力フィールド全体に再利用可能なコンポーネントを構築し、それを 3 回使ってそれぞれに異なるプロパティを渡すことができるようにすると便利かもしれません。

例えば、ラストネーム用には `name="lastName"` をプロパティとして渡し、生年月日用には `type="date"` を渡して HTML5 の組み込み日付ピッカーを使用することができます。
次の講義ではまさにその実装に取りかかる予定です。

## React and state 5
アプリケーションは現在、1つの入力フィールドを含むフォームで構成されていますが、このフォーム用の再利用可能なコンポーネントを作成します。
`src` フォルダに新しい「Input」ファイルを作り、`props` を引数とする矢印関数で構成します。
この関数は、フォームのJSXを返し、`div` と`label` 要素を含むシンプルな構造です。

`props` を使用して、ラベルや入力フィールドのプロパティを動的に設定する再利用可能なコンポーネントを作成します。
`label` には `props.title` を使用し、`input` タグには `props.type` や `props.className` を用いることで、様々なタイプやスタイルを設定できるようにしています。
ID も必須のプロパティです。

```js
const Input = (props) => {
	return(
		<div classNAme="mb-3">
			<label htmlFor={props.name} classNAme="form-label">{{props.title}}</label>
			<input
				type={props.type}
				className={props.className}
				id={props.name}
				autoComplete={props.autoComplete}
			/>
		</div>
	)
}
export default Input;
```

Input.js に onChange 属性を追加し、props 経由でイベントを受け取って状態を更新できるようにしました。
Apks.js で onChange イベントを設定し、入力された値を対応する状態変数に保存します。
これにより、last name や date of birth の入力が正しく状態に反映されるようになり、フォーム入力を再利用可能なコンポーネントとして効率的に構築できました。
次はボタンを追加して、フォームの入力データをアプリで処理するロジックを実装します。

Apks のフォームの最後に戻ってきました。
これまでの講義で作成してきたフォームに、次に追加するのはボタンです。
これは非常に簡単です。この入力欄の後に input type="submit" を追加します。
フォームを送信するわけではありませんが、ボタンが必要なので submit タイプを使用します。値は value="submit" とし、クラス名 className="btn btn-primary" を設定します（Bootstrap から）。これでボタンが完成です。

ただし、submit ボタンがそのままフォームを送信しないようにしたいので、別の動作を設定します。フォームタグの最初に戻り、onSubmit イベントリスナーを追加し、新しい handleSubmit 関数を呼び出すようにします。この関数はまだ存在していないので、これを作成する必要があります。

次に、return 文の前で const handleSubmit を定義します。この関数はイベントを受け取り、矢印関数を使用します。関数の最初でフォームの実際の送信を防ぐため、event.preventDefault() を呼び出します。これをしないと、フォームはサーバーに送信されるか、ページが完全にリロードされてしまいます。

# Setting up User Login
## Working on the Login button
`App.js`でログイン状態を管理するために、`JWT`トークンを`state`として扱います。これにより、ユーザーのログイン状態に応じてUIの表示を変更できます。`JWT`はこの後の講義で詳しく説明しますが、基本的には認証情報を含んだ暗号化されたトークンです。

まず、`App.js`に`JWT`トークン用の`state`を追加します：


```javascript
import React, { useState } from 'react';

function App() {
    // JWTトークンを保持するstate変数を作成
    const [jwtToken, setJwtToken] = useState('');

    return (
        <div>
            {/* トークンが存在するかどうかで表示を切り替える */}
            {jwtToken ? (
                <>
                    <button onClick={() => setJwtToken('')}>Log Out</button>
                    <nav>
                        <ul>
                            <li>Manage Catalog</li>
                            <li>Add Movie</li>
                            <li>GraphQL</li>
                        </ul>
                    </nav>
                </>
            ) : (
                <button onClick={() => setJwtToken('sample-jwt-token')}>Log In</button>
            )}
            <h1>Go watch a movie</h1>
        </div>
    );
}

export default App;

```
### 説明

- **`jwtToken`の初期値**: `useState`を使用して、`jwtToken`の初期値を空の文字列に設定しています。これは、デフォルトでログインしていない状態を示します。
- **条件付きレンダリング**: `jwtToken`が存在する場合に「Log Out」ボタンと管理ナビゲーションを表示し、存在しない場合に「Log In」ボタンを表示します。
- **`onClick`ハンドラ**: 「Log In」ボタンをクリックすると仮の`jwtToken`を設定し、「Log Out」ボタンをクリックすると`jwtToken`を空にしてログアウトします。

これで、ユーザーのログイン状態に応じてメニュー項目やボタンを切り替えることができます。次のステップでは、実際の認証処理や`JWT`トークンの取り扱いを詳しく見ていきます。

この変更により、`jwtToken`の値に基づいてログインリンクの表示が変わるようになりました。具体的には、`jwtToken`が空の文字列の場合は「Log In」が表示され、空でない場合は「Log Out」が表示されます。以下に、`App.js`の修正版を示します：

```javascript
import React, { useState } from 'react';

function App() {
    // JWTトークンを保持するstate変数を作成
    const [jwtToken, setJwtToken] = useState(''); // 初期値は空の文字列

    return (
        <div>
            {/* JWTトークンの状態による条件付きレンダリング */}
            {jwtToken === '' ? (
                <a href="#!" onClick={() => setJwtToken('sample-jwt-token')}>
                    Log In
                </a>
            ) : (
                <a href="#!" onClick={() => setJwtToken('')} className="badge bg-danger">
                    Log Out
                </a>
            )}
            <h1>Go watch a movie</h1>
        </div>
    );
}

export default App;

```

### 説明

- **条件付きレンダリング**: `jwtToken`が空の場合、「Log In」リンクが表示され、クリックするとトークンが仮の値に設定されます。`jwtToken`が空でない場合、「Log Out」リンクが表示され、クリックするとトークンが空に設定されます。
- **スタイリング**: `Log Out`リンクはBootstrapの`badge`クラスと`bg-danger`クラスを使ってスタイリングされます。

これで、ブラウザで確認すると、初期状態では「Log In」が表示され、クリックすると「Log Out」に切り替わることが確認できるはずです。`Log Out`をクリックすると再び「Log In」に戻ります。

## Creating the login form
`input.js`ファイルを完成させるために、以下のようにコードを記述します。このコンポーネントは、フォームの入力フィールドとして使用され、プロパティを受け取って表示を動的に制御できます。
### 完成形の `input.js` コード

```javascript
import React, { forwardRef } from 'react';

// 入力コンポーネントを作成
const Input = forwardRef((props, ref) => {
    return (
        <div className="mb-3">
            {/* ラベル */}
            <label htmlFor={props.name} className="form-label">
                {props.title}
            </label>
            {/* 入力フィールド */}
            <input
                type={props.type || 'text'} // プロパティで指定されたタイプ、なければ'text'
                className="form-control"
                id={props.name}
                name={props.name}
                placeholder={props.placeholder}
                ref={ref}
                onChange={props.onChange}
                value={props.value}
            />
        </div>
    );
});

export default Input;

```

### 説明

- **`forwardRef`**: このコンポーネントは`ref`を受け取って転送できるように`forwardRef`を使用しています。これにより、親コンポーネントから`ref`を設定して、DOM要素を直接操作できるようになります。
- **`props`**:
    - `type`: 入力フィールドのタイプ（デフォルトは`text`）。
    - `name`: 入力フィールドの`id`および`name`属性として使用。
    - `title`: ラベルの表示テキスト。
    - `placeholder`: 入力フィールドのプレースホルダー。
    - `onChange`: 入力が変更された際のイベントハンドラ。
    - `value`: 入力フィールドの値。
- **`className`**: Bootstrapのクラス`mb-3`を使用して、入力フィールドの下に適度な余白を設定。

この入力コンポーネントをログインフォームで再利用することで、より簡潔でモジュール化されたフォームを作成できます。

次のステップでは、`Login`コンポーネントを作成し、`input.js`を利用してログインフォームを構築していきます。

これで、フォーム入力コンポーネントがエラーメッセージ表示機能を持つようになります。完成形の`input.js`は次のようになります：

### 修正版 `input.js`

```javascript
import React, { forwardRef } from 'react';

// 入力コンポーネントを作成
const Input = forwardRef((props, ref) => {
    return (
        <div className="mb-3">
            {/* ラベル */}
            <label htmlFor={props.name} className="form-label">
                {props.title}
            </label>
            {/* 入力フィールド */}
            <input
                type={props.type || 'text'}
                className={props.className || 'form-control'} // クラス名のデフォルト値
                id={props.name}
                name={props.name}
                placeholder={props.placeholder}
                ref={ref}
                onChange={props.onChange}
                autoComplete={props.autoComplete}
                value={props.value}
            />
            {/* エラーメッセージ表示 */}
            <div className={props.errorDiv}>
                {props.errorMsg}
            </div>
        </div>
    );
});

export default Input;

```

### 説明

- **エラーメッセージ**: 入力フィールドの下に、`props.errorDiv`クラスを持つ`<div>`を追加し、`props.errorMsg`でエラーメッセージを表示できるようにしました。
- **属性の使用**:
    - `type`, `className`, `id`, `name`, `placeholder`, `ref`, `onChange`, `autoComplete`, `value`はすべて`props`から受け取ることができます。
    - `errorDiv`と`errorMsg`はエラーメッセージのスタイリングと内容の設定に使用します。

この入力コンポーネントは、ログインフォームなど複数のフォームで再利用可能で、汎用性の高い設計になっています。次のステップでは、`Login`コンポーネントを作成し、この`Input`コンポーネントを使用して実際のログインフォームを構築します。

このようにして、フォームを中央に配置し、`email`と`password`を入力するための状態変数を設定しました。これからログインフォームを実装し、バリデーションやサブミット処理を行います。以下にログインフォームの構築を示します。

### `Login.js` の実装

javascript

コードをコピーする

`import React, { useState } from 'react'; import Input from './form/Input';  function Login() {     // Emailとパスワードのstateを設定     const [email, setEmail] = useState('');     const [password, setPassword] = useState('');      // フォーム送信ハンドラを作成     const handleSubmit = (event) => {         event.preventDefault(); // フォームのデフォルトの送信を防止         // 認証処理やバリデーションは後ほど追加         console.log('Form submitted:', { email, password });     };      return (         <div className="col-md-6 offset-md-3">             <h2>Login</h2>             <form onSubmit={handleSubmit}>                 {/* Emailフィールド */}                 <Input                     name="email"                     title="Email"                     type="email"                     placeholder="Enter your email"                     value={email}                     onChange={(e) => setEmail(e.target.value)}                 />                 {/* パスワードフィールド */}                 <Input                     name="password"                     title="Password"                     type="password"                     placeholder="Enter your password"                     value={password}                     onChange={(e) => setPassword(e.target.value)}                 />                 {/* サブミットボタン */}                 <button type="submit" className="btn btn-primary">                     Log In                 </button>             </form>         </div>     ); }  export default Login;`

### 説明

- **`useState` の利用**: `email`と`password`の入力値を管理するために`useState`を使用しています。
- **`handleSubmit`関数**: フォームが送信されると呼び出され、`event.preventDefault()`でページの再読み込みを防止します。
- **`<Input>`コンポーネントの使用**: 再利用可能な`Input`コンポーネントを使用して、`email`と`password`フィールドを作成しています。
- **`value`と`onChange`**: `value`に状態変数を設定し、`onChange`で入力が変更された際に状態を更新します。

### 次のステップ

このフォームのバリデーションを追加し、入力が不正であればエラーメッセージを表示するようにします。また、認証のロジックを作成し、フォームが正常に送信されると`JWT`トークンを設定する機能を実装していきます。

これで、ログインフォームのUIを完成させ、フォームの送信処理の準備が整いました。以下は修正版の`Login.js`全体です。

### 修正版 `Login.js`

```javascript
import React, { useState } from 'react';
import Input from './form/Input';

function Login() {
    // Emailとパスワードのstateを設定
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // フォーム送信ハンドラ
    const handleSubmit = (event) => {
        event.preventDefault(); // デフォルトのフォーム送信を防止
        console.log('Form submitted:', { email, password });
        // ここで認証ロジックを追加する予定
    };

    return (
        <div className="col-md-6 offset-md-3">
            <h2>Login</h2>
            <hr />
            <form onSubmit={handleSubmit}>
                {/* Email入力フィールド */}
                <Input
                    title="Email Address"
                    type="email"
                    className="form-control"
                    name="email"
                    autoComplete="email-new"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                {/* パスワード入力フィールド */}
                <Input
                    title="Password"
                    type="password"
                    className="form-control"
                    name="password"
                    autoComplete="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <hr />
                {/* ログインボタン */}
                <input
                    type="submit"
                    className="btn btn-primary"
                    value="Log In"
                />
            </form>
        </div>
    );
}

export default Login;

```

### 説明

- **`<Input>`コンポーネントの使用**: 再利用可能な`Input`コンポーネントを使って、`email`と`password`の入力フィールドを作成しています。
- **`handleSubmit`関数**: フォームが送信されると呼び出され、`event.preventDefault()`でページの再読み込みを防止します。現在は、コンソールに入力されたデータを出力するようにしており、後で認証ロジックを追加します。
- **`<input type="submit">`**: フォーム送信ボタンを作成し、Bootstrapの`btn`クラスでスタイリングしています。

### 実行結果

このコードをブラウザで確認すると、中央揃えされたログインフォームが表示され、`Email`と`Password`の入力フィールド、ログインボタンが揃っています。フォームを送信すると、`handleSubmit`関数が呼び出され、現在は入力された`email`と`password`がコンソールに表示されるはずです。

次のステップでは、`handleSubmit`関数内で認証ロジックを追加し、成功した場合に`JWT`トークンを設定する機能を実装します。

これで、ログインフォームのUIが整い、基本的な動作を確認できました。次のステップとして、`App.js`にある`JWT`トークンの状態を`Login`コンポーネントで管理できるようにする必要があります。これを実現するために、`Outlet Context`を使用して親コンポーネントと子コンポーネント間で状態を共有します。

### 次の手順

- **`Outlet Context`の使用**: React Router v6の`Outlet`コンポーネントを使用して、親コンポーネントから子コンポーネントにデータを渡します。これにより、`App.js`で管理している`JWT`トークンの状態を`Login`コンポーネントで更新できるようになります。
- **`Login`コンポーネントの`setJwtToken`関数の受け渡し**: `App.js`から`Login`コンポーネントに`setJwtToken`関数を渡して、認証成功時にトークンを設定できるようにします。

次の講義で、`Outlet Context`を用いた状態管理と、ログイン時に`JWT`トークンをセットする方法を実装していきます。これにより、`Login`コンポーネントから`App.js`の`setJwtToken`を呼び出し、トークンを設定してログイン状態を管理できるようになります。

これで、`App.js`の`setJwtToken`関数を`Login.js`でアクセスできるようになりました。React Routerの`Outlet`を使用し、コンテキストを介して親コンポーネントから子コンポーネントに情報を伝える方法を実装しました。以下に、具体的なコードの詳細を説明します。

### `App.js`の修正

`Outlet`に`context`を渡すようにしました：

```javascript
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

function App() {
    const [jwtToken, setJwtToken] = useState('');

    return (
        <div>
            {/* ここでログイン状態による表示を行う */}
            {jwtToken === '' ? (
                <a href="#!" onClick={() => setJwtToken('sample-jwt-token')}>
                    Log In
                </a>
            ) : (
                <a href="#!" onClick={() => setJwtToken('')} className="badge bg-danger">
                    Log Out
                </a>
            )}
            <h1>Go watch a movie</h1>
            {/* Outletでコンテキストを渡す */}
            <Outlet context={{ jwtToken, setJwtToken }} />
        </div>
    );
}

export default App;

```

### `Login.js`の修正

`useOutletContext`を使って`setJwtToken`を取得し、ログイン後にトークンを設定できるようにしました：

```javascript
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Input from './form/Input';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setJwtToken } = useOutletContext(); // Outletからコンテキストを取得

    const handleSubmit = (event) => {
        event.preventDefault();
        // シンプルな認証処理のフェイク
        if (email === 'admin@example.com') {
            setJwtToken('ABC'); // トークンを設定
            console.log('Logged in');
        } else {
            console.log('Invalid credentials');
        }
    };

    return (
        <div className="col-md-6 offset-md-3">
            <h2>Login</h2>
            <hr />
            <form onSubmit={handleSubmit}>
                <Input
                    title="Email Address"
                    type="email"
                    className="form-control"
                    name="email"
                    autoComplete="email-new"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <Input
                    title="Password"
                    type="password"
                    className="form-control"
                    name="password"
                    autoComplete="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <hr />
                <input
                    type="submit"
                    className="btn btn-primary"
                    value="Log In"
                />
            </form>
        </div>
    );
}

export default Login;

```
### 説明

- **`useOutletContext`**: React Routerの`useOutletContext`フックを使用して、`Outlet`から渡されたコンテキストを取得しています。これにより、`setJwtToken`関数にアクセスできます。
- **`setJwtToken`の使用**: フォーム送信時に、メールアドレスが`admin@example.com`の場合に`setJwtToken('ABC')`を呼び出して、トークンを設定しています。

### 次のステップ

この実装を基に、次はより実際的な認証ロジックや、`JWT`トークンをバックエンドから取得して設定するプロセスを作成していきます。また、`Login`コンポーネントが`App.js`の状態を適切に更新するための完全なフローを確立します。

これで、ログインの実装が正しく動作していることを確認できました。ログイン成功時に`JWT`トークンが設定され、UIの状態が適切に変更されることも確認できました。次の改善点として、以下を実装します。

### 次に取り組む内容

1. **エラーメッセージの表示**:
    
    - 入力が正しくない場合に、ユーザーにエラーメッセージを表示します。これにより、ユーザーが間違った情報を入力したことが明確になります。
2. **ログイン成功時のリダイレクト**:
    
    - 正しい認証情報が入力されたときに、ログイン画面から別のページへリダイレクトするようにします。

### 概要

- **エラーメッセージ**:
    
    - ログイン失敗時にエラーメッセージを表示するために、`Login.js`に状態変数`errorMessage`を追加します。
    - `handleSubmit`関数内で認証情報が不正である場合にこのメッセージを設定し、入力フィールドの下に表示します。
- **リダイレクト**:
    
    - `useNavigate`フックを使って、ログイン成功時に別のページ（例えば、ホームページやダッシュボード）へリダイレクトします。

### 次回のコード実装案

次の講義では、`Login.js`に`useNavigate`を追加し、認証失敗時にはエラーメッセージを設定し、成功時にはリダイレクトを行うコードを示します。

これで、次の2つの改善点について説明ができました。

1. **エラーメッセージの表示**:
    
    - 誤ったログイン情報を入力したときに、「無効な資格情報」といったエラーメッセージを表示します。これを実現するために、Bootstrapの`alert`クラスを使用してUIにメッセージを表示します。
    - 再利用性を高めるために、別途`Alert`コンポーネントを作成し、`Login`コンポーネントで使用します。
2. **ログイン成功時のリダイレクト**:
    
    - ログインが成功した場合に、`useNavigate`フックを使用してユーザーを別のページ（例えば、ホームページ）へリダイレクトします。

### `Alert.js`コンポーネントの実装

まず、再利用可能な`Alert`コンポーネントを作成します。

```javascript
import React from 'react';

function Alert({ message, type = 'danger' }) {
    return (
        <div className={`alert alert-${type}`} role="alert">
            {message}
        </div>
    );
}

export default Alert;

```

### `Login.js`の改善

次に、`Login.js`に`Alert`コンポーネントを追加し、`useNavigate`を使用してリダイレクトを行います。

```javascript
import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Input from './form/Input';
import Alert from './Alert';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // エラーメッセージのstate
    const { setJwtToken } = useOutletContext(); // Outletからコンテキストを取得
    const navigate = useNavigate(); // リダイレクト用フック

    const handleSubmit = (event) => {
        event.preventDefault();
        // シンプルな認証処理のフェイク
        if (email === 'admin@example.com') {
            setJwtToken('ABC'); // トークンを設定
            console.log('Logged in');
            navigate('/'); // ホームページへリダイレクト
        } else {
            setErrorMessage('Invalid credentials'); // エラーメッセージを設定
        }
    };

    return (
        <div className="col-md-6 offset-md-3">
            <h2>Login</h2>
            {errorMessage && <Alert message={errorMessage} />} {/* エラーメッセージの表示 */}
            <hr />
            <form onSubmit={handleSubmit}>
                <Input
                    title="Email Address"
                    type="email"
                    className="form-control"
                    name="email"
                    autoComplete="email-new"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <Input
                    title="Password"
                    type="password"
                    className="form-control"
                    name="password"
                    autoComplete="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <hr />
                <input
                    type="submit"
                    className="btn btn-primary"
                    value="Log In"
                />
            </form>
        </div>
    );
}

export default Login;

```

### 説明

- **`Alert`コンポーネント**: Bootstrapの`alert`クラスを使用してエラーメッセージをスタイリッシュに表示します。
- **エラーメッセージの状態管理**: `errorMessage`の状態を管理し、誤った資格情報の場合にエラーメッセージを設定します。
- **リダイレクト**: `useNavigate`を使用して、ログイン成功時に`/`（ホームページ）へリダイレクトします。

このようにして、`Login`コンポーネントにエラーメッセージ表示とログイン成功時のリダイレクト機能を追加できます。これにより、ユーザー体験が向上し、使いやすいログインフォームが完成します。

この`Alert`コンポーネントを使用するために、`App.js`に状態管理を追加し、アラートメッセージを表示できるように設定します。以下は`App.js`の修正版と説明です。

### `App.js`の修正版

```javascript
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Alert from './components/Alert';

function App() {
    const [jwtToken, setJwtToken] = useState('');
    const [alertMessage, setAlertMessage] = useState(''); // アラートメッセージの状態を追加
    const [alertClassName, setAlertClassName] = useState('danger'); // アラートクラス名の状態を追加

    return (
        <div>
            {/* アラートメッセージの表示 */}
            {alertMessage && <Alert message={alertMessage} className={alertClassName} />}
            {/* ログイン/ログアウトボタンの条件付きレンダリング */}
            {jwtToken === '' ? (
                <a href="#!" onClick={() => setJwtToken('sample-jwt-token')}>
                    Log In
                </a>
            ) : (
                <a href="#!" onClick={() => setJwtToken('')} className="badge bg-danger">
                    Log Out
                </a>
            )}
            <h1>Go watch a movie</h1>
            {/* コンテキストを渡す */}
            <Outlet context={{ jwtToken, setJwtToken, setAlertMessage, setAlertClassName }} />
        </div>
    );
}

export default App;

```

### `Login.js`の修正版

次に、`Login.js`で`setAlertMessage`と`setAlertClassName`を使用してエラーメッセージを表示できるようにします。

```javascript
import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Input from './form/Input';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setJwtToken, setAlertMessage, setAlertClassName } = useOutletContext(); // コンテキストから関数を取得
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        // シンプルな認証処理のフェイク
        if (email === 'admin@example.com') {
            setJwtToken('ABC'); // トークンを設定
            setAlertMessage('Login successful');
            setAlertClassName('success'); // 成功時のクラス
            console.log('Logged in');
            navigate('/'); // ホームページへリダイレクト
        } else {
            setAlertMessage('Invalid credentials'); // エラーメッセージを設定
            setAlertClassName('danger'); // エラー時のクラス
        }
    };

    return (
        <div className="col-md-6 offset-md-3">
            <h2>Login</h2>
            <hr />
            <form onSubmit={handleSubmit}>
                <Input
                    title="Email Address"
                    type="email"
                    className="form-control"
                    name="email"
                    autoComplete="email-new"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <Input
                    title="Password"
                    type="password"
                    className="form-control"
                    name="password"
                    autoComplete="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <hr />
                <input
                    type="submit"
                    className="btn btn-primary"
                    value="Log In"
                />
            </form>
        </div>
    );
}

export default Login;

```

### 説明

- **`alertMessage`と`alertClassName`の状態**: `App.js`に`alertMessage`と`alertClassName`の状態を追加して、アラートの内容とスタイルを制御します。
- **`Alert`コンポーネントの使用**: `alertMessage`が設定されている場合にのみ`Alert`を表示します。
- **ログイン成功/失敗時の処理**: `Login.js`で`setAlertMessage`と`setAlertClassName`を呼び出して、認証結果に応じたメッセージを表示します。

これにより、ユーザーが正しくないログイン情報を入力した場合はエラーメッセージが表示され、正しい情報を入力した場合は成功メッセージと共にリダイレクトされるようになります。

これでログイン処理のエラーメッセージ表示と、ログイン成功時のリダイレクトが実装できました。エラーメッセージが表示され、ログイン成功時には`/`（ホームページ）にリダイレクトされることが確認できました。次回は、ログアウトボタンがユーザーをログアウトできるようにして、完全な認証フローを実現します。

### まとめ

- **エラーメッセージの表示**: 誤った資格情報を入力すると、`Invalid credentials`メッセージが表示されます。
- **成功時のリダイレクト**: 正しい情報を入力すると、`useNavigate`を使用してホームページにリダイレクトされます。
- **次のステップ**: ログアウトボタンの機能を実装し、ユーザーがクリックしたときにログアウトし、適切なUIに戻るようにします。

### `App.js` と `Login.js` の改善コード

上記のコードは以下のようにまとめられます：

#### `App.js`

```javascript
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Alert from './components/Alert';

function App() {
    const [jwtToken, setJwtToken] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertClassName, setAlertClassName] = useState('d-none');

    return (
        <div>
            {alertMessage && <Alert message={alertMessage} className={alertClassName} />}
            {jwtToken === '' ? (
                <a href="#!" onClick={() => setJwtToken('sample-jwt-token')}>
                    Log In
                </a>
            ) : (
                <a href="#!" onClick={() => setJwtToken('')} className="badge bg-danger">
                    Log Out
                </a>
            )}
            <h1>Go watch a movie</h1>
            <Outlet context={{ jwtToken, setJwtToken, setAlertMessage, setAlertClassName }} />
        </div>
    );
}

export default App;

```

#### `Login.js`

```javascript
import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Input from './form/Input';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setJwtToken, setAlertMessage, setAlertClassName } = useOutletContext();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (email === 'admin@example.com') {
            setJwtToken('ABC');
            setAlertMessage('');
            setAlertClassName('d-none');
            navigate('/'); // リダイレクト
        } else {
            setAlertMessage('Invalid credentials');
            setAlertClassName('alert-danger');
        }
    };

    return (
        <div className="col-md-6 offset-md-3">
            <h2>Login</h2>
            <hr />
            <form onSubmit={handleSubmit}>
                <Input
                    title="Email Address"
                    type="email"
                    className="form-control"
                    name="email"
                    autoComplete="email-new"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <Input
                    title="Password"
                    type="password"
                    className="form-control"
                    name="password"
                    autoComplete="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <hr />
                <input
                    type="submit"
                    className="btn btn-primary"
                    value="Log In"
                />
            </form>
        </div>
    );
}

export default Login;

```

このコードを使って、ログインの完全なエラーハンドリングとリダイレクトを備えたログイン機能が構築されました。次のステップでは、ログアウトボタンの機能を追加し、アプリケーション全体の状態管理をより洗練させていきます。

## Logout

これで、ログアウト機能を実装するためのコードが整いました。ログアウト時に`JWT`トークンを空にし、ユーザーをログイン画面へリダイレクトするようにします。

### `App.js`の修正版

```javascript
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Alert from './components/Alert';

function App() {
    const [jwtToken, setJwtToken] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertClassName, setAlertClassName] = useState('d-none');
    const navigate = useNavigate(); // useNavigate フックを使用

    // ログアウト関数の実装
    const logOut = () => {
        setJwtToken(''); // トークンを空にしてユーザーをログアウト
        setAlertMessage('Logged out successfully'); // ログアウト成功メッセージ
        setAlertClassName('alert-success'); // メッセージのスタイル
        navigate('/login'); // ログイン画面にリダイレクト
    };

    return (
        <div>
            {alertMessage && <Alert message={alertMessage} className={alertClassName} />}
            {jwtToken === '' ? (
                <a href="#!" onClick={() => setJwtToken('sample-jwt-token')}>
                    Log In
                </a>
            ) : (
                <a href="#!" onClick={logOut} className="badge bg-danger">
                    Log Out
                </a>
            )}
            <h1>Go watch a movie</h1>
            <Outlet context={{ jwtToken, setJwtToken, setAlertMessage, setAlertClassName }} />
        </div>
    );
}

export default App;

```

### 説明

- **`logOut`関数**:
    - `setJwtToken('')`で`JWT`トークンを空にして、ユーザーをログアウト状態にします。
    - `setAlertMessage('Logged out successfully')`でログアウト成功メッセージを設定し、`setAlertClassName('alert-success')`でメッセージのスタイルを指定します。
    - `navigate('/login')`でユーザーをログイン画面にリダイレクトします。

これにより、ログアウトボタンをクリックするとユーザーはログアウトされ、適切なメッセージと共にログイン画面に戻るようになります。次のステップでは、実際の`JWT`トークン管理やリフレッシュトークン処理の実装を進めていきます。

次に、プロジェクトの基本構成を整え、必要なディレクトリと初期ファイルを作成していきます。

### ステップ1: 必要なディレクトリの作成

APIのコードを整理するために、以下のようなディレクトリ構造を推奨します。

- **`cmd`**: メインのアプリケーションエントリーポイント。
- **`internal`**: アプリケーションのロジックを含むパッケージ。
- **`pkg`**: 再利用可能なライブラリやユーティリティ。
- **`configs`**: 設定ファイル。
- **`migrations`**: データベースのマイグレーション用。

### ステップ2: `main.go` ファイルの作成

`cmd`ディレクトリ内に`main.go`というファイルを作成し、Goアプリケーションのエントリーポイントを設定します。

**`cmd/main.go`**:

```go
package main

import (
    "fmt"
    "log"
    "net/http"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintln(w, "Welcome to Go Movies API!")
    })

    log.Println("Starting server on :8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        log.Fatalf("could not start server: %v\n", err)
    }
}
```

**説明**:
    
    - `http.HandleFunc`でルートパスに対するハンドラを登録し、`fmt.Fprintln`でシンプルな応答を送ります。
    - `http.ListenAndServe(":8080", nil)`でサーバーを起動し、ポート`8080`でリクエストを受け付けます。

### ステップ3: 必要なライブラリの追加

将来的な開発を考慮し、プロジェクトで使用するパッケージを追加します。例えば、`mux`ライブラリを使用する場合は以下のコマンドを使用します。

```bash
go get -u github.com/gorilla/mux
```

### ステップ4: サーバーの起動

`main.go`ファイルを保存し、ターミナルで以下のコマンドを実行してサーバーを起動します。

```bash
go run cmd/main.go
```
### 実行結果

ブラウザで`http://localhost:8080`にアクセスすると、「Welcome to Go Movies API!」というメッセージが表示されます。

この基盤の上に、次のステップでAPIエンドポイントやデータベース接続、認証機能を追加していきます。

次に行うことは、ここに**CMD**という名前のフォルダを作成することです。CMDはCommand（コマンド）を意味します。

その中に**API**という名前の新しいフォルダを作成します。これは慣例に従ったものです。

メインプロジェクト、つまりメインモジュールをCMD/APIに配置します。そして、後でこの同じコードベースを使ってウェブアプリケーションやコマンドラインアプリケーションを開発したい場合は、APIの隣に**web**や**CLI**という名前の新しいフォルダを作成するだけです。

このようにして、複数のプロジェクトが同じファイルを共有できるようになります。やがて、メインモジュールが参照する他のフォルダやモジュールが追加されることになります。

現時点では、CMDフォルダの中にAPIフォルダがあり、その中に**main.go**というファイルを作成します。Goファイルはすべて、あるパッケージに属していなければなりません。

私の場合は、このパッケージは**main**です。そして、Goファイルには引数を取らず、何も返さない**main**という関数が1つ必要です。

この関数はアプリケーションのエントリーポイントになります。

では、いくつかコメントを書いて、何をするかを決めましょう。すぐに取り掛かるものもあれば、しばらく手を付けないものもありますが、計画を明確にするためにコメントを残しておきます。

まず最初に行うことは、アプリケーションの設定を行うことです。これに取り掛かるのは少し先になりますが、長くはかかりません。

アプリケーション設定は、アプリケーションが必要とする情報を格納する型に過ぎません。

たとえば、データベースへの接続方法やデータベースリポジトリの場所、JWTトークンを署名するための秘密鍵などの情報が必要です。

そのため、これらを格納する型が必要となり、コマンドラインから読み込むことになります。

Goのアプリケーションや多くのプログラミング言語では、アプリケーションを起動するときにコマンドラインから値を渡すことが一般的です。これらは「フラグ」と呼ばれます。

例えば、「このAPIはexample.comドメイン専用だ」といったフラグを渡すことがあるかもしれません。

そこで、コマンドラインから値を読み取り、先述のアプリケーション設定に取り込みます。

次に必要なのはデータベースです。そのため、データベースに接続する必要がありますが、これは比較的簡単に行えます。

これも長くかからずに対処できるでしょう。そして、その後はウェブサーバーを起動します。

今回はこれを開始し、アプリケーションを実行できる状態にします。

次に考えるべきことは、このウェブサーバーでどのハンドラーを使用するかです。

ポートのフォーマットが自動でされなかったので、`fmt`を修正し、Enterを押します。これによりインポートが追加され、`fmt`が上に追加されているのが確認できます。

`http.ListenAndServe`の第2引数はハンドラーです。`ListenAndServe`にカーソルを合わせると、「ListenAndServeはアドレス（文字列）と、型`http.Handler`のハンドラーを受け取る」と表示されます。

では、そのハンドラーはどこから手に入れるのでしょうか？現時点では、とりあえず`nil`を指定します。つまり、何も受け取らない状態にします。

この段階で変数`error`を宣言しましたが、Goでは関数内で宣言した変数を使用しないとアプリケーションはコンパイルされず、実行もできません。したがって、`error`に対して何か処理をしなければなりません。同様に`app`も使う必要があります。

ひとまず、`error`を処理しましょう。`error`が`nil`でない場合、つまり`http.ListenAndServe`を呼び出してエラーが返ってきた場合、この`if`文の中身が実行されます。その中では標準ライブラリに組み込まれている`log`を使用します。Enterを押すとインポートが追加され、`log.Fatal`を使用して「ウェブサーバーを起動できない場合はエラーを表示して終了」とします。

次に、`var app application`を使わないとプログラムは実行できません。そこで、`application`型にメンバーを追加しましょう。`domain`という名前で、型は`string`です。

そして、ウェブサーバーを起動する直前に、`app.domain`に`"example.com"`を代入します。これで変数が使用されることになります。

この時点で、アプリケーションを実行できます。頻繁にこの操作を行うことになるので、早速実行してみましょう。アプリケーションはポート8080で待ち受けるだけで、ハンドラーがないため何も処理しませんが、一度動作させてみます。

画面をクリアし、プロジェクトのルートディレクトリから`go run ./cmd/API`と入力してアプリケーションを実行します。

実行中にフィードバックは表示されませんので、`Ctrl+C`を押して停止し、ターミナルを非表示にします。

ウェブサーバーを起動する前に、ログを出力するコードを追加しましょう。`log.Println`を使い、「Starting application on port」と表示し、ポート番号を出力します。

ターミナルを再び開き、画面をクリアして、矢印キーの上を押して`go run ./cmd/API`コマンドを呼び出し、Enterを押します。すると、「Starting application on port 8080」と表示されます。

これでブラウザを使ってアプリケーションに接続を試みても、実際には何も行いません。ポートで待ち受けているだけで、接続を処理していません。

このため、`nil`を渡すだけでは不十分です。次回の講義でこの続きを始めましょう。
## Adding hnadlers and routes to our API
現在、ポート8080で待ち受けるウェブサーバーがありますが、何もしていません。そこで、少し改良してみましょう。

まず、**CMD/API**フォルダ内に2つの新しいファイルを作成します。

1つ目は**handlers.go**という新しいファイルを作成します。このファイルは`package main`に属し、今は空のままにしておきます。

2つ目は**routes.go**という新しいファイルを作成します。こちらも`package main`に属します。今回の講義ではこのファイルに触れませんが、後で使用するので今のうちに作成しておきます。

それでは**main.go**に戻りましょう。

現在、28行目でHTTPパッケージ（標準ライブラリの一部）から関数`ListenAndServe`を呼び出したときにエラーをチェックしています。

Visual Studio Codeが提供するコメントを見ると、`ListenAndServe`はTCPネットワークアドレス`addr`でリッスンすることが記載されています。この関数の最初の引数は、文字列`:8080`です。

2つ目の引数は`Handler`です。コメントには、通常この`Handler`は`nil`で、デフォルトの`ServeMux`が使用されると書かれています。今回はこのデフォルト`ServeMux`を使用します。

ただし、最終的なアプリケーションではデフォルトの`ServeMux`は使用しません。代わりに、別のルーターやサードパーティパッケージを使用します。多くの人がそのようにしています。

純粋主義者はデフォルトの`ServeMux`を使用しますが、私の経験や多くの人の経験では、デフォルトの`ServeMux`は使い勝手が悪く、サードパーティのルーターよりもかなり遅いです。

とはいえ、これで始めましょう。

GoはAPIを構築するための必要なものがほとんど標準ライブラリに組み込まれていますが、場合によってはサードパーティのパッケージを使用するのが理にかなっていることもあります。

では、**handlers.go**ファイルに移動し、非常にシンプルなハンドラーを作成しましょう。

`func`キーワードを使って関数を定義します。関数名を`Hello`とし、ハンドラーとして設定します。Goのハンドラーはすべて2つの引数を取ります。

最初の引数は通常`w`と呼ばれ、多くの人がこの名前を使います。これは書き込み先であり、型を指定する必要があります。

そして、書き込み先は標準ライブラリの`http`を使用します。Enterを押すと自動でインポートされます。そして、`ResponseWriter`が必要です。これは書き込み先です。

`ResponseWriter`はクライアントに送信する最終的なコンテンツを書き込む場所です。2番目の引数はリクエストで、型は`*http.Request`でなければなりません。

これでハンドラーが完成です。今は、ウェブブラウザに「Hello, World」と表示するだけにしますが、これは非常に簡単です。

`fmt`パッケージを使用します。前回の講義でも使用しましたね。そして、その中にある関数`Fprint`を使います。

ただし、間違えて入力しましたので、修正して`fmt.Fprint`とし、`W`に書き込みます。つまり、`ResponseWriter`に対して書き込みます。

ここでは単純な文字列「Hello, World」を表示します。

これでハンドラーが完成し、使用できる状態になりましたが、まだ呼び出してはいません。**main.go**に戻り、1行追加します。今回は、`log.Println`の直後に追加します。

`http.HandleFunc`を使用して、デフォルトパス「/」にアクセスしたときに`Hello`ハンドラーを呼び出すようにします。それだけです。

では、全体をおさらいしましょう。

`package main`でこのファイルがメインパッケージに属していることを宣言します。標準ライブラリから使用するインポートは`fmt`（フォーマット用パッケージ）、ログに書き込むための`log`、ウェブアプリケーションのネットワーク接続用の`net/http`です。

ポート`8080`でリッスンするようにする定数`port`を宣言しています。注意点として、すでにポート8080で待ち受けている何かがある場合、アプリケーションはエラーを出して終了します。ポート8080で動作しているプロセスを停止するか、ポート8081など別のポートを選んでください。それでも動作します。

次に、アプリケーションの設定情報を保持するための`application`型を宣言しています。その中には`Domain`という1つのフィールドがありますが、今回は使用していません。

そして、`main`関数を宣言します。Goのプログラムには必ず1つだけ`main`関数があり、アプリケーションのエントリーポイントです。

アプリケーションを実行するとき、`application`型の変数`app`を宣言します。

次に、その型の1つのフィールドに`example.com`というドメインを代入します。

その後、ターミナルに「Starting application on port 8080」と表示します。

次に、この`http.HandleFunc`の行があり、これは誰かがウェブサーバー上のポート8080にアクセスして、アプリケーションのルートレベルを探している場合、そのときに関数`Hello`を実行するという意味です。

その`Hello`関数は`handlers.go`にあり、ブラウザに「Hello, World」を表示するだけです。

では、アプリケーションを起動しましょう。

ターミナルを開き、画面をクリアし、アプリケーションのルートレベルにいることを確認します。確認したら、`go run ./cmd/API`と入力して実行します。起動したら、これは良いサインです。

次に、ウェブブラウザを開き、新しいタブで`http://localhost:8080`にアクセスします。`8080`のポートで接続し、Enterを押します。

すると「Hello, World」と表示されました。

これで、アプリケーションに接続して情報を取得できることが確認できました。ただし、「Hello, World」のテキストはReactのフロントエンドにとってはあまり価値がありませんが、これがスタートです。

次回の講義では、デフォルトの`ServeMux`の使用をやめ、サードパーティのルーターをインストールして、今後の開発がより簡単になるようにします。

それでは、次に進みましょう。

# installing a routing package

前回お話ししたように、今行いたいのはサードパーティのルーティングパッケージをインストールすることです。

念のため言っておくと、これは必須ではありませんが、私が知っているほとんどの人がこれを行っています。標準ライブラリには特定のハンドラーへのリクエストをルーティングするために必要なものが揃っており、私たちのコードの27行目でそれを行っています。また、30行目で第2引数に`nil`を渡したことで、標準ライブラリの一部であるデフォルト`ServeMux`が使用されます。

しかし、これを使用するには少し多めのコードが必要であり、実際にサードパーティのルーターを使用するよりも少し遅くなります。

サードパーティのルーターは多数ありますが、私が使用するのは、これからブラウザで紹介する「Chi Router」です。このルーターは非常に安定しており、これまで問題を起こしたことはありません。

URLは`GitHub.com/go-chi/chi`で、スクロールするとインストールコマンドが見つかります。これをコピーし、コードに戻ってターミナルを開き、アプリケーションのルートレベルにいることを確認します。確認したら、アプリケーションを停止して、次のコマンドを貼り付けます。

```bash
go get -u github.com/go-chi/chi/v5
```

注意として、もしバージョン6がリリースされていて、まだこのコースが更新されていなければ、バージョン5を使用してください。メジャーバージョンの違いは互換性のない変更をもたらすことがあるので、簡単にするためにバージョン5を使い、後で必要であればアップグレードしてください。

このコマンドを実行しました。この操作によって、`go.mod`ファイルにパッケージが追加され、`chi`が使われていることが表示されます。まだ使用していませんが、インストールは完了しました。ターミナルを閉じ、`go.mod`も閉じて、作成した`routes.go`ファイルを開きます。現在、このファイルには冒頭にパッケージ宣言があるだけです。

次に、関数を宣言します。この関数に`app`（`application`型のポインタ）をレシーバーとして設定します。これにより、`application`型の変数があれば、この関数にアクセスできるようになります。関数名は`routes`とし、パラメータは取りません。戻り値の型は`http.Handler`です。

関数内で最初に行うのは、ルーターマルチプレクサ（`Mux`）の作成です。変数`mux`に`chi.NewRouter()`を呼び出して代入します。これで`chi`がインポートされ、引数は不要です。

そして、この関数の最後で`mux`を返す必要があります。ですので、`return mux`とします。

その間に、必要なミドルウェアを指定し、また設定するルートを記述します。ここでミドルウェアを追加してみましょう。

`chi`には優れたミドルウェアが含まれています。`mux.Use`を使って、すべてのリクエストに適用するミドルウェアを指定します。ここで使用したいのは`middleware`パッケージから`middleware.Recover`です。これは`chi`バージョン5の一部です。

このミドルウェアは、アプリケーションが何らかの理由でパニックを起こしたときに、その内容をログに記録し、エラートレースを表示して、エラーが発生した場所を特定できるようにします。また、HTTP 500（内部サーバーエラー）という必要なヘッダーを返し、アプリケーションが停止することなく復旧します。非常に有用なミドルウェアです。

```go
func (app *application) routes() http.Handler {
	mux := chi.NewRouter()
	mux.Use(middleware.Recoverer)

	return mux
}
```

では、この`routes`関数をどう使うかについて説明します。**main.go**に戻り、`nil`を渡していた箇所に`app.routes()`を渡します。この関数は`http.Handler`を返すので、これで問題ありません。

これにより、`http.HandleFunc`の行は不要になります。その代わり、`app.routes()`で必要なルートをすべて設定し、次回の講義でそれを進めていきます。

## Adding a route to our handlers
現在、`main.go`ファイル内で`ListenAndServe`の呼び出しを変更し、以前の`nil`の代わりに`routes`を使用するようにしました。これにより、デフォルトの`ServeMux`は使用されなくなりました。

この`routes`関数は、`routes.go`に記述されているもので、現時点ではルーターを作成し、ミドルウェアを適用してそれを返すだけの内容になっています。

では、新しいルートを追加しましょう。既存のハンドラー（`handlers.go`に記述されているもの）を使います。`hello`という名前だったものを`Home`に変更し、これをAPIのデフォルトルートとして使用します。このハンドラーは現在、単に文字列を返すだけのものです。

ここにレシーバーを追加します。`routes`関数で使用したのと同じレシーバー、`App *application`を加えることで、このハンドラーは`application`型に格納されているすべての情報にアクセスできるようになります。現在格納されている情報は`domain`のみですが、これを活用して出力を変更します。

例えば、`fmt.Fprintf`を使用し、フォーマット文字列`Hello world from %s`を作成します。ここで、`%s`の部分に`app.domain`を代入することで、`application`型に保存されたドメイン名を動的に表示します。

これで、`application`型に格納されたドメイン名（例えば`example.com`）を元に「Hello world from Example.com」と出力されるようになります。

次に、`routes.go`に移動し、ルートを追加します。`mux.Get`を使用し、「/」へのGETリクエストが来たときに`app.Home`ハンドラーにリクエストをルーティングするよう設定します。

その後、アプリケーションを起動します。ターミナルを開き、画面をクリアして、アプリケーションのルートディレクトリにいることを確認します。その上で、以下のコマンドを実行します：

```bash
go run ./cmd/api
```

アプリケーションが起動したら、ブラウザを開いてポート8080の`localhost`にアクセスします。このとき、「Hello world from Example.com」というメッセージが表示されるはずです。

これが新しいルートを作成して機能させる方法の流れです。

ローカルホストにアクセスし、ポート8080に接続します。ページをリロードすると「Hello world from Example.com」と表示されました。

この`example.com`は、`main.go`で設定されたものです。

ターミナルを閉じて説明します。23行目で宣言された変数`app`は、17行目で作成され、その中の`domain`フィールドに`example.com`が代入されています。これが表示の元になっています。

これで、1つの機能するルートが作成できました。ただし、このルートは現在プレーンテキストを返しているだけです。次は、このルートがJSONを返すように変更します。

それについては次回の講義で進めていきます。

## Returning Json from our API
現在、ブラウザにテキストを返すシンプルな`home`ハンドラーがありますが、今回はこれを修正してJSONを返すようにします。なぜなら、ReactフロントエンドはバックエンドからJSONを受け取る必要があるからです。

まず、JSONを送信する方法を学びます。それを行う準備として、ハンドラーの中身をすべて削除し、コードを保存します。これでインポートが整理され、クリーンな状態になります。

次に、返す内容を決定します。APIのルート（`/`）にアクセスされた場合、APIのステータス（アクティブかどうか）やメッセージ、バージョン情報を含むJSONレスポンスを返すことにします。

具体的には、以下の手順を実行します：

1. **変数`payload`を宣言**します。これが返されるデータです。
2. この変数を匿名構造体（struct）として定義し、そのフィールドを一度に宣言、初期化します。
3. 構造体のフィールドを指定します。フィールドごとにJSONで使用する名前も指定します。

以下が具体的なコード例です：

```go
payload := struct {
    Status  string `json:"status"`
    Message string `json:"message"`
    Version string `json:"version"`
}{
    Status:  "active",
    Message: "API is running",
    Version: "1.0.0",
}
```

- **`Status`**: 型は`string`で、JSONレスポンスでは`"status"`という名前になります。
- **`Message`**: 型は`string`で、JSONレスポンスでは`"message"`という名前になります。
- **`Version`**: APIのバージョンを表し、型は`string`で、JSONレスポンスでは`"version"`という名前になります。

フィールド名とJSON名を関連付けるためにバッククォート（`` ` ``）で囲まれた`json`タグを使用します。

なお、JSON標準ではキーは大文字で始めるべきとされていますが、多くの人がそうしないため、このコードでも小文字で始めています。

次回、これをブラウザに正しく返す方法を学びます。

さて、必要であれば大文字を使うことも可能ですが、今回はフィールドを以下のように初期化します。

### フィールドの初期化

`payload`変数を匿名構造体として定義し、そのフィールドに値を設定します：

```go
payload := struct {
    Status  string `json:"status"`
    Message string `json:"message"`
    Version string `json:"version"`
}{
    Status:  "active",
    Message: "Go Movies up and running",
    Version: "1.0.0",
}
```

- **Status**: `"active"`と設定。
- **Message**: `"Go Movies up and running"`。
- **Version**: `"1.0.0"`。

この変数をJSON形式に変換する必要があります。それを行うために、次の手順を実行します。

---

### JSONへの変換

Go標準ライブラリの`json.Marshal`を使用して、`payload`をJSON形式に変換します。この際、エラー処理も行います：

```go
out, err := json.Marshal(payload)
if err != nil {
    fmt.Println(err) // 現時点ではエラーをコンソールに出力
    return
}
```

---

### レスポンスの設定

クライアントにJSONを正しく返すために、以下の手順を実行します：

1. **ヘッダーの設定**: `Content-Type`ヘッダーを`application/json`に設定します。
2. **ステータスコードの設定**: HTTPステータスコード200を返します。

コードは以下のようになります：

```go
w.Header().Set("Content-Type", "application/json") // JSONとして返すことを指定
w.WriteHeader(http.StatusOK)                      // ステータスコード200を設定
```

---

### JSONデータの書き込み

最後に、変換したJSONデータをレスポンスとして書き込みます：

```go
w.Write(out)
```

---

### アプリケーションの実行

ターミナルで以下のコマンドを実行してアプリケーションを起動します：

```bash
go run ./cmd/API
```

その後、ブラウザで`http://localhost:8080`にアクセスします。ブラウザによっては、JSONがフォーマットされて表示される場合があります。

---

### 出力の確認

ブラウザで以下のようなJSONレスポンスが確認できます：

```json
{
    "status": "active",
    "message": "Go Movies up and running",
    "version": "1.0.0"
}
```

`status`、`message`、`version`のフィールド名はすべて小文字であり、定義した構造体のJSONタグに一致しています。

## Returning a list of movies as json

今回の目標は、映画のリストをJSONとして返すハンドラーを作成することです。これが動作するようになったら、フロントエンドに接続して、すべてが正しく動作するかを確認します。現時点ではデータベースに接続せず、バックエンドでデータを仮定義します。データベースが準備できた段階でコードを完成させます。

### ステップ1: ハンドラーの作成

`handlers.go`ファイルに、すべての映画を返すシンプルなハンドラーを作成します。以下のように`app`のレシーバーを持つ`allMovies`関数を追加します。

```go
func (app *application) allMovies(w http.ResponseWriter, r *http.Request) {
    // TODO: Add logic to return a list of movies
}
```

このハンドラーは以下の2つのパラメータを取ります：

- **`w`**: レスポンスを返すための`http.ResponseWriter`
- **`r`**: リクエストを受け取るための`*http.Request`

これでハンドラーの雛形が完成しました。

---

### ステップ2: ルートの設定

`routes.go`ファイルに移動し、`/movies`エンドポイントを設定します。REST APIでは、アクション（GET、POSTなど）はHTTPメソッドで決まるため、ルート名には通常動詞を含めません。

以下のコードを追加します：

```go
mux.Get("/movies", app.allMovies)
```

これにより、`/movies`へのGETリクエストが`allMovies`ハンドラーにルーティングされます。

---

以下は映画データモデルの拡張および映画データのハンドリングに関する具体的な手順です。

---

### ステップ1: 映画モデルの拡張

`movie.go`に以下のフィールドを追加し、それぞれに対応するJSONタグを設定します。

```go
package models

import "time"

// Movie represents a single movie record
type Movie struct {
    ID          int       `json:"id"`
    Title       string    `json:"title"`
    ReleaseDate time.Time `json:"release_date"`
    Runtime     int       `json:"runtime"`
    MPAARating  string    `json:"mpaa_rating"`
    Description string    `json:"description"`
    Image       string    `json:"image"`
    CreatedAt   time.Time `json:"-"` // JSONに含めない
    UpdatedAt   time.Time `json:"-"` // JSONに含めない
}
```

- **`Runtime`**: 映画の上映時間（整数型、JSONでは`runtime`）。
- **`MPAARating`**: MPAAのレーティング（文字列型、JSONでは`mpaa_rating`）。
- **`Description`**: 映画の説明（文字列型、JSONでは`description`）。
- **`Image`**: 映画のポスター画像などのURL（文字列型、JSONでは`image`）。
- **`CreatedAt`**と**`UpdatedAt`**: 作成・更新時刻（`time.Time`型）。JSONには含めないため、JSONタグに`"-"`を指定。

これで、映画データをフロントエンドに送信する際に必要な情報だけを含むようにできます。

---

### ステップ2: 映画データの生成

`handlers.go`に戻り、映画データを生成します。

```go
func (app *application) allMovies(w http.ResponseWriter, r *http.Request) {
    // 映画データのスライスを作成
    movies := []models.Movie{
        {
            ID:          1,
            Title:       "Highlander",
            ReleaseDate: time.Date(1986, 3, 7, 0, 0, 0, 0, time.UTC),
            Runtime:     116,
            MPAARating:  "R",
            Description: "An immortal Scottish swordsman faces other immortals in a deadly centuries-old game.",
            Image:       "highlander.jpg",
        },
        {
            ID:          2,
            Title:       "The Matrix",
            ReleaseDate: time.Date(1999, 3, 31, 0, 0, 0, 0, time.UTC),
            Runtime:     136,
            MPAARating:  "R",
            Description: "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
            Image:       "matrix.jpg",
        },
    }

    // JSON形式に変換
    out, err := json.Marshal(movies)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // ヘッダーの設定
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)

    // JSONデータをレスポンスに書き込み
    w.Write(out)
}
```

---

### ステップ3: 動作確認

ターミナルでアプリケーションを起動します：

```bash
go run ./cmd/API
```

その後、ブラウザやAPIテストツール（例: Postman）で`http://localhost:8080/movies`にアクセスします。

---

### 出力の例

以下のようなJSONレスポンスが確認できます：

```json
[
    {
        "id": 1,
        "title": "Highlander",
        "release_date": "1986-03-07T00:00:00Z",
        "runtime": 116,
        "mpaa_rating": "R",
        "description": "An immortal Scottish swordsman faces other immortals in a deadly centuries-old game.",
        "image": "highlander.jpg"
    },
    {
        "id": 2,
        "title": "The Matrix",
        "release_date": "1999-03-31T00:00:00Z",
        "runtime": 136,
        "mpaa_rating": "R",
        "description": "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
        "image": "matrix.jpg"
    }
]
```

---

これで映画のリストをJSON形式で返すハンドラーが完成しました。次はフロントエンドと連携し、データを取得して表示する部分に進みます。
### ステップ2: 映画データの追加（Raiders of the Lost Ark）

同様に、2つ目の映画データを作成します。変数名の衝突を避けるため、適切な名前を使用します。

```go
rd2, _ := time.Parse("2006-01-02", "1981-06-12") // "1981-06-12"をtime.Time型に変換
movie2 := models.Movie{
    ID:          2,
    Title:       "Raiders of the Lost Ark",
    ReleaseDate: rd2,
    Runtime:     115,
    MPAARating:  "PG-13",
    Description: "An adventurous archaeologist races against time to find the Ark of the Covenant.",
    Image:       "raiders.jpg",
    CreatedAt:   time.Now(),
    UpdatedAt:   time.Now(),
}
```

---

### ステップ3: スライスに映画を追加

Goの`append`を使用して映画データをスライスに追加します。

```go
movies := []models.Movie{}
movies = append(movies, movie1)
movies = append(movies, movie2)
```

---

### ステップ4: JSONレスポンスの生成と返却

スライスをJSON形式に変換し、レスポンスとして返します。

```go
out, err := json.Marshal(movies) // スライスをJSON形式に変換
if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
}

w.Header().Set("Content-Type", "application/json") // JSONレスポンスとして返却
w.WriteHeader(http.StatusOK)
w.Write(out)
```

---

### フルコード（`handlers.go`の`allMovies`関数）

以下は全体のコードです：

```go
func (app *application) allMovies(w http.ResponseWriter, r *http.Request) {
    rd, _ := time.Parse("2006-01-02", "1986-03-07")
    movie1 := models.Movie{
        ID:          1,
        Title:       "Highlander",
        ReleaseDate: rd,
        Runtime:     116,
        MPAARating:  "R",
        Description: "An immortal Scottish swordsman faces other immortals in a deadly centuries-old game.",
        Image:       "highlander.jpg",
        CreatedAt:   time.Now(),
        UpdatedAt:   time.Now(),
    }

    rd2, _ := time.Parse("2006-01-02", "1981-06-12")
    movie2 := models.Movie{
        ID:          2,
        Title:       "Raiders of the Lost Ark",
        ReleaseDate: rd2,
        Runtime:     115,
        MPAARating:  "PG-13",
        Description: "An adventurous archaeologist races against time to find the Ark of the Covenant.",
        Image:       "raiders.jpg",
        CreatedAt:   time.Now(),
        UpdatedAt:   time.Now(),
    }

    movies := []models.Movie{}
    movies = append(movies, movie1)
    movies = append(movies, movie2)

    out, err := json.Marshal(movies)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(out)
}
```

---

### ステップ5: 動作確認

1. ターミナルでアプリケーションを再起動します：

```bash
go run ./cmd/API
```

2. ブラウザやAPIテストツール（例: Postman）で以下のURLにアクセスします：

```
http://localhost:8080/movies
```

---

### 結果のJSONレスポンス

以下のようなJSONデータが返されるはずです：

```json
[
    {
        "id": 1,
        "title": "Highlander",
        "release_date": "1986-03-07T00:00:00Z",
        "runtime": 116,
        "mpaa_rating": "R",
        "description": "An immortal Scottish swordsman faces other immortals in a deadly centuries-old game.",
        "image": "highlander.jpg"
    },
    {
        "id": 2,
        "title": "Raiders of the Lost Ark",
        "release_date": "1981-06-12T00:00:00Z",
        "runtime": 115,
        "mpaa_rating": "PG-13",
        "description": "An adventurous archaeologist races against time to find the Ark of the Covenant.",
        "image": "raiders.jpg"
    }
]
```

---

### 次のステップ

次回は、フロントエンドをバックエンドAPIに接続して映画リストを取得する仕組みを構築します。これにより、全体のフローが完成します。

# Connecting the front end to the back end API
以下は、フロントエンドの`Movies.js`コンポーネントでバックエンドAPIに接続して映画リストを取得する方法の詳細です。

---

### ステップ1: `useEffect`の修正

現在、`useEffect`フック内にハードコーディングされた映画リストがあります。それを削除して、バックエンドAPIにリクエストを送るコードを追加します。

---

### ステップ2: `fetch`を使ったデータ取得

`fetch`関数を使用してバックエンドAPIからJSONデータを取得し、その結果を`setMovies`で状態に設定します。

#### 修正後のコード例:

```jsx
import React, { useEffect, useState } from 'react';

const Movies = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        // ヘッダーの作成
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        // リクエストオプションの作成
        const requestOptions = {
            method: "GET",
            headers: headers,
        };

        // fetchリクエスト
        fetch("http://localhost:8080/movies", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // JSONデータを解析
            })
            .then((data) => {
                setMovies(data); // 映画リストを状態に設定
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);
            });
    }, []); // コンポーネントが初回レンダリング時に実行

    return (
        <div>
            <h1>Movies</h1>
            <ul>
                {movies.map((movie) => (
                    <li key={movie.id}>
                        <h2>{movie.title}</h2>
                        <p>Release Date: {new Date(movie.release_date).toLocaleDateString()}</p>
                        <p>Runtime: {movie.runtime} minutes</p>
                        <p>Rating: {movie.mpaa_rating}</p>
                        <p>{movie.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Movies;
```

---

### 詳細説明

1. **ヘッダーの作成**:
    
    ```javascript
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    ```
    
    - `Content-Type`を`application/json`に設定します。
2. **リクエストオプションの設定**:
    
    ```javascript
    const requestOptions = {
        method: "GET",
        headers: headers,
    };
    ```
    
    - `GET`メソッドを指定し、作成したヘッダーをリクエストに追加します。
3. **`fetch`リクエストの送信**:
    
    ```javascript
    fetch("http://localhost:8080/movies", requestOptions)
        .then((response) => response.json())
        .then((data) => setMovies(data))
        .catch((error) => console.error("Error fetching movies:", error));
    ```
    
    - `http://localhost:8080/movies`にリクエストを送信。
    - レスポンスが成功すればJSONを解析し、`setMovies`で映画リストを設定。
    - エラーが発生した場合はコンソールにエラーメッセージを出力。
4. **映画リストの表示**:
    
    - 状態`movies`をマップして映画リストをレンダリングします。
    - 日付をフォーマットするために`Date`オブジェクトを使用。

---

### ステップ3: 動作確認

1. **バックエンドの起動**:
    
    ```bash
    go run ./cmd/API
    ```
    
2. **フロントエンドの起動**: 開発サーバーを起動します（例: `npm start`）。
    
3. **ブラウザで確認**: `Movies.js`コンポーネントが正しく映画リストを表示することを確認します。
    

---

### 結果の例

以下のような映画リストが表示されます：

```
Movies
- Highlander
  Release Date: 03/07/1986
  Runtime: 116 minutes
  Rating: R
  An immortal Scottish swordsman faces other immortals in a deadly centuries-old game.

- Raiders of the Lost Ark
  Release Date: 06/12/1981
  Runtime: 115 minutes
  Rating: PG-13
  An adventurous archaeologist races against time to find the Ark of the Covenant.
```

---

次回は、エラーハンドリングやフロントエンドでのローディング状態の管理を追加する方法について学びます。

以下は、フロントエンドとバックエンド間で発生するCORS（Cross-Origin Resource Sharing）エラーの問題を説明し、解決する方法を解説します。

---

### 問題の概要

1. フロントエンドは`http://localhost:3000`で動作。
2. バックエンドは`http://localhost:8080`で動作。
3. ブラウザは同一オリジンポリシー（Same-Origin Policy）に従い、異なるオリジン（ポートが異なる場合も別オリジンとみなされる）間のリソース共有を許可しない。

結果として、次のエラーが発生：

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource.
Reason: CORS header ‘Access-Control-Allow-Origin’ missing.
Status Code: 405
```

---

### 解決策

バックエンドにCORSミドルウェアを追加して、特定のオリジン（この場合、`http://localhost:3000`）からのリクエストを許可します。

---

### ステップ1: CORSミドルウェアの作成

以下のコードをバックエンドのルート設定またはミドルウェア設定に追加します。

#### GoでのCORSミドルウェア

`routes.go`またはミドルウェア設定ファイルに以下を追加：

```go
package main

import (
    "net/http"
)

// CORSミドルウェア
func enableCORS(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        // Preflightリクエストへの応答
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r)
    })
}
```

---

### ステップ2: ミドルウェアをルートに適用

ルート設定でCORSミドルウェアを適用します。`routes.go`で`mux`に追加：

```go
mux := chi.NewRouter()
mux.Use(enableCORS) // CORSミドルウェアを適用
```

---

### ステップ3: バックエンドの再起動

変更を保存し、バックエンドを再起動します：

```bash
go run ./cmd/API
```

---

### ステップ4: 動作確認

1. **フロントエンドの起動**: 開発サーバーを起動（例: `npm start`）。
2. **ブラウザで確認**: `http://localhost:3000`でフロントエンドにアクセスし、映画リストが正しく表示されるか確認します。
3. **ブラウザのJavaScriptコンソールを確認**: エラーが消え、データが正しく取得されていることを確認。

---

### 期待する結果

映画データがフロントエンドに正しく表示される：

```json
[
    {
        "id": 1,
        "title": "Highlander",
        "release_date": "1986-03-07T00:00:00Z",
        "runtime": 116,
        "mpaa_rating": "R",
        "description": "An immortal Scottish swordsman faces other immortals in a deadly centuries-old game.",
        "image": "highlander.jpg"
    },
    {
        "id": 2,
        "title": "Raiders of the Lost Ark",
        "release_date": "1981-06-12T00:00:00Z",
        "runtime": 115,
        "mpaa_rating": "PG-13",
        "description": "An adventurous archaeologist races against time to find the Ark of the Covenant.",
        "image": "raiders.jpg"
    }
]
```

---

### 補足

- 開発環境では特定のオリジンを許可（例: `http://localhost:3000`）。
- 本番環境ではより厳密なセキュリティ設定が必要。

次回は、エラー処理やCORS設定の拡張について解説します。

# Enabling CORS middleware
以下はCORS（Cross-Origin Resource Sharing）の設定をGoで行う方法と、Reactでプロキシを設定してフロントエンドとバックエンドを接続する手順について解説します。

---

### ステップ1: CORSミドルウェアの作成

CORSミドルウェアを新しいファイル`middleware.go`に追加します。このミドルウェアは、すべてのリクエストに必要なCORSヘッダーを追加し、`OPTIONS`リクエスト（プリフライトリクエスト）に対応します。

#### `middleware.go`

```go
package main

import (
    "net/http"
)

// EnableCORS adds CORS headers to the responses
func (app *application) enableCORS(h http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // CORSヘッダーを設定
        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Authorization, X-CSRF-Token")
        w.Header().Set("Access-Control-Allow-Credentials", "true")

        // OPTIONSリクエストへの対応
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }

        // 次のミドルウェアまたはハンドラーにリクエストを渡す
        h.ServeHTTP(w, r)
    })
}
```

### コードの説明
1. **`enableCORS`関数**:
    - この関数は、`http.Handler`を受け取り、新しい`http.Handler`を返します。
    - 返されたハンドラーは、CORSヘッダーをリクエストに追加します。
2. **CORSヘッダーの設定**:
    - `Access-Control-Allow-Origin`: `http://localhost:3000`を指定し、フロントエンドからのリクエストを許可。
    - `Access-Control-Allow-Methods`: 許可するHTTPメソッドを指定（例: GET, POST, PUTなど）。
    - `Access-Control-Allow-Headers`: 許可するヘッダー（例: `Content-Type`, `Authorization`）。
    - `Access-Control-Allow-Credentials`: クッキーや認証情報を許可するため`true`を設定。
3. **OPTIONSリクエストへの対応**:
    - ブラウザはプリフライトリクエストとして`OPTIONS`リクエストを送信します。
    - `OPTIONS`リクエストの場合、ステータスコード200を返して終了。
4. **次のミドルウェアまたはハンドラーへの移行**:
    - `h.ServeHTTP(w, r)`を呼び出して、次のハンドラーにリクエストを渡します。

---
### ステップ2: ミドルウェアをルートに適用

CORSミドルウェアを`routes.go`に追加します。

#### `routes.go`

```go
mux := chi.NewRouter()
mux.Use(app.enableCORS) // CORSミドルウェアを適用
```

---

### ステップ3: バックエンドを再起動

ターミナルで以下を実行し、バックエンドを再起動します：

```bash
go run ./cmd/API
```

---

### ステップ4: Reactでプロキシ設定

Reactの開発環境でプロキシを設定し、フロントエンドからバックエンドへのリクエストを同一オリジンとして扱うようにします。

#### プロキシ設定の追加

1. プロジェクトのルートディレクトリに`package.json`ファイルを開きます。
2. 以下を追加します：

```json
"proxy": "http://localhost:8080"
```

これにより、Reactの開発サーバー（`http://localhost:3000`）からのAPIリクエストが、自動的にバックエンドサーバー（`http://localhost:8080`）に転送されます。

---

### ステップ5: 動作確認

1. **バックエンドの起動**:
    
    ```bash
    go run ./cmd/API
    ```
    
2. **フロントエンドの起動**:
    
    ```bash
    npm start
    ```
    
3. **ブラウザで確認**:
    
    - フロントエンドアプリケーションを開き、映画リストが正しく表示されるか確認します。

---

### 期待する結果

CORSエラーが解消され、以下のような映画リストがフロントエンドに表示されます：

```
Movies
- Highlander
  Release Date: 03/07/1986
  Runtime: 116 minutes
  Rating: R
  An immortal Scottish swordsman faces other immortals in a deadly centuries-old game.

- Raiders of the Lost Ark
  Release Date: 06/12/1981
  Runtime: 115 minutes
  Rating: PG-13
  An adventurous archaeologist races against time to find the Ark of the Covenant.
```

---

### 注意点

- **本番環境**: 開発環境では`http://localhost:3000`を許可していますが、本番環境ではCORSヘッダーをセキュリティポリシーに基づいて厳密に設定する必要があります。
    
- **フロントエンドのプロキシ**: プロキシ設定は開発環境専用です。本番環境では、APIリクエストが正しいエンドポイントに向かうよう、適切に設定する必要があります。
    

---

次回は、フロントエンドとバックエンドを連携させて、さらにエラー処理や状態管理を改善する方法について解説します。

## Enabling Reacts proxy to the back end API
Reactのプロキシ設定を使用してフロントエンドとバックエンドをシームレスに接続する方法です。
### ステップ1: Reactでプロキシ設定を追加
1. プロジェクトのルートディレクトリにある`package.json`ファイルを開きます。
2. ファイルの冒頭に`proxy`フィールドを追加します。
#### 修正後の`package.json`例

```json
{
  "name": "frontend-app",
  "version": "0.1.0",
  "private": true,
  "proxy": "http://localhost:8080",
	// プロキシ設定を追加
  "dependencies": {
    // 他の依存関係
  }
}
```

この設定により、フロントエンドからのリクエストがバックエンド（`http://localhost:8080`）に転送されます。

# Connecting to Postgres
## Setting up our database using docker
データベースにアプリケーションを接続する前に、まずデータベースが起動している必要があります。  
これをDockerを使って行います。

この講義のコースリソースに移動すると、zipファイルがあります。  
そのファイルをダウンロードして解凍してください。  
中にはフォルダとファイルがあります。ファイルは `Docker-compose.yml` という名前です。  
このファイルをプロジェクトのルートディレクトリに配置してください。

フォルダの名前は `SQL` で、その中には `Create_tables_start.sql` という1つのファイルがあります。  
これを `Docker-compose.html` の隣に置いてください。  
これでデータベースを起動する準備が整いました。

次に、ターミナルを開き、正しいディレクトリにいることを確認してください。  
私の場合、ディレクトリ内に `Docker-compose.html` とその隣に `SQL` フォルダが見えます。

以下のコマンドを入力します:  
`docker-compose up -d`  
このコマンドはDockerをバックグラウンドで起動します（`-d` はバックグラウンド実行を意味します）。  
これによりPostgresが起動し、`create_tables.sql` ファイルを使ってデータベースが初期化されます。

では、実際に実行してみましょう。  
バックエンドが起動しましたが、初回実行時はPostgresのDockerイメージを取得するため、少し時間がかかる場合があります。  
30秒ほど待ち、データベースが確実に動作していることを確認してください。

次にデータベースに接続します。最終的にはGoコードで接続しますが、今は動作確認だけ行います。  
Postgresクライアントが必要です。まだインストールしていない場合は、無料のクライアント「Beekeeper Studio」を使うと便利です。

ブラウザで「Beekeeper Studio」と検索してください。公式サイトに移動し、ダウンロードボタンをクリックします。  
私はMacを使っているので、Mac用のダウンロードが表示されています。WindowsやLinuxを使っている場合は、対応するダウンロードリンクが表示されます。  
これをダウンロードしてインストールし、起動してください。

私はすでにBeekeeper Studioを起動しています。  
新規接続画面が表示されるので、「Postgres」を選択します。  
ここで、ユーザー名、パスワード、デフォルトデータベース名を入力します。

`Docker-compose.html` ファイルを確認すると、必要な接続情報が書かれています。  
ユーザー名は `postgres`、パスワードも `postgres`、データベース名は `movies` です。

Beekeeper Studioに戻り、以下の情報を入力します:

- ユーザー名: `postgres`
- パスワード: `postgres`
- データベース名: `movies`

他の設定はそのままで「テスト」をクリックします。  
接続が成功すれば問題ありませんが、エラーが出た場合は、すでにPostgresのインスタンスが動作している可能性があります。  
その場合、既存のPostgresインスタンスを停止してください。

以下の手順で停止と再起動が可能です:

1. ターミナルで `docker-compose down` を実行し、Dockerを停止する。
2. 既存のPostgresインスタンスを停止する。
3. 再度 `docker-compose up -d` を実行してDockerを再起動する。

これで接続が成功するはずです。  
接続後、データベース内に次のようなテーブルがあることを確認できます:

- `Genres`
- `Movies`
- `Movie_genres`
- `Users`

たとえば、`Movies` テーブルを開くと、次のようなデータが表示されます:

- `ID 1`: Highlander
- `ID 2`: Raiders of the Lost Ark
- `ID 3`: The Godfather

`Genres` テーブルには映画のジャンルが記載されていますが、リストが完全である必要はありません。学習には十分です。  
`Movie_genres` テーブルは、1つの映画に複数のジャンルを割り当てるためのテーブルです。

最後に `Users` テーブルを確認します。  
このテーブルはユーザー認証に使用されます。  
テーブルには `ID`、`First Name`、`Last Name`、`Email`、`Password` が含まれています。  
ただし、パスワードは平文ではなく、ハッシュ化されたものが保存されています（平文で保存するのは良くない実践です）。

ここまで進めば、データベース接続は完了です。  
次回の講義では、GoコードでPostgresデータベースに接続する方法を学びます。

## Getting started connecting our API to Postgres
これでDockerが起動し、データベースが動作しているので、Goのコードを作成してアプリケーションをデータベースに接続する作業を始めます。

今、`main.go` というファイルを見ていますが、19行目にコメントで「コマンドラインから読み取る」と書いてあります。  
データベースを使用するので、接続文字列（connection string）が必要です。  
このような場合、コマンドラインのフラグを使ってパラメータを指定するのが理想的です。  
Goではこれが非常に簡単にできます。

標準ライブラリの `flag` パッケージを使って、文字列を読み取ります。  
これにはいくつかのパラメータが必要です。

まず、何に読み取るかを指定する必要があります。  
ここでDSM（Data Source Name）という変数を作ることもできますが、この値は別の場所でも使うかもしれないので、  
`application` 構造体のフィールドとして定義する方が合理的です。  
そこで、`application` 構造体に `DSM` というフィールドを追加します。このフィールドの型は `string` です。

次に、コマンドラインからの値をこの `DSM` に読み取るようにします。  
ここが最初のパラメータです。

次に必要なのは、コマンドラインで使用するフラグの名前です。  
バイナリとして実行する場合、バイナリ名に続けて「-」で始まるフラグを指定します。  
ここではフラグ名を `DSM` にします。

また、デフォルト値を指定することもできます。  
このアプローチの便利な点は、開発時にはデフォルト値を使い、本番環境では別の値を指定できることです。

次に、`pkg X` というパッケージを使用します（後ほどインストールします）。  
このパッケージの接続文字列の形式は以下のようになります:

- **ホスト名**: 開発環境では `localhost`（現在使用中のマシン）
- **ポート番号**: Postgresのデフォルトポート `5432`
- **ユーザー名**: `postgres`
- **パスワード**: `postgres`
- **データベース名**: `movies`（私たちのデータベース名）

さらに、開発環境に適した設定をいくつか追加します:

- **SSLモード**: 無効化（`disable`）
- **タイムゾーン**: `UTC`（協定世界時）
- **接続タイムアウト**: 5秒（接続できない場合、5秒後にエラー）

最後に、このフラグの説明を指定します。  
ここでは「Postgres接続文字列」とします。

これでフラグ値を読み取れるようになりました。  
最後に `flag.Parse()` を呼び出して、コマンドラインから読み取ったすべてのフラグを解析します。

## Installing a database driver and connecting to postgres
これでデータベース接続文字列が用意できました。
良いスタートですが、当然ながらこれを使って何かしなければなりません。

Goでデータベースに接続するのは比較的簡単ですが、接続するデータベースごとにサードパーティ製のパッケージが必要です。  
今回使用するデータベースはPostgresです。

現時点でPostgresに接続するための人気のあるパッケージが2つありますので、ブラウザを見てみましょう。

最初に多くのチュートリアルで取り上げられているのが、GitHubの `github.com/lib/pq` というパッケージです。  
ただし、このページを下にスクロールして「ステータス」セクションを見ると、このパッケージは現在「保守モード（maintenance mode）」とされています。  
保守モードであるため、このパッケージの開発者は、「PGX（`pgx`）」を使用することを推奨しています。  
PGXは積極的に開発が進められているパッケージで、これを今回使用します。

PGXもGitHubにあります。URLは `github.com/jackc/pgx` です。  
このページのREADMEを読むといくつかの例が紹介されていますが、最初の例はPostgres専用のインターフェースを使用しています。  
ただし、これはGoの標準ライブラリのSQLインターフェースを使っていないため、今回の目的には過剰な機能です。

今回は標準ライブラリの `database/sql` インターフェースを使います。  
では、このパッケージをインストールしましょう。

コードに戻ります。  
ターミナルを開き、必要なパッケージを取得します。  
以下のコマンドを実行して、`github.com/jackc/pgx` からパッケージを取得します。

```
go get github.com/jackc/pgx/v4
```

現時点ではバージョン5がほぼ完成していますが、まだ正式リリースされていません。  
この講義では、安定しているバージョン4を使用することを強く推奨します。  
バージョン5がリリースされた後で、必要に応じてアップグレードしてください。  
バージョン4は非常に安定しており、私たちのニーズをすべて満たします。

次に、安全のためにもう1つのパッケージを取得します。

```
go get github.com/jackc/pgx/pgconn
```

これで必要なコードとライブラリが揃いました。  
次に、新しいファイルを作成します。  
`CMD/API` ディレクトリ内に `db.go` という名前の新しいファイルを作成します。

このファイルは `package main` で、以下のようにインポートを行います。

```go
package main

import (
    _ "github.com/jackc/pgconn"
    _ "github.com/jackc/pgx/v4/stdlib"
    _ "github.com/jackc/pgx/v4"
)
```

これで、Postgresとの接続に必要な準備が整いました。

この空識別子を使用している理由について説明します。
通常、Goのコードでは、使っていないインポートは許可されません。  
しかし、今回使うライブラリは標準ライブラリの `database/sql` であり、特定のデータベースに接続するためには、そのためのドライバが必要です。  
空識別子`_`を使用することで、「このパッケージの中のものを明示的には使わないけれど、必要だからインポートする」と指定できます。

これで必要なインポートが揃いました。今後さらに追加するものも出てきます。
次に、レシーバーを持たない関数を宣言します。この関数は `OpenDB` と呼び、以下のようになります。

- パラメータ: `dsn`（型は `string`）
- 戻り値: 2つ、1つは標準ライブラリの `*sql.DB`（データベース接続プールのポインタ）、もう1つは `error` です。

`*sql.DB` について少し説明します。  
これはデータベース接続プールのポインタです。  
Goの `database/sql` ドライバは接続プールを自動的に管理し、必要なときに接続をプールから取得し、不要になったらプールに戻します。

では、この関数の実装を始めましょう。内容は非常にシンプルです。

```go
func OpenDB(dsn string) (*sql.DB, error) {
    // 接続プールを作成
    db, err := sql.Open("pgx", dsn)
    if err != nil {
        return nil, err
    }

    // データベースへの接続確認
    if err = db.Ping()
    err != nil {
        return nil, err
    }

    return db, nil
}
```

### コードの説明:
1. `sql.Open`
    - 最初のパラメータはドライバ名で、空識別子を使ってインポートした `pgx` ドライバを指定します。
    - 2つ目のパラメータは接続文字列（`dsn`）。
2. エラーチェック
    - 接続に失敗した場合はエラーを返します。
3. `db.Ping`
    - データベースへの接続をテストします。Pingが成功すれば接続が正常です。
    - エラーが発生した場合は、接続プールを返さずエラーを返します。

次に、この関数を利用するための別の関数を作成します。  
この関数は `*application` をレシーバーとして持ち、名前を `connectToDB` とします。  
これは以前と同じ方法で `application` 構造体にデータベース接続を設定するための関数です。

以下のように記述します。

```go
func (app *application) connectToDB() error {
    connection, err := OpenDB(app.DSN)
    if err != nil {
        return nil, err
    }
    return connection, nil
}
```

### コードの説明:
1. `app.DSN` を利用して `OpenDB` 関数を呼び出し、データベース接続プールを作成します。
2. 接続成功時には `app.DB` に接続プールを設定します。
3. エラーが発生した場合はエラーを返します。

これで、データベース接続の準備が整いました。
この流れでアプリケーションをPostgresデータベースに接続することができます。

このデータベース関数はパラメータを受け取らず、戻り値として `*sql.DB`（データベース接続プールのポインタ）とエラーを返します。  
関数のシグネチャからもそのように見て取れます。

しかし、この関数には `app`（`application` 構造体）のレシーバーがあります。  
ここで行うことは、`OpenDB` 関数を呼び出して接続とエラーを取得することです。  
`OpenDB` 関数はすでに実装済みです。

次にエラーチェックを行いますが、先ほど作成したコードをそのまま貼り付けることができます。  
エラーが発生した場合はログにエラーメッセージを出力します。  
エラーがなければ「Postgresに接続成功」とログ出力し、接続を返します。

これで2つの関数が完成し、データベースへの接続に必要なコードが揃いました。  
次に、`main.go` に戻り、実際にデータベースに接続します。

まず、`connectToDB` 関数を呼び出し、その結果を変数 `con` に格納します。  
以下のように記述します:

```go
con, err := app.connectToDB()
if err != nil {
    log.Fatal(err)
}
```

次に、この `con` をどこかに格納する必要があります。  
使わない変数はGoのコンパイル時にエラーとなるためです。  
以下のようにアプリケーション構造体に格納します:

1. `application` 構造体に `DB` フィールドを追加（型は `*sql.DB`）。
2. `app.DB` に接続を代入。

以下が全体のコードの例です:

```go
type application struct {
    DB *sql.DB
}

func (app *application) connectToDB() (*sql.DB, error) {
    con, err := OpenDB(app.DSN)
    if err != nil {
        log.Println("Error connecting to database:", err)
        return nil, err
    }
    log.Println("Connected to Postgres")
    return con, nil
}

func main() {
    app := application{}

    // データベース接続
    con, err := app.connectToDB()
    if err != nil {
        log.Fatal("Unable to connect to database:", err)
    }
    app.DB = con

    // 以降の処理
}
```

ここでは、データベース接続プール（`*sql.DB`）を `application` 構造体に一時的に格納しています。  
後に「リポジトリパターン」を使用して、この設計を改善します。  
これにより、データベースを変更する際の柔軟性が向上し、テストの実施も容易になります。

次に、以下を実行して動作確認します:

1. ターミナルを開いて画面をクリアします。
2. PostgresイメージがDocker上で動作していることを確認します（起動していない場合は動作しません）。
3. 以下のコマンドを入力してアプリケーションを実行します:

```
go run ./cmd/api
```

出力に「Connected to Postgres」と表示されれば成功です。

これで良いスタートが切れました！  
次回はPostgresを操作する具体的なメソッド（クエリの実行など）を実装していきます。

## Setting up a database repository 1
データベースに接続することに成功しました。

さて、今すぐ対処しておきたいことがあります。
これを前回の講義に含めるべきだったかもしれませんが、大した問題ではありません。

データベース接続や接続プールを開いた場合（今回の例では `main.go` の28行目で `app.ConnectToDB` を呼び出し、それが `connectToDB` 関数を経由して `openDB` 関数を呼び出すことで接続を取得しています）、最後に必ずそれを閉じる必要があります。これを怠ると、リソースリークが発生し、不要な状態でもPostgresへの接続が開いたままになります。

接続を閉じるタイミングとしては、アプリケーションが終了する直前が最適です。つまり、データベースをもう使用しないと確信したタイミングで接続プールを閉じる必要があります。以下のように実装できます。

```go
app.DB.Close()
```

ただし、現時点ではまだデータベース接続を使用しているので、すぐには閉じません。そこで、Goのキーワード `defer` を使います。このキーワードは「この後のコードを、関数の終了直前に実行する」という意味です。例えば、`defer app.DB.Close()` と書くと、`main` 関数が終了する直前にデータベース接続を閉じるようになります。

これで接続が適切に閉じられるようになりました。次に、データベースを実際に操作するコードを書いていきます。

---

現状、アプリケーションの型に `DB` フィールドを埋め込んでおり、このフィールドは `*sql.DB` 型、つまりデータベース接続プールを指しています。
これを「リポジトリパターン」に変更する絶好のタイミングです。

### リポジトリのセットアップ
まず、`internal` フォルダに新しいフォルダを作成し、`repository` と名前を付けます。
その中に `repository.go` というファイルを作成し、以下のように記述します。

```go
package repository

type DatabaseRepo interface {
    AllMovies() ([]*models.Movie, error)
}
```

ここで、`DatabaseRepo` というインターフェースを定義しました。このインターフェースを満たすためには、`AllMovies` というメソッドを持つ必要があります。このメソッドはパラメータを取らず、`models.Movie` 型へのポインタのスライスとエラーを返します。

現時点ではこのインターフェースを満たす型がまだ存在していません。次に、その型を作成します。

---

`repository` フォルダ内にさらに `dbrepo` というフォルダを作成し、その中に `postgres_dbrepo.go` というファイルを作成します。

```go
package dbrepo

import (
    "database/sql"
    "time"
    "context"
    "models"
)

type PostgresDBRepo struct {
    DB *sql.DB
}

func (m *PostgresDBRepo) AllMovies() ([]*models.Movie, error) {
    const dbTimeout = 3 * time.Second

    ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
    defer cancel()

    query := `
        SELECT id, title, release_date, runtime, mpaa_rating, description,
        COALESCE(image, ''), created_at, updated_at
        FROM movies
        ORDER BY title
    `

    rows, err := m.DB.QueryContext(ctx, query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var movies []*models.Movie
    for rows.Next() {
        var movie models.Movie
        err := rows.Scan(
            &movie.ID,
            &movie.Title,
            &movie.ReleaseDate,
            &movie.Runtime,
            &movie.MPAARating,
            &movie.Description,
            &movie.Image,
            &movie.CreatedAt,
            &movie.UpdatedAt,
        )
        if err != nil {
            return nil, err
        }
        movies = append(movies, &movie)
    }

    return movies, nil
}
```

### 説明
1. **接続タイムアウト**  
    クエリの実行時間が3秒を超える場合に、接続をタイムアウトさせるように設定しています。
2. **SQLクエリ**  
    映画のデータを取得するSQLを記述しています。`COALESCE` 関数を使用して、`NULL` 値を空文字列に置き換えています。
3. **クエリ実行**  
    `QueryContext` メソッドを使用してクエリを実行し、取得した行を1つずつ処理しています。
4. **リソース解放**  
    クエリの結果である `rows` を `defer rows.Close()` で確実に閉じるようにしています。

## Setting up a database repository 2
現在、`postgres_dbrepo.go` ファイルは、`dbrepo` パッケージ内にあり、データベース接続プールを保持する型 `PostgresDBRepo` を定義しています。
この型には、受信者 (`receiver`) が `*PostgresDBRepo` 型である `AllMovies` 関数が結び付けられています。

また、`repository` パッケージ内には `DatabaseRepo` というインターフェースが定義されており、`AllMovies` 関数が必要な唯一のメソッドとして指定されています。このインターフェースを満たすために、`PostgresDBRepo` 型が使用されています。

### アプリケーションの型変更

次に、この `DatabaseRepo` を活用できるよう、アプリケーションの型を変更します。

まず、`app` 構造体内の `DB` フィールドの型を、単なるデータベース接続プール (`*sql.DB`) から `repository.DatabaseRepo` に変更します。

```go
type Application struct {
    DB repository.DatabaseRepo
}
```

これにより、`main.go` 内で以下のような修正が必要になります。以前は接続プールを直接割り当てていましたが、`DBRepo` 型のインスタンスを使用して、データベース接続をラップする必要があります。

```go
app.DB = &dbrepo.PostgresDBRepo{
    DB: con,
}
```

これで、`app.DB` は `DatabaseRepo` インターフェースを満たす `PostgresDBRepo` 型になります。

---

### 接続を閉じる処理の変更

以前は次のように直接接続を閉じていました。

```go
defer con.Close()
```

しかし、`DatabaseRepo` インターフェースを通じて操作するようになったため、代わりに以下のコードを使用します。

```go
defer app.DB.Connection().Close()
```

ただし、この時点では `DatabaseRepo` インターフェースに `Connection` メソッドが定義されていないため、これを追加します。

---

### 新しいインターフェースメソッドの追加

`repository.go` に次のようなメソッドを追加します。

```go
type DatabaseRepo interface {
    AllMovies() ([]*models.Movie, error)
    Connection() *sql.DB
}
```

これにより、`DatabaseRepo` インターフェースを満たすために、`PostgresDBRepo` 型に `Connection` メソッドを追加する必要があります。

---

### `PostgresDBRepo` に `Connection` メソッドを追加

`postgres_dbrepo.go` に以下のコードを追加します。

```go
func (m *PostgresDBRepo) Connection() *sql.DB {
    return m.DB
}
```

これで、`PostgresDBRepo` 型が `DatabaseRepo` インターフェースを完全に満たし、`app.DB.Connection().Close()` を使用できるようになります。

---

### リポジトリパターンを使用するメリット

リポジトリパターンを採用することで、以下の利点が得られます。

1. **データベース切り替えの容易さ**  
    別のデータベース（例: MongoDB）を使用する場合、`DBRepo` パッケージ内に新しい型（例: `MongoDBRepo`）を作成し、必要なメソッドを実装するだけで切り替えが可能です。
    
2. **テストの容易さ**  
    実際のデータベース接続を必要としないテスト用リポジトリ（例: `TestDBRepo`）を簡単に作成できます。
    
3. **コードの再利用性とモジュール化**  
    データベース操作のロジックを明確に分離できるため、アプリケーションの保守性が向上します。
    

---

次回は、`handlers.go` ファイルに移り、ハンドラー `AllMovies` を修正して、リポジトリからデータを取得する形に変更します。

## Improving the allMovies handler to use our database
では、`AllMovies` ハンドラーを改善していきます。
このハンドラーは現在、`cmd/api/handlers.go` ファイルに定義されています。
以下は、その改修手順です。

---

### 1. ハードコードされた映画リストの削除

`AllMovies` 関数内でハードコードされた映画リストを削除し、以下のように書き換えます。

```go
func (h *Handler) AllMovies(w http.ResponseWriter, r *http.Request) {
    // 映画のリストを取得
    movies, err := h.App.DB.AllMovies()
    if err != nil {
        // エラーが発生した場合はログを出力し、リクエストを終了
        fmt.Println(err)
        http.Error(w, "Failed to fetch movies", http.StatusInternalServerError)
        return
    }

    // 正常に取得できた場合、JSON形式でレスポンスを返す
    if err := json.NewEncoder(w).Encode(movies); err != nil {
        http.Error(w, "Failed to encode movies to JSON", http.StatusInternalServerError)
        return
    }
}
```
---
### 2. 修正内容のポイント
1. **リポジトリの利用**  
    `h.App.DB.AllMovies()` を呼び出して、映画のデータをデータベースから取得します。`AllMovies` メソッドはエラーを返す可能性があるため、エラーチェックを行います。
2. **エラー処理**  
    データベースの操作が失敗した場合、`http.Error` を使用して適切なエラーメッセージをクライアントに返します。
3. **JSONのエンコード**  
    映画のリストをJSON形式に変換してクライアントに送信します。エンコードに失敗した場合も適切なエラーを返します。
---
### 3. 動作確認
コードを保存した後、バックエンドを再起動します。

```bash
# 実行中のバックエンドを停止
Ctrl+C
# バックエンドを再起動
go run ./cmd/api
```

---

### 4. フロントエンドの確認
フロントエンドが動作していない場合は、以下のコマンドで起動します。

```bash
npm start
```

その後、ブラウザでアプリケーションを開き、「Movies」タブまたはボタンをクリックして、映画リストが表示されるか確認します。

---

### 5. 日付フォーマットの改善
リリース日が適切にフォーマットされていない場合、バックエンドでフォーマットを行う方法を後ほど実装します。例として、Goの`time`パッケージを使用してフォーマットを調整できます。

```go
releaseDate.Format("2006-01-02")
```

---
### 6. 次のステップ

現在、JSONのエンコードやエラー処理が複数箇所で重複しています。このコードの重複を解消するため、次回は以下を実装します。
1. **ヘルパー関数の作成**  
    JSONを読み書きする関数や、エラーをフォーマットして返す関数を作成します。
2. **再利用性の向上**  
    これにより、コードの可読性が向上し、メンテナンスが容易になります。

次回は、ヘルパー関数の実装を開始します！
