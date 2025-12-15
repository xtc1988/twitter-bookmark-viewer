'use client'

import DashboardLayout from '@/components/Layout/DashboardLayout'
import { Search as SearchIcon } from 'lucide-react'

export default function SearchPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            検索
          </h1>
          <p className="text-secondary-600">
            ブックマークを検索できます
          </p>
        </div>

        <div className="card">
          <div className="card-body text-center py-12">
            <SearchIcon className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-600">
              検索機能は準備中です
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

