// EntityManager Types
// Comprehensive type definitions for the EntityManager orchestrator
// Based on MyLandlord backend models and API structure

import * as React from 'react'

// ===== BASE TYPES =====

export interface BaseEntity {
  id: string | number
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

// ===== ENTITY MANAGER CONFIGURATION =====

export interface EntityManagerConfig<TEntity extends BaseEntity = BaseEntity> {
  // Entity identification
  entityType: EntityType
  displayName: string
  displayNamePlural: string

  // API configuration
  apiBaseUrl: string
  endpoints: {
    list: string
    create: string
    retrieve: string
    update: string
    delete: string
    bulk_delete?: string
    export?: string
    import?: string
  }

  // Field configuration
  fields: EntityFieldConfig[]

  // Related entities configuration
  relations?: EntityRelation[]

  // View configurations
  listView: EntityListViewConfig
  detailView: EntityDetailViewConfig
  formView: EntityFormViewConfig

  // Actions configuration
  actions: EntityActionsConfig

  // Permissions
  permissions: EntityPermissions

  // Hooks and callbacks
  hooks?: {
    onBeforeCreate?: (data: Partial<TEntity>) => Partial<TEntity> | Promise<Partial<TEntity>>
    onAfterCreate?: (data: TEntity) => void | Promise<void>
    onBeforeUpdate?: (data: Partial<TEntity>) => Partial<TEntity> | Promise<Partial<TEntity>>
    onAfterUpdate?: (data: TEntity) => void | Promise<void>
    onBeforeDelete?: (id: string | number) => boolean | Promise<boolean>
    onAfterDelete?: (id: string | number) => void | Promise<void>
  }
}

// ===== USER MANAGEMENT TYPES =====
// Based on userManager models

export interface User extends BaseEntity {
  username: string
  email: string
  first_name: string
  last_name: string
  user_type: 'admin' | 'tenant' | 'landlord' | 'caretaker' | 'property_manager'
  phone_number: string
  national_id: string
  is_active: boolean
  date_joined: string
  last_login?: string
  groups?: string[]
  user_permissions?: string[]

  // Related entities
  tenant_profile?: TenantProfile
  landlord_profile?: LandlordProfile
  caretaker_profile?: CaretakerProfile
  property_manager_profile?: PropertyManagerProfile
}

export interface TenantProfile extends BaseEntity {
  user: number // User ID
  home_address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  profile_picture?: string
  lease_start_date?: string
  payment_history?: Record<string, unknown>

  // Related user data
  user_details?: User
}

export interface LandlordProfile extends BaseEntity {
  user: number // User ID
  profile_picture?: string

  // Related data
  user_details?: User
  properties_owned?: Property[]
}

export interface CaretakerProfile extends BaseEntity {
  user: number // User ID
  profile_picture?: string

  // Related data
  user_details?: User
  assigned_properties?: Property[]
}

export interface PropertyManagerProfile extends BaseEntity {
  user: number // User ID
  profile_picture?: string
  employee_id?: string

  // Related data
  user_details?: User
  managed_properties?: Property[]
}

// ===== PROPERTY MANAGEMENT TYPES =====
// Based on propertyManager models

export interface Property extends BaseEntity {
  property_name: string
  property_images?: string
  property_description: string
  property_status: 'vacant' | 'occupied' | 'available' | 'unavailable'
  address: string
  postal_code: string
  town: string
  landlord?: number // User ID
  caretaker?: number // User ID

  // Property type specific fields (for apartments)
  apartment_type?: 'studio' | 'one_bedroom' | 'two_bedroom' | 'three_bedroom' | 'penthouse'
  floor_number?: number
  total_floors?: number
  has_elevator?: boolean
  parking_spaces?: number

  // Property type specific fields (for houses)
  house_type?: 'detached' | 'semi_detached' | 'townhouse' | 'bungalow'
  number_of_floors?: number
  garage_spaces?: number
  garden_size?: number

  // Related entities
  landlord_details?: User
  caretaker_details?: User
  units?: Unit[]
  maintenance_requests?: MaintenanceRequest[]
}

export interface Unit extends BaseEntity {
  unit_number: string
  unit_type: 'apartment' | 'house'
  property: number // Property ID
  rent_amount: number
  security_deposit: number
  is_occupied: boolean
  tenant?: number // User ID

  // Related entities
  property_details?: Property
  tenant_details?: User
  rent_payments?: RentPayment[]
}

export interface MaintenanceRequest extends BaseEntity {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  related_property: number // Property ID
  tenant: number // User ID
  unit_number?: number // Unit ID
  assigned_to?: number // User ID (caretaker/property_manager)
  estimated_cost?: number
  actual_cost?: number
  scheduled_date?: string
  completed_date?: string
  notes?: string

  // Related entities
  property_details?: Property
  tenant_details?: User
  unit_details?: Unit
  assigned_to_details?: User
}

// ===== RENT MANAGEMENT TYPES =====
// Based on rentManager models

export interface Rent extends BaseEntity {
  related_property: number // Property ID
  tenant: number // User ID
  unit_number?: number // Unit ID
  rent_amount: number
  security_deposit: number
  lease_start_date: string
  lease_end_date: string
  payment_frequency: 'monthly' | 'quarterly' | 'annually'
  is_active: boolean

  // Related entities
  property_details?: Property
  tenant_details?: User
  unit_details?: Unit
  payments?: RentPayment[]
}

export interface RentPayment extends BaseEntity {
  rent: number // Rent ID
  unit_number?: number // Unit ID
  amount_paid: number
  payment_date: string
  payment_method: 'cash' | 'bank_transfer' | 'check' | 'online'
  payment_reference?: string
  is_late: boolean
  late_fee?: number
  notes?: string

  // Related entities
  rent_details?: Rent
  unit_details?: Unit
}

// ===== NOTIFICATION MANAGEMENT TYPES =====
// Based on notificationsManager models

export interface Notification extends BaseEntity {
  recipient: number // User ID
  sender?: number // User ID
  title: string
  message: string
  notification_type: 'info' | 'warning' | 'error' | 'success'
  is_read: boolean
  read_at?: string
  action_url?: string
  metadata?: Record<string, unknown>

  // Related entities
  recipient_details?: User
  sender_details?: User
}

// ===== REPORT MANAGEMENT TYPES =====
// Based on reportManager models

export interface Report extends BaseEntity {
  title: string
  report_type: 'financial' | 'occupancy' | 'maintenance' | 'tenant' | 'property'
  generated_by: number // User ID
  date_range_start: string
  date_range_end: string
  parameters?: Record<string, unknown>
  status: 'pending' | 'processing' | 'completed' | 'failed'
  file_path?: string
  generated_at?: string

  // Related entities
  generated_by_details?: User
}

// ===== ENTITY MANAGER CONFIGURATION =====

export type EntityType =
  | 'user' | 'tenant_profile' | 'landlord_profile' | 'caretaker_profile' | 'property_manager_profile'
  | 'property' | 'unit' | 'maintenance_request'
  | 'rent' | 'rent_payment'
  | 'notification' | 'report'

export interface EntityManagerConfig<TEntity extends BaseEntity = BaseEntity> {
  // Entity identification
  entityType: EntityType
  displayName: string
  displayNamePlural: string

  // API configuration
  apiBaseUrl: string
  endpoints: {
    list: string
    create: string
    retrieve: string
    update: string
    delete: string
    bulk_delete?: string
    export?: string
    import?: string
  }

  // Field configuration
  fields: EntityFieldConfig[]

  // Related entities configuration
  relations?: EntityRelation[]

  // View configurations
  listView: EntityListViewConfig
  detailView: EntityDetailViewConfig
  formView: EntityFormViewConfig

  // Actions configuration
  actions: EntityActionsConfig

  // Permissions
  permissions: EntityPermissions

  // Hooks and callbacks
  hooks?: {
    onBeforeCreate?: (data: Partial<TEntity>) => Partial<TEntity> | Promise<Partial<TEntity>>
    onAfterCreate?: (data: TEntity) => void | Promise<void>
    onBeforeUpdate?: (data: Partial<TEntity>) => Partial<TEntity> | Promise<Partial<TEntity>>
    onAfterUpdate?: (data: TEntity) => void | Promise<void>
    onBeforeDelete?: (id: string | number) => boolean | Promise<boolean>
    onAfterDelete?: (id: string | number) => void | Promise<void>
  }
}

// ===== FIELD CONFIGURATION =====

export interface EntityFieldConfig {
  name: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'select' | 'multiselect' | 'textarea' | 'file' | 'image' | 'relation'
  required?: boolean
  readonly?: boolean
  hidden?: boolean

  // Field options
  options?: Array<{ value: string | number; label: string }>
  multiple?: boolean
  defaultValue?: unknown

  // Validation
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string

  // Display
  placeholder?: string
  helpText?: string
  icon?: React.ComponentType<{ className?: string }>

  // Custom rendering
  customRenderer?: (value: unknown, record: Record<string, unknown>) => React.ReactNode
  customFormRenderer?: (props: Record<string, unknown>) => React.ReactNode

  // List configuration
  sortable?: boolean
  filterable?: boolean
  searchable?: boolean
  width?: string | number

  // Relation configuration (for relation type fields)
  relation?: {
    entityType: EntityType
    displayField: string
    valueField: string
    endpoint: string
    filters?: Record<string, unknown>
  }
}

// ===== RELATION CONFIGURATION =====

export interface EntityRelation {
  name: string
  type: 'belongs_to' | 'has_many' | 'has_one' | 'many_to_many'
  entityType: EntityType
  foreignKey: string
  relatedField?: string
  displayField: string
  endpoint: string

  // UI configuration
  showInList?: boolean
  showInDetail?: boolean
  editable?: boolean

  // Cascade options
  cascadeDelete?: boolean
  cascadeUpdate?: boolean
}

// ===== VIEW CONFIGURATIONS =====

export interface EntityListViewConfig {
  variant: 'table' | 'card' | 'list' | 'grid' | 'compact'
  pageSize: number
  enableSearch: boolean
  enableFilters: boolean
  enableSorting: boolean
  enablePagination: boolean
  enableSelection: boolean
  enableBulkActions: boolean
  enableExport: boolean

  // Column configuration
  columns?: EntityListColumn[]

  // Custom rendering
  customRowRenderer?: (item: Record<string, unknown>) => React.ReactNode
  customCardRenderer?: (item: Record<string, unknown>) => React.ReactNode
}

export interface EntityListColumn {
  key: string
  title: string
  dataIndex?: string
  render?: (value: unknown, record: Record<string, unknown>) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
}

export interface EntityDetailViewConfig {
  variant: 'detail' | 'card' | 'summary' | 'timeline'
  sections?: EntityDetailSection[]
  showRelatedEntities: boolean
  enableEdit: boolean
  enableDelete: boolean

  // Custom rendering
  customRenderer?: (item: Record<string, unknown>) => React.ReactNode
}

export interface EntityDetailSection {
  title: string
  fields: string[]
  layout: 'grid' | 'list' | 'card'
  columns?: number
}

export interface EntityFormViewConfig {
  variant: 'create' | 'edit' | 'view'
  layout: 'single-column' | 'two-column' | 'grid'
  columns: number
  fieldSpacing: 'sm' | 'md' | 'lg'
  showProgress: boolean
  enableBulkImport: boolean

  // Sections for complex forms
  sections?: EntityFormSection[]

  // Custom rendering
  customRenderer?: (data: Record<string, unknown>, mode: string) => React.ReactNode
}

export interface EntityFormSection {
  title: string
  fields: string[]
  layout: 'grid' | 'list'
  columns?: number
  collapsible?: boolean
  defaultCollapsed?: boolean
}

// ===== ACTIONS CONFIGURATION =====

export interface EntityActionsConfig {
  // Standard actions
  enableCreate: boolean
  enableEdit: boolean
  enableDelete: boolean
  enableView: boolean
  enableDuplicate: boolean

  // Bulk actions
  bulkActions: EntityBulkAction[]

  // Custom actions
  customActions: EntityCustomAction[]

  // Action permissions
  permissions: {
    create?: string[]
    edit?: string[]
    delete?: string[]
    view?: string[]
    export?: string[]
  }
}

export interface EntityBulkAction {
  key: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  confirmMessage?: string
  handler: (selectedItems: Record<string, unknown>[]) => Promise<void> | void
  permission?: string
}

export interface EntityCustomAction {
  key: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  variant: 'primary' | 'secondary' | 'danger' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  position: 'toolbar' | 'dropdown' | 'row'

  // Action behavior
  confirmMessage?: string
  formSchema?: Record<string, unknown>
  modalConfig?: Record<string, unknown>

  // Conditions
  condition?: (item: Record<string, unknown>) => boolean
  permission?: string

  // Handler
  handler: (item: Record<string, unknown>, formData?: Record<string, unknown>) => Promise<void> | void
}

// ===== PERMISSIONS =====

export interface EntityPermissions {
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
  export: boolean
  import: boolean

  // Field-level permissions
  fieldPermissions?: Record<string, {
    read: boolean
    write: boolean
  }>

  // Custom permissions
  customPermissions?: Record<string, boolean>
}

// ===== API TYPES =====

export interface ApiResponse<T = unknown> {
  data: T
  success: boolean
  message?: string
  errors?: Record<string, string>
  meta?: {
    total: number
    page: number
    pageSize: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next: string | null
  previous: string | null
}

export interface ApiError {
  message: string
  status: number
  details?: Record<string, unknown>
}

// ===== HOOK INTERFACES =====

export interface UseEntityManagerOptions<TEntity extends BaseEntity = BaseEntity> {
  config: EntityManagerConfig<TEntity>
  initialData?: TEntity[]
  initialFilters?: Record<string, unknown>
  initialSort?: { field: string; direction: 'asc' | 'desc' }
}

export interface EntityManagerState<TEntity extends BaseEntity = BaseEntity> {
  // Data state
  items: TEntity[]
  selectedItem: TEntity | null
  selectedIds: (string | number)[]
  totalCount: number
  currentPage: number
  pageSize: number

  // UI state
  currentMode: 'list' | 'create' | 'edit' | 'view'
  loading: boolean
  error: string | null
  searchTerm: string
  filters: Record<string, unknown>
  sortConfig: { field: string; direction: 'asc' | 'desc' } | null

  // Form state
  formData: Partial<TEntity>
  formErrors: Record<string, string>
  formTouched: Record<string, boolean>

  // Related data
  relatedData: Record<string, unknown[]>
}

export interface EntityManagerActions<TEntity extends BaseEntity = BaseEntity> {
  // Navigation
  setMode: (mode: 'list' | 'create' | 'edit' | 'view') => void
  setSelectedItem: (item: TEntity | null) => void
  setSelectedIds: (ids: (string | number)[]) => void

  // Data operations
  loadData: (params?: Record<string, unknown>) => Promise<void>
  createItem: (data: Partial<TEntity>) => Promise<void>
  updateItem: (id: string | number, data: Partial<TEntity>) => Promise<void>
  deleteItem: (id: string | number) => Promise<void>
  bulkDeleteItems: (ids: (string | number)[]) => Promise<void>

  // UI operations
  setSearchTerm: (term: string) => void
  setFilters: (filters: Record<string, unknown>) => void
  setSortConfig: (config: { field: string; direction: 'asc' | 'desc' } | null) => void
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void

  // Form operations
  setFormData: (data: Partial<TEntity>) => void
  validateForm: () => boolean
  submitForm: () => Promise<void>

  // Related data
  loadRelatedData: (relation: string, params?: Record<string, unknown>) => Promise<void>
}

// ===== COMPONENT PROPS =====

export interface EntityManagerProps<TEntity extends BaseEntity = BaseEntity> {
  config: EntityManagerConfig<TEntity>
  initialMode?: 'list' | 'create' | 'edit' | 'view'
  initialData?: TEntity[]
  initialFilters?: Record<string, unknown>
  className?: string

  // Event handlers
  onModeChange?: (mode: string, item: TEntity | null) => void
  onDataChange?: (data: TEntity[]) => void
  onSelectionChange?: (selectedIds: (string | number)[]) => void
  onAction?: (action: string, data: unknown) => void

  // Context data for related entities
  contextData?: Record<string, unknown>
}