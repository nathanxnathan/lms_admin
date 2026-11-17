import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseForm } from '@/components/forms/CourseForm'
import { createDemoCourse } from '@/features/courses/courses.data'
import type { CourseFormValues } from '@/features/courses/courses.schema'

export const Route = createFileRoute('/_admin/course/new')({
  component: NewCoursePage,
})

function NewCoursePage(): React.ReactElement {
  const navigate = useNavigate()

  const handleSubmit = (values: CourseFormValues): void => {
    createDemoCourse(values)
    void navigate({ to: '/course' })
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
            Enter a name and code for the course.
          </p>
        </div>
      </div>

      <div className="demo-panel w-full max-w-2xl rounded-2xl p-6">
        <CourseForm
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitLabel="Create course"
        />
      </div>
    </section>
  )
}
