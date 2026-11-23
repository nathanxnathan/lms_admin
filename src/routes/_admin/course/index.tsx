import { useCallback, useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseDialog } from '@/components/organisms/CourseDialog'
import { DataTable } from '@/components/organisms/DataTable'
import type { DataTableColumn } from '@/components/organisms/DataTable'
import { useCourses } from '@/features/courses/courses.hooks'
import { listCourses } from '@/features/courses/courses.api'
import type { CourseFormValues } from '@/features/courses/courses.schema'
import type { Course } from '@/features/courses/courses.types'
import { listDepartments } from '@/features/department/department.api'
import type { Department } from '@/features/department/department.types'

export const Route = createFileRoute('/_admin/course/')({
  loader: async (): Promise<{
    courses: Course[]
    departments: Department[]
  }> => {
    const [coursesResponse, departmentsResponse] = await Promise.all([
      listCourses(),
      listDepartments(),
    ])
    return {
      courses: coursesResponse.data,
      departments: departmentsResponse.data,
    }
  },
  component: CoursesPage,
})

function CoursesPage(): React.ReactElement {
  const { courses: initialCourses, departments } = Route.useLoaderData()
  const { courses, removeCourse, updateCourse } = useCourses(initialCourses)
  const [activeCourse, setActiveCourse] = useState<{
    course: Course
    mode: 'view' | 'edit'
  } | null>(null)

  const handleDelete = useCallback(
    (course: Course): void => {
      if (window.confirm(`Delete "${course.name}"?`)) {
        removeCourse(course.id)
      }
    },
    [removeCourse],
  )

  const handleUpdate = (values: CourseFormValues): void => {
    if (activeCourse === null) {
      return
    }

    updateCourse(activeCourse.course.id, values)
    setActiveCourse(null)
  }

  const columns = useMemo<DataTableColumn<Course>[]>(
    () => [
      {
        id: 'name',
        header: 'Course name',
        cell: (course) => <span className="font-semibold">{course.name}</span>,
      },
      {
        id: 'code',
        header: 'Course code',
        cell: (course) => (
          <span className="rounded-md border border-(--chip-line) bg-(--chip-bg) px-2 py-1 text-xs font-semibold">
            {course.code}
          </span>
        ),
      },
      {
        id: 'description',
        header: 'Description',
        cell: (course) => course.description ?? '—',
      },
      {
        id: 'departments',
        header: 'Departments',
        cell: (course) => {
          const departmentIds =
            course.departmentIds ??
            course.departments?.map((department) => department.id) ??
            []

          if (departmentIds.length === 0) {
            return '—'
          }

          return departmentIds
            .map(
              (departmentId) =>
                course.departments?.find(
                  (department) => department.id === departmentId,
                )?.name ??
                departments.find((department) => department.id === departmentId)
                  ?.name ??
                departmentId,
            )
            .join(', ')
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (course) => (
          <div className="flex flex-wrap gap-2">
            <Button
              className="demo-button demo-button-secondary"
              size="sm"
              type="button"
              variant="outline"
              onClick={() => setActiveCourse({ course, mode: 'view' })}
            >
              <Eye data-icon="inline-start" />
              View
            </Button>
            <Button
              className="demo-button demo-button-secondary"
              size="sm"
              type="button"
              variant="outline"
              onClick={() => setActiveCourse({ course, mode: 'edit' })}
            >
              <Pencil data-icon="inline-start" />
              Edit
            </Button>
            <Button
              className="demo-button demo-button-danger"
              size="sm"
              type="button"
              variant="outline"
              onClick={() => handleDelete(course)}
            >
              <Trash2 data-icon="inline-start" />
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [handleDelete],
  )

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="island-kicker">Course management</p>
          <h1 className="text-2xl font-bold text-(--sea-ink)">Courses</h1>
          <p className="text-sm text-(--sea-ink-soft)">
            Manage course details and department assignments.
          </p>
        </div>
        <Button asChild className="demo-button">
          <Link to="/course/new">
            <Plus data-icon="inline-start" />
            New course
          </Link>
        </Button>
      </div>

      <DataTable
        caption="Courses"
        columns={columns}
        data={courses}
        emptyMessage="No courses yet. Add a course to get started."
        getRowId={(course) => course.id}
      />

      {activeCourse !== null && (
        <CourseDialog
          course={activeCourse.course}
          departments={departments}
          mode={activeCourse.mode}
          onClose={() => setActiveCourse(null)}
          onSave={handleUpdate}
        />
      )}
    </section>
  )
}
