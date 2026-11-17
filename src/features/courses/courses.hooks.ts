import { useCallback, useState } from 'react'
import {
  createDemoCourse,
  deleteDemoCourse,
  getDemoCourses,
  updateDemoCourse,
} from '@/features/courses/courses.data'
import type { CourseFormValues } from '@/features/courses/courses.schema'
import type { Course } from '@/features/courses/courses.types'

type UseCoursesResult = {
  courses: Course[]
  addCourse: (values: CourseFormValues) => void
  updateCourse: (courseId: string, values: CourseFormValues) => void
  removeCourse: (courseId: string) => void
}

export const useCourses = (): UseCoursesResult => {
  const [courses, setCourses] = useState<Course[]>(getDemoCourses)

  const addCourse = useCallback((values: CourseFormValues): void => {
    createDemoCourse(values)
    setCourses(getDemoCourses())
  }, [])

  const updateCourse = useCallback(
    (courseId: string, values: CourseFormValues): void => {
      setCourses(updateDemoCourse(courseId, values))
    },
    [],
  )

  const removeCourse = useCallback((courseId: string): void => {
    setCourses(deleteDemoCourse(courseId))
  }, [])

  return { courses, addCourse, updateCourse, removeCourse }
}
