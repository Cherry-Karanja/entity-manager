/**
 * EntityForm Component Types
 * 
 * Type definitions for the entity form component.
 * Supports 15+ field types, multiple layouts, and comprehensive validation.
 */

import { BaseEntity } from '../../primitives/types';

/**
 * Form mode
 */
export type FormMode = 'create' | 'edit' | 'view';

/**
 * Form layout
 */
export type FormLayout = 'vertical' | 'horizontal' | 'grid' | 'tabs' | 'wizard';

/**
 * Field type enumeration
 */
export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'url'
  | 'tel'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'date'
  | 'datetime'
  | 'time'
  | 'file'
  | 'image'
  | 'color'
  | 'range'
  | 'json'
  | 'relation'
  | 'custom';

/**
 * Form field definition
 */
export interface FormField<T extends BaseEntity = BaseEntity> {
  /** Field name (entity property key) */
  name: keyof T | string;
  
  /** Field label */
  label: string;
  
  /** Field type */
  type: FieldType;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Help text */
  helpText?: string;
  
  /** Default value */
  defaultValue?: unknown;
  
  /** Required field */
  required?: boolean;
  
  /** Disabled state */
  disabled?: boolean | ((values: Partial<T>) => boolean);
  
  /** Visibility condition */
  visible?: boolean | ((values: Partial<T>) => boolean);
  
  /** Validation rules */
  validation?: ValidationRule[];
  
  /** Field width (for grid layout) */
  width?: number | string;
  
  /** Field group/section */
  group?: string;
  
  /** Field order */
  order?: number;
  
  /** Options for select/radio/multiselect */
  options?: FieldOption[] | ((values: Partial<T>) => FieldOption[] | Promise<FieldOption[]>);
  
  /** Min value (number/range) */
  min?: number;
  
  /** Max value (number/range) */
  max?: number;
  
  /** Step (number/range) */
  step?: number;
  
  /** Min length (text) */
  minLength?: number;
  
  /** Max length (text) */
  maxLength?: number;
  
  /** Rows (textarea) */
  rows?: number;
  
  /** Accept (file) */
  accept?: string;
  
  /** Multiple (file/select) */
  multiple?: boolean;
  
  /** Custom renderer */
  render?: (props: FieldRenderProps<T>) => React.ReactNode;
  
  /** Transform value before save */
  transform?: (value: unknown) => unknown;
  
  /** Relation config (for relation fields) */
  relationConfig?: RelationConfig<any>;
}

/**
 * Field option (for select/radio/etc)
 */
export interface FieldOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

/**
 * Relation configuration
 */
export interface RelationConfig<R extends BaseEntity = BaseEntity> {
  /** Entity name */
  entity: string;
  
  /** Display field */
  displayField: keyof R | string;
  
  /** Value field */
  valueField: keyof R | string;
  
  /** Search fields */
  searchFields?: Array<keyof R | string>;
  
  /** Fetch function */
  fetchOptions: (search?: string) => Promise<R[]>;
  
  /** Create new option */
  onCreate?: (value: string) => Promise<R>;
  
  /** Multiple selection */
  multiple?: boolean;
}

/**
 * Validation rule
 */
export interface ValidationRule {
  type: 'required' | 'email' | 'url' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'custom' | 'async';
  message: string;
  value?: unknown;
  validate?: (value: unknown, values: Record<string, unknown>) => string | null | Promise<string | null>;
}

/**
 * Field group
 */
export interface FieldSection {
  id: string;
  label: string;
  description?: string;
  fields: string[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  order?: number;
}

/**
 * Form tab
 */
export interface FormTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  fields: string[];
  order?: number;
}

/**
 * Wizard step
 */
export interface WizardStep {
  id: string;
  label: string;
  description?: string;
  fields: string[];
  validate?: (values: Record<string, unknown>) => Record<string, string> | Promise<Record<string, string>>;
  order?: number;
}

/**
 * EntityForm component props
 */
export interface EntityFormProps<T extends BaseEntity = BaseEntity> {
  /** Form fields */
  fields: FormField<T>[];
  
  /** Form mode */
  mode?: FormMode;
  
  /** Form layout */
  layout?: FormLayout;
  
  /** Initial values */
  initialValues?: Partial<T>;
  
  /** Entity being edited */
  entity?: T;
  
  /** Field sections (for grouped layout) */
  sections?: FieldSection[];
  
  /** Tabs (for tabbed layout) */
  tabs?: FormTab[];
  
  /** Wizard steps (for wizard layout) */
  steps?: WizardStep[];
  
  /** Submit handler */
  onSubmit: (values: Partial<T>) => void | Promise<void>;
  
  /** Cancel handler */
  onCancel?: () => void;
  
  /** Change handler */
  onChange?: (values: Partial<T>) => void;
  
  /** Validation handler */
  onValidate?: (values: Partial<T>) => Record<string, string> | Promise<Record<string, string>>;
  
  /** Submit button text */
  submitText?: string;
  
  /** Cancel button text */
  cancelText?: string;
  
  /** Show cancel button */
  showCancel?: boolean;
  
  /** Show reset button */
  showReset?: boolean;
  
  /** Loading state */
  loading?: boolean;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Custom className */
  className?: string;
  
  /** Validate on change */
  validateOnChange?: boolean;
  
  /** Validate on blur */
  validateOnBlur?: boolean;
}

/**
 * Form state
 */
export interface FormState<T extends BaseEntity = BaseEntity> {
  /** Form values */
  values: Partial<T>;
  
  /** Validation errors */
  errors: Record<string, string>;
  
  /** Touched fields */
  touched: Set<string>;
  
  /** Dirty fields */
  dirty: Set<string>;
  
  /** Submitting state */
  submitting: boolean;
  
  /** Current wizard step */
  currentStep?: number;
  
  /** Current tab */
  currentTab?: string;
  
  /** Collapsed sections */
  collapsedSections: Set<string>;
}

/**
 * Field render props
 */
export interface FieldRenderProps<T extends BaseEntity = BaseEntity> {
  field: FormField<T>;
  value: unknown;
  error?: string;
  touched: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  disabled: boolean;
  mode: FormMode;
}

/**
 * Form context
 */
export interface FormContextValue<T extends BaseEntity = BaseEntity> {
  values: Partial<T>;
  errors: Record<string, string>;
  touched: Set<string>;
  setFieldValue: (field: string, value: unknown) => void;
  setFieldError: (field: string, error: string) => void;
  setFieldTouched: (field: string) => void;
  validateField: (field: string) => Promise<void>;
  submitForm: () => Promise<void>;
}
