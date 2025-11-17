/**
 * EntityView Component Types
 * 
 * Type definitions for the entity detail view component.
 * Supports 4 display modes: detail, card, summary, timeline.
 */

import { BaseEntity } from '../../primitives/types';

/**
 * View mode enumeration
 */
export type ViewMode = 'detail' | 'card' | 'summary' | 'timeline';

/**
 * Field group for organizing fields
 */
export interface FieldGroup {
  /** Group ID */
  id: string;
  
  /** Group label */
  label: string;
  
  /** Group description */
  description?: string;
  
  /** Fields in this group */
  fields: string[];
  
  /** Collapsible group */
  collapsible?: boolean;
  
  /** Initially collapsed */
  defaultCollapsed?: boolean;
  
  /** Display order */
  order?: number;
}

/**
 * View field definition
 */
export interface ViewField<T extends BaseEntity = BaseEntity> {
  /** Field key from entity */
  key: keyof T | string;
  
  /** Display label */
  label: string;
  
  /** Field type for rendering */
  type?: 'text' | 'number' | 'date' | 'boolean' | 'email' | 'url' | 'image' | 'file' | 'json' | 'custom';
  
  /** Custom formatter */
  formatter?: (value: unknown, entity: T) => React.ReactNode;
  
  /** Custom renderer */
  render?: (entity: T) => React.ReactNode;
  
  /** Show in summary view */
  showInSummary?: boolean;
  
  /** Enable copy to clipboard */
  copyable?: boolean;
  
  /** Help text */
  helpText?: string;
  
  /** Visibility condition */
  visible?: boolean | ((entity: T) => boolean);
  
  /** Field group */
  group?: string;
  
  /** Display order */
  order?: number;
}

/**
 * Tab definition for tabbed view
 */
export interface ViewTab<T extends BaseEntity = BaseEntity> {
  /** Tab ID */
  id: string;
  
  /** Tab label */
  label: string;
  
  /** Tab icon */
  icon?: string | React.ReactNode;
  
  /** Tab content */
  content: React.ComponentType<{ entity: T }> | React.ReactNode;
  
  /** Badge count */
  badge?: number | ((entity: T) => number);
  
  /** Lazy load */
  lazy?: boolean;
}

/**
 * EntityView component props
 */
export interface EntityViewProps<T extends BaseEntity = BaseEntity> {
  /** Entity to display */
  entity: T;
  
  /** Fields to display */
  fields: ViewField<T>[];
  
  /** Field groups */
  groups?: FieldGroup[];
  
  /** View mode */
  mode?: ViewMode;
  
  /** Show metadata (created, updated) */
  showMetadata?: boolean;
  
  /** Tabs for additional content */
  tabs?: ViewTab<T>[];
  
  /** Title field key */
  titleField?: keyof T | string;
  
  /** Subtitle field key */
  subtitleField?: keyof T | string;
  
  /** Image field key */
  imageField?: keyof T | string;
  
  /** Loading state */
  loading?: boolean;
  
  /** Error state */
  error?: Error | string;
  
  /** Custom className */
  className?: string;
  
  /** Callback when field is copied */
  onCopy?: (field: keyof T | string, value: unknown) => void;
  
  /** Header actions */
  actions?: React.ReactNode;
}

/**
 * View state
 */
export interface ViewState {
  /** Active tab ID */
  activeTab?: string;
  
  /** Collapsed groups */
  collapsedGroups: Set<string>;
  
  /** Copied field */
  copiedField?: string;
}

/**
 * Field render props
 */
export interface FieldRenderProps<T extends BaseEntity = BaseEntity> {
  field: ViewField<T>;
  entity: T;
  value: unknown;
  onCopy?: (field: keyof T | string, value: unknown) => void;
}
