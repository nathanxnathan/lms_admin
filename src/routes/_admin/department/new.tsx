import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DepartmentForm } from '@/components/forms/DepartmentForm'
import { useCreateDepartment } from '@/features/department/department.hooks'
import type { CreateDepartmentFormValues } from '@/features/department/department.schema'

export const Route = createFileRoute('/_admin/department/new')({
  component: NewDepartmentPage,
})

function NewDepartmentPage(): React.ReactElement {
  const navigate = useNavigate()
  const createDepartment = useCreateDepartment()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (
    values: CreateDepartmentFormValues,
  ): Promise<void> => {
    setErrorMessage(null)

    try {
      await createDepartment(values)
      await navigate({ to: '/department' })
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to create the department.',
      )
    }
  }

  const handleCancel = (): void => {
    void navigate({ to: '/department' })
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Button
          asChild
          className="demo-button demo-button-secondary w-fit"
          variant="outline"
        >
          <Link to="/department">
            <ArrowLeft data-icon="inline-start" />
            Back to departments
          </Link>
        </Button>
        <div className="flex flex-col gap-1">
          <p className="island-kicker">Department management</p>
          <h1 className="text-2xl font-bold text-(--sea-ink)">
            New department
          </h1>
          <p className="text-sm text-(--sea-ink-soft)">
            Enter a name, code, and description for the department.
          </p>
        </div>
      </div>

      <div className="demo-panel w-full max-w-2xl rounded-2xl p-6">
        <DepartmentForm
          errorMessage={errorMessage}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  )
}
