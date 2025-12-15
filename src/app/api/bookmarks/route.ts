import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // 認証なしでSupabaseクライアントを作成
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const offset = (page - 1) * pageSize

    // Fetch bookmarks
    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('bookmarked_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('Error fetching bookmarks:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bookmarks' },
        { status: 500 }
      )
    }

    // Parse media_urls from JSONB to array
    const parsedBookmarks = (bookmarks || []).map((bookmark: any) => {
      if (bookmark.media_urls) {
        try {
          // If it's already an array, use it as is
          if (Array.isArray(bookmark.media_urls)) {
            return bookmark
          }
          // If it's a string, try to parse it
          if (typeof bookmark.media_urls === 'string') {
            bookmark.media_urls = JSON.parse(bookmark.media_urls)
          }
        } catch (e) {
          // If parsing fails, set to null
          bookmark.media_urls = null
        }
      }
      return bookmark
    })

    // Check if there are more bookmarks
    const { count } = await supabase
      .from('bookmarks')
      .select('*', { count: 'exact', head: true })

    const total = count || 0
    const hasMore = total > offset + pageSize

    return NextResponse.json({
      bookmarks: parsedBookmarks,
      hasMore,
      total,
      page,
      pageSize,
    })
  } catch (error: any) {
    console.error('Error in GET /api/bookmarks:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

