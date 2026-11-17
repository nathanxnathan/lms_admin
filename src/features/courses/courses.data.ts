import type { CourseFormValues } from '@/features/courses/courses.schema'
import type { Course } from '@/features/courses/courses.types'

let demoCourses: Course[] = [
  {
    id: 'course-1',
    courseName: 'CPAP Fundamentals',
    courseCode: 'CPAP-101',
  },
  {
    id: 'course-2',
    courseName: 'Patient Care and Safety',
    courseCode: 'PCS-204',
  },
  {
    id: 'course-3',
    courseName: 'Equipment Maintenance',
    courseCode: 'EM-310',
  },
]

let nextCourseId = demoCourses.length + 1

export const getDemoCourses = (): Course[] =>
  demoCourses.map((course) => ({ ...course }))

export const createDemoCourse = (values: CourseFormValues): Course => {
  const course: Course = {
    id: `course-${nextCourseId}`,
    ...values,
  }
  nextCourseId += 1
  demoCourses = [...demoCourses, course]
  return { ...course }
}

export const updateDemoCourse = (
  courseId: string,
  values: CourseFormValues,
): Course[] => {
  if (!demoCourses.some((course) => course.id === courseId)) {
    throw new Error(`Course "${courseId}" does not exist.`)
  }

  demoCourses = demoCourses.map((course) =>
    course.id === courseId ? { ...course, ...values } : course,
  )
  return getDemoCourses()
}

export const deleteDemoCourse = (courseId: string): Course[] => {
  const remainingCourses = demoCourses.filter(
    (course) => course.id !== courseId,
  )

  if (remainingCourses.length === demoCourses.length) {
    throw new Error(`Course "${courseId}" does not exist.`)
  }

  demoCourses = remainingCourses
  return getDemoCourses()
}
