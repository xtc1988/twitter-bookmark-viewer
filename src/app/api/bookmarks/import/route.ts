import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

interface BookmarkData {
  tweet_id?: string
  tweet_text?: string
  tweet_url?: string
  author_username?: string
  author_display_name?: string
  author_profile_image_url?: string
  media_urls?: string[] | any
  retweet_count?: number
  like_count?: number
  bookmarked_at?: string
  [key: string]: any
}

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { bookmarks } = await request.json()

    if (!Array.isArray(bookmarks)) {
      return NextResponse.json(
        { error: 'Invalid format: bookmarks must be an array' },
        { status: 400 }
      )
    }

    const imported: string[] = []
    const skipped: string[] = []
    const errors: string[] = []

    // バッチ処理で効率的にインポート（重複チェックを先に行う）
    const normalizedBookmarks: BookmarkData[] = []
    
    for (const bookmark of bookmarks) {
      try {
        // Normalize bookmark data
        const normalized: BookmarkData = {
          tweet_id: bookmark.tweet_id || bookmark.id || bookmark.tweetId || '',
          tweet_text: bookmark.tweet_text || bookmark.text || bookmark.content || '',
          tweet_url: bookmark.tweet_url || bookmark.url || bookmark.permalink || '',
          author_username: bookmark.author_username || bookmark.username || bookmark.screen_name || '',
          author_display_name: bookmark.author_display_name || bookmark.display_name || bookmark.name || '',
          author_profile_image_url: bookmark.author_profile_image_url || bookmark.profile_image_url || null,
          media_urls: bookmark.media_urls || bookmark.media || null,
          retweet_count: bookmark.retweet_count || bookmark.retweetCount || bookmark.retweets || null,
          like_count: bookmark.like_count || bookmark.likeCount || bookmark.likes || bookmark.favorites || null,
          bookmarked_at: bookmark.bookmarked_at || bookmark.bookmarkedAt || bookmark.created_at || bookmark.createdAt || new Date().toISOString(),
        }

        // Validate required fields
        if (!normalized.tweet_id || !normalized.tweet_text || !normalized.tweet_url) {
          errors.push(`Invalid bookmark: missing required fields (tweet_id: ${normalized.tweet_id ? 'OK' : 'MISSING'}, tweet_text: ${normalized.tweet_text ? 'OK' : 'MISSING'}, tweet_url: ${normalized.tweet_url ? 'OK' : 'MISSING'})`)
          continue
        }

        normalizedBookmarks.push(normalized)
      } catch (error: any) {
        errors.push(`Error processing bookmark: ${error.message}`)
      }
    }

    // 既存のブックマークをチェック（重複を避ける）
    const tweetIds = normalizedBookmarks.map(b => b.tweet_id)
    const { data: existingBookmarks } = await supabase
      .from('bookmarks')
      .select('tweet_id')
      .in('tweet_id', tweetIds)

    const existingTweetIds = new Set(existingBookmarks?.map(b => b.tweet_id) || [])
    
    // 新しいブックマークのみをフィルタリング
    const newBookmarks = normalizedBookmarks.filter(b => !existingTweetIds.has(b.tweet_id))
    const skippedCount = normalizedBookmarks.length - newBookmarks.length

    // バッチで挿入（Supabaseは最大1000件まで一度に挿入可能）
    const batchSize = 500
    for (let i = 0; i < newBookmarks.length; i += batchSize) {
      const batch = newBookmarks.slice(i, i + batchSize)
      
      const insertData = batch.map(normalized => ({
        tweet_id: normalized.tweet_id,
        tweet_text: normalized.tweet_text,
        tweet_url: normalized.tweet_url,
        author_username: normalized.author_username,
        author_display_name: normalized.author_display_name,
        author_profile_image_url: normalized.author_profile_image_url,
        media_urls: normalized.media_urls ? (Array.isArray(normalized.media_urls) ? normalized.media_urls : [normalized.media_urls]) : null,
        retweet_count: normalized.retweet_count,
        like_count: normalized.like_count,
        bookmarked_at: normalized.bookmarked_at,
      }))

      const { error: insertError, data: insertedData } = await supabase
        .from('bookmarks')
        .insert(insertData)
        .select('tweet_id')

      if (insertError) {
        // バッチ挿入が失敗した場合、個別に試行
        for (const item of batch) {
          try {
            const { error: singleError } = await supabase
              .from('bookmarks')
              .insert({
                tweet_id: item.tweet_id,
                tweet_text: item.tweet_text,
                tweet_url: item.tweet_url,
                author_username: item.author_username,
                author_display_name: item.author_display_name,
                author_profile_image_url: item.author_profile_image_url,
                media_urls: item.media_urls ? (Array.isArray(item.media_urls) ? item.media_urls : [item.media_urls]) : null,
                retweet_count: item.retweet_count,
                like_count: item.like_count,
                bookmarked_at: item.bookmarked_at,
              })

            if (singleError) {
              if (singleError.code === '23505') {
                if (item.tweet_id) {
                  skipped.push(item.tweet_id)
                }
              } else {
                errors.push(`Error importing bookmark ${item.tweet_id || 'unknown'}: ${singleError.message}`)
              }
            } else {
              if (item.tweet_id) {
                imported.push(item.tweet_id)
              }
            }
          } catch (error: any) {
            errors.push(`Error importing bookmark ${item.tweet_id || 'unknown'}: ${error.message}`)
          }
        }
      } else {
        // 成功した場合
        if (insertedData) {
          imported.push(...insertedData.map(b => b.tweet_id))
        }
      }
    }

    // スキップされたものもカウント
    skipped.push(...Array.from(existingTweetIds))

    return NextResponse.json({
      success: true,
      imported: imported.length,
      skipped: skipped.length,
      total: bookmarks.length,
      errors: errors.slice(0, 20), // Limit errors to first 20
    })
  } catch (error: any) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

