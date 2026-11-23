import { apiClient } from '@/lib/apiClient'
import type { CourseFormValues } from '@/features/courses/courses.schema'
import type { Course } from '@/features/courses/courses.types'

export type ListCoursesResponse = {
  data: Course[]
}

export const listCourses = (): Promise<ListCoursesResponse> =>
  apiClient.get<ListCoursesResponse>('/api/courses')

export const createCourse = (course: CourseFormValues): Promise<unknown> =>
  apiClient.post<unknown>('/api/courses', course)
