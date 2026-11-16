import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/store/authStore'

export const Route = createFileRoute('/_admin/admin')({
  component: AdminPage,
})

function AdminPage(): React.ReactElement {
  const user = useAuthStore((state) => state.user)

  return (
    <section className="demo-panel">
      <p className="island-kicker mb-2">Dashboard</p>
      <h2 className="demo-title">Welcome, {user?.firstName}</h2>
      <p className="demo-muted mt-4">You are signed in with the admin role.</p>
    </section>
  )
}
