'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import { format } from 'date-fns'
import Link from 'next/link'
import { ExternalLink, Calendar } from 'lucide-react'

interface Bookmark {
  id: string
  tweet_id: string
  tweet_text: string
  tweet_url: string
  author_username: string
  author_display_name: string
  author_profile_image_url: string | null
  media_urls: string[] | null
  retweet_count: number | null
  like_count: number | null
  bookmarked_at: string
  imported_at: string
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const pageSize = 20

  useEffect(() => {
    loadBookmarks()
  }, [page])

  const loadBookmarks = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/bookmarks?page=${page}&pageSize=${pageSize}`
      )
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (page === 1) {
        setBookmarks(data.bookmarks || [])
      } else {
        setBookmarks((prev) => [...prev, ...(data.bookmarks || [])])
      }
      setHasMore(data.hasMore || false)
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error loading bookmarks:', error)
      // エラーが発生した場合でも、空の配列を設定してページを表示可能にする
      if (page === 1) {
        setBookmarks([])
        setTotal(0)
        setHasMore(false)
      }
    } finally {
      setLoading(false)
    }
  }

  // 無限スクロール: スクロールが下に近づいたら自動でロード
  useEffect(() => {
    const handleScroll = () => {
      // スクロール位置がページ下部の200px以内になったらロード
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      if (scrollTop + windowHeight >= documentHeight - 200) {
        if (!loading && hasMore) {
          setPage((prev) => prev + 1)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, hasMore])

  if (loading && bookmarks.length === 0) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            ブックマーク一覧
          </h1>
          <p className="text-secondary-600">
            {total > 0 ? `全${total.toLocaleString()}件中 ${bookmarks.length}件を表示` : 'ブックマークがありません'}
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-12">
              <p className="text-secondary-600 mb-4">
                ブックマークがありません
              </p>
              <Link href="/import" className="btn btn-primary">
                ブックマークをインポート
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="card">
                  <div className="card-body">
                    <div className="flex items-start space-x-4">
                      {bookmark.author_profile_image_url && (
                        <img
                          src={bookmark.author_profile_image_url}
                          alt={bookmark.author_display_name}
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-secondary-900">
                            {bookmark.author_display_name}
                          </span>
                          <span className="text-secondary-500">
                            @{bookmark.author_username}
                          </span>
                        </div>
                        <p className="text-secondary-700 mb-3 whitespace-pre-wrap">
                          {bookmark.tweet_text}
                        </p>
                        
                        {/* メディア（画像）の表示 */}
                        {bookmark.media_urls && (
                          <div className="mb-3">
                            {Array.isArray(bookmark.media_urls) && bookmark.media_urls.length > 0 ? (
                              <div className={`grid gap-2 ${
                                bookmark.media_urls.length === 1 
                                  ? 'grid-cols-1' 
                                  : bookmark.media_urls.length === 2
                                  ? 'grid-cols-2'
                                  : 'grid-cols-2'
                              }`}>
                                {bookmark.media_urls.slice(0, 4).map((mediaUrl: string, mediaIndex: number) => (
                                  <div key={mediaIndex} className="relative group">
                                    <img
                                      src={mediaUrl}
                                      alt={`Media ${mediaIndex + 1}`}
                                      className="w-full h-auto rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity max-h-96"
                                      onClick={() => window.open(mediaUrl, '_blank')}
                                      onError={(e) => {
                                        // 画像読み込みエラー時の処理
                                        const target = e.currentTarget
                                        target.style.display = 'none'
                                      }}
                                      loading="lazy"
                                    />
                                  </div>
                                ))}
                                {bookmark.media_urls.length > 4 && (
                                  <div className="text-sm text-secondary-500 flex items-center justify-center">
                                    +{bookmark.media_urls.length - 4}枚
                                  </div>
                                )}
                              </div>
                            ) : typeof bookmark.media_urls === 'string' ? (
                              <div className="text-sm text-secondary-500">
                                メディアが含まれています
                              </div>
                            ) : null}
                          </div>
                        )}

                        {/* エンゲージメント情報 */}
                        {(bookmark.retweet_count !== null || bookmark.like_count !== null) && (
                          <div className="flex items-center space-x-4 text-sm text-secondary-500 mb-3">
                            {bookmark.retweet_count !== null && (
                              <span>🔁 {bookmark.retweet_count.toLocaleString()}</span>
                            )}
                            {bookmark.like_count !== null && (
                              <span>❤️ {bookmark.like_count.toLocaleString()}</span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-secondary-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(
                              new Date(bookmark.bookmarked_at),
                              'yyyy年MM月dd日 HH:mm'
                            )}
                          </div>
                          <a
                            href={bookmark.tweet_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-primary-600 hover:text-primary-700"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            元のツイートを見る
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {loading && hasMore && (
              <div className="mt-8 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mr-3"></div>
                  <span className="text-secondary-600">読み込み中...</span>
                </div>
              </div>
            )}
            
            {!hasMore && bookmarks.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-secondary-500">
                  すべてのブックマークを表示しました
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

