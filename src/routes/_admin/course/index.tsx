import { useCallback, useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseDialog } from '@/components/organisms/CourseDialog'
import { DataTable } from '@/components/organisms/DataTable'
import type { DataTableColumn } from '@/components/organisms/DataTable'
import { useCourses } from '@/features/courses/courses.hooks'
import type { CourseFormValues } from '@/features/courses/courses.schema'
import type { Course } from '@/features/courses/courses.types'

export const Route = createFileRoute('/_admin/course/')({
  component: CoursesPage,
})

function CoursesPage(): React.ReactElement {
  const { courses, removeCourse, updateCourse } = useCourses()
  const [activeCourse, setActiveCourse] = useState<{
    course: Course
    mode: 'view' | 'edit'
  } | null>(null)

  const handleDelete = useCallback(
    (course: Course): void => {
      if (window.confirm(`Delete "${course.courseName}"?`)) {
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
        id: 'courseName',
        header: 'Course name',
        cell: (course) => (
          <span className="font-semibold">{course.courseName}</span>
        ),
      },
      {
        id: 'courseCode',
        header: 'Course code',
        cell: (course) => (
          <span className="rounded-md border border-(--chip-line) bg-(--chip-bg) px-2 py-1 text-xs font-semibold">
            {course.courseCode}
          </span>
        ),
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
            Manage course names and codes.
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
          mode={activeCourse.mode}
          onClose={() => setActiveCourse(null)}
          onSave={handleUpdate}
        />
      )}
    </section>
  )
}
