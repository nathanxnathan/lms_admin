import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { loginSchema } from '@/features/auth/auth.schema'
import type { LoginFormValues } from '@/features/auth/auth.schema'

type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => Promise<void>
}

export const LoginForm = ({ onSubmit }: LoginFormProps): React.ReactElement => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const handleFormSubmit = async (values: LoginFormValues): Promise<void> => {
    setSubmitError(null)

    try {
      await onSubmit(values)
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error ? error.message : 'Unable to sign in.',
      )
    }
  }

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-[var(--sea-ink)]"
          htmlFor="email"
        >
          Email
        </label>
        <input
          autoComplete="email"
          className="demo-input"
          id="email"
          type="email"
          aria-invalid={errors.email ? 'true' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p className="demo-alert demo-alert-danger mt-2">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-semibold text-[var(--sea-ink)]"
          htmlFor="password"
        >
          Password
        </label>
        <input
          autoComplete="current-password"
          className="demo-input"
          id="password"
          type="password"
          aria-invalid={errors.password ? 'true' : undefined}
          {...register('password')}
        />
        {errors.password && (
          <p className="demo-alert demo-alert-danger mt-2">
            {errors.password.message}
          </p>
        )}
      </div>

      {submitError && (
        <p className="demo-alert demo-alert-danger" role="alert">
          {submitError}
        </p>
      )}

      <button
        className="demo-button w-full"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
