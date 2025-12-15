'use client'

import DashboardLayout from '@/components/Layout/DashboardLayout'
import { FolderOpen } from 'lucide-react'

export default function CategoriesPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            カテゴリ
          </h1>
          <p className="text-secondary-600">
            ブックマークをカテゴリで整理できます
          </p>
        </div>

        <div className="card">
          <div className="card-body text-center py-12">
            <FolderOpen className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-600">
              カテゴリ機能は準備中です
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

