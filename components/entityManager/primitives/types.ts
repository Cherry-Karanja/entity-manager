/**
 * Entity Manager Primitive Types
 * 
 * Core type definitions for the entity manager system.
 */

import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

// Re-export from types/entity.ts
export type { FilterConfig, SortConfig, PaginationConfig, FilterOperator } from './types/entity';

// Base Entity
export interface BaseEntity {
  id: string | number;
  created_at?: string;
  updated_at?: string;
}

// Field Configuration
export interface FieldConfig<T = any> {
  name: keyof T;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'boolean' | 'select' | 'textarea' | 'date' | 'datetime' | 'file' | 'image' | 'json';
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  validation?: any;
  options?: Array<{ label: string; value: any }>;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  icon?: LucideIcon;
  visible?: boolean | ((entity?: T) => boolean);
  disabled?: boolean | ((entity?: T) => boolean);
  defaultValue?: any;
}

// Column Configuration
export interface ColumnConfig<T = any> {
  name: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  visible?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: any, entity: T) => ReactNode;
  render?: (entity: T) => ReactNode;
}

// List Configuration
export interface ListConfig {
  defaultView?: 'table' | 'grid' | 'list' | 'kanban' | 'timeline' | 'calendar' | 'map' | 'gallery';
  defaultPageSize?: number;
  defaultSort?: { field: string; direction: 'asc' | 'desc' };
  enabledViews?: Array<'table' | 'grid' | 'list' | 'kanban' | 'timeline' | 'calendar' | 'map' | 'gallery'>;
  density?: 'comfortable' | 'compact' | 'spacious';
}

// Form Section
export interface FormSection<T = any> {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  fields: Array<keyof T>;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

// Form Layout
export interface FormLayout {
  mode: 'tabs' | 'sections';
  columns?: 1 | 2 | 3;
}

// Form Mode
export type FormMode = 'create' | 'edit' | 'view';

// View Field
export interface ViewField<T = any> {
  name: keyof T;
  label: string;
  type?: 'text' | 'email' | 'url' | 'date' | 'datetime' | 'boolean' | 'badge' | 'image' | 'json';
  format?: (value: any, entity: T) => ReactNode;
  render?: (entity: T) => ReactNode;
  copyable?: boolean;
  icon?: LucideIcon;
}

// View Group
export interface ViewGroup<T = any> {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  fields: Array<keyof T>;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

// Action Configuration
export interface Action<T = any> {
  id: string;
  type: 'navigation' | 'confirm' | 'form' | 'bulk' | 'custom';
  label: string;
  icon?: LucideIcon;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  path?: string | ((entity: T) => string);
  confirmTitle?: string;
  confirmMessage?: string | ((entity: T) => string);
  confirmButton?: string;
  confirmButtonVariant?: 'default' | 'destructive';
  onConfirm?: (entity: T) => Promise<void>;
  onExecute?: (entities: T[]) => Promise<void>;
  permissions?: string[];
  visible?: boolean | ((entity: T) => boolean);
  disabled?: boolean | ((entity: T) => boolean);
}

// Entity Configuration
export interface EntityConfig<T extends BaseEntity = BaseEntity> {
  // Metadata
  name: string;
  label: string;
  labelPlural: string;
  icon?: string;
  description?: string;
  
  // Fields
  fields: FieldConfig<T>[];
  
  // List
  columns: ColumnConfig<T>[];
  listConfig?: ListConfig;
  
  // Form
  formLayout?: FormLayout;
  formSections?: FormSection<T>[];
  formMode?: Record<FormMode, Partial<FieldConfig<T>>[]>;
  
  // View
  viewFields?: ViewField<T>[];
  viewGroups?: ViewGroup<T>[];
  
  // Actions
  actions?: Action<T>[];
  bulkActions?: Action<T>[];
  
  // API
  apiEndpoint?: string;
  
  // Display
  displayField?: keyof T;
  searchFields?: Array<keyof T>;
  defaultSort?: { field: keyof T; direction: 'asc' | 'desc' };
}
