/**
 * Configuration Types
 * 
 * Core configuration types for entity management system.
 * 
 * @module primitives/types/config
 */

import { BaseEntity } from './entity';
import { AnyFieldConfig, FieldGroup } from './field';
import { AnyActionConfig } from './action';
import { EntityEndpoints, CacheConfig } from './api';
import { ValidationSchema } from './validation';

/**
 * View mode type
 */
export type ViewMode =
  | 'table'
  | 'card'
  | 'grid'
  | 'list'
  | 'compact'
  | 'timeline'
  | 'detailed'
  | 'gallery';

/**
 * Form layout type
 */
export type FormLayout = 'vertical' | 'horizontal' | 'grid' | 'tabs' | 'wizard';

/**
 * Detail view mode
 */
export type DetailViewMode = 'detail' | 'card' | 'summary' | 'timeline';

/**
 * Permission configuration
 */
export interface PermissionConfig {
  /** Can create entities */
  create?: boolean;
  /** Can read/view entities */
  read?: boolean;
  /** Can update entities */
  update?: boolean;
  /** Can delete entities */
  delete?: boolean;
  /** Can export entities */
  export?: boolean;
  /** Can perform bulk operations */
  bulk?: boolean;
  /** Custom permissions */
  custom?: Record<string, boolean>;
}

/**
 * Display configuration
 */
export interface DisplayConfig {
  /** Display name singular (e.g., "User") */
  singular: string;
  /** Display name plural (e.g., "Users") */
  plural: string;
  /** Display icon */
  icon?: string;
  /** Display color */
  color?: string;
  /** Display description */
  description?: string;
}

/**
 * List view configuration
 */
export interface ListConfig {
  /** Default view mode */
  defaultView?: ViewMode;
  /** Available view modes */
  availableViews?: ViewMode[];
  /** Default page size */
  defaultPageSize?: number;
  /** Available page sizes */
  pageSizeOptions?: number[];
  /** Default sort */
  defaultSort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  /** Whether to enable search */
  searchEnabled?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Whether to enable filters */
  filtersEnabled?: boolean;
  /** Whether to enable bulk selection */
  bulkSelectionEnabled?: boolean;
  /** Whether to show row numbers */
  showRowNumbers?: boolean;
  /** Whether rows are clickable */
  rowsClickable?: boolean;
  /** Row click action */
  onRowClick?: 'view' | 'edit' | 'custom';
}

/**
 * Form configuration
 */
export interface FormConfig {
  /** Form layout */
  layout?: FormLayout;
  /** Show cancel button */
  showCancel?: boolean;
  /** Show reset button */
  showReset?: boolean;
  /** Submit button text */
  submitText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Whether to validate on change */
  validateOnChange?: boolean;
  /** Whether to validate on blur */
  validateOnBlur?: boolean;
  /** Form width */
  width?: string | number;
}

/**
 * View configuration
 */
export interface ViewConfig {
  /** Detail view mode */
  mode?: DetailViewMode;
  /** Show edit button */
  showEdit?: boolean;
  /** Show delete button */
  showDelete?: boolean;
  /** Show back button */
  showBack?: boolean;
  /** Enable copy to clipboard */
  enableCopy?: boolean;
}

/**
 * Entity base configuration
 */
export interface EntityConfig<T extends BaseEntity = BaseEntity> {
  /** Entity name */
  name: string;
  /** Phantom type field to utilize generic T */
  _entityType?: T;
  /** Display configuration */
  display: DisplayConfig;
  /** API endpoints */
  endpoints: EntityEndpoints;
  /** Entity fields */
  fields: AnyFieldConfig[];
  /** Field groups (optional) */
  fieldGroups?: FieldGroup[];
  /** Entity actions */
  actions?: AnyActionConfig[];
  /** Permissions */
  permissions?: PermissionConfig;
  /** Validation schema */
  validationSchema?: ValidationSchema;
  /** List configuration */
  list?: ListConfig;
  /** Form configuration */
  form?: FormConfig;
  /** View configuration */
  view?: ViewConfig;
  /** Cache configuration */
  cache?: CacheConfig;
  /** Custom metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Feature flags
 */
export interface FeatureFlags {
  /** Enable offline support */
  offline?: boolean;
  /** Enable real-time updates */
  realtime?: boolean;
  /** Enable optimistic UI */
  optimistic?: boolean;
  /** Enable collaborative editing */
  collaborative?: boolean;
  /** Enable audit logging */
  auditLog?: boolean;
  /** Enable version history */
  versionHistory?: boolean;
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  /** Primary color */
  primary?: string;
  /** Secondary color */
  secondary?: string;
  /** Success color */
  success?: string;
  /** Warning color */
  warning?: string;
  /** Danger color */
  danger?: string;
  /** Border radius */
  borderRadius?: string;
  /** Font family */
  fontFamily?: string;
}

/**
 * Global configuration
 */
export interface GlobalConfig {
  /** Base API URL */
  apiBaseUrl?: string;
  /** Default headers */
  defaultHeaders?: Record<string, string>;
  /** Feature flags */
  features?: FeatureFlags;
  /** Theme configuration */
  theme?: ThemeConfig;
  /** Locale/language */
  locale?: string;
  /** Date format */
  dateFormat?: string;
  /** Time format */
  timeFormat?: string;
  /** Currency */
  currency?: string;
}
