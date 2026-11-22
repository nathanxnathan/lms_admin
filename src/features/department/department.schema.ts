import { z } from 'zod'

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(1, 'Department name is required.'),
  code: z.string().trim().min(1, 'Department code is required.'),
  description: z.string().trim().min(1, 'Department description is required.'),
})

export type CreateDepartmentFormValues = z.infer<typeof createDepartmentSchema>
