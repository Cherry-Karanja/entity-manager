// EntityManager API Configuration
// API endpoints and configurations for MyLandlord backend integration

import { EntityManagerConfig, User, TenantProfile, LandlordProfile, CaretakerProfile, PropertyManagerProfile, Property, Unit, MaintenanceRequest, Rent, RentPayment, Notification, Report } from '../types'

// ===== API BASE CONFIGURATION =====

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'

export const API_ENDPOINTS = {
  // User Management
  users: {
    list: '/users/',
    create: '/users/',
    retrieve: '/users/{id}/',
    update: '/users/{id}/',
    delete: '/users/{id}/',
  },
  tenantProfiles: {
    list: '/tenant-profiles/',
    create: '/tenant-profiles/',
    retrieve: '/tenant-profiles/{id}/',
    update: '/tenant-profiles/{id}/',
    delete: '/tenant-profiles/{id}/',
  },
  landlordProfiles: {
    list: '/landlord-profiles/',
    create: '/landlord-profiles/',
    retrieve: '/landlord-profiles/{id}/',
    update: '/landlord-profiles/{id}/',
    delete: '/landlord-profiles/{id}/',
  },
  caretakerProfiles: {
    list: '/caretaker-profiles/',
    create: '/caretaker-profiles/',
    retrieve: '/caretaker-profiles/{id}/',
    update: '/caretaker-profiles/{id}/',
    delete: '/caretaker-profiles/{id}/',
  },
  propertyManagerProfiles: {
    list: '/property-manager-profiles/',
    create: '/property-manager-profiles/',
    retrieve: '/property-manager-profiles/{id}/',
    update: '/property-manager-profiles/{id}/',
    delete: '/property-manager-profiles/{id}/',
  },

  // Property Management
  apartments: {
    list: '/apartment/',
    create: '/apartment/',
    retrieve: '/apartment/{id}/',
    update: '/apartment/{id}/',
    delete: '/apartment/{id}/',
  },
  houses: {
    list: '/house/',
    create: '/house/',
    retrieve: '/house/{id}/',
    update: '/house/{id}/',
    delete: '/house/{id}/',
  },
  units: {
    list: '/units/',
    create: '/units/',
    retrieve: '/units/{id}/',
    update: '/units/{id}/',
    delete: '/units/{id}/',
  },
  maintenanceRequests: {
    list: '/maintenance-requests/',
    create: '/maintenance-requests/',
    retrieve: '/maintenance-requests/{id}/',
    update: '/maintenance-requests/{id}/',
    delete: '/maintenance-requests/{id}/',
  },

  // Statistics
  propertyStatistics: '/statistics/',
}

// ===== ENTITY CONFIGURATIONS =====

// User Management Configurations
export const USER_CONFIG: EntityManagerConfig<User> = {
  entityType: 'user',
  displayName: 'User',
  displayNamePlural: 'Users',
  apiBaseUrl: API_BASE_URL,
  endpoints: API_ENDPOINTS.users,

  fields: [
    { name: 'username', label: 'Username', type: 'string', required: true, searchable: true },
    { name: 'email', label: 'Email', type: 'string', required: true, searchable: true },
    { name: 'first_name', label: 'First Name', type: 'string', required: true, searchable: true, sortable: true },
    { name: 'last_name', label: 'Last Name', type: 'string', required: true, searchable: true, sortable: true },
    {
      name: 'user_type',
      label: 'User Type',
      type: 'select',
      required: true,
      filterable: true,
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'tenant', label: 'Tenant' },
        { value: 'landlord', label: 'Landlord' },
        { value: 'caretaker', label: 'Caretaker' },
        { value: 'property_manager', label: 'Property Manager' },
      ]
    },
    { name: 'phone_number', label: 'Phone Number', type: 'string', required: true },
    { name: 'national_id', label: 'National ID', type: 'string', required: true },
    { name: 'is_active', label: 'Active', type: 'boolean', defaultValue: true, filterable: true },
    { name: 'date_joined', label: 'Date Joined', type: 'date', readonly: true, sortable: true },
    { name: 'last_login', label: 'Last Login', type: 'datetime', readonly: true },
  ],

  relations: [
    {
      name: 'tenant_profile',
      type: 'has_one',
      entityType: 'tenant_profile',
      foreignKey: 'user',
      displayField: 'home_address',
      endpoint: API_ENDPOINTS.tenantProfiles.list,
      showInDetail: true,
      editable: true,
    },
    {
      name: 'landlord_profile',
      type: 'has_one',
      entityType: 'landlord_profile',
      foreignKey: 'user',
      displayField: 'profile_picture',
      endpoint: API_ENDPOINTS.landlordProfiles.list,
      showInDetail: true,
      editable: true,
    },
    {
      name: 'caretaker_profile',
      type: 'has_one',
      entityType: 'caretaker_profile',
      foreignKey: 'user',
      displayField: 'profile_picture',
      endpoint: API_ENDPOINTS.caretakerProfiles.list,
      showInDetail: true,
      editable: true,
    },
    {
      name: 'property_manager_profile',
      type: 'has_one',
      entityType: 'property_manager_profile',
      foreignKey: 'user',
      displayField: 'employee_id',
      endpoint: API_ENDPOINTS.propertyManagerProfiles.list,
      showInDetail: true,
      editable: true,
    },
  ],

  listView: {
    variant: 'table',
    pageSize: 10,
    enableSearch: true,
    enableFilters: true,
    enableSorting: true,
    enablePagination: true,
    enableSelection: true,
    enableBulkActions: true,
    enableExport: true,
    columns: [
      { key: 'first_name', title: 'First Name', dataIndex: 'first_name', sortable: true },
      { key: 'last_name', title: 'Last Name', dataIndex: 'last_name', sortable: true },
      { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
      { key: 'user_type', title: 'Type', dataIndex: 'user_type', filterable: true },
      { key: 'phone_number', title: 'Phone', dataIndex: 'phone_number' },
      { key: 'is_active', title: 'Active', dataIndex: 'is_active', filterable: true },
      { key: 'date_joined', title: 'Joined', dataIndex: 'date_joined', sortable: true },
    ],
  },

  detailView: {
    variant: 'detail',
    showRelatedEntities: true,
    enableEdit: true,
    enableDelete: true,
    sections: [
      {
        title: 'Basic Information',
        fields: ['username', 'email', 'first_name', 'last_name', 'user_type'],
        layout: 'grid',
        columns: 2,
      },
      {
        title: 'Contact Information',
        fields: ['phone_number', 'national_id'],
        layout: 'grid',
        columns: 2,
      },
      {
        title: 'Account Status',
        fields: ['is_active', 'date_joined', 'last_login'],
        layout: 'grid',
        columns: 3,
      },
    ],
  },

  formView: {
    variant: 'create',
    layout: 'two-column',
    columns: 2,
    fieldSpacing: 'md',
    showProgress: true,
    enableBulkImport: false,
    sections: [
      {
        title: 'Account Information',
        fields: ['username', 'email', 'user_type'],
        layout: 'grid',
        columns: 1,
      },
      {
        title: 'Personal Information',
        fields: ['first_name', 'last_name', 'phone_number', 'national_id'],
        layout: 'grid',
        columns: 2,
      },
    ],
  },

  actions: {
    enableCreate: true,
    enableEdit: true,
    enableDelete: true,
    enableView: true,
    enableDuplicate: false,
    bulkActions: [
      {
        key: 'bulk_activate',
        label: 'Activate Users',
        handler: async (selectedItems) => {
          // Implement bulk activation
          console.log('Activating users:', selectedItems)
        },
      },
      {
        key: 'bulk_deactivate',
        label: 'Deactivate Users',
        handler: async (selectedItems) => {
          // Implement bulk deactivation
          console.log('Deactivating users:', selectedItems)
        },
      },
    ],
    customActions: [
      {
        key: 'reset_password',
        label: 'Reset Password',
        variant: 'secondary',
        size: 'sm',
        position: 'dropdown',
        confirmMessage: 'Are you sure you want to reset this user\'s password?',
        handler: async (item) => {
          // Implement password reset
          console.log('Resetting password for user:', item.id)
        },
      },
      {
        key: 'impersonate',
        label: 'Impersonate User',
        variant: 'ghost',
        size: 'sm',
        position: 'dropdown',
        permission: 'admin',
        handler: async (item) => {
          // Implement user impersonation
          console.log('Impersonating user:', item.id)
        },
      },
    ],
    permissions: {
      create: ['admin'],
      edit: ['admin', 'property_manager'],
      delete: ['admin'],
      view: ['admin', 'property_manager', 'caretaker'],
      export: ['admin', 'property_manager'],
    },
  },

  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
    export: true,
    import: false,
  },
}

export const TENANT_PROFILE_CONFIG: EntityManagerConfig<TenantProfile> = {
  entityType: 'tenant_profile',
  displayName: 'Tenant Profile',
  displayNamePlural: 'Tenant Profiles',
  apiBaseUrl: API_BASE_URL,
  endpoints: API_ENDPOINTS.tenantProfiles,

  fields: [
    {
      name: 'user',
      label: 'User',
      type: 'relation',
      required: true,
      relation: {
        entityType: 'user',
        displayField: 'first_name,last_name',
        valueField: 'id',
        endpoint: API_ENDPOINTS.users.list,
        filters: { user_type: 'tenant' },
      },
    },
    { name: 'home_address', label: 'Home Address', type: 'textarea' },
    { name: 'emergency_contact_name', label: 'Emergency Contact Name', type: 'string' },
    { name: 'emergency_contact_phone', label: 'Emergency Contact Phone', type: 'string' },
    { name: 'profile_picture', label: 'Profile Picture', type: 'image' },
    { name: 'lease_start_date', label: 'Lease Start Date', type: 'date' },
    { name: 'payment_history', label: 'Payment History', type: 'textarea', readonly: true },
  ],

  relations: [
    {
      name: 'user_details',
      type: 'belongs_to',
      entityType: 'user',
      foreignKey: 'user',
      displayField: 'first_name,last_name',
      endpoint: API_ENDPOINTS.users.retrieve,
      showInDetail: true,
      editable: false,
    },
  ],

  listView: {
    variant: 'card',
    pageSize: 12,
    enableSearch: true,
    enableFilters: true,
    enableSorting: true,
    enablePagination: true,
    enableSelection: false,
    enableBulkActions: false,
    enableExport: true,
  },

  detailView: {
    variant: 'card',
    showRelatedEntities: true,
    enableEdit: true,
    enableDelete: false,
  },

  formView: {
    variant: 'create',
    layout: 'single-column',
    columns: 1,
    fieldSpacing: 'md',
    showProgress: false,
    enableBulkImport: false,
  },

  actions: {
    enableCreate: true,
    enableEdit: true,
    enableDelete: false,
    enableView: true,
    enableDuplicate: false,
    bulkActions: [],
    customActions: [],
    permissions: {
      create: ['admin', 'property_manager'],
      edit: ['admin', 'property_manager'],
      delete: [],
      view: ['admin', 'property_manager', 'caretaker'],
      export: ['admin', 'property_manager'],
    },
  },

  permissions: {
    create: true,
    read: true,
    update: true,
    delete: false,
    export: true,
    import: false,
  },
}

export const PROPERTY_CONFIG: EntityManagerConfig<Property> = {
  entityType: 'property',
  displayName: 'Property',
  displayNamePlural: 'Properties',
  apiBaseUrl: API_BASE_URL,
  endpoints: API_ENDPOINTS.apartments, // Will be overridden based on property type

  fields: [
    { name: 'property_name', label: 'Property Name', type: 'string', required: true, searchable: true, sortable: true },
    { name: 'property_description', label: 'Description', type: 'textarea', required: true },
    {
      name: 'property_status',
      label: 'Status',
      type: 'select',
      required: true,
      filterable: true,
      options: [
        { value: 'vacant', label: 'Vacant' },
        { value: 'occupied', label: 'Occupied' },
        { value: 'available', label: 'Available' },
        { value: 'unavailable', label: 'Unavailable' },
      ]
    },
    { name: 'address', label: 'Address', type: 'textarea', required: true },
    { name: 'postal_code', label: 'Postal Code', type: 'string', required: true },
    { name: 'town', label: 'Town', type: 'string', required: true, searchable: true },
    {
      name: 'landlord',
      label: 'Landlord',
      type: 'relation',
      filterable: true,
      relation: {
        entityType: 'user',
        displayField: 'first_name,last_name',
        valueField: 'id',
        endpoint: API_ENDPOINTS.users.list,
        filters: { user_type: 'landlord' },
      },
    },
    {
      name: 'caretaker',
      label: 'Caretaker',
      type: 'relation',
      filterable: true,
      relation: {
        entityType: 'user',
        displayField: 'first_name,last_name',
        valueField: 'id',
        endpoint: API_ENDPOINTS.users.list,
        filters: { user_type: 'caretaker' },
      },
    },
    { name: 'property_images', label: 'Property Images', type: 'image', multiple: true },
  ],

  relations: [
    {
      name: 'landlord_details',
      type: 'belongs_to',
      entityType: 'user',
      foreignKey: 'landlord',
      displayField: 'first_name,last_name',
      endpoint: API_ENDPOINTS.users.retrieve,
      showInDetail: true,
      editable: true,
    },
    {
      name: 'caretaker_details',
      type: 'belongs_to',
      entityType: 'user',
      foreignKey: 'caretaker',
      displayField: 'first_name,last_name',
      endpoint: API_ENDPOINTS.users.retrieve,
      showInDetail: true,
      editable: true,
    },
    {
      name: 'units',
      type: 'has_many',
      entityType: 'unit',
      foreignKey: 'property',
      displayField: 'unit_number',
      endpoint: API_ENDPOINTS.units.list,
      showInList: false,
      showInDetail: true,
      editable: true,
    },
    {
      name: 'maintenance_requests',
      type: 'has_many',
      entityType: 'maintenance_request',
      foreignKey: 'related_property',
      displayField: 'title',
      endpoint: API_ENDPOINTS.maintenanceRequests.list,
      showInList: false,
      showInDetail: true,
      editable: false,
    },
  ],

  listView: {
    variant: 'card',
    pageSize: 12,
    enableSearch: true,
    enableFilters: true,
    enableSorting: true,
    enablePagination: true,
    enableSelection: true,
    enableBulkActions: true,
    enableExport: true,
  },

  detailView: {
    variant: 'detail',
    showRelatedEntities: true,
    enableEdit: true,
    enableDelete: true,
    sections: [
      {
        title: 'Property Information',
        fields: ['property_name', 'property_description', 'property_status'],
        layout: 'grid',
        columns: 1,
      },
      {
        title: 'Location',
        fields: ['address', 'postal_code', 'town'],
        layout: 'grid',
        columns: 3,
      },
      {
        title: 'Management',
        fields: ['landlord', 'caretaker'],
        layout: 'grid',
        columns: 2,
      },
    ],
  },

  formView: {
    variant: 'create',
    layout: 'two-column',
    columns: 2,
    fieldSpacing: 'md',
    showProgress: true,
    enableBulkImport: false,
  },

  actions: {
    enableCreate: true,
    enableEdit: true,
    enableDelete: true,
    enableView: true,
    enableDuplicate: false,
    bulkActions: [
      {
        key: 'bulk_update_status',
        label: 'Update Status',
        handler: async (selectedItems) => {
          // Implement bulk status update
          console.log('Updating status for properties:', selectedItems)
        },
      },
    ],
    customActions: [
      {
        key: 'view_units',
        label: 'View Units',
        variant: 'primary',
        size: 'sm',
        position: 'toolbar',
        handler: async (item) => {
          // Navigate to units view
          console.log('Viewing units for property:', item.id)
        },
      },
      {
        key: 'maintenance_history',
        label: 'Maintenance History',
        variant: 'secondary',
        size: 'sm',
        position: 'dropdown',
        handler: async (item) => {
          // Show maintenance history
          console.log('Showing maintenance history for property:', item.id)
        },
      },
    ],
    permissions: {
      create: ['admin', 'property_manager'],
      edit: ['admin', 'property_manager', 'landlord'],
      delete: ['admin'],
      view: ['admin', 'property_manager', 'landlord', 'caretaker'],
      export: ['admin', 'property_manager'],
    },
  },

  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
    export: true,
    import: false,
  },
}

// ===== UTILITY FUNCTIONS =====

export function getEntityConfig(entityType: string): EntityManagerConfig<any> | null {
  switch (entityType) {
    case 'user':
      return USER_CONFIG
    case 'tenant_profile':
      return TENANT_PROFILE_CONFIG
    case 'property':
      return PROPERTY_CONFIG
    default:
      return null
  }
}

export function getApiEndpoint(entityType: string, operation: string, id?: string | number): string {
  const config = getEntityConfig(entityType)
  if (!config) return ''

  let endpoint = config.endpoints[operation as keyof typeof config.endpoints] as string
  if (id && endpoint.includes('{id}')) {
    endpoint = endpoint.replace('{id}', id.toString())
  }

  return `${config.apiBaseUrl}${endpoint}`
}