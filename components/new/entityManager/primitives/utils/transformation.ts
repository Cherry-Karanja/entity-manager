/**
 * Transformation Utilities
 * 
 * Pure data transformation functions with zero dependencies.
 * 
 * @module primitives/utils/transformation
 */

import type { BaseEntity, FilterConfig } from '../types/entity';

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

/**
 * Deep merge two objects
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        ) as T[Extract<keyof T, string>];
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}

/**
 * Pick specific keys from an object
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit specific keys from an object
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

/**
 * Group array of objects by a key
 */
export function groupBy<T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T
): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Sort array of objects by a key
 */
export function sortBy<T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    const comparison = aVal < bVal ? -1 : 1;
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Filter array of objects
 */
export function filterBy<T extends Record<string, unknown>>(
  arr: T[],
  filters: FilterConfig[]
): T[] {
  return arr.filter(item => {
    return filters.every(filter => {
      const value = item[filter.field];
      
      switch (filter.operator) {
        case 'equals':
          return value === filter.value;
        case 'notEquals':
          return value !== filter.value;
        case 'contains':
          return String(value).includes(String(filter.value));
        case 'notContains':
          return !String(value).includes(String(filter.value));
        case 'startsWith':
          return String(value).startsWith(String(filter.value));
        case 'endsWith':
          return String(value).endsWith(String(filter.value));
        case 'greaterThan':
          return Number(value) > Number(filter.value);
        case 'greaterThanOrEqual':
          return Number(value) >= Number(filter.value);
        case 'lessThan':
          return Number(value) < Number(filter.value);
        case 'lessThanOrEqual':
          return Number(value) <= Number(filter.value);
        case 'in':
          return Array.isArray(filter.value) && filter.value.includes(value);
        case 'notIn':
          return Array.isArray(filter.value) && !filter.value.includes(value);
        case 'isNull':
          return value === null || value === undefined;
        case 'isNotNull':
          return value !== null && value !== undefined;
        case 'between':
          if (Array.isArray(filter.value) && filter.value.length === 2) {
            const num = Number(value);
            return num >= Number(filter.value[0]) && num <= Number(filter.value[1]);
          }
          return false;
        default:
          return true;
      }
    });
  });
}

/**
 * Search array of objects
 */
export function searchBy<T extends Record<string, unknown>>(
  arr: T[],
  query: string,
  fields: (keyof T)[]
): T[] {
  const lowerQuery = query.toLowerCase();
  
  return arr.filter(item => {
    return fields.some(field => {
      const value = item[field];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(lowerQuery);
    });
  });
}

/**
 * Paginate array
 */
export function paginate<T>(
  arr: T[],
  page: number,
  pageSize: number
): T[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return arr.slice(startIndex, endIndex);
}

/**
 * Unique array of objects by key
 */
export function uniqueBy<T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T
): T[] {
  const seen = new Set();
  return arr.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * Flatten nested array
 */
export function flatten<T>(arr: (T | T[])[]): T[] {
  return arr.reduce<T[]>((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}

/**
 * Convert object to query string
 */
export function toQueryString(obj: Record<string, unknown>): string {
  const params = new URLSearchParams();
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      params.append(key, String(value));
    }
  }
  
  return params.toString();
}

/**
 * Parse query string to object
 */
export function fromQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
}

/**
 * Transform entity for API (remove metadata, format dates, etc.)
 */
export function toApiFormat<T extends BaseEntity>(entity: T): unknown {
  const data = { ...entity };
  return Object.fromEntries(Object.entries(data).filter(([key]) => key !== 'id'));
}

/**
 * Transform API response to entity
 */
export function fromApiFormat<T extends BaseEntity>(data: unknown): T {
  return data as T;
}
