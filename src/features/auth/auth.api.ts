import { apiClient } from '@/lib/apiClient'
import type { LoginCredentials, LoginResponse } from '@/types/auth.types'

export const login = (credentials: LoginCredentials): Promise<LoginResponse> =>
  apiClient.post<LoginResponse>('/api/users/login', credentials)
