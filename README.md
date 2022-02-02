# keio-meeting

## version

- macOS Catalina 
- Vue.js
- @vue/cli: v4.4.6
- Node.js: v14.9.0
- nodebrew
- npm
- この中でバージョンが同じであるべきなのは、以下の3つ
    - @vue/cli
    - Node.js

## 環境構築のために脳死してこれやってください

## Git clone

```
git clone https://github.com/eee-lin/keio-meeting.git
cd keio-meeting
```

## nodebrew のインストール（Node.js のバージョン管理のため）

```
brew install nodebrew
mkdir -p ~/.nodebrew/src
nodebrew ls-remote
```

ここで、ずら〜っと version が出てくればOK

参考: [node.jsのversionを管理するためにnodebrewを利用する](https://qiita.com/sinmetal/items/154e81823f386279b33c)

## Node.js のインストール

最新の v14.9.0 をインストールし、使いたいバージョンを use とする。

```
nodebrew install-binary v14.9.0
nodebrew use v14.9.0
node -v
```

この結果、以下のように表示されればOK

```
v14.9.0
```

Node.js をインストールすると、同時に npm もインストールされる

## パスを通す

```
echo 'export PATH=$HOME/.nodebrew/current/bin:$PATH' >> ~/<.zshrc や .bash_profile などメインのやつ>
source ~/<.zshrc や .bash_profile などメインのやつ>
npm -v
```

以下のように表示されればOK（このバージョンは違くても問題ないはず）

```
6.14.8
```

## vue/cli のインストール

```
npm install -g @vue/cli@4.4.6
```

## Firebase 周りのインストール

```
npm install --save buefy buefy/dist/buefy.min.css firebase firebase/auth firebase/firestore firebase/storage vuex
```

## 起動

``` 
npm run serve
```

ここでできない場合は

```
npm install
```

とやってみる。これはおそくらく `./node_modules`がインストールされていないことに起因しており、これをすると大丈夫っぽい。

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
