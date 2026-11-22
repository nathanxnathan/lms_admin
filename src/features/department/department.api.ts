import { apiClient } from '@/lib/apiClient'
import type {
  CreateDepartmentRequest,
  ListDepartmentsResponse,
} from '@/features/department/department.types'

export const createDepartment = (
  department: CreateDepartmentRequest,
): Promise<unknown> => apiClient.post<unknown>('/api/departments', department)

export const listDepartments = (): Promise<ListDepartmentsResponse> =>
  apiClient.get<ListDepartmentsResponse>('/api/departments')
