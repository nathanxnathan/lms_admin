import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { login as loginRequest } from '@/features/auth/auth.api'
import { useAuthStore } from '@/store/authStore'
import type { LoginCredentials } from '@/types/auth.types'

export const useLogin = (): ((
  credentials: LoginCredentials,
) => Promise<void>) => {
  const saveAuth = useAuthStore((state) => state.login)

  return async (credentials: LoginCredentials): Promise<void> => {
    const response = await loginRequest(credentials)
    saveAuth(response.data)
  }
}

export const useAuthExpiryRedirect = (): void => {
  const expiresAt = useAuthStore((state) => state.accessTokenExpiresAt)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  useEffect(() => {
    if (expiresAt === null) {
      return
    }

    const handleExpiration = (): void => {
      logout()
      void navigate({ to: '/login', replace: true })
    }

    const timeUntilExpiration = expiresAt - Date.now()
    if (timeUntilExpiration <= 0) {
      handleExpiration()
      return
    }

    const timeoutId = window.setTimeout(handleExpiration, timeUntilExpiration)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [expiresAt, logout, navigate])
}
