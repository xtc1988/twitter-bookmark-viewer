'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'

interface ImportResult {
  success: boolean
  imported: number
  skipped?: number
  total?: number
  errors: string[]
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setIsImporting(true)
    setResult(null)

    try {
      const text = await file.text()
      let bookmarks: any[] = []

      // Parse file based on extension
      if (file.name.endsWith('.json')) {
        const data = JSON.parse(text)
        // Handle different JSON formats
        if (Array.isArray(data)) {
          bookmarks = data
        } else if (data.bookmarks && Array.isArray(data.bookmarks)) {
          bookmarks = data.bookmarks
        } else {
          throw new Error('Invalid JSON format')
        }
      } else if (file.name.endsWith('.csv')) {
        // Parse CSV
        const lines = text.split('\n')
        const headers = lines[0].split(',').map(h => h.trim())
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue
          const values = lines[i].split(',').map(v => v.trim())
          const bookmark: any = {}
          headers.forEach((header, index) => {
            bookmark[header] = values[index] || ''
          })
          bookmarks.push(bookmark)
        }
      } else {
        throw new Error('Unsupported file format. Please use CSV or JSON.')
      }

      // Import bookmarks via API
      const response = await fetch('/api/bookmarks/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookmarks }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Import failed')
      }

      setResult({
        success: true,
        imported: data.imported || 0,
        skipped: data.skipped || 0,
        total: data.total || 0,
        errors: data.errors || [],
      })
    } catch (error: any) {
      setResult({
        success: false,
        imported: 0,
        errors: [error.message || 'Import failed'],
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            ブックマークをインポート
          </h1>
          <p className="text-secondary-600">
            TwitterからエクスポートしたCSV/JSONファイルをアップロードしてください
          </p>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="mb-6">
              <label className="form-label">
                ファイルを選択
              </label>
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-secondary-300 border-dashed rounded-lg cursor-pointer bg-secondary-50 hover:bg-secondary-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-secondary-400" />
                    <p className="mb-2 text-sm text-secondary-500">
                      <span className="font-semibold">クリックしてファイルを選択</span> または ドラッグ&ドロップ
                    </p>
                    <p className="text-xs text-secondary-500">
                      CSV または JSON (MAX. 10MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv,.json"
                    onChange={handleFileChange}
                    disabled={isImporting}
                  />
                </label>
              </div>
              {file && (
                <div className="mt-4 flex items-center text-sm text-secondary-600">
                  <FileText className="h-4 w-4 mr-2" />
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>

            <button
              onClick={handleImport}
              disabled={!file || isImporting}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting ? 'インポート中...' : 'インポートを開始'}
            </button>

            {result && (
              <div className={`mt-6 p-4 rounded-lg ${
                result.success ? 'bg-success-50 border border-success-200' : 'bg-error-50 border border-error-200'
              }`}>
                <div className="flex items-start">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-success-600 mr-2 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-error-600 mr-2 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${
                      result.success ? 'text-success-800' : 'text-error-800'
                    }`}>
                      {result.success ? (
                        <>
                          {result.imported}件のブックマークをインポートしました
                          {result.skipped && result.skipped > 0 && (
                            <span className="block text-sm text-success-600 mt-1">
                              （{result.skipped}件は既に存在していたためスキップ）
                            </span>
                          )}
                          {result.total && (
                            <span className="block text-sm text-success-600 mt-1">
                              合計: {result.total}件
                            </span>
                          )}
                        </>
                      ) : (
                        'インポートに失敗しました'
                      )}
                    </p>
                    {result.errors.length > 0 && (
                      <ul className="mt-2 text-sm text-error-700 list-disc list-inside">
                        {result.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-secondary-50 rounded-lg">
              <h3 className="font-semibold text-secondary-900 mb-2">
                ファイル形式について
              </h3>
              <p className="text-sm text-secondary-600 mb-2">
                Twitterからエクスポートしたデータは、以下の形式をサポートしています：
              </p>
              <ul className="text-sm text-secondary-600 list-disc list-inside space-y-1">
                <li>JSON形式: 配列またはbookmarksプロパティを含むオブジェクト</li>
                <li>CSV形式: カンマ区切りのテキストファイル</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

