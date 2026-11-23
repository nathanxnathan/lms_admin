import { z } from 'zod'

export const courseFormSchema = z.object({
  name: z.string().trim().min(1, 'Course name is required.'),
  code: z.string().trim().min(1, 'Course code is required.'),
  description: z.string().trim().min(1, 'Course description is required.'),
  departmentIds: z.array(z.string()).min(1, 'Select at least one department.'),
})

export type CourseFormValues = z.infer<typeof courseFormSchema>
