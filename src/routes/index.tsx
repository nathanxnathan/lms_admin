import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthExpiryRedirect } from '@/features/auth/auth.hooks'
import { hasValidAuthSession, useAuthStore } from '@/store/authStore'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    if (typeof window === 'undefined' || !hasValidAuthSession()) {
      throw redirect({ to: '/login' })
    }

    if (useAuthStore.getState().user?.role === 'admin') {
      throw redirect({ to: '/admin' })
    }
  },
  component: IndexPage,
})

function IndexPage(): React.ReactElement {
  const user = useAuthStore((state) => state.user)
  useAuthExpiryRedirect()

  return (
    <main className="demo-page demo-center">
      <section className="demo-panel w-full max-w-xl">
        <p className="island-kicker mb-2">Access denied</p>
        <h1 className="demo-title">Not authorized</h1>
        <p className="demo-muted mt-4">
          This area is available to admin users only. The current account role
          is {user?.role ?? 'unknown'}.
        </p>
      </section>
    </main>
  )
}
