/**
 * EntityForm Utility Functions
 * 
 * Pure functions for form operations and validation.
 */

import { BaseEntity } from '../../primitives/types';
import { 
  validateRule as primitiveValidateRule,
  isValidEmail,
  isValidUrl,
} from '../../primitives/utils';
import { FormField, ValidationRule, FieldSection, FormTab, WizardStep, FieldOption } from './types';

/**
 * Check if field is visible
 */
export function isFieldVisible<T extends BaseEntity>(
  field: FormField<T>,
  values: Partial<T>
): boolean {
  if (field.visible === undefined) return true;
  
  if (typeof field.visible === 'boolean') {
    return field.visible;
  }
  
  return field.visible(values);
}

/**
 * Check if field is disabled
 */
export function isFieldDisabled<T extends BaseEntity>(
  field: FormField<T>,
  values: Partial<T>
): boolean {
  if (field.disabled === undefined) return false;
  
  if (typeof field.disabled === 'boolean') {
    return field.disabled;
  }
  
  return field.disabled(values);
}

/**
 * Get visible fields
 */
export function getVisibleFields<T extends BaseEntity>(
  fields: FormField<T>[],
  values: Partial<T>
): FormField<T>[] {
  return fields.filter(field => isFieldVisible(field, values));
}

/**
 * Sort fields by order
 */
export function sortFields<T extends BaseEntity>(
  fields: FormField<T>[]
): FormField<T>[] {
  return [...fields].sort((a, b) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    return orderA - orderB;
  });
}

/**
 * Get initial form values
 */
export function getInitialValues<T extends BaseEntity>(
  fields: FormField<T>[],
  entity?: T,
  initialValues?: Partial<T>
): Partial<T> {
  const values: Record<string, unknown> = {};

  // Apply field defaults
  fields.forEach(field => {
    const fieldName = String(field.name);
    if (field.defaultValue !== undefined) {
      values[fieldName] = field.defaultValue;
    }
  });

  // Apply initial values prop
  if (initialValues) {
    Object.assign(values, initialValues);
  }

  // Apply entity values (for edit mode)
  if (entity) {
    fields.forEach(field => {
      const fieldName = String(field.name);
      if (entity[field.name as keyof T] !== undefined) {
        values[fieldName] = entity[field.name as keyof T];
      }
    });
  }

  return values as Partial<T>;
}

/**
 * Validate single field
 */
export async function validateField<T extends BaseEntity = BaseEntity>(
  value: unknown,
  field: FormField<T>,
  values: Record<string, unknown>
): Promise<string | undefined> {
  // Check required
  if (field.required && (value === undefined || value === null || value === '')) {
    return `${field.label} is required`;
  }

  // Skip validation if empty and not required
  if (!value && !field.required) {
    return undefined;
  }

  // Run validation rules
  if (field.validation) {
    for (const rule of field.validation) {
      const error = await validateRule(value, rule, values);
      if (error) {
        return error;
      }
    }
  }

  // Type-specific validation
  switch (field.type) {
    case 'email':
      if (typeof value === 'string' && !isValidEmail(value)) {
        return 'Invalid email address';
      }
      break;

    case 'url':
      if (typeof value === 'string' && !isValidUrl(value)) {
        return 'Invalid URL';
      }
      break;

    case 'number':
    case 'range':
      if (typeof value === 'number') {
        if (field.min !== undefined && value < field.min) {
          return `Minimum value is ${field.min}`;
        }
        if (field.max !== undefined && value > field.max) {
          return `Maximum value is ${field.max}`;
        }
      }
      break;

    case 'text':
    case 'textarea':
    case 'password':
      if (typeof value === 'string') {
        if (field.minLength !== undefined && value.length < field.minLength) {
          return `Minimum length is ${field.minLength} characters`;
        }
        if (field.maxLength !== undefined && value.length > field.maxLength) {
          return `Maximum length is ${field.maxLength} characters`;
        }
      }
      break;
  }

  return undefined;
}

/**
 * Validate single rule
 */
async function validateRule(
  value: unknown,
  rule: ValidationRule,
  values: Record<string, unknown>
): Promise<string | undefined> {
  switch (rule.type) {
    case 'required':
      if (!value) {
        return rule.message;
      }
      break;

    case 'email':
      if (typeof value === 'string' && !isValidEmail(value)) {
        return rule.message;
      }
      break;

    case 'url':
      if (typeof value === 'string' && !isValidUrl(value)) {
        return rule.message;
      }
      break;

    case 'minLength':
      if (typeof value === 'string' && rule.value && value.length < Number(rule.value)) {
        return rule.message;
      }
      break;

    case 'maxLength':
      if (typeof value === 'string' && rule.value && value.length > Number(rule.value)) {
        return rule.message;
      }
      break;

    case 'min':
      if (typeof value === 'number' && rule.value && value < Number(rule.value)) {
        return rule.message;
      }
      break;

    case 'max':
      if (typeof value === 'number' && rule.value && value > Number(rule.value)) {
        return rule.message;
      }
      break;

    case 'pattern':
      if (typeof value === 'string' && rule.value) {
        const pattern = new RegExp(String(rule.value));
        if (!pattern.test(value)) {
          return rule.message;
        }
      }
      break;

    case 'custom':
      if (rule.validator) {
        const isValid = await rule.validator(value, values);
        if (!isValid) {
          return rule.message;
        }
      }
      break;

    case 'async':
      if (rule.validator) {
        const isValid = await rule.validator(value, values);
        if (!isValid) {
          return rule.message;
        }
      }
      break;
  }

  return undefined;
}

/**
 * Validate all fields
 */
export async function validateForm<T extends BaseEntity>(
  values: Partial<T>,
  fields: FormField<T>[]
): Promise<Record<string, string>> {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    if (!isFieldVisible(field, values)) continue;

    const fieldName = String(field.name);
    const value = values[field.name as keyof T];
    const error = await validateField<T>(value, field, values as Record<string, unknown>);
    
    if (error) {
      errors[fieldName] = error;
    }
  }

  return errors;
}

/**
 * Group fields by section
 */
export function groupFieldsBySections<T extends BaseEntity>(
  fields: FormField<T>[],
  sections?: FieldSection[]
): Map<string | null, FormField<T>[]> {
  const grouped = new Map<string | null, FormField<T>[]>();

  if (!sections || sections.length === 0) {
    grouped.set(null, fields);
    return grouped;
  }

  // Initialize sections
  sections.forEach(section => {
    grouped.set(section.id, []);
  });

  // Add ungrouped fields
  grouped.set(null, []);

  // Assign fields to sections
  fields.forEach(field => {
    const sectionId = field.group || null;
    const sectionFields = grouped.get(sectionId) || [];
    sectionFields.push(field);
    grouped.set(sectionId, sectionFields);
  });

  return grouped;
}

/**
 * Group fields by tabs
 */
export function groupFieldsByTabs<T extends BaseEntity>(
  fields: FormField<T>[],
  tabs: FormTab[]
): Map<string, FormField<T>[]> {
  const grouped = new Map<string, FormField<T>[]>();

  tabs.forEach(tab => {
    const tabFields = fields.filter(field => tab.fields.includes(String(field.name)));
    grouped.set(tab.id, tabFields);
  });

  return grouped;
}

/**
 * Group fields by wizard steps
 */
export function groupFieldsBySteps<T extends BaseEntity>(
  fields: FormField<T>[],
  steps: WizardStep[]
): Map<string, FormField<T>[]> {
  const grouped = new Map<string, FormField<T>[]>();

  steps.forEach(step => {
    const stepFields = fields.filter(field => step.fields.includes(String(field.name)));
    grouped.set(step.id, stepFields);
  });

  return grouped;
}

/**
 * Sort sections by order
 */
export function sortSections(sections: FieldSection[]): FieldSection[] {
  return [...sections].sort((a, b) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    return orderA - orderB;
  });
}

/**
 * Sort tabs by order
 */
export function sortTabs(tabs: FormTab[]): FormTab[] {
  return [...tabs].sort((a, b) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    return orderA - orderB;
  });
}

/**
 * Sort wizard steps by order
 */
export function sortSteps(steps: WizardStep[]): WizardStep[] {
  return [...steps].sort((a, b) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    return orderA - orderB;
  });
}

/**
 * Transform form values before submit
 */
export function transformValues<T extends BaseEntity>(
  values: Partial<T>,
  fields: FormField<T>[]
): Partial<T> {
  const transformed: Record<string, unknown> = { ...values };

  fields.forEach(field => {
    const fieldName = String(field.name);
    const value = transformed[fieldName];

    if (field.transform && value !== undefined) {
      transformed[fieldName] = field.transform(value);
    }
  });

  return transformed as Partial<T>;
}

/**
 * Check if form has errors
 */
export function hasErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Check if form is dirty
 */
export function isFormDirty(
  values: Record<string, unknown>,
  initialValues: Record<string, unknown>
): boolean {
  return JSON.stringify(values) !== JSON.stringify(initialValues);
}

/**
 * Get field options
 */
export async function getFieldOptions<T extends BaseEntity>(
  field: FormField<T>,
  values: Partial<T>
): Promise<FieldOption[]> {
  if (!field.options) return [];

  if (typeof field.options === 'function') {
    return await field.options(values);
  }

  return field.options;
}

/**
 * Format field value for display
 */
export function formatFieldValue<T extends BaseEntity>(value: unknown, field: FormField<T>): string {
  if (value === null || value === undefined) return '';

  switch (field.type) {
    case 'date':
      if (value instanceof Date) {
        return value.toLocaleDateString();
      }
      if (typeof value === 'string' && value) {
        try {
          return new Date(value).toLocaleDateString();
        } catch {
          return value;
        }
      }
      return String(value);

    case 'datetime':
      if (value instanceof Date) {
        return value.toLocaleString();
      }
      if (typeof value === 'string' && value) {
        try {
          return new Date(value).toLocaleString();
        } catch {
          return value;
        }
      }
      return String(value);

    case 'time':
      if (value instanceof Date) {
        return value.toLocaleTimeString();
      }
      if (typeof value === 'string' && value) {
        try {
          return new Date(value).toLocaleTimeString();
        } catch {
          return value;
        }
      }
      return String(value);

    case 'checkbox':
    case 'switch':
      return value ? 'Yes' : 'No';

    case 'multiselect':
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return String(value);

    default:
      return String(value);
  }
}
