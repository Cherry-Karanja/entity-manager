// backendEntities.ts
// Entity configurations for Django backend integration

import { EntityConfig, EntityField } from '../components/entityManager/manager/types'
import { EntityListColumn } from '../components/entityManager/EntityList/types'
import {
  USERS_URL,
  TENANT_PROFILES_URL,
  LANDLORD_PROFILES_URL,
  CARETAKER_PROFILES_URL,
  PROPERTY_MANAGER_PROFILES_URL,
  APARTMENTS_URL,
  HOUSES_URL,
  UNITS_URL,
  MAINTENANCE_REQUESTS_URL,
  RENTS_URL,
  RENT_PAYMENTS_URL
} from '../handler/apiConfig'

// ===== USER ENTITY CONFIG =====
export const userEntityConfig: EntityConfig = {
  name: 'user',
  namePlural: 'users',
  displayName: 'User',
  fields: [
    {
      key: 'id',
      label: 'ID',
      type: 'string',
      readOnly: true
    },
    {
      key: 'username',
      label: 'Username',
      type: 'string',
      required: true,
      minLength: 3,
      maxLength: 150
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true
    },
    {
      key: 'first_name',
      label: 'First Name',
      type: 'string',
      maxLength: 30
    },
    {
      key: 'last_name',
      label: 'Last Name',
      type: 'string',
      maxLength: 30
    },
    {
      key: 'user_type',
      label: 'User Type',
      type: 'select',
      required: true,
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'tenant', label: 'Tenant' },
        { value: 'landlord', label: 'Landlord' },
        { value: 'caretaker', label: 'Caretaker' },
        { value: 'property_manager', label: 'Property Manager' }
      ],
      defaultValue: 'tenant'
    },
    {
      key: 'phone_number',
      label: 'Phone Number',
      type: 'string',
      required: true
    },
    {
      key: 'national_id',
      label: 'National ID',
      type: 'string',
      required: true,
      maxLength: 20
    },
    {
      key: 'is_active',
      label: 'Active',
      type: 'boolean',
      defaultValue: true
    },
    {
      key: 'date_joined',
      label: 'Date Joined',
      type: 'date',
      readOnly: true
    },
    {
      key: 'updated_at',
      label: 'Updated At',
      type: 'date',
      readOnly: true
    }
  ],
  endpoints: {
    list: USERS_URL,
    create: USERS_URL,
    update: `${USERS_URL}{id}/`,
    delete: `${USERS_URL}{id}/`
  },
  listConfig: {
    columns: [
      { id: 'id', header: 'ID', sortable: true },
      { id: 'username', header: 'Username', sortable: true },
      { id: 'email', header: 'Email', sortable: true },
      { id: 'first_name', header: 'First Name', sortable: true },
      { id: 'last_name', header: 'Last Name', sortable: true },
      { id: 'user_type', header: 'Type' },
      { id: 'phone_number', header: 'Phone' },
      { id: 'is_active', header: 'Active' },
      { id: 'date_joined', header: 'Joined', sortable: true }
    ],
    searchableFields: ['username', 'email', 'first_name', 'last_name', 'phone_number'],
    defaultSort: { field: 'date_joined', direction: 'desc' },
    pageSize: 20
  }
}

// ===== TENANT PROFILE ENTITY CONFIG =====
export const tenantProfileEntityConfig: EntityConfig = {
  name: 'tenantProfile',
  namePlural: 'tenantProfiles',
  displayName: 'Tenant Profile',
  fields: [
    {
      key: 'id',
      label: 'ID',
      type: 'string',
      readOnly: true
    },
    {
      key: 'user',
      label: 'User',
      type: 'string',
      foreignKey: true,
      relatedEntity: 'user',
      displayField: 'username',
      required: true
    },
    {
      key: 'phone_number',
      label: 'Phone Number',
      type: 'string'
    },
    {
      key: 'emergency_contact_name',
      label: 'Emergency Contact Name',
      type: 'string'
    },
    {
      key: 'emergency_contact_phone',
      label: 'Emergency Contact Phone',
      type: 'string'
    },
    {
      key: 'monthly_income',
      label: 'Monthly Income',
      type: 'number'
    },
    {
      key: 'employment_status',
      label: 'Employment Status',
      type: 'select',
      options: [
        { value: 'employed', label: 'Employed' },
        { value: 'self_employed', label: 'Self Employed' },
        { value: 'unemployed', label: 'Unemployed' },
        { value: 'student', label: 'Student' }
      ]
    }
  ],
  endpoints: {
    list: TENANT_PROFILES_URL,
    create: TENANT_PROFILES_URL,
    update: `${TENANT_PROFILES_URL}{id}/`,
    delete: `${TENANT_PROFILES_URL}{id}/`
  },
  listConfig: {
    columns: [
      { id: 'id', header: 'ID', sortable: true },
      { id: 'user', header: 'User' },
      { id: 'phone_number', header: 'Phone' },
      { id: 'employment_status', header: 'Employment' },
      { id: 'monthly_income', header: 'Income' }
    ],
    searchableFields: ['user', 'phone_number'],
    defaultSort: { field: 'id', direction: 'desc' },
    pageSize: 20
  }
}

// ===== APARTMENT ENTITY CONFIG =====
export const apartmentEntityConfig: EntityConfig = {
  name: 'apartment',
  namePlural: 'apartments',
  displayName: 'Apartment',
  fields: [
    {
      key: 'id',
      label: 'ID',
      type: 'string',
      readOnly: true
    },
    {
      key: 'name',
      label: 'Name',
      type: 'string',
      required: true
    },
    {
      key: 'address',
      label: 'Address',
      type: 'textarea',
      required: true
    },
    {
      key: 'city',
      label: 'City',
      type: 'string',
      required: true
    },
    {
      key: 'state',
      label: 'State',
      type: 'string',
      required: true
    },
    {
      key: 'zip_code',
      label: 'ZIP Code',
      type: 'string',
      required: true
    },
    {
      key: 'total_units',
      label: 'Total Units',
      type: 'number',
      required: true,
      min: 1
    },
    {
      key: 'year_built',
      label: 'Year Built',
      type: 'number',
      min: 1800,
      max: new Date().getFullYear()
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea'
    }
  ],
  endpoints: {
    list: APARTMENTS_URL,
    create: APARTMENTS_URL,
    update: `${APARTMENTS_URL}{id}/`,
    delete: `${APARTMENTS_URL}{id}/`
  },
  listConfig: {
    columns: [
      { id: 'id', header: 'ID', sortable: true },
      { id: 'name', header: 'Name', sortable: true },
      { id: 'address', header: 'Address' },
      { id: 'city', header: 'City', sortable: true },
      { id: 'total_units', header: 'Units', sortable: true },
      { id: 'year_built', header: 'Year Built', sortable: true }
    ],
    searchableFields: ['name', 'address', 'city'],
    defaultSort: { field: 'name', direction: 'asc' },
    pageSize: 20
  }
}

// ===== UNIT ENTITY CONFIG =====
export const unitEntityConfig: EntityConfig = {
  name: 'unit',
  namePlural: 'units',
  displayName: 'Unit',
  fields: [
    {
      key: 'id',
      label: 'ID',
      type: 'string',
      readOnly: true
    },
    {
      key: 'apartment',
      label: 'Apartment',
      type: 'string',
      foreignKey: true,
      relatedEntity: 'apartment',
      displayField: 'name',
      required: true
    },
    {
      key: 'unit_number',
      label: 'Unit Number',
      type: 'string',
      required: true
    },
    {
      key: 'bedrooms',
      label: 'Bedrooms',
      type: 'number',
      required: true,
      min: 0
    },
    {
      key: 'bathrooms',
      label: 'Bathrooms',
      type: 'number',
      required: true,
      min: 0
    },
    {
      key: 'square_feet',
      label: 'Square Feet',
      type: 'number',
      min: 0
    },
    {
      key: 'monthly_rent',
      label: 'Monthly Rent',
      type: 'number',
      required: true,
      min: 0
    },
    {
      key: 'is_available',
      label: 'Available',
      type: 'boolean',
      defaultValue: true
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea'
    }
  ],
  endpoints: {
    list: UNITS_URL,
    create: UNITS_URL,
    update: `${UNITS_URL}{id}/`,
    delete: `${UNITS_URL}{id}/`
  },
  listConfig: {
    columns: [
      { id: 'id', header: 'ID', sortable: true },
      { id: 'apartment', header: 'Apartment' },
      { id: 'unit_number', header: 'Unit #', sortable: true },
      { id: 'bedrooms', header: 'Beds', sortable: true },
      { id: 'bathrooms', header: 'Baths', sortable: true },
      { id: 'monthly_rent', header: 'Rent', sortable: true },
      { id: 'is_available', header: 'Available' }
    ],
    searchableFields: ['unit_number', 'apartment'],
    defaultSort: { field: 'unit_number', direction: 'asc' },
    pageSize: 20
  }
}

// ===== MAINTENANCE REQUEST ENTITY CONFIG =====
export const maintenanceRequestEntityConfig: EntityConfig = {
  name: 'maintenanceRequest',
  namePlural: 'maintenanceRequests',
  displayName: 'Maintenance Request',
  fields: [
    {
      key: 'id',
      label: 'ID',
      type: 'string',
      readOnly: true
    },
    {
      key: 'unit',
      label: 'Unit',
      type: 'string',
      foreignKey: true,
      relatedEntity: 'unit',
      displayField: 'unit_number',
      required: true
    },
    {
      key: 'tenant',
      label: 'Tenant',
      type: 'string',
      foreignKey: true,
      relatedEntity: 'tenantProfile',
      displayField: 'user'
    },
    {
      key: 'title',
      label: 'Title',
      type: 'string',
      required: true
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      required: true
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      required: true,
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'emergency', label: 'Emergency' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ],
      defaultValue: 'pending'
    },
    {
      key: 'created_at',
      label: 'Created At',
      type: 'date',
      readOnly: true
    },
    {
      key: 'updated_at',
      label: 'Updated At',
      type: 'date',
      readOnly: true
    }
  ],
  endpoints: {
    list: MAINTENANCE_REQUESTS_URL,
    create: MAINTENANCE_REQUESTS_URL,
    update: `${MAINTENANCE_REQUESTS_URL}{id}/`,
    delete: `${MAINTENANCE_REQUESTS_URL}{id}/`
  },
  listConfig: {
    columns: [
      { id: 'id', header: 'ID', sortable: true },
      { id: 'title', header: 'Title', sortable: true },
      { id: 'unit', header: 'Unit' },
      { id: 'priority', header: 'Priority' },
      { id: 'status', header: 'Status' },
      { id: 'created_at', header: 'Created', sortable: true }
    ],
    searchableFields: ['title', 'description'],
    defaultSort: { field: 'created_at', direction: 'desc' },
    pageSize: 20
  }
}

// ===== RENT ENTITY CONFIG =====
export const rentEntityConfig: EntityConfig = {
  name: 'rent',
  namePlural: 'rents',
  displayName: 'Rent Agreement',
  fields: [
    {
      key: 'id',
      label: 'ID',
      type: 'string',
      readOnly: true
    },
    {
      key: 'unit',
      label: 'Unit',
      type: 'string',
      foreignKey: true,
      relatedEntity: 'unit',
      displayField: 'unit_number',
      required: true
    },
    {
      key: 'tenant',
      label: 'Tenant',
      type: 'string',
      foreignKey: true,
      relatedEntity: 'tenantProfile',
      displayField: 'user',
      required: true
    },
    {
      key: 'monthly_rent',
      label: 'Monthly Rent',
      type: 'number',
      required: true,
      min: 0
    },
    {
      key: 'security_deposit',
      label: 'Security Deposit',
      type: 'number',
      required: true,
      min: 0
    },
    {
      key: 'lease_start_date',
      label: 'Lease Start Date',
      type: 'date',
      required: true
    },
    {
      key: 'lease_end_date',
      label: 'Lease End Date',
      type: 'date',
      required: true
    },
    {
      key: 'is_active',
      label: 'Active',
      type: 'boolean',
      defaultValue: true
    }
  ],
  endpoints: {
    list: RENTS_URL,
    create: RENTS_URL,
    update: `${RENTS_URL}{id}/`,
    delete: `${RENTS_URL}{id}/`
  },
  listConfig: {
    columns: [
      { id: 'id', header: 'ID', sortable: true },
      { id: 'unit', header: 'Unit' },
      { id: 'tenant', header: 'Tenant' },
      { id: 'monthly_rent', header: 'Rent', sortable: true },
      { id: 'lease_start_date', header: 'Start Date', sortable: true },
      { id: 'lease_end_date', header: 'End Date', sortable: true },
      { id: 'is_active', header: 'Active' }
    ],
    searchableFields: ['unit', 'tenant'],
    defaultSort: { field: 'lease_start_date', direction: 'desc' },
    pageSize: 20
  }
}

// ===== EXPORT ALL ENTITY CONFIGS =====
export const backendEntityConfigs = {
  user: userEntityConfig,
  tenantProfile: tenantProfileEntityConfig,
  landlordProfile: {
    ...tenantProfileEntityConfig,
    name: 'landlordProfile',
    namePlural: 'landlordProfiles',
    displayName: 'Landlord Profile',
    endpoints: {
      list: LANDLORD_PROFILES_URL,
      create: LANDLORD_PROFILES_URL,
      update: `${LANDLORD_PROFILES_URL}{id}/`,
      delete: `${LANDLORD_PROFILES_URL}{id}/`
    }
  },
  caretakerProfile: {
    ...tenantProfileEntityConfig,
    name: 'caretakerProfile',
    namePlural: 'caretakerProfiles',
    displayName: 'Caretaker Profile',
    endpoints: {
      list: CARETAKER_PROFILES_URL,
      create: CARETAKER_PROFILES_URL,
      update: `${CARETAKER_PROFILES_URL}{id}/`,
      delete: `${CARETAKER_PROFILES_URL}{id}/`
    }
  },
  propertyManagerProfile: {
    ...tenantProfileEntityConfig,
    name: 'propertyManagerProfile',
    namePlural: 'propertyManagerProfiles',
    displayName: 'Property Manager Profile',
    endpoints: {
      list: PROPERTY_MANAGER_PROFILES_URL,
      create: PROPERTY_MANAGER_PROFILES_URL,
      update: `${PROPERTY_MANAGER_PROFILES_URL}{id}/`,
      delete: `${PROPERTY_MANAGER_PROFILES_URL}{id}/`
    }
  },
  apartment: apartmentEntityConfig,
  house: {
    ...apartmentEntityConfig,
    name: 'house',
    namePlural: 'houses',
    displayName: 'House',
    endpoints: {
      list: HOUSES_URL,
      create: HOUSES_URL,
      update: `${HOUSES_URL}{id}/`,
      delete: `${HOUSES_URL}{id}/`
    }
  },
  unit: unitEntityConfig,
  maintenanceRequest: maintenanceRequestEntityConfig,
  rent: rentEntityConfig,
  rentPayment: {
    name: 'rentPayment',
    namePlural: 'rentPayments',
    displayName: 'Rent Payment',
    fields: [
      {
        key: 'id',
        label: 'ID',
        type: 'string',
        readOnly: true
      },
      {
        key: 'rent',
        label: 'Rent Agreement',
        type: 'string',
        foreignKey: true,
        relatedEntity: 'rent',
        required: true
      },
      {
        key: 'amount',
        label: 'Amount',
        type: 'number',
        required: true,
        min: 0
      },
      {
        key: 'payment_date',
        label: 'Payment Date',
        type: 'date',
        required: true
      },
      {
        key: 'payment_method',
        label: 'Payment Method',
        type: 'select',
        options: [
          { value: 'cash', label: 'Cash' },
          { value: 'check', label: 'Check' },
          { value: 'bank_transfer', label: 'Bank Transfer' },
          { value: 'credit_card', label: 'Credit Card' }
        ]
      },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'completed', label: 'Completed' },
          { value: 'failed', label: 'Failed' },
          { value: 'refunded', label: 'Refunded' }
        ],
        defaultValue: 'pending'
      }
    ],
    endpoints: {
      list: RENT_PAYMENTS_URL,
      create: RENT_PAYMENTS_URL,
      update: `${RENT_PAYMENTS_URL}{id}/`,
      delete: `${RENT_PAYMENTS_URL}{id}/`
    },
    listConfig: {
      columns: [
        { id: 'id', header: 'ID', sortable: true },
        { id: 'rent', header: 'Rent Agreement' },
        { id: 'amount', header: 'Amount', sortable: true },
        { id: 'payment_date', header: 'Date', sortable: true },
        { id: 'payment_method', header: 'Method' },
        { id: 'status', header: 'Status' }
      ],
      searchableFields: ['rent'],
      defaultSort: { field: 'payment_date', direction: 'desc' },
      pageSize: 20
    }
  }
} as const

export type BackendEntityType = keyof typeof backendEntityConfigs