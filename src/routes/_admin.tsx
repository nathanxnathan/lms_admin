import { useEffect } from 'react'
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useAuthExpiryRedirect } from '@/features/auth/auth.hooks'
import { hasValidAuthSession, useAuthStore } from '@/store/authStore'

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

  const handleLogout = (): void => {
    logout()
    void navigate({ to: '/login', replace: true })
  }

  return (
    <div className="demo-page">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="island-kicker mb-1">LMS admin</p>
          <h1 className="demo-section-title">Admin console</h1>
        </div>
        <button
          className="demo-button demo-button-secondary"
          onClick={handleLogout}
          type="button"
        >
          Sign out
        </button>
      </header>
      <Outlet />
    </div>
  )
}
