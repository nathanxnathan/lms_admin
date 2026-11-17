import { z } from 'zod'

export const courseFormSchema = z.object({
  courseName: z.string().trim().min(1, 'Course name is required.'),
  courseCode: z.string().trim().min(1, 'Course code is required.'),
})

export type CourseFormValues = z.infer<typeof courseFormSchema>
