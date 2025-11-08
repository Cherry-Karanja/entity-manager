import { EntityListColumn } from '../../../components/entityManager/EntityList/types'

// ===== USER LIST CONFIGURATION =====

export const userListConfig: {
  columns: EntityListColumn[]
  searchableFields?: string[]
  defaultSort?: { field: string; direction: 'asc' | 'desc' }
  pageSize?: number
  allowBatchActions?: boolean
  allowExport?: boolean
} = {
  columns: [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
      width: 80,
      sortable: true
    },
    {
      id: 'firstName',
      header: 'First Name',
      accessorKey: 'first_name',
      sortable: true
    },
    {
      id: 'lastName',
      header: 'Last Name',
      accessorKey: 'last_name',
      sortable: true
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
      sortable: true,
      filterable: true
    },
    {
      id: 'phoneNumber',
      header: 'Phone',
      accessorKey: 'phone_number',
      filterable: true
    },
    {
      id: 'nationalId',
      header: 'National ID',
      accessorKey: 'national_id',
      filterable: true
    },
    {
      id: 'userType',
      header: 'User Type',
      accessorKey: 'user_type',
      cell: (value: unknown) => {
        const roleValue = value as string
        const roleLabels: Record<string, string> = {
          admin: 'Admin',
          tenant: 'Tenant',
          landlord: 'Landlord',
          caretaker: 'Caretaker',
          property_manager: 'Property Manager'
        }
        return roleLabels[roleValue] || roleValue
      },
      filterable: true
    },
    {
      id: 'isActive',
      header: 'Active',
      accessorKey: 'is_active',
      cell: (value: unknown) => {
        return value ? 'Yes' : 'No'
      },
      filterable: true
    },
    {
      id: 'dateJoined',
      header: 'Date Joined',
      accessorKey: 'date_joined',
      cell: (value: unknown) => {
        if (!value) return ''
        return new Date(value as string).toLocaleDateString()
      },
      sortable: true
    }
  ],
  searchableFields: ['email', 'first_name', 'last_name', 'phone_number', 'national_id'],
  defaultSort: { field: 'date_joined', direction: 'desc' },
  pageSize: 10,
  allowBatchActions: true,
  allowExport: true
}
