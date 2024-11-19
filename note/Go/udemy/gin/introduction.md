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

では、この`routes`関数をどう使うかについて説明します。**main.go**に戻り、`nil`を渡していた箇所に`app.routes()`を渡します。この関数は`http.Handler`を返すので、これで問題ありません。

これにより、`http.HandleFunc`の行は不要になります。その代わり、`app.routes()`で必要なルートをすべて設定し、次回の講義でそれを進めていきます。