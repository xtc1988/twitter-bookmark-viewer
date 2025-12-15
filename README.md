# Twitter Bookmark Viewer

Twitter（X）のブックマークを整理・検索しやすくする個人向けWebサービス

## 機能

- 手動インポート機能（CSV/JSON）✅
- ブックマーク一覧表示 ✅
- 検索機能（準備中）
- カテゴリ・タグ付け機能（準備中）

**注意**: 認証なしで動作します。Twitter OAuthは不要です。

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **認証・データベース**: Supabase

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabaseプロジェクトのセットアップ

1. データベーススキーマを適用
   - SupabaseダッシュボードのSQL Editorで`database/apply_migration.sql`を実行
   - 詳細は`docs/DATABASE_MIGRATION.md`を参照

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3001](http://localhost:3001) を開いてください。

## プロジェクト構造

```
twitter-bookmark-viewer/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Reactコンポーネント
│   ├── hooks/           # カスタムフック
│   ├── lib/             # ユーティリティ・ライブラリ
│   └── types/           # TypeScript型定義
├── database/            # データベーススキーマ
└── docs/                # ドキュメント
```

## ライセンス

MIT

