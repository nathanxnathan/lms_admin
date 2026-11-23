export type Course = {
  id: string
  name: string
  code: string
  description?: string
  departmentIds?: string[]
  departments?: Array<{
    id: string
    name: string
    code?: string
  }>
}
