# AI検索機能 仕様書

## 1. 概要

### 1.1 目的
文字列マッチングではなく、**意味的に関連するブックマークを検索**できる機能を実装する。

### 1.2 機能概要
- ユーザーが「これっぽい情報」を自然言語で検索
- ツイートの意味・文脈を理解して関連するブックマークを返す
- 例：「プログラミングの勉強方法」→ プログラミング学習、コーディング、技術記事などの関連ツイートを検索

## 2. 技術アーキテクチャ

### 2.1 技術スタック

#### ベクトル検索基盤
- **Supabase pgvector**: PostgreSQLのベクトル拡張機能
- **Embedding API**: テキストをベクトルに変換
  - 候補1: OpenAI Embeddings API (`text-embedding-3-small` または `text-embedding-ada-002`)
  - 候補2: Supabase Edge Functions + オープンソースモデル（コスト削減）
  - 候補3: Hugging Face Inference API

#### 検索方式
- **ハイブリッド検索**: ベクトル検索 + 全文検索の組み合わせ
  - ベクトル検索: 意味的類似度（コサイン類似度）
  - 全文検索: 既存のPostgreSQL全文検索（キーワード一致）

### 2.2 データベース設計

#### スキーマ変更

```sql
-- pgvector拡張機能を有効化
CREATE EXTENSION IF NOT EXISTS vector;

-- bookmarksテーブルにembeddingカラムを追加
ALTER TABLE bookmarks 
ADD COLUMN IF NOT EXISTS embedding vector(1536); -- OpenAI text-embedding-3-smallの場合

-- ベクトル検索用インデックス（IVFFlat）
CREATE INDEX IF NOT EXISTS idx_bookmarks_embedding 
ON bookmarks 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100); -- データ量に応じて調整

-- または、HNSWインデックス（より高速だがメモリ使用量が多い）
-- CREATE INDEX IF NOT EXISTS idx_bookmarks_embedding 
-- ON bookmarks 
-- USING hnsw (embedding vector_cosine_ops);
```

#### データフロー

1. **インポート時**
   ```
   ブックマークインポート
   → tweet_textを抽出
   → Embedding APIでベクトル化
   → embeddingカラムに保存
   ```

2. **検索時**
   ```
   ユーザーが検索クエリを入力
   → クエリをEmbedding APIでベクトル化
   → ベクトル検索（コサイン類似度）
   → 結果をランキングして返す
   ```

### 2.3 API設計

#### エンドポイント

**POST /api/search/ai**
```typescript
// リクエスト
{
  query: string,           // 検索クエリ（自然言語）
  limit?: number,          // 結果数（デフォルト: 20）
  threshold?: number,      // 類似度閾値（0-1、デフォルト: 0.7）
  hybrid?: boolean,        // ハイブリッド検索（デフォルト: true）
  filters?: {
    dateFrom?: string,
    dateTo?: string,
    author?: string,
    categories?: string[],
    tags?: string[]
  }
}

// レスポンス
{
  bookmarks: Bookmark[],
  total: number,
  searchTime: number,
  method: 'vector' | 'hybrid' | 'fulltext'
}
```

#### 検索ロジック

```typescript
// 1. クエリをベクトル化
const queryEmbedding = await generateEmbedding(query);

// 2. ベクトル検索（コサイン類似度）
const vectorResults = await supabase.rpc('match_bookmarks', {
  query_embedding: queryEmbedding,
  match_threshold: 0.7,
  match_count: 20
});

// 3. ハイブリッド検索の場合、全文検索も実行
const fulltextResults = await supabase
  .from('bookmarks')
  .select('*')
  .textSearch('tweet_text', query);

// 4. 結果をマージ・重複除去・ランキング
const mergedResults = mergeAndRank(vectorResults, fulltextResults);
```

### 2.4 実装コンポーネント

#### 1. Embedding生成サービス

**`src/lib/embeddings/generator.ts`**
```typescript
// OpenAI Embeddings APIを使用
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small', // または text-embedding-ada-002
      input: text,
    }),
  });
  
  const data = await response.json();
  return data.data[0].embedding;
}
```

#### 2. データベース関数（PostgreSQL）

**`database/functions/match_bookmarks.sql`**
```sql
CREATE OR REPLACE FUNCTION match_bookmarks(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  tweet_id text,
  tweet_text text,
  tweet_url text,
  author_username text,
  author_display_name text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    bookmarks.id,
    bookmarks.tweet_id,
    bookmarks.tweet_text,
    bookmarks.tweet_url,
    bookmarks.author_username,
    bookmarks.author_display_name,
    1 - (bookmarks.embedding <=> query_embedding) as similarity
  FROM bookmarks
  WHERE bookmarks.embedding IS NOT NULL
    AND 1 - (bookmarks.embedding <=> query_embedding) > match_threshold
  ORDER BY bookmarks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

#### 3. インポート処理の拡張

**`src/app/api/bookmarks/import/route.ts`** に追加
```typescript
// インポート時にembeddingを生成
for (const bookmark of newBookmarks) {
  try {
    // Embedding生成（バッチ処理で効率化）
    const embedding = await generateEmbedding(bookmark.tweet_text);
    
    await supabase
      .from('bookmarks')
      .insert({
        ...bookmark,
        embedding: embedding
      });
  } catch (error) {
    // Embedding生成失敗時はembeddingなしで保存
    await supabase
      .from('bookmarks')
      .insert(bookmark);
  }
}
```

#### 4. 検索API実装

**`src/app/api/search/ai/route.ts`**
```typescript
export async function POST(request: NextRequest) {
  const { query, limit = 20, threshold = 0.7, hybrid = true, filters } = await request.json();
  
  // 1. クエリをベクトル化
  const queryEmbedding = await generateEmbedding(query);
  
  // 2. ベクトル検索
  const { data: vectorResults } = await supabase.rpc('match_bookmarks', {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: limit * 2 // ハイブリッド検索用に多めに取得
  });
  
  // 3. ハイブリッド検索の場合、全文検索も実行
  let fulltextResults = [];
  if (hybrid) {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .textSearch('tweet_text', query)
      .limit(limit);
    fulltextResults = data || [];
  }
  
  // 4. 結果をマージ・ランキング
  const mergedResults = mergeResults(vectorResults, fulltextResults, limit);
  
  // 5. フィルタ適用
  const filteredResults = applyFilters(mergedResults, filters);
  
  return NextResponse.json({
    bookmarks: filteredResults,
    total: filteredResults.length,
    method: hybrid ? 'hybrid' : 'vector'
  });
}
```

### 2.5 UI設計

#### 検索ページの拡張

**`src/app/search/page.tsx`**

```typescript
// 検索モード切り替え
- [ ] 通常検索（全文検索）
- [ ] AI検索（セマンティック検索）
- [ ] ハイブリッド検索（両方）

// 検索結果表示
- 類似度スコア表示（オプション）
- 「なぜこの結果が表示されたか」の説明（オプション）
- 検索方法の表示（vector/hybrid/fulltext）
```

#### UIコンポーネント

```tsx
<SearchBar>
  <SearchModeToggle>
    <Radio value="fulltext">通常検索</Radio>
    <Radio value="ai">AI検索</Radio>
    <Radio value="hybrid">ハイブリッド</Radio>
  </SearchModeToggle>
  
  <Input 
    placeholder="例: プログラミングの勉強方法"
    value={query}
    onChange={handleQueryChange}
  />
  
  <Button onClick={handleSearch}>検索</Button>
</SearchBar>

<SearchResults>
  {results.map(bookmark => (
    <BookmarkCard 
      bookmark={bookmark}
      similarity={bookmark.similarity} // AI検索の場合
    />
  ))}
</SearchResults>
```

## 3. 実装フェーズ

### Phase 1: 基盤構築
- [ ] pgvector拡張機能の有効化
- [ ] bookmarksテーブルにembeddingカラム追加
- [ ] ベクトル検索インデックス作成
- [ ] Embedding生成サービスの実装
- [ ] データベース関数（match_bookmarks）の作成

### Phase 2: インポート処理の拡張
- [ ] インポート時にembedding生成を追加
- [ ] バッチ処理で効率化
- [ ] エラーハンドリング（Embedding生成失敗時の処理）
- [ ] 既存データのembedding生成（バックフィル）

### Phase 3: 検索API実装
- [ ] `/api/search/ai` エンドポイント実装
- [ ] ベクトル検索ロジック実装
- [ ] ハイブリッド検索ロジック実装
- [ ] フィルタリング機能追加

### Phase 4: UI実装
- [ ] 検索ページにAI検索モード追加
- [ ] 検索結果の表示改善
- [ ] 類似度スコア表示（オプション）
- [ ] ローディング状態の表示

### Phase 5: 最適化・改善
- [ ] パフォーマンス最適化
- [ ] キャッシュ戦略の実装
- [ ] エラーハンドリングの改善
- [ ] ユーザーフィードバックの収集

## 4. コスト・パフォーマンス考慮事項

### 4.1 コスト

#### OpenAI Embeddings API
- `text-embedding-3-small`: $0.02 / 1M tokens
- `text-embedding-ada-002`: $0.0001 / 1K tokens（非推奨）

**例: 10,000件のブックマーク**
- 平均ツイート長: 100文字 ≈ 25 tokens
- 総トークン数: 10,000 × 25 = 250,000 tokens
- コスト: $0.005（約0.75円）

**検索時のコスト**
- 1回の検索: 約25 tokens
- コスト: $0.0000005（約0.000075円）

### 4.2 パフォーマンス

- **Embedding生成**: 100-500ms（API呼び出し）
- **ベクトル検索**: 10-50ms（インデックス使用時）
- **全文検索**: 5-20ms
- **合計**: 150-600ms（ハイブリッド検索の場合）

### 4.3 最適化戦略

1. **バッチ処理**: 複数のembeddingを一度に生成
2. **キャッシュ**: 同じクエリのembeddingをキャッシュ
3. **非同期処理**: インポート時のembedding生成を非同期で実行
4. **インデックス最適化**: IVFFlat/HNSWインデックスのパラメータ調整

## 5. 代替案・拡張機能

### 5.1 代替Embedding API

#### Supabase Edge Functions + オープンソースモデル
- コスト削減（API呼び出し料金なし）
- セルフホスト可能
- 実装が複雑

#### Hugging Face Inference API
- 無料プランあり
- 多様なモデル選択可能
- レイテンシが高い場合がある

### 5.2 拡張機能

#### RAG（Retrieval Augmented Generation）
- 検索結果をLLMに渡して要約・説明を生成
- 「なぜこの結果が表示されたか」を説明

#### クエリ拡張
- ユーザーのクエリをLLMで拡張
- 関連キーワードを自動追加

#### 学習機能
- ユーザーのクリック履歴から学習
- パーソナライズされた検索結果

## 6. 実装の優先順位

### 必須機能（MVP）
1. ✅ pgvector拡張機能の有効化
2. ✅ embeddingカラムの追加
3. ✅ Embedding生成サービス（OpenAI）
4. ✅ ベクトル検索API
5. ✅ 基本的なUI実装

### 推奨機能
1. ハイブリッド検索
2. バッチ処理による効率化
3. 既存データのバックフィル

### オプション機能
1. 類似度スコア表示
2. クエリ拡張
3. RAG機能

## 7. リスク・課題

### 7.1 技術的リスク
- **API制限**: OpenAI APIのレート制限
- **コスト**: 大量データの場合、コストが増加
- **レイテンシ**: Embedding生成に時間がかかる

### 7.2 解決策
- レート制限の監視とリトライロジック
- コスト監視とアラート設定
- 非同期処理とプログレス表示

## 8. 次のステップ

1. **技術選定の確定**
   - Embedding APIの選択（OpenAI推奨）
   - インデックス方式の選択（IVFFlat vs HNSW）

2. **環境変数の設定**
   - `OPENAI_API_KEY` の設定
   - コスト監視の設定

3. **実装開始**
   - Phase 1から順次実装

