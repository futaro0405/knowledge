# Compornets
Reactアプリケーションは __コンポーネント__ と呼ばれる独立したUIのパーツで構成されている。
Reactコンポーネントとは、マークアップを添えることができるJavaScript関数。

```javascript:App.js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```
