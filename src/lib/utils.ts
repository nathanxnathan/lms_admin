import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { env } from '@/env'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Turns a storage-relative path (e.g. `/static/customers/id/profile.png`)
 * into an absolute URL using the backend origin derived from
 * VITE_HTTP_URL. Full URLs (http/https) are returned unchanged.
 */
export function resolveMediaUrl(
  path: string | null | undefined,
): string | null {
  if (path == null || path === '') return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const origin = new URL(env.VITE_HTTP_URL).origin
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}

export const elegantFormat = (text: string | null | undefined): string => {
  if (text == null || text === '') return ''
  return text
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export const CANCELLABLE_PAYMENT_STATUSES: ReadonlySet<string> = new Set([
  'unpaid',
  'pending',
  'failed',
])

export const REFUNDABLE_PAYMENT_STATUSES: ReadonlySet<string> = new Set([
  'paid',
  'partially_refunded',
])
