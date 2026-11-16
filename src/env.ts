import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_HTTP_URL: z.string().url(),
    VITE_APP_NAME: z.string().min(1),
  },
  runtimeEnv: {
    VITE_HTTP_URL: import.meta.env.VITE_HTTP_URL,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  },
  emptyStringAsUndefined: true,
})
