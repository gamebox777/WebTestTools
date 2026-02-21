# 開発者向けガイド (Developer Guide)

このドキュメントは、「Test Tools Portal」の環境構築・開発・デプロイに関する情報をまとめたものです。
利用者（ユーザー）向けの機能説明等は `README.md` をご参照ください。

## 1. テクノロジースタック
- **フレームワーク**: Next.js (App Router, v14系)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS + shadcn/ui
- **バイナリ生成ライブラリ** (画像・PDF・Excel等用): `canvas`, `pdf-lib`, `exceljs`, `jszip`
- **ホスティング**: Vercel

## 2. ローカル環境の構築

プロジェクトのクローン後、以下の手順でローカルサーバーを起動します。

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動 (デフォルト: http://localhost:3000)
npm run dev
```

変更を保存すると、ホットリロードによりブラウザ上の表示が自動更新されます。

## 3. プロジェクト構造

```text
src/
├── app/
│   ├── page.tsx               # ポータルのトップ画面（スタートメニュー）
│   ├── layout.tsx             # グローバルレイアウト
│   ├── globals.css            # Tailwind & shadcn のグローバルスタイル設定
│   ├── api/generate/route.ts  # 【バックエンド】画像/PDF/Excel等を生成しZIPで返すAPI API Routes
│   └── tools/                 # 各種テストツールのフロントエンド画面群
│       └── image-generator/   # 画像生成ツールのUI画面
└── components/
    └── ui/                    # shadcn/ui で生成された共通UIコンポーネント (Button, Card, Input 등)
```

## 4. UIコンポーネントの追加 (shadcn/ui)

当プロジェクトでは、UIライブラリとして `shadcn/ui` を採用しています。
新しいコンポーネントを使用したい場合は、CLIから追加してください。

```bash
npx shadcn@latest add [コンポーネント名]
# 例: npx shadcn@latest add dialog
```

## 5. デプロイについて

このプロジェクトは、**Vercel** へのデプロイを前提として構成されています。
(データベース等を使用していないため、環境変数を設定しなくても動作します。)

1. GitHub リポジトリ等の Vercel のダッシュボードに連携・インポートします。
2. Build Command 等は Next.js のデフォルト設定 (`npm run build`) で動作します。
3. `main` ブランチにプッシュするたびに自動でデプロイが行われます。

## 6. Python版画像生成ツールからの移行について
初期の画像生成機能はPythonのデスクトップGUIスクリプト `sample/image_generator.py` によって提供されていましたが、本プロジェクト内においてNext.jsのAPI (`route.ts`) へと移植されました。
VercelのServerless Functions環境で動作するよう、`canvas` や `pdf-lib` などの Node.js ライブラリで代替実装されています。
