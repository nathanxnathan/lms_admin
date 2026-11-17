import { useNavigate } from '@tanstack/react-router'
import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'

type AdminHeaderProps = {
  title: string
}

export const AdminHeader = ({
  title,
}: AdminHeaderProps): React.ReactElement => {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const onLogout = (): void => {
    logout()
    void navigate({ to: '/login' })
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-(--line) bg-(--header-bg) px-6 backdrop-blur-sm">
      <h1 className="text-base font-semibold text-(--sea-ink)">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-(--sand) px-3 py-1.5">
          <User className="size-3.5 text-(--sea-ink-soft)" />
          <span className="text-xs font-medium text-(--sea-ink)">
            {user !== null ? `${user.firstName} ${user.lastName}` : 'Admin'}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onLogout}
          aria-label="Sign out"
          className="text-(--sea-ink-soft) hover:text-(--sea-ink)"
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  )
}
