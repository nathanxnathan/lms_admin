import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { courseFormSchema } from '@/features/courses/courses.schema'
import type { CourseFormValues } from '@/features/courses/courses.schema'
import { Button } from '@/components/ui/button'

type CourseFormProps = {
  initialValues?: CourseFormValues
  onCancel: () => void
  onSubmit: (values: CourseFormValues) => void
  submitLabel: string
}

export const CourseForm = ({
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
    defaultValues: initialValues ?? { courseName: '', courseCode: '' },
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
          htmlFor="courseName"
        >
          Course name
        </label>
        <input
          id="courseName"
          className="demo-input"
          aria-invalid={errors.courseName ? 'true' : undefined}
          {...register('courseName')}
        />
        {errors.courseName && (
          <p className="text-sm text-destructive" role="alert">
            {errors.courseName.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-semibold text-(--sea-ink)"
          htmlFor="courseCode"
        >
          Course code
        </label>
        <input
          id="courseCode"
          className="demo-input"
          aria-invalid={errors.courseCode ? 'true' : undefined}
          {...register('courseCode')}
        />
        {errors.courseCode && (
          <p className="text-sm text-destructive" role="alert">
            {errors.courseCode.message}
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
        <Button className="demo-button" type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
