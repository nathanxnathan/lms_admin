import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseForm } from '@/components/forms/CourseForm'
import { createCourse } from '@/features/courses/courses.api'
import type { CourseFormValues } from '@/features/courses/courses.schema'
import { listDepartments } from '@/features/department/department.api'

export const Route = createFileRoute('/_admin/course/new')({
  loader: () => listDepartments(),
  component: NewCoursePage,
})

function NewCoursePage(): React.ReactElement {
  const navigate = useNavigate()
  const { data: departments } = Route.useLoaderData()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (values: CourseFormValues): Promise<void> => {
    setErrorMessage(null)
    try {
      await createCourse(values)
      await navigate({ to: '/course' })
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to create course.',
      )
    }
  }

  const handleCancel = (): void => {
    void navigate({ to: '/course' })
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Button
          asChild
          className="demo-button demo-button-secondary w-fit"
          variant="outline"
        >
          <Link to="/course">
            <ArrowLeft data-icon="inline-start" />
            Back to courses
          </Link>
        </Button>
        <div className="flex flex-col gap-1">
          <p className="island-kicker">Course management</p>
          <h1 className="text-2xl font-bold text-(--sea-ink)">New course</h1>
          <p className="text-sm text-(--sea-ink-soft)">
            Enter the course details and select its departments.
          </p>
        </div>
      </div>

      <div className="demo-panel w-full max-w-2xl rounded-2xl p-6">
        <CourseForm
          departments={departments}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitLabel="Create course"
        />
        {errorMessage !== null && (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    </section>
  )
}
