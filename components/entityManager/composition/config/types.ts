/**
 * Configuration Builder Types
 * 
 * Type definitions for configuration builders.
 */

import { BaseEntity} from '../../primitives/types';
import { EntityActionsProps } from '../../components/actions/types';
import { EntityExporterProps } from '../../components/exporter/types';
import { EntityFormProps } from '../../components/form/types';
import { EntityListProps } from '../../components/list/types';
import { EntityViewProps } from '../../components/view/types';

/**
 * Entity actions configuration
 */
export type EntityActionsConfig<T extends BaseEntity = BaseEntity> = Omit<EntityActionsProps<T>, 'entity' | 'context' | 'onActionComplete' | 'onActionError'>;

/**
 * Entity exporter configuration
 */
export type EntityExporterConfig<T extends BaseEntity = BaseEntity> = Omit<EntityExporterProps<T>, 'data' | 'onExportStart' | 'onExportComplete' | 'onExportError'>;

/**
 * Entity form configuration
 */
export type EntityFormConfig<T extends BaseEntity = BaseEntity> = Omit<EntityFormProps<T>, 'initialValues' | 'entity' | 'onSubmit' | 'onCancel' | 'onChange' | 'onValidate'>;

/**
 * Entity list configuration
 */
export type EntityListConfig<T extends BaseEntity = BaseEntity> = Omit<EntityListProps<T>, 'data' | 'selectedIds' | 'onSelectionChange' | 'onRowClick' | 'onRowDoubleClick' | 'onPaginationChange' | 'onSortChange' | 'onFilterChange' | 'onSearchChange'>;

/**
 * Entity view configuration
 */
export type EntityViewConfig<T extends BaseEntity = BaseEntity> = Omit<EntityViewProps<T>, 'entity' | 'onCopy'>;

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
  
  /** List configuration */
  list: EntityListConfig<T>;
  
  /** Form configuration */
  form: EntityFormConfig<T>;
  
  /** View configuration */
  view: EntityViewConfig<T>;
  
  /** Actions configuration */
  actions: EntityActionsConfig<T>;
  
  /** Exporter configuration */
  exporter: EntityExporterConfig<T>;
  
  /** Custom validation function */
  onValidate?: (values: Partial<T>) => Record<string, string> | Promise<Record<string, string>>;
  
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
