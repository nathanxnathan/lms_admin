import { useCallback } from 'react'
import { createDepartment } from '@/features/department/department.api'
import type { CreateDepartmentRequest } from '@/features/department/department.types'

export const useCreateDepartment = (): ((
  department: CreateDepartmentRequest,
) => Promise<void>) => {
  return useCallback(
    async (department: CreateDepartmentRequest): Promise<void> => {
      await createDepartment(department)
    },
    [],
  )
}
