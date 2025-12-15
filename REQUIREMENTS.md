# Twitterブックマークビューアー 要件定義書

## 1. プロジェクト概要

### 1.1 目的
Twitter（X）のブックマークを整理・検索しやすくする個人向けWebサービス

### 1.2 対象ユーザー
- 自分自身（個人利用）
- Twitterアカウントを持ち、ブックマーク機能を頻繁に使用するユーザー

## 2. 機能要件

### 2.1 認証機能
- **OAuth認証**
  - Twitter/Xアカウントでのログイン
  - セッション管理
  - ログアウト機能

### 2.2 ブックマーク取得方法
**重要**: X API v2が使えないため、以下の代替手段を検討：

#### オプションA: ブラウザ拡張機能方式（推奨）
- ブラウザ拡張機能（Chrome/Edge/Firefox）でTwitter Webからブックマークを取得
- 拡張機能が取得したデータをWebサービスに送信
- リアルタイム同期が可能

#### オプションB: 手動インポート方式
- ユーザーがTwitterからエクスポートしたデータ（CSV/JSON）をアップロード
- 定期的な手動更新が必要

#### オプションC: スクレイピング方式（非推奨）
- Twitter Webをスクレイピング（利用規約違反の可能性が高いため非推奨）

**推奨実装**: オプションA（ブラウザ拡張機能）+ オプションB（手動インポート）の併用

### 2.3 コア機能

#### 2.3.1 ブックマーク一覧表示
- タイムライン形式での表示
- カード形式での表示
- リスト形式での表示（切り替え可能）
- ページネーションまたは無限スクロール
- 各ツイートの基本情報表示：
  - 投稿者名・ユーザー名
  - 投稿日時
  - ツイート本文
  - 画像・動画（あれば）
  - リツイート数・いいね数（取得可能な場合）

#### 2.3.2 検索機能
- 全文検索（ツイート本文）
- 投稿者名・ユーザー名での検索
- 日付範囲での検索
- 複合検索（AND/OR条件）
- 検索履歴の保存

#### 2.3.3 カテゴリ・タグ機能
- カテゴリの作成・編集・削除
- ツイートへのカテゴリ割り当て
- タグの作成・編集・削除
- ツイートへの複数タグ付け
- カテゴリ・タグでのフィルタリング
- カテゴリ・タグの色分け表示

### 2.4 データ管理
- データベースへの永続化
- ユーザーごとのデータ分離
- データのバックアップ・エクスポート機能
- データのインポート機能

## 3. 非機能要件

### 3.1 パフォーマンス
- 初期表示: 3秒以内
- 検索結果表示: 2秒以内
- スムーズなスクロール体験

### 3.2 セキュリティ
- OAuth認証による安全なログイン
- ユーザーデータの暗号化（必要に応じて）
- HTTPS通信の強制

### 3.3 ユーザビリティ
- レスポンシブデザイン（モバイル対応必須）
- 直感的なUI/UX
- ダークモード対応（推奨）
- アクセシビリティ対応

### 3.4 互換性
- モダンブラウザ対応（Chrome, Firefox, Safari, Edge）
- モバイルブラウザ対応（iOS Safari, Chrome Mobile）

## 4. 技術スタック

### 4.1 フロントエンド
- **フレームワーク**: Next.js 14+ (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: Redux Toolkit または Zustand（必要に応じて）
- **UIコンポーネント**: カスタムコンポーネント + Lucide React（アイコン）

### 4.2 バックエンド
- **フレームワーク**: Next.js API Routes
- **認証**: Supabase Auth（Twitter OAuth対応）
- **データベース**: Supabase PostgreSQL
- **ORM/クエリビルダー**: Supabase Client

### 4.3 ブラウザ拡張機能（オプションA採用時）
- **フレームワーク**: Manifest V3対応
- **言語**: TypeScript
- **通信**: Chrome Extension Messaging API

### 4.4 デプロイ
- **フロントエンド/バックエンド**: Vercel
- **データベース**: Supabase（ホスティング）

## 5. データベース設計（案）

### 5.1 テーブル構成

#### users
- id (UUID, PK)
- twitter_user_id (String, Unique)
- twitter_username (String)
- twitter_display_name (String)
- created_at (Timestamp)
- updated_at (Timestamp)

#### bookmarks
- id (UUID, PK)
- user_id (UUID, FK → users.id)
- tweet_id (String, Unique)
- tweet_text (Text)
- tweet_url (String)
- author_username (String)
- author_display_name (String)
- author_profile_image_url (String, nullable)
- media_urls (JSON, nullable) - 画像・動画URLの配列
- retweet_count (Integer, nullable)
- like_count (Integer, nullable)
- bookmarked_at (Timestamp) - Twitterでブックマークした日時
- imported_at (Timestamp) - システムに取り込んだ日時
- created_at (Timestamp)
- updated_at (Timestamp)

#### categories
- id (UUID, PK)
- user_id (UUID, FK → users.id)
- name (String)
- color (String) - カラーコード
- created_at (Timestamp)
- updated_at (Timestamp)

#### bookmark_categories
- bookmark_id (UUID, FK → bookmarks.id)
- category_id (UUID, FK → categories.id)
- PRIMARY KEY (bookmark_id, category_id)

#### tags
- id (UUID, PK)
- user_id (UUID, FK → users.id)
- name (String)
- created_at (Timestamp)

#### bookmark_tags
- bookmark_id (UUID, FK → bookmarks.id)
- tag_id (UUID, FK → tags.id)
- PRIMARY KEY (bookmark_id, tag_id)

#### search_history
- id (UUID, PK)
- user_id (UUID, FK → users.id)
- query (String)
- filters (JSON) - 検索条件の詳細
- created_at (Timestamp)

## 6. API設計（案）

### 6.1 認証API
- `POST /api/auth/twitter` - Twitter OAuth認証開始
- `GET /api/auth/callback` - OAuthコールバック処理
- `POST /api/auth/logout` - ログアウト

### 6.2 ブックマークAPI
- `GET /api/bookmarks` - ブックマーク一覧取得（ページネーション対応）
- `GET /api/bookmarks/:id` - ブックマーク詳細取得
- `POST /api/bookmarks` - ブックマーク追加（拡張機能/インポート用）
- `PUT /api/bookmarks/:id` - ブックマーク更新
- `DELETE /api/bookmarks/:id` - ブックマーク削除
- `POST /api/bookmarks/import` - 一括インポート

### 6.3 検索API
- `GET /api/search` - ブックマーク検索
- `GET /api/search/history` - 検索履歴取得

### 6.4 カテゴリAPI
- `GET /api/categories` - カテゴリ一覧取得
- `POST /api/categories` - カテゴリ作成
- `PUT /api/categories/:id` - カテゴリ更新
- `DELETE /api/categories/:id` - カテゴリ削除
- `POST /api/bookmarks/:id/categories` - ブックマークにカテゴリ追加
- `DELETE /api/bookmarks/:id/categories/:categoryId` - ブックマークからカテゴリ削除

### 6.5 タグAPI
- `GET /api/tags` - タグ一覧取得
- `POST /api/tags` - タグ作成
- `DELETE /api/tags/:id` - タグ削除
- `POST /api/bookmarks/:id/tags` - ブックマークにタグ追加
- `DELETE /api/bookmarks/:id/tags/:tagId` - ブックマークからタグ削除

## 7. UI/UX設計（案）

### 7.1 ページ構成
1. **ログインページ** (`/`)
   - Twitter OAuthログインボタン
   - サービス説明

2. **ダッシュボード** (`/dashboard`)
   - ブックマーク一覧
   - 検索バー
   - フィルタ（カテゴリ・タグ・日付）
   - 表示形式切り替え（タイムライン/カード/リスト）

3. **ブックマーク詳細** (`/bookmarks/:id`)
   - ツイート詳細表示
   - カテゴリ・タグ編集
   - 元のツイートへのリンク

4. **カテゴリ管理** (`/categories`)
   - カテゴリ一覧
   - カテゴリ作成・編集・削除

5. **設定** (`/settings`)
   - アカウント設定
   - データエクスポート/インポート
   - ブラウザ拡張機能の設定（オプションA採用時）

### 7.2 モバイル対応
- レスポンシブデザイン
- タッチ操作最適化
- モバイル向けナビゲーション（ハンバーガーメニュー）

## 8. 実装フェーズ

### Phase 1: 基盤構築
- [ ] Next.jsプロジェクトセットアップ
- [ ] Supabaseプロジェクト作成・設定
- [ ] データベーススキーマ作成
- [ ] OAuth認証実装
- [ ] 基本的なUIコンポーネント作成

### Phase 2: コア機能実装
- [ ] ブックマーク一覧表示
- [ ] 検索機能
- [ ] カテゴリ機能
- [ ] タグ機能

### Phase 3: データ取得方法実装
- [ ] 手動インポート機能（CSV/JSON）
- [ ] ブラウザ拡張機能開発（オプションA採用時）

### Phase 4: UI/UX改善
- [ ] レスポンシブデザイン実装
- [ ] ダークモード対応
- [ ] パフォーマンス最適化

### Phase 5: テスト・デプロイ
- [ ] 単体テスト
- [ ] E2Eテスト
- [ ] デプロイ
- [ ] 動作確認

## 9. 課題・検討事項

### 9.1 X API v2が使えない場合の代替手段
- **ブラウザ拡張機能**: 開発コストが高いが、リアルタイム同期が可能
- **手動インポート**: 実装が簡単だが、更新が手動になる
- **推奨**: まず手動インポートで実装し、後で拡張機能を追加

### 9.2 Twitterの利用規約
- スクレイピングは利用規約違反の可能性が高いため避ける
- ブラウザ拡張機能も利用規約を確認する必要がある
- 手動インポートが最も安全

### 9.3 データの更新頻度
- 手動インポートの場合、ユーザーが定期的に更新する必要がある
- 拡張機能の場合、リアルタイムまたは定期的な自動同期が可能

### 9.4 ストレージコスト
- 画像・動画の保存方法を検討（URLのみ保存 vs ダウンロード保存）
- 初期実装ではURLのみ保存を推奨

## 10. 次のステップ

1. **実装方針の決定**
   - データ取得方法の最終決定（拡張機能 vs 手動インポート）
   - まずは手動インポートでMVPを構築することを推奨

2. **プロジェクトセットアップ**
   - Next.jsプロジェクト作成
   - Supabaseプロジェクト作成
   - 環境変数設定

3. **データベース設計の確定**
   - 上記の設計案をレビュー・調整
   - マイグレーションスクリプト作成

4. **開発開始**
   - Phase 1から順次実装

