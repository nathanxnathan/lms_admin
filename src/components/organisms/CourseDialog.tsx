import { useEffect, useRef } from 'react'
import { CourseForm } from '@/components/forms/CourseForm'
import type { CourseFormValues } from '@/features/courses/courses.schema'
import type { Course } from '@/features/courses/courses.types'
import { Button } from '@/components/ui/button'

type CourseDialogProps = {
  course: Course
  mode: 'view' | 'edit'
  onClose: () => void
  onSave: (values: CourseFormValues) => void
}

export const CourseDialog = ({
  course,
  mode,
  onClose,
  onSave,
}: CourseDialogProps): React.ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog !== null && !dialog.open) {
      dialog.showModal()
    }

    return () => {
      if (dialog?.open) {
        dialog.close()
      }
    }
  }, [])

  const closeDialog = (): void => {
    dialogRef.current?.close()
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="course-dialog-title"
      className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-2xl border border-(--line) bg-(--surface-strong) p-0 text-(--sea-ink) shadow-xl backdrop:bg-black/40"
      onCancel={onClose}
    >
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2
              id="course-dialog-title"
              className="text-xl font-semibold text-(--sea-ink)"
            >
              {mode === 'view' ? 'Course details' : 'Edit course'}
            </h2>
            <p className="text-sm text-(--sea-ink-soft)">
              {mode === 'view'
                ? 'Review the course name and code.'
                : 'Update the course name or code.'}
            </p>
          </div>
          <Button
            className="demo-button demo-button-secondary"
            type="button"
            variant="outline"
            onClick={closeDialog}
          >
            Close
          </Button>
        </div>

        {mode === 'view' ? (
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="text-xs font-semibold uppercase tracking-wide text-(--sea-ink-soft)">
                Course name
              </dt>
              <dd className="font-medium">{course.courseName}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs font-semibold uppercase tracking-wide text-(--sea-ink-soft)">
                Course code
              </dt>
              <dd className="font-medium">{course.courseCode}</dd>
            </div>
          </dl>
        ) : (
          <CourseForm
            initialValues={{
              courseName: course.courseName,
              courseCode: course.courseCode,
            }}
            onCancel={closeDialog}
            onSubmit={onSave}
            submitLabel="Save changes"
          />
        )}
      </div>
    </dialog>
  )
}
