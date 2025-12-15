'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-secondary-900 mb-4">
          エラーが発生しました
        </h1>
        <p className="text-secondary-600 mb-6">
          申し訳ございません。予期しないエラーが発生しました。
        </p>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="btn btn-primary w-full"
          >
            もう一度試す
          </button>
          <Link href="/" className="btn btn-secondary w-full inline-block">
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}

