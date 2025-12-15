# MCP設定手順

## 現在の状態

設定ファイル（`C:\Users\xtc19\AppData\Roaming\Cursor\User\settings.json`）にMCP設定を追加しました。

## 次のステップ：Supabaseアクセストークンの取得と設定

### 1. Supabaseアクセストークンを取得

1. https://supabase.com/dashboard/account/tokens にアクセス
2. 「Access Tokens」セクションで **「Generate new token」** をクリック
3. トークン名を入力（例：`Cursor MCP`）
4. 生成されたトークンをコピー（**重要：このトークンは一度しか表示されません**）

### 2. 設定ファイルを更新

1. `C:\Users\xtc19\AppData\Roaming\Cursor\User\settings.json` を開く
2. `YOUR_SUPABASE_ACCESS_TOKEN_HERE` を取得したトークンに置き換える

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
          "SUPABASE_ACCESS_TOKEN": "sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }
      }
    }
  }
}
```

### 3. Cursorを再起動

設定を反映させるために、**Cursorを完全に再起動**してください。

### 4. 接続確認

再起動後、MCPツールが利用可能か確認：
- チャットで `@supabase` と入力して、MCPツールが表示されるか確認
- または、MCPツールを直接呼び出してみる

## トラブルシューティング

### 問題: MCPツールが表示されない

**解決策：**
- Cursorを完全に再起動（すべてのウィンドウを閉じて再起動）
- 設定ファイルのJSON構文エラーを確認（カンマ、引用符など）
- アクセストークンが正しく設定されているか確認

### 問題: "Not connected" エラー

**解決策：**
- アクセストークンが正しく設定されているか確認
- トークンの有効期限を確認（期限切れの場合は再生成）
- ネットワーク接続を確認

### 問題: 設定ファイルが見つからない

**解決策：**
- パスを確認：`C:\Users\xtc19\AppData\Roaming\Cursor\User\settings.json`
- Windowsキー + R で `%APPDATA%\Cursor\User` と入力してEnter

## 現在の設定内容

設定ファイルに以下のMCP設定が追加されています：

```json
"mcp": {
  "servers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_SUPABASE_ACCESS_TOKEN_HERE"
      }
    }
  }
}
```

**重要：** `YOUR_SUPABASE_ACCESS_TOKEN_HERE` を実際のトークンに置き換えてください。


