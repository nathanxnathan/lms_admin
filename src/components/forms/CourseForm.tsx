import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { courseFormSchema } from '@/features/courses/courses.schema'
import type { CourseFormValues } from '@/features/courses/courses.schema'
import type { Department } from '@/features/department/department.types'
import { Button } from '@/components/ui/button'

type CourseFormProps = {
  departments: Department[]
  initialValues?: CourseFormValues
  onCancel: () => void
  onSubmit: (values: CourseFormValues) => void | Promise<void>
  submitLabel: string
}

export const CourseForm = ({
  departments,
  initialValues,
  onCancel,
  onSubmit,
  submitLabel,
}: CourseFormProps): React.ReactElement => {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: initialValues ?? {
      name: '',
      code: '',
      description: '',
      departmentIds: [],
    },
  })

  return (
    <form
      className="flex flex-col gap-5"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-semibold text-(--sea-ink)"
          htmlFor="name"
        >
          Course name
        </label>
        <input
          id="name"
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
          htmlFor="code"
        >
          Course code
        </label>
        <input
          id="code"
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
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          id="description"
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

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-semibold text-(--sea-ink)">
          Departments
        </legend>
        {departments.length === 0 ? (
          <p className="text-sm text-(--sea-ink-soft)">
            No departments are available. Create a department before adding a
            course.
          </p>
        ) : (
          departments.map((department) => (
            <label
              key={department.id}
              className="flex items-center gap-2 text-sm text-(--sea-ink)"
            >
              <input
                type="checkbox"
                value={department.id}
                aria-invalid={errors.departmentIds ? 'true' : undefined}
                {...register('departmentIds')}
              />
              {department.name} ({department.code})
            </label>
          ))
        )}
        {errors.departmentIds && (
          <p className="text-sm text-destructive" role="alert">
            {errors.departmentIds.message}
          </p>
        )}
      </fieldset>

      <div className="flex flex-wrap justify-end gap-3">
        <Button
          className="demo-button demo-button-secondary"
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button className="demo-button" type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
