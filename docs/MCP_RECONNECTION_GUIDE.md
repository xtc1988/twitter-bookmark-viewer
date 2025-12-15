# MCP再接続ガイド

## 確認すべき場所

### 1. Cursorの設定UI（最も重要）

1. **Cursorを開く**
2. **設定を開く**
   - Windows: `Ctrl + ,` または `File > Preferences > Settings`
   - または、左下の歯車アイコンをクリック
3. **「MCP」または「Model Context Protocol」**を検索
4. **MCP設定セクション**を確認

### 2. Cursorの設定ファイル（Windows）

設定ファイルは通常以下の場所にあります：

```
%APPDATA%\Cursor\User\settings.json
```

または

```
%USERPROFILE%\.cursor\settings.json
```

**確認方法：**
1. Windowsキー + R を押す
2. `%APPDATA%\Cursor` と入力してEnter
3. `User` フォルダ内の `settings.json` を確認

### 3. MCP設定の確認項目

設定ファイルで以下のような設定を探してください：

```json
{
  "mcp": {
    "servers": {
      "supabase": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-supabase"],
        "env": {
          "SUPABASE_ACCESS_TOKEN": "your-access-token"
        }
      }
    }
  }
}
```

または

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "your-access-token"
      }
    }
  }
}
```

### 4. Supabase MCPサーバーに必要な環境変数

Supabase MCPサーバーが動作するために必要な環境変数：

- `SUPABASE_ACCESS_TOKEN`: Supabaseのアクセストークン（必須）
- または、プロジェクト固有の設定：
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

### 5. アクセストークンの取得方法

1. https://supabase.com/dashboard/account/tokens にアクセス
2. 「Access Tokens」セクションで新しいトークンを生成
3. 生成したトークンをMCP設定の環境変数に設定

### 6. 接続テスト

設定を更新した後：

1. **Cursorを再起動**（重要）
2. MCPツールが利用可能か確認
   - チャットで `@supabase` と入力して、MCPツールが表示されるか確認
   - または、MCPツールを直接呼び出してみる

### 7. トラブルシューティング

#### 問題: MCPツールが表示されない

**解決策：**
- Cursorを完全に再起動
- 設定ファイルの構文エラーを確認（JSONの形式が正しいか）
- MCPサーバーのパッケージが正しくインストールされているか確認

#### 問題: "Not connected" エラー

**解決策：**
- アクセストークンが正しく設定されているか確認
- トークンの有効期限を確認（期限切れの場合は再生成）
- ネットワーク接続を確認

#### 問題: 設定ファイルが見つからない

**解決策：**
- Cursorの設定UIから直接設定を追加
- または、設定ファイルを手動で作成

### 8. 代替方法

MCP接続が復旧できない場合：

1. **Supabaseダッシュボードで直接SQL実行**（推奨）
   - https://supabase.com/dashboard/project/azlcuxgourruwoxptwbr
   - SQL Editorで `database/apply_migration.sql` を実行

2. **Supabase CLIを使用**
   ```bash
   npx supabase db push
   ```

## 次のステップ

1. 上記の手順でMCP設定を確認・修正
2. Cursorを再起動
3. MCP接続が復旧したら、データベーススキーマを自動適用


