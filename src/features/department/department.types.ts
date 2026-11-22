import type { z } from 'zod'
import type { createDepartmentSchema } from '@/features/department/department.schema'

export type Department = {
  id: string
  name: string
  code: string
  description: string
}

export type CreateDepartmentRequest = z.input<typeof createDepartmentSchema>

export type ListDepartmentsResponse = {
  data: Department[]
}
