import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-secondary-700 mb-4">
          ページが見つかりません
        </h2>
        <p className="text-secondary-600 mb-6">
          お探しのページは存在しないか、移動された可能性があります。
        </p>
        <Link href="/" className="btn btn-primary">
          ホームに戻る
        </Link>
      </div>
    </div>
  )
}

