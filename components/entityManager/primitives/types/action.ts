/**
 * Action Definition Types
 * 
 * Core action types for entity operations and user interactions.
 * Actions are reusable across all components.
 * 
 * @module primitives/types/action
 */

import { BaseEntity } from './entity';

/**
 * Action types
 */
export type ActionType =
  | 'immediate'      // Execute immediately without confirmation
  | 'confirm'        // Require user confirmation
  | 'form'           // Show form modal
  | 'modal'          // Show custom modal
  | 'navigation'     // Navigate to URL
  | 'bulk'           // Batch operation on multiple entities
  | 'download'       // Download/export action
  | 'custom';        // Custom action handler

/**
 * Action variant for styling
 */
export type ActionVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'ghost'
  | 'link';

/**
 * Action size
 */
export type ActionSize = 'sm' | 'md' | 'lg';

/**
 * Action position in UI
 */
export type ActionPosition =
  | 'toolbar'        // Main toolbar
  | 'row'            // Row actions (in table/list)
  | 'bulk'           // Bulk actions toolbar
  | 'detail'         // Detail view actions
  | 'floating';      // Floating action button

/**
 * Base action definition
 */
export interface ActionDefinition {
  /** Unique action identifier */
  id: string;
  /** Action label */
  label: string;
  /** Action type */
  actionType: ActionType;
  /** Action icon */
  icon?: string;
  /** Action variant */
  variant?: ActionVariant;
  /** Action size */
  size?: ActionSize;
  /** Action position */
  position?: ActionPosition;
  /** Action tooltip */
  tooltip?: string;
  /** Whether action is disabled */
  disabled?: boolean;
  /** Whether action is loading */
  loading?: boolean;
  /** Whether action is visible */
  visible?: boolean;
  /** Action keyboard shortcut */
  shortcut?: string;
  /** Action order/priority */
  order?: number;
  /** Action group (for grouping related actions) */
  group?: string;
}

/**
 * Immediate action configuration
 */
export interface ImmediateAction extends ActionDefinition {
  actionType: 'immediate';
  /** Action handler */
  handler: <T extends BaseEntity>(entity?: T, context?: ActionContext) => void | Promise<void>;
}

/**
 * Confirm action configuration
 */
export interface ConfirmAction extends ActionDefinition {
  actionType: 'confirm';
  /** Confirmation message */
  confirmMessage: string;
  /** Confirmation title */
  confirmTitle?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Action handler (called after confirmation) */
  handler: <T extends BaseEntity>(entity?: T, context?: ActionContext) => void | Promise<void>;
}

/**
 * Form action configuration
 */
export interface FormAction extends ActionDefinition {
  actionType: 'form';
  /** Form modal title */
  formTitle: string;
  /** Form fields */
  formFields: unknown[]; // Will be typed as FieldDefinition[] when imported
  /** Form submit handler */
  onSubmit: <T extends BaseEntity>(data: unknown, entity?: T, context?: ActionContext) => void | Promise<void>;
  /** Initial form values */
  initialValues?: Record<string, unknown>;
  /** Form validation schema */
  validationSchema?: unknown;
}

/**
 * Modal action configuration
 */
export interface ModalAction extends ActionDefinition {
  actionType: 'modal';
  /** Modal title */
  modalTitle: string;
  /** Modal content component or render function */
  modalContent: React.ComponentType<ModalContentProps> | ((props: ModalContentProps) => React.ReactNode);
  /** Modal width */
  modalWidth?: string | number;
  /** Modal height */
  modalHeight?: string | number;
}

/**
 * Navigation action configuration
 */
export interface NavigationAction extends ActionDefinition {
  actionType: 'navigation';
  /** Navigation URL (supports template variables like {id}) */
  url: string;
  /** Whether to open in new tab */
  newTab?: boolean;
  /** URL parameters */
  params?: Record<string, string | number>;
}

/**
 * Bulk action configuration
 */
export interface BulkAction extends ActionDefinition {
  actionType: 'bulk';
  /** Minimum selections required */
  minSelections?: number;
  /** Maximum selections allowed */
  maxSelections?: number;
  /** Require confirmation */
  requireConfirm?: boolean;
  /** Confirmation message */
  confirmMessage?: string;
  /** Bulk action handler */
  handler: <T extends BaseEntity>(entities: T[], context?: ActionContext) => void | Promise<void>;
}

/**
 * Download/Export action configuration
 */
export interface DownloadAction extends ActionDefinition {
  actionType: 'download';
  /** File format */
  format: 'csv' | 'json' | 'xlsx' | 'pdf';
  /** File name */
  fileName?: string;
  /** Download handler */
  handler: <T extends BaseEntity>(entities?: T[], context?: ActionContext) => void | Promise<void>;
}

/**
 * Custom action configuration
 */
export interface CustomAction extends ActionDefinition {
  actionType: 'custom';
  /** Custom action handler */
  handler: <T extends BaseEntity>(entity?: T, context?: ActionContext) => void | Promise<void>;
  /** Custom component to render */
  component?: React.ComponentType<CustomActionProps>;
}

/**
 * Union of all action configurations
 */
export type AnyActionConfig =
  | ImmediateAction
  | ConfirmAction
  | FormAction
  | ModalAction
  | NavigationAction
  | BulkAction
  | DownloadAction
  | CustomAction;

/**
 * Action context passed to action handlers
 */
export interface ActionContext {
  /** Current entity manager mode */
  mode?: 'list' | 'form' | 'view';
  /** Selected entities */
  selectedEntities?: BaseEntity[];
  /** Pagination state */
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
  };
  /** Filters state */
  filters?: unknown[];
  /** Sort state */
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  /** Search state */
  search?: string;
  /** Refresh callback */
  refresh?: () => void | Promise<void>;
  /** Navigate callback */
  navigate?: (url: string) => void;
  /** Additional context data */
  [key: string]: unknown;
}

/**
 * Modal content props
 */
export interface ModalContentProps<T extends BaseEntity = BaseEntity> {
  /** Entity being acted upon */
  entity?: T;
  /** Action context */
  context?: ActionContext;
  /** Close modal callback */
  onClose: () => void;
  /** Additional props */
  [key: string]: unknown;
}

/**
 * Custom action component props
 */
export interface CustomActionProps<T extends BaseEntity = BaseEntity> {
  /** Action definition */
  action: CustomAction;
  /** Entity being acted upon */
  entity?: T;
  /** Action context */
  context?: ActionContext;
  /** Additional props */
  [key: string]: unknown;
}

/**
 * Action execution result
 */
export interface ActionResult {
  /** Whether action was successful */
  success: boolean;
  /** Result message */
  message?: string;
  /** Result data */
  data?: unknown;
  /** Error if action failed */
  error?: Error;
}

/**
 * Action permission configuration
 */
export interface ActionPermission {
  /** Action ID */
  actionId: string;
  /** Required permissions */
  permissions: string[];
  /** Permission check mode */
  mode?: 'all' | 'any';
}
