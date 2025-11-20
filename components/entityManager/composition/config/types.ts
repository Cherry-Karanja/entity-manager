/**
 * Configuration Builder Types
 * 
 * Type definitions for configuration builders.
 */

import { BaseEntity, FormMode } from '../../primitives/types';
import { Column } from '../../components/list/types';
import { FormField, FormLayout, FieldSection } from '../../components/form/types';
import { Action } from '../../components/actions/types';
import { ExportField } from '../../components/exporter/types';
import { ViewField } from '../../components/view/types';

/**
 * Entity configuration
 */
export interface EntityConfig<T extends BaseEntity = BaseEntity> {
  /** Entity name */
  name: string;
  
  /** Entity display name (plural) */
  pluralName?: string;
  
  /** Entity label (alias for name) */
  label: string;
  
  /** Entity label plural (alias for pluralName) */
  labelPlural: string;
  
  /** Entity description */
  description?: string;
  
  /** List columns */
  columns: Column<T>[];
  
  /** Form fields */
  fields: FormField<T>[];
  
  /** Form layout */
  formLayout?: FormLayout;
  
  /** Form sections */
  formSections?: FieldSection[];
  
  /** Form mode configurations */
  formMode?: Record<FormMode, Partial<{ layout?: FormLayout; sections?: FieldSection[]; fields?: FormField<T>[] }>>;
  
  /** View fields */
  viewFields: ViewField<T>[];
  
  /** Actions */
  actions: Action<T>[];
  
  /** Custom validation function */
  onValidate?: (values: Partial<T>) => Record<string, string> | Promise<Record<string, string>>;
  
  /** Export fields */
  exportFields: ExportField[];
  
  /** Default sort */
  defaultSort?: { field: string; direction: 'asc' | 'desc' };
  
  /** Default page size */
  defaultPageSize?: number;
  
  /** Searchable fields */
  searchableFields?: string[];
  
  /** Filterable fields */
  filterableFields?: string[];
  
  /** Title field */
  titleField?: string;
  
  /** Subtitle field */
  subtitleField?: string;
  
  /** Image field */
  imageField?: string;
  
  /** Date field */
  dateField?: string;
  
  /** Display field (for single field display) */
  displayField?: string;
  
  /** API endpoint */
  apiEndpoint?: string;
  
  /** Icon */
  icon?: string;
  
  /** Permissions */
  permissions?: {
    create?: boolean;
    read?: boolean;
    update?: boolean;
    delete?: boolean;
    export?: boolean;
  };
  
  /** Metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Builder callback type
 */
export type BuilderCallback<T, B> = (builder: B) => T | void;

/**
 * Field builder options
 */
export interface FieldBuilderOptions {
  /** Field name */
  name: string;
  
  /** Field label */
  label: string;
  
  /** Field type */
  type?: string;
}

/**
 * Column builder options
 */
export interface ColumnBuilderOptions {
  /** Column key */
  key: string;
  
  /** Column label */
  label: string;
}

/**
 * Action builder options
 */
export interface ActionBuilderOptions {
  /** Action ID */
  id: string;
  
  /** Action label */
  label: string;
  
  /** Action type */
  type?: string;
}

/**
 * Config adapter interface
 */
export interface ConfigAdapter<T = unknown> {
  /** Adapt external config to internal format */
  adapt: (externalConfig: T) => Partial<EntityConfig>;
  
  /** Validate external config */
  validate?: (externalConfig: T) => boolean;
}
