'use client'

import NavBar from '@/components/Navigation/NavBar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-secondary-50">
      <NavBar />
      <main>{children}</main>
    </div>
  )
}

