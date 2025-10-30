// Export all types from their respective modules

// API Types
export type { ApiErrorResponse, DjangoPaginatedResponse } from './api';

// Authentication Types
export type {
  User,
  SubscriptionTier,
  AuthState,
  SUBSCRIPTION_TIERS
} from './auth';
export interface FormFieldConfig {
  key: string
  label: string
  type: 'string' | 'number' | 'date' | 'boolean' | 'select' | 'textarea' | 'email' | 'url' | 'password' | 'file'
  required?: boolean
  placeholder?: string
  description?: string
  options?: Array<{ value: string | number; label: string }>
  validation?: (value: unknown) => boolean | string
  defaultValue?: unknown
  disabled?: boolean
  readOnly?: boolean
  permissions?: {
    create?: boolean
    update?: boolean
    read?: boolean
    delete?: boolean
  }
  relationshipType?: 'one-to-one' | 'many-to-one' | 'one-to-many' | 'many-to-many'
  condition?: (formData: Record<string, unknown>) => boolean
  accept?: string // For file inputs - MIME types or file extensions
}