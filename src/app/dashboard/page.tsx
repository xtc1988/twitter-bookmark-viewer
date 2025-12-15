'use client'

import DashboardLayout from '@/components/Layout/DashboardLayout'
import Link from 'next/link'
import { Upload } from 'lucide-react'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            ダッシュボード
          </h1>
          <p className="text-secondary-600">
            Twitterのブックマークを整理・検索する個人向けツール
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <div className="card-body">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                ブックマークをインポート
              </h2>
              <p className="text-secondary-600 mb-4">
                TwitterからエクスポートしたCSV/JSONファイルをアップロードして、ブックマークをインポートできます。
              </p>
              <Link
                href="/import"
                className="btn btn-primary inline-flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                インポートを開始
              </Link>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                ブックマーク一覧
              </h2>
              <p className="text-secondary-600 mb-4">
                インポートしたブックマークを一覧で確認できます。
              </p>
              <Link
                href="/bookmarks"
                className="btn btn-secondary inline-flex items-center"
              >
                ブックマークを見る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

