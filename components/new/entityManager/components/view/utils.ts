/**
 * EntityView Utility Functions
 * 
 * Pure functions for view operations.
 */

import React from 'react';
import { BaseEntity } from '../../primitives/types';
import { formatDate, formatBoolean } from '../../primitives/utils';
import { ViewField, FieldGroup } from './types';

/**
 * Check if field is visible
 */
export function isFieldVisible<T extends BaseEntity>(
  field: ViewField<T>,
  entity: T
): boolean {
  if (field.visible === undefined) return true;
  
  if (typeof field.visible === 'boolean') {
    return field.visible;
  }
  
  return field.visible(entity);
}

/**
 * Get visible fields
 */
export function getVisibleFields<T extends BaseEntity>(
  fields: ViewField<T>[],
  entity: T
): ViewField<T>[] {
  return fields.filter(field => isFieldVisible(field, entity));
}

/**
 * Get field value from entity
 */
export function getFieldValue<T extends BaseEntity>(
  entity: T,
  fieldKey: keyof T | string
): unknown {
  return entity[fieldKey as keyof T];
}

/**
 * Format field value based on type
 */
export function formatFieldValue(
  value: unknown,
  type?: string
): string | React.ReactNode {
  if (value === null || value === undefined) {
    return React.createElement('span', { className: 'null-value' }, '—');
  }

  switch (type) {
    case 'date':
      if (value instanceof Date) {
        return formatDate(value, 'YYYY-MM-DD HH:mm:ss');
      }
      if (typeof value === 'string') {
        const date = new Date(value);
        return isNaN(date.getTime()) ? value : formatDate(date, 'YYYY-MM-DD HH:mm:ss');
      }
      return String(value);

    case 'boolean':
      return formatBoolean(Boolean(value));

    case 'email':
      return React.createElement('a', { href: `mailto:${value}` }, String(value));

    case 'url':
      return React.createElement('a', { 
        href: String(value), 
        target: '_blank', 
        rel: 'noopener noreferrer' 
      }, String(value));

    case 'image':
      return React.createElement('img', { 
        src: String(value), 
        alt: 'Image', 
        className: 'field-image' 
      });

    case 'json':
      return React.createElement('pre', { className: 'json-value' }, JSON.stringify(value, null, 2));

    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : String(value);

    default:
      return String(value);
  }
}

/**
 * Render field with formatter
 */
export function renderField<T extends BaseEntity>(
  field: ViewField<T>,
  entity: T
): React.ReactNode {
  // Use custom render if provided
  if (field.render) {
    return field.render(entity);
  }

  const value = getFieldValue(entity, field.key);

  // Use custom formatter if provided
  if (field.formatter) {
    return field.formatter(value, entity);
  }

  // Use type-based formatting
  return formatFieldValue(value, field.type);
}

/**
 * Group fields by group ID
 */
export function groupFields<T extends BaseEntity>(
  fields: ViewField<T>[],
  groups?: FieldGroup[]
): Map<string | null, ViewField<T>[]> {
  const grouped = new Map<string | null, ViewField<T>[]>();

  if (!groups || groups.length === 0) {
    // No groups - return all fields in default group
    grouped.set(null, fields);
    return grouped;
  }

  // Initialize groups
  groups.forEach(group => {
    grouped.set(group.id, []);
  });

  // Add ungrouped fields
  grouped.set(null, []);

  // Assign fields to groups
  fields.forEach(field => {
    const groupId = field.group || null;
    const groupFields = grouped.get(groupId) || [];
    groupFields.push(field);
    grouped.set(groupId, groupFields);
  });

  // Remove empty groups
  groups.forEach(group => {
    const groupFields = grouped.get(group.id);
    if (!groupFields || groupFields.length === 0) {
      grouped.delete(group.id);
    }
  });

  return grouped;
}

/**
 * Sort fields by order
 */
export function sortFields<T extends BaseEntity>(
  fields: ViewField<T>[]
): ViewField<T>[] {
  return [...fields].sort((a, b) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    return orderA - orderB;
  });
}

/**
 * Sort groups by order
 */
export function sortGroups(groups: FieldGroup[]): FieldGroup[] {
  return [...groups].sort((a, b) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    return orderA - orderB;
  });
}

/**
 * Get summary fields
 */
export function getSummaryFields<T extends BaseEntity>(
  fields: ViewField<T>[]
): ViewField<T>[] {
  return fields.filter(field => field.showInSummary !== false);
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('Copy failed:', error);
    return false;
  }
}

/**
 * Get entity title
 */
export function getEntityTitle<T extends BaseEntity>(
  entity: T,
  titleField?: keyof T | string
): string {
  if (!titleField) {
    // Try common title fields
    const commonTitleFields = ['name', 'title', 'label', 'id'];
    for (const field of commonTitleFields) {
      const value = entity[field as keyof T];
      if (value) {
        return String(value);
      }
    }
    return 'Entity';
  }

  const value = entity[titleField as keyof T];
  return value ? String(value) : 'Entity';
}

/**
 * Get entity subtitle
 */
export function getEntitySubtitle<T extends BaseEntity>(
  entity: T,
  subtitleField?: keyof T | string
): string | undefined {
  if (!subtitleField) return undefined;

  const value = entity[subtitleField as keyof T];
  return value ? String(value) : undefined;
}

/**
 * Get entity image
 */
export function getEntityImage<T extends BaseEntity>(
  entity: T,
  imageField?: keyof T | string
): string | undefined {
  if (!imageField) return undefined;

  const value = entity[imageField as keyof T];
  return value ? String(value) : undefined;
}

/**
 * Get metadata fields
 */
export function getMetadataFields<T extends BaseEntity>(entity: T): Array<{ label: string; value: unknown }> {
  const metadata: Array<{ label: string; value: unknown }> = [];

  if (entity.createdAt) {
    metadata.push({ label: 'Created', value: entity.createdAt });
  }

  if (entity.updatedAt) {
    metadata.push({ label: 'Updated', value: entity.updatedAt });
  }

  if (entity.createdBy) {
    metadata.push({ label: 'Created By', value: entity.createdBy });
  }

  if (entity.updatedBy) {
    metadata.push({ label: 'Updated By', value: entity.updatedBy });
  }

  return metadata;
}
