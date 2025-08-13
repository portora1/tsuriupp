現在作成中

釣果一覧アプリ(React + TypeScript + Vite)
React,TypeScript,Viteを使用して作成した釣果を保存・投稿できるアプリです。
コードを書くためにAIに聞きながら作成して、dockerを使用して最後はデプロイして友人が使える状態までを目指してます。

今回気をつける内容として、
１、作業内容のコミット　２、作成時間　３、エラー内容の理解　４、コメント機能を利用する　５、可読性の向上　６、責務をファイルで分ける
をやっていきたいです

取り入れたい機能
・docker
・デプロイ

主な機能
・

セットアップと実行方法
このAPPを動かすにはいくつくかの APIキーの設定が必要です。
1. プロジェクトのクローンと依存関係のインストール
```bash
git clone https://github/com/portora1/weather-app.git
cd weather-app
yarn install
or
npm install
```
2. APIキーの準備
以下の二つのAPIサービスから、無料でAPIキーを取得してください。


3. 環境変数の設定

```bash

```
この.env.localファイルはGitの管理対象から除外されてるので、キーをGitHubにアップロードしないでください。

4. 開発サーバー起動
```bash
yarn dev
or
npm run dev
```
ブラウザでhttp://localhost:5173 にアクセスしてください。
使用技術
React
TypeScript
Vite
