import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LoginForm } from '@/components/forms/LoginForm'
import { useLogin } from '@/features/auth/auth.hooks'
import type { LoginFormValues } from '@/features/auth/auth.schema'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage(): React.ReactElement {
  const login = useLogin()
  const navigate = useNavigate()

  const handleLogin = async (values: LoginFormValues): Promise<void> => {
    await login(values)
    await navigate({ to: '/' })
  }

  return (
    <main className="demo-page demo-center">
      <section className="demo-panel w-full max-w-md">
        <p className="island-kicker mb-2">LMS admin</p>
        <h1 className="demo-title mb-3">Sign in</h1>
        <p className="demo-muted mb-6">
          Sign in with your admin account to continue.
        </p>
        <LoginForm onSubmit={handleLogin} />
      </section>
    </main>
  )
}
