# Twitter Developer Portal 申請用テキスト

## Use Case Description（用途説明）

### 英語版（推奨）

```
Personal Bookmark Management Tool

I am developing a personal web application to help me organize and search through my Twitter bookmarks more efficiently. This is a private, non-commercial tool for personal use only.

Use Cases:
1. OAuth 2.0 Authentication: I will use Twitter OAuth 2.0 to authenticate users and securely access their Twitter account information. This allows users to log in to my application using their Twitter credentials.

2. Bookmark Data Access: Users will manually import their Twitter bookmarks (exported as CSV/JSON files) into the application. The application will store and organize this data locally for better searchability and categorization.

3. Data Organization: The application will help users categorize, tag, and search through their bookmarks using custom categories and tags, making it easier to find specific bookmarks later.

4. Read-Only Access: The application will only request read permissions. It will not post tweets, modify user data, or perform any write operations on Twitter.

This application is for personal use only and will not be distributed commercially. All data is stored locally and is only accessible to the authenticated user.
```

### 日本語版（参考）

```
個人用ブックマーク管理ツール

Twitterのブックマークをより効率的に整理・検索するための個人向けWebアプリケーションを開発しています。これは私的な、非商用の個人利用のみを目的としたツールです。

用途：
1. OAuth 2.0認証：Twitter OAuth 2.0を使用してユーザーを認証し、Twitterアカウント情報に安全にアクセスします。これにより、ユーザーはTwitterの認証情報を使用してアプリケーションにログインできます。

2. ブックマークデータへのアクセス：ユーザーはTwitterからエクスポートしたブックマーク（CSV/JSONファイル）を手動でアプリケーションにインポートします。アプリケーションはこのデータをローカルに保存し、より検索しやすく、カテゴリ化しやすく整理します。

3. データの整理：アプリケーションは、カスタムカテゴリとタグを使用してブックマークを分類、タグ付け、検索できるようにし、後で特定のブックマークを見つけやすくします。

4. 読み取り専用アクセス：アプリケーションは読み取り権限のみを要求します。ツイートの投稿、ユーザーデータの変更、Twitterへの書き込み操作は一切行いません。

このアプリケーションは個人利用のみを目的としており、商用には配布されません。すべてのデータはローカルに保存され、認証されたユーザーのみがアクセスできます。
```

---

## App Name（アプリ名）

```
twitter-bookmark-viewer
```

または

```
Twitter Bookmark Viewer
```

---

## App Description（アプリ説明）

### 英語版

```
A personal web application for organizing and searching Twitter bookmarks. Users can import their bookmarks, categorize them, add tags, and search through them efficiently. This is a private tool for personal use only.
```

### 日本語版

```
Twitterのブックマークを整理・検索するための個人向けWebアプリケーション。ユーザーはブックマークをインポートし、カテゴリ化、タグ付け、効率的な検索ができます。個人利用のみのプライベートツールです。
```

---

## Website URL（ウェブサイトURL）

### 開発環境
```
http://localhost:3001
```

### 本番環境（デプロイ後）
```
https://your-app.vercel.app
```
（実際のデプロイ先URLに置き換えてください）

---

## Callback URI / Redirect URL（コールバックURI）

### 開発環境
```
http://localhost:3001/auth/callback
```

### 本番環境（デプロイ後）
```
https://your-app.vercel.app/auth/callback
```

---

## App Permissions（アプリ権限）

- ✅ **Read** （読み取りのみ）
- ❌ Write（書き込み不要）
- ❌ Read and Write（読み書き不要）

**理由**: ブックマークの読み取りのみが必要で、ツイートの投稿やデータの変更は行いません。

---

## その他の注意事項

### 申請時のポイント

1. **個人利用であることを明確に**
   - "Personal use only"
   - "Non-commercial"
   - "Private tool"

2. **読み取り専用であることを強調**
   - "Read-only access"
   - "No write operations"
   - "Only requesting read permissions"

3. **データの使用方法を説明**
   - ブックマークの整理・検索
   - ローカルストレージへの保存
   - ユーザー自身のデータのみ

4. **セキュリティへの配慮**
   - OAuth 2.0を使用した安全な認証
   - ユーザーデータの保護

### よくある質問への回答

**Q: このアプリは商用利用しますか？**
A: いいえ、個人利用のみです。商用利用は予定していません。

**Q: どのようなデータにアクセスしますか？**
A: ユーザーが手動でインポートしたブックマークデータのみです。Twitter APIから直接データを取得することはありません。

**Q: データを外部に共有しますか？**
A: いいえ、すべてのデータはユーザー自身のアカウント内にのみ保存され、外部に共有されることはありません。

---

## 申請時のチェックリスト

- [ ] Use Case Descriptionを英語で記入
- [ ] App Nameを入力（一意である必要がある）
- [ ] App Descriptionを記入
- [ ] Website URLを入力（開発環境: localhost:3001）
- [ ] Callback URIを入力（開発環境: localhost:3001/auth/callback）
- [ ] App Permissionsで「Read」を選択
- [ ] 申請を提出

---

この内容をTwitter Developer Portalの申請フォームに記入してください。

