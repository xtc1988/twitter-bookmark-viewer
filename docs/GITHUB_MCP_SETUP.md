# GitHub MCP設定ガイド

## 設定ファイルの場所

現在の設定ファイル:
```
C:\Users\xtc19\AppData\Roaming\Cursor\User\settings.json
```

## GitHub MCP設定に必要な情報

### 1. GitHub Personal Access Token (PAT) の取得

1. GitHubにログイン
2. 右上のプロフィールアイコンをクリック → **Settings**
3. 左サイドバーの最下部 → **Developer settings**
4. **Personal access tokens** → **Tokens (classic)** または **Fine-grained tokens**
5. **Generate new token** をクリック

#### Classic Tokenの場合:
- **Note**: `Cursor MCP GitHub` など分かりやすい名前
- **Expiration**: 必要に応じて設定（推奨: 90日または無期限）
- **Scopes**: 以下の権限を選択:
  - `repo` (Full control of private repositories)
  - `workflow` (Update GitHub Action workflows)
  - `read:org` (Read org and team membership)
  - `read:user` (Read user profile data)
  - `gist` (Create gists)

#### Fine-grained Tokenの場合:
- **Repository access**: 必要なリポジトリを選択
- **Permissions**: 
  - Repository permissions: `Contents: Read and write`, `Metadata: Read`, `Pull requests: Read and write`, `Issues: Read and write`
  - Account permissions: `Read-only` で十分

6. **Generate token** をクリック
7. **重要**: 生成されたトークンをコピー（一度しか表示されません）

### 2. 設定ファイルへの追加

`settings.json` に以下の設定を追加:

```json
{
  "mcp": {
    "servers": {
      "supabase": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-supabase"
        ],
        "env": {
          "SUPABASE_ACCESS_TOKEN": "sbp_e0eec71503e8aba19598b31573fd9b8f942817c3"
        }
      },
      "github": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-github"
        ],
        "env": {
          "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN_HERE"
        }
      }
    }
  }
}
```

### 3. 設定後の手順

1. `YOUR_GITHUB_TOKEN_HERE` を実際のGitHub Personal Access Tokenに置き換える
2. Cursorを**完全に再起動**（すべてのウィンドウを閉じて再起動）
3. 再起動後、MCPツールが利用可能か確認

### 4. 接続確認

再起動後、以下の方法で確認:
- チャットで `@github` と入力して、GitHub MCPツールが表示されるか確認
- GitHub関連のMCPツール（リポジトリ作成、ファイル操作など）が利用可能か確認

## トラブルシューティング

### 問題: GitHub MCPツールが表示されない

**解決策：**
- Cursorを完全に再起動
- 設定ファイルのJSON構文エラーを確認（カンマ、引用符など）
- GitHub Personal Access Tokenが正しく設定されているか確認
- トークンに必要な権限（scopes）が付与されているか確認

### 問題: "Not connected" エラー

**解決策：**
- GitHub Personal Access Tokenが正しく設定されているか確認
- トークンの有効期限を確認（期限切れの場合は再生成）
- ネットワーク接続を確認
- GitHub APIのレート制限に達していないか確認

### 問題: 権限エラー

**解決策：**
- GitHub Personal Access Tokenに必要な権限（scopes）が付与されているか確認
- リポジトリへのアクセス権限があるか確認

## 現在の設定ファイルの状態

現在の設定ファイルにはSupabase MCPのみが設定されています。GitHub MCPを追加するには、上記の設定を追加してください。

## 参考リンク

- [GitHub Personal Access Tokens](https://github.com/settings/tokens)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [GitHub MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)


