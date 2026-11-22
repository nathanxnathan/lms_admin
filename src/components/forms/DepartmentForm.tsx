import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { createDepartmentSchema } from '@/features/department/department.schema'
import type { CreateDepartmentFormValues } from '@/features/department/department.schema'

type DepartmentFormProps = {
  errorMessage: string | null
  onCancel: () => void
  onSubmit: (values: CreateDepartmentFormValues) => Promise<void>
}

export const DepartmentForm = ({
  errorMessage,
  onCancel,
  onSubmit,
}: DepartmentFormProps): React.ReactElement => {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<CreateDepartmentFormValues>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
    },
  })

  return (
    <form
      className="flex flex-col gap-5"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      {errorMessage !== null && (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-semibold text-(--sea-ink)"
          htmlFor="departmentName"
        >
          Department name
        </label>
        <input
          id="departmentName"
          className="demo-input"
          aria-invalid={errors.name ? 'true' : undefined}
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-semibold text-(--sea-ink)"
          htmlFor="departmentCode"
        >
          Department code
        </label>
        <input
          id="departmentCode"
          className="demo-input"
          aria-invalid={errors.code ? 'true' : undefined}
          {...register('code')}
        />
        {errors.code && (
          <p className="text-sm text-destructive" role="alert">
            {errors.code.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-semibold text-(--sea-ink)"
          htmlFor="departmentDescription"
        >
          Description
        </label>
        <textarea
          id="departmentDescription"
          className="demo-input min-h-24"
          aria-invalid={errors.description ? 'true' : undefined}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-destructive" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <Button
          className="demo-button demo-button-secondary"
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button className="demo-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Creating...' : 'Create department'}
        </Button>
      </div>
    </form>
  )
}
