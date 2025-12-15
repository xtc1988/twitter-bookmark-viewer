# Twitterブックマークビューアー 作業ログ

## 2024年 - 要件定義フェーズ

### 要件定義書の作成
- `REQUIREMENTS.md`を作成し、プロジェクトの要件定義を記載
- X API v2が使えない制約を考慮し、代替手段（ブラウザ拡張機能、手動インポート）を検討
- 技術スタック（Next.js + Supabase）を決定
- データベース設計案、API設計案、UI/UX設計案を記載
- 実装フェーズを5段階に分割して計画

## 2024年 - Phase 1: 基盤構築

### Next.jsプロジェクトのセットアップ
- `package.json`を作成し、Next.js 14、TypeScript、Tailwind CSS、Supabase関連の依存関係を追加
- `tsconfig.json`を作成し、TypeScriptの設定とパスエイリアス（@/*）を設定
- `tailwind.config.js`を作成し、Tailwind CSSの設定とカスタムカラーパレットを定義
- `postcss.config.js`を作成し、PostCSSの設定を追加
- `next.config.js`を作成し、Twitter画像ドメインの許可と環境変数の設定を追加
- `.gitignore`を作成し、Git管理から除外するファイルを定義
- `README.md`を作成し、プロジェクトの概要とセットアップ手順を記載

### Supabaseクライアント設定とプロバイダーの実装
- `src/lib/supabase/client.ts`を作成し、Supabaseクライアントの初期化処理を実装
- `src/lib/supabase/types.ts`を作成し、データベースの型定義を実装
- `src/lib/supabase/provider.tsx`を作成し、SupabaseプロバイダーコンポーネントとuseSupabaseフックを実装
- `src/app/providers.tsx`を作成し、アプリケーション全体でSupabaseプロバイダーを使用できるように設定

### データベーススキーマの作成
- `database/schema.sql`を作成し、以下のテーブルとRLSポリシーを実装：
  - usersテーブル（Twitterユーザー情報を保存）
  - bookmarksテーブル（ブックマーク情報を保存）
  - categoriesテーブル（カテゴリ情報を保存）
  - bookmark_categoriesテーブル（ブックマークとカテゴリの関連付け）
  - tagsテーブル（タグ情報を保存）
  - bookmark_tagsテーブル（ブックマークとタグの関連付け）
  - search_historyテーブル（検索履歴を保存）
  - 各テーブルにRLS（Row Level Security）ポリシーを設定し、ユーザーごとのデータ分離を実現
  - パフォーマンス向上のためのインデックスを追加
  - updated_atカラムの自動更新トリガーを実装

### OAuth認証機能の実装
- `src/hooks/useAuth.ts`を作成し、Twitter OAuth認証のsignInWithTwitter関数とsignOut関数を実装
- `src/app/auth/callback/route.ts`を作成し、OAuthコールバック処理を実装
- `src/app/page.tsx`を作成し、ログインページを実装（未ログイン時はログインページ、ログイン済みはダッシュボードへリダイレクト）

### 基本的なレイアウトコンポーネントの作成
- `src/components/Navigation/NavBar.tsx`を作成し、ナビゲーションバーコンポーネントを実装（デスクトップ・モバイル対応）
- `src/components/Layout/DashboardLayout.tsx`を作成し、ダッシュボード用のレイアウトコンポーネントを実装（認証チェック機能付き）
- `src/app/layout.tsx`を作成し、アプリケーション全体のレイアウトとメタデータを設定
- `src/app/globals.css`を作成し、Tailwind CSSのベーススタイルとカスタムコンポーネントクラスを定義

### ダッシュボードページの実装
- `src/app/dashboard/page.tsx`を作成し、ダッシュボードページを実装（インポートとブックマーク一覧へのリンクを表示）

## 2024年 - Phase 2: コア機能実装

### 手動インポート機能の実装
- `src/app/import/page.tsx`を作成し、CSV/JSONファイルのアップロードUIを実装
  - ドラッグ&ドロップ対応のファイル選択UI
  - ファイル形式の検証とパース処理（JSON/CSV）
  - インポート結果の表示（成功/失敗、エラーメッセージ）
- `src/app/api/bookmarks/import/route.ts`を作成し、ブックマークインポートAPIを実装
  - 認証チェック（Supabase認証）
  - ユーザープロファイルの自動作成
  - ブックマークデータの正規化処理（複数のJSON形式に対応）
  - バッチインポート処理（エラーハンドリング付き）
  - 重複チェック（tweet_idのユニーク制約）

### ブックマーク一覧表示機能の実装
- `src/app/bookmarks/page.tsx`を作成し、ブックマーク一覧ページを実装
  - ページネーション対応（無限スクロール風の「もっと見る」ボタン）
  - ブックマークカードの表示（投稿者情報、ツイート本文、日時、元ツイートへのリンク）
  - 日付フォーマット（date-fnsを使用）
  - 空状態の表示（ブックマークがない場合のメッセージとインポートへのリンク）
- `src/app/api/bookmarks/route.ts`を作成し、ブックマーク取得APIを実装
  - 認証チェック
  - ページネーション処理（offset/limit）
  - ブックマークのソート（bookmarked_atの降順）
  - hasMoreフラグの計算

### その他のページのスタブ作成
- `src/app/search/page.tsx`を作成し、検索ページのスタブを実装（今後実装予定）
- `src/app/categories/page.tsx`を作成し、カテゴリページのスタブを実装（今後実装予定）
- `src/app/settings/page.tsx`を作成し、設定ページのスタブを実装（今後実装予定）
- `next-env.d.ts`を作成し、Next.jsの型定義ファイルを追加

## 2024年 - Supabaseプロジェクトセットアップ

### Supabaseプロジェクトの作成と設定
- Supabase MCPツールを使用して、ブラウザ操作なしでプロジェクトを作成
  - プロジェクト名: `twitter-bookmark-viewer`
  - プロジェクトID: `azlcuxgourruwoxptwbr`
  - リージョン: `ap-northeast-1` (東京)
  - ステータス: `ACTIVE_HEALTHY`
  - コスト: $0/月（無料プラン）
- データベーススキーマの適用
  - `mcp_supabase_apply_migration`を使用して`initial_schema`マイグレーションを適用
  - 全テーブル、インデックス、RLSポリシー、トリガーが正常に作成されたことを確認
- 環境変数の設定
  - `.env.local`ファイルを作成し、以下の環境変数を設定：
    - `NEXT_PUBLIC_SUPABASE_URL`: https://azlcuxgourruwoxptwbr.supabase.co
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: （anon keyを設定）
- 依存関係のインストール
  - `npm install`を実行し、全依存関係をインストール完了
- 開発サーバーのポート設定
  - `package.json`のdevスクリプトを更新し、デフォルトでポート3001を使用するように設定（ポート3000は別アプリで使用中）
- ビルドエラーの修正
  - `/api/bookmarks/route.ts`、`/api/bookmarks/import/route.ts`、`/auth/callback/route.ts`に`export const dynamic = 'force-dynamic'`を追加し、Dynamic Server Errorを解消
  - `src/app/layout.tsx`で`viewport`を`metadata`から分離し、別の`viewport` exportとして定義（Next.js 14の要件に対応）
  - `src/lib/supabase/client.ts`で環境変数のチェックを遅延実行に変更し、モジュール読み込み時のエラーを回避
  - `supabaseClient`を関数に変更し、遅延初期化を実装
- 開発サーバーの起動確認
  - 開発サーバーが正常に起動し、http://localhost:3001で接続可能であることを確認
- Twitter OAuth設定手順書の作成
  - `docs/TWITTER_OAUTH_SETUP.md`を作成し、Twitter OAuth認証の設定手順を詳細に記載
  - Twitter Developer Portalでのアプリ作成手順、Supabaseでの設定手順、トラブルシューティングを含む完全なガイドを作成
- 認証なし実装への変更
  - 手動インポート方式を使用するため、Twitter OAuth認証を削除
  - データベーススキーマから`user_id`を削除（`database/schema_no_auth.sql`を作成）
  - APIルート（`/api/bookmarks/route.ts`、`/api/bookmarks/import/route.ts`）から認証チェックを削除
  - フロントエンドから認証関連コードを削除：
    - `src/app/page.tsx`: ログインページを削除し、直接ダッシュボードにリダイレクト
    - `src/app/dashboard/page.tsx`: ユーザー情報表示を削除
    - `src/app/import/page.tsx`: 認証チェックを削除
    - `src/app/bookmarks/page.tsx`: 認証チェックを削除
    - `src/components/Layout/DashboardLayout.tsx`: 認証チェックを削除
    - `src/components/Navigation/NavBar.tsx`: ログアウトボタンとユーザー情報表示を削除
  - 型定義（`src/lib/supabase/types.ts`）から`user_id`を削除
  - データベースマイグレーション手順書（`docs/DATABASE_MIGRATION.md`）を作成
- MCP接続の確立
  - Cursorの設定ファイル（`C:\Users\xtc19\AppData\Roaming\Cursor\User\settings.json`）にSupabase MCPサーバーの設定を追加
  - Supabaseアクセストークンを設定し、MCP接続を確認
  - データベーススキーマが完全に適用されていることを確認（全テーブル、インデックス、トリガーが正常に作成）
- Chrome拡張機能の作成
  - `twitter-bookmark-viewer-extension`フォルダを作成し、TwitterブックマークをインポートするChrome拡張機能を実装
  - `manifest.json`: Manifest V3形式で拡張機能の設定を定義（permissions, content_scripts, action等）
  - `popup.html/popup.css/popup.js`: 拡張機能のポップアップUIを実装（API URL設定、抽出・インポートボタン、進捗表示、結果表示）
  - `content.js`: Twitterブックマークページからツイートデータを抽出するコンテンツスクリプトを実装（ツイートID、テキスト、作者情報、エンゲージメント数等を取得）
  - `background.js`: サービスワーカーを実装（必要に応じて使用）
  - `README.md`: 拡張機能のセットアップ手順、使用方法、トラブルシューティングを記載
  - 拡張機能はTwitterのブックマークページ（https://twitter.com/i/bookmarks）で動作し、抽出したデータをTwitter Bookmark ViewerのAPIエンドポイント（`/api/bookmarks/import`）に送信
  - 自動スクロール機能を追加し、すべてのブックマークを自動で読み込んで抽出できるように改善
  - ブックマーク表示ページに画像表示機能を追加（media_urlsを表示、最大4枚までグリッド表示、クリックで拡大表示）
  - インポート処理を改善：バッチ処理の最適化、重複チェックの事前実行、エラーハンドリングの強化、スキップ数の表示
  - エンゲージメント数（リツイート数、いいね数）の表示機能を追加

