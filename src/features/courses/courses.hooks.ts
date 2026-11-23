import { useCallback, useState } from 'react'
import type { CourseFormValues } from '@/features/courses/courses.schema'
import type { Course } from '@/features/courses/courses.types'

type UseCoursesResult = {
  courses: Course[]
  updateCourse: (courseId: string, values: CourseFormValues) => void
  removeCourse: (courseId: string) => void
}

export const useCourses = (initialCourses: Course[]): UseCoursesResult => {
  const [courses, setCourses] = useState<Course[]>(initialCourses)

  const updateCourse = useCallback(
    (courseId: string, values: CourseFormValues): void => {
      setCourses((currentCourses) => {
        if (!currentCourses.some((course) => course.id === courseId)) {
          throw new Error(`Course "${courseId}" does not exist.`)
        }

        return currentCourses.map((course) =>
          course.id === courseId ? { ...course, ...values } : course,
        )
      })
    },
    [],
  )

  const removeCourse = useCallback((courseId: string): void => {
    setCourses((currentCourses) => {
      const remainingCourses = currentCourses.filter(
        (course) => course.id !== courseId,
      )

      if (remainingCourses.length === currentCourses.length) {
        throw new Error(`Course "${courseId}" does not exist.`)
      }

      return remainingCourses
    })
  }, [])

  return { courses, updateCourse, removeCourse }
}
