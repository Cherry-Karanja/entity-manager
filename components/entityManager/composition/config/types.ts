/**
 * Configuration Builder Types
 * 
 * Type definitions for configuration builders.
 */

import { BaseEntity } from '../../primitives/types';
import { Column } from '../../components/list/types';
import { FormField, FormLayout, FieldSection } from '../../components/form/types';
import { ViewField } from '../../components/view/types';
import { Action } from '../../components/actions/types';
import { ExportField } from '../../components/exporter/types';

/**
 * Entity configuration
 */
export interface EntityConfig<T extends BaseEntity = BaseEntity> {
  /** Entity name */
  name: string;
  
  /** Entity display name (plural) */
  pluralName?: string;
  
  /** Entity description */
  description?: string;
  
  /** List columns */
  columns: Column<T>[];
  
  /** Form fields */
  fields: FormField[];
  
  /** Form layout */
  formLayout?: FormLayout;
  
  /** Form sections */
  formSections?: FieldSection[];
  
  /** View fields */
  viewFields: ViewField[];
  
  /** Actions */
  actions: Action[];
  
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
