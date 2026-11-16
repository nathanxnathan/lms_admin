import { create } from 'zustand'
import type { AuthActions, AuthState, LoginResponse } from '@/types/auth.types'

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  accessToken: null,
  tokenType: null,
  accessTokenExpiresAt: null,

  login: ({
    accessToken,
    expiresIn,
    tokenType,
    user,
  }: LoginResponse['data']): void => {
    set({
      user,
      accessToken,
      tokenType,
      accessTokenExpiresAt: Date.now() + expiresIn * 1000,
    })
  },

  logout: (): void => {
    set({
      user: null,
      accessToken: null,
      tokenType: null,
      accessTokenExpiresAt: null,
    })
  },
}))

export const hasValidAuthSession = (): boolean => {
  const state = useAuthStore.getState()
  const isValid =
    state.user !== null &&
    state.accessToken !== null &&
    state.tokenType === 'Bearer' &&
    state.accessTokenExpiresAt !== null &&
    state.accessTokenExpiresAt > Date.now()

  if (!isValid) {
    state.logout()
  }

  return isValid
}
