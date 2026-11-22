import { useMemo } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/organisms/DataTable'
import type { DataTableColumn } from '@/components/organisms/DataTable'
import { listDepartments } from '@/features/department/department.api'
import type { Department } from '@/features/department/department.types'

export const Route = createFileRoute('/_admin/department/')({
  loader: () => listDepartments(),
  component: DepartmentsPage,
})

function DepartmentsPage(): React.ReactElement {
  const { data: departments } = Route.useLoaderData()

  const columns = useMemo<DataTableColumn<Department>[]>(
    () => [
      {
        id: 'name',
        header: 'Department name',
        cell: (department) => (
          <span className="font-semibold">{department.name}</span>
        ),
      },
      {
        id: 'code',
        header: 'Department code',
        cell: (department) => (
          <span className="rounded-md border border-(--chip-line) bg-(--chip-bg) px-2 py-1 text-xs font-semibold">
            {department.code}
          </span>
        ),
      },
      {
        id: 'description',
        header: 'Description',
        cell: (department) => department.description,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: () => (
          <Button
            className="demo-button demo-button-danger"
            size="sm"
            type="button"
            variant="outline"
          >
            <Trash2 data-icon="inline-start" />
            Delete
          </Button>
        ),
      },
    ],
    [],
  )

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="island-kicker">Department management</p>
          <h1 className="text-2xl font-bold text-(--sea-ink)">Departments</h1>
          <p className="text-sm text-(--sea-ink-soft)">
            Manage department names, codes, and descriptions.
          </p>
        </div>
        <Button asChild className="demo-button">
          <Link to="/department/new">
            <Plus data-icon="inline-start" />
            New department
          </Link>
        </Button>
      </div>

      <DataTable
        caption="Departments"
        columns={columns}
        data={departments}
        emptyMessage="No departments yet. Add a department to get started."
        getRowId={(department) => department.id}
      />
    </section>
  )
}
