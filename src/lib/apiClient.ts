import { env } from '@/env'

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

const post = async <TResponse>(
  path: string,
  body: unknown,
  accessToken?: string,
): Promise<TResponse> => {
  const response = await fetch(new URL(path, env.VITE_HTTP_URL), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  })
  const payload: unknown = await response.json()

  if (!response.ok) {
    throw new ApiError(getErrorMessage(payload), response.status)
  }

  return payload as TResponse
}

export const apiClient = { post }
