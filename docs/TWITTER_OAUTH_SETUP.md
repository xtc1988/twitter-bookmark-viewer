# Twitter OAuth設定手順書

## 概要

このドキュメントでは、Twitter OAuth認証をSupabaseとNext.jsアプリケーションに設定する手順を詳しく説明します。

## 必要な情報

### 現在のプロジェクト情報
- **SupabaseプロジェクトID**: `azlcuxgourruwoxptwbr`
- **Supabase URL**: `https://azlcuxgourruwoxptwbr.supabase.co`
- **開発環境URL**: `http://localhost:3001`
- **コールバックURL**: `http://localhost:3001/auth/callback`

---

## ステップ1: Twitter Developer Portalでアプリを作成

### 1.1 Twitter Developer Portalにアクセス

**URL**: https://developer.twitter.com/en/portal/dashboard

1. Twitterアカウントでログイン
2. 右上の「Developer Portal」をクリック
3. まだ開発者アカウントでない場合は、申請が必要です

### 1.2 プロジェクトとアプリを作成

1. **「+ Create Project」**をクリック
2. プロジェクト名を入力（例: `Twitter Bookmark Viewer`）
3. 使用目的を選択（例: `Making a bot` または `Exploring the API`）
4. プロジェクトの説明を入力
5. **「Next」**をクリック

### 1.3 アプリを作成

1. **「Create App」**をクリック
2. アプリ名を入力（例: `twitter-bookmark-viewer`）
   - 注意: アプリ名は一意である必要があります
3. **「Complete」**をクリック

### 1.4 OAuth 2.0設定を有効化

1. 作成したアプリの詳細ページに移動
2. 左側のメニューから **「Settings」** → **「User authentication settings」**をクリック
3. **「Set up」**ボタンをクリック
4. 以下の設定を行う：

   **App permissions:**
   - ✅ **Read** を選択（ブックマークを読み取るため）

   **Type of App:**
   - ✅ **Web App, Automated App or Bot** を選択

   **App info:**
   - **App name**: アプリ名（既に入力済み）
   - **Website URL**: 
     - 開発環境: `http://localhost:3001`
     - 本番環境: デプロイ後のURL（例: `https://your-app.vercel.app`）
   - **Callback URI / Redirect URL**: 
     - 開発環境: `http://localhost:3001/auth/callback`
     - 本番環境: `https://your-app.vercel.app/auth/callback`
     - **重要**: 複数のURLを追加する場合は、1行に1つずつ入力

   **Additional settings:**
   - ✅ **Request email from users** をチェック（オプション）

5. **「Save」**をクリック

### 1.5 API Keys and Tokensを取得

1. 左側のメニューから **「Keys and tokens」**をクリック
2. 以下の情報をコピーして安全に保管：

   **OAuth 2.0 Client ID and Client Secret:**
   - **Client ID**: `xxxxxxxxxxxxxxxxxxxxxxxxx`（長い文字列）
   - **Client Secret**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`（長い文字列）
   - ⚠️ **重要**: Client Secretは一度しか表示されません。必ずコピーして保存してください

---

## ステップ2: SupabaseでTwitter OAuthを設定

### 2.1 Supabaseダッシュボードにアクセス

**URL**: https://supabase.com/dashboard

1. ログイン
2. プロジェクト `twitter-bookmark-viewer` を選択

### 2.2 Authentication設定に移動

1. 左側のメニューから **「Authentication」**をクリック
2. **「Providers」**タブをクリック

### 2.3 Twitterプロバイダーを有効化

1. プロバイダー一覧から **「Twitter」**を探す
2. **「Twitter」**の行で、トグルスイッチを**ON**にする
3. 以下の情報を入力：

   **Twitter Client ID (API Key):**
   - Twitter Developer Portalで取得した **Client ID** を貼り付け

   **Twitter Client Secret (API Secret Key):**
   - Twitter Developer Portalで取得した **Client Secret** を貼り付け

4. **「Save」**をクリック

### 2.4 Redirect URLsを確認

Supabaseは自動的に以下のURLを設定します：
- `https://azlcuxgourruwoxptwbr.supabase.co/auth/v1/callback`

このURLをTwitter Developer PortalのCallback URIに追加する必要は**ありません**。
Supabaseが自動的に処理します。

---

## ステップ3: アプリケーションコードの確認

### 3.1 現在の実装状況

以下のファイルが既に実装済みです：

**認証フック** (`src/hooks/useAuth.ts`):
```typescript
const signInWithTwitter = async () => {
  const redirectUrl = `${window.location.origin}/auth/callback`
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
    options: {
      redirectTo: redirectUrl,
    },
  })
  // ...
}
```

**コールバック処理** (`src/app/auth/callback/route.ts`):
- OAuth認証後のコールバックを処理
- セッションを確立してダッシュボードにリダイレクト

### 3.2 環境変数の確認

`.env.local`ファイルに以下が設定されていることを確認：
```env
NEXT_PUBLIC_SUPABASE_URL=https://azlcuxgourruwoxptwbr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**注意**: Twitter OAuthのClient IDとClient Secretは、Supabaseダッシュボードで設定するため、`.env.local`には追加する必要はありません。

---

## ステップ4: 動作確認

### 4.1 開発サーバーを起動

```bash
cd twitter-bookmark-viewer
npm run dev
```

### 4.2 ブラウザでアクセス

1. **http://localhost:3001** にアクセス
2. **「Twitterでログイン」**ボタンをクリック
3. Twitterの認証画面が表示される
4. アプリの認可を許可
5. ダッシュボードにリダイレクトされる

### 4.3 エラーが発生した場合

**よくあるエラーと対処法:**

1. **"Invalid redirect_uri"**
   - Twitter Developer PortalのCallback URIを確認
   - `http://localhost:3001/auth/callback` が正しく設定されているか確認

2. **"Client authentication failed"**
   - SupabaseのTwitter設定でClient IDとClient Secretが正しいか確認
   - Twitter Developer Portalで再生成した場合は、Supabaseでも更新が必要

3. **"OAuth provider not enabled"**
   - SupabaseダッシュボードでTwitterプロバイダーが有効になっているか確認

---

## ステップ5: 本番環境へのデプロイ

### 5.1 本番環境のURLを設定

**Twitter Developer Portal:**
1. アプリの設定ページに移動
2. **「Callback URI / Redirect URL」**に本番環境のURLを追加：
   - 例: `https://your-app.vercel.app/auth/callback`

**Supabase:**
1. ダッシュボードの **「Authentication」** → **「URL Configuration」**に移動
2. **「Site URL」**を本番環境のURLに設定：
   - 例: `https://your-app.vercel.app`
3. **「Redirect URLs」**に本番環境のコールバックURLを追加：
   - 例: `https://your-app.vercel.app/auth/callback`

### 5.2 環境変数の設定

Vercelなどのホスティングサービスで、以下の環境変数を設定：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 参考リンク

### Twitter Developer Portal
- **ダッシュボード**: https://developer.twitter.com/en/portal/dashboard
- **ドキュメント**: https://developer.twitter.com/en/docs/authentication/oauth-2-0
- **アプリ設定**: https://developer.twitter.com/en/portal/projects-and-apps

### Supabase
- **ダッシュボード**: https://supabase.com/dashboard
- **認証ドキュメント**: https://supabase.com/docs/guides/auth
- **Twitter OAuth設定**: https://supabase.com/docs/guides/auth/social-login/auth-twitter

### 現在のプロジェクト
- **Supabaseプロジェクト**: https://supabase.com/dashboard/project/azlcuxgourruwoxptwbr
- **開発環境**: http://localhost:3001

---

## トラブルシューティング

### Q: Twitter Developer Portalでアプリが作成できない
A: 開発者アカウントの申請が必要な場合があります。申請には数日かかる場合があります。

### Q: Callback URIのエラーが出る
A: Twitter Developer PortalとSupabaseの両方で、正確なURLが設定されているか確認してください。

### Q: 認証後、ダッシュボードにリダイレクトされない
A: `src/app/auth/callback/route.ts`のリダイレクトURLを確認してください。

### Q: ユーザー情報が取得できない
A: Twitter Developer Portalで「Request email from users」を有効にしているか確認してください。

---

## セキュリティに関する注意事項

1. **Client Secretの管理**
   - Client Secretは絶対に公開リポジトリにコミットしないでください
   - Supabaseダッシュボードでのみ管理してください

2. **Callback URIの検証**
   - 本番環境では、Callback URIを厳密に設定してください
   - ワイルドカードは使用しないでください

3. **HTTPSの使用**
   - 本番環境では必ずHTTPSを使用してください
   - 開発環境（localhost）のみHTTPが許可されています

---

## 完了後の確認事項

- [ ] Twitter Developer Portalでアプリを作成
- [ ] OAuth 2.0設定を有効化
- [ ] Client IDとClient Secretを取得
- [ ] SupabaseでTwitterプロバイダーを有効化
- [ ] Client IDとClient SecretをSupabaseに設定
- [ ] 開発環境でログインをテスト
- [ ] 本番環境のURLを設定（デプロイ時）

---

この手順に従って設定すれば、Twitter OAuth認証が動作するようになります。

