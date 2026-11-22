import { env } from '@/env'
import { useAuthStore } from '@/store/authStore'

export class ApiError extends Error {
  public readonly status: number

  public constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const getErrorMessage = (payload: unknown): string => {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof payload.message === 'string'
  ) {
    return payload.message
  }

  return 'The request failed.'
}

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') {
    return {}
  }

  const { accessToken, tokenType } = useAuthStore.getState()
  if (accessToken === null || tokenType === null) {
    return {}
  }

  return { Authorization: `${tokenType} ${accessToken}` }
}

const post = async <TResponse>(
  path: string,
  body: unknown,
): Promise<TResponse> => {
  const response = await fetch(new URL(path, env.VITE_HTTP_URL), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  })
  const payload: unknown = await response.json()

  if (!response.ok) {
    throw new ApiError(getErrorMessage(payload), response.status)
  }

  return payload as TResponse
}

const get = async <TResponse>(path: string): Promise<TResponse> => {
  const response = await fetch(new URL(path, env.VITE_HTTP_URL), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
  })
  const payload: unknown = await response.json()

  if (!response.ok) {
    throw new ApiError(getErrorMessage(payload), response.status)
  }

  return payload as TResponse
}

export const apiClient = { get, post }
