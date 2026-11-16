export type AdminUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type LoginResponse = {
  message: string
  data: {
    accessToken: string
    tokenType: 'Bearer'
    expiresIn: number
    user: AdminUser
  }
}

export type AuthState = {
  user: AdminUser | null
  accessToken: string | null
  tokenType: 'Bearer' | null
  accessTokenExpiresAt: number | null
}

export type AuthActions = {
  login: (data: LoginResponse['data']) => void
  logout: () => void
}
