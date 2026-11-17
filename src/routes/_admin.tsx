import { useEffect } from 'react'
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useAuthExpiryRedirect } from '@/features/auth/auth.hooks'
import { hasValidAuthSession, useAuthStore } from '@/store/authStore'
import { AdminHeader } from '@/components/organisms/AdminHeader'
import { AdminSidebar } from '@/components/organisms/AdminSidebar'

export const Route = createFileRoute('/_admin')({
  beforeLoad: () => {
    if (typeof window === 'undefined' || !hasValidAuthSession()) {
      throw redirect({ to: '/login' })
    }

    if (useAuthStore.getState().user?.role !== 'admin') {
      throw redirect({ to: '/' })
    }
  },
  component: AdminLayout,
})

function AdminLayout(): React.ReactElement {
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  useAuthExpiryRedirect()

  useEffect(() => {
    const handleExpiredSession = (): void => {
      logout()
      void navigate({ to: '/login', replace: true })
    }

    const handleVisibilityChange = (): void => {
      const expiresAt = useAuthStore.getState().accessTokenExpiresAt
      if (expiresAt !== null && expiresAt <= Date.now()) {
        handleExpiredSession()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [logout, navigate])

  return (
    <div className="flex h-screen overflow-hidden bg-(--bg-base)">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader title="Admin Console" />
        <main className="container mx-auto flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
