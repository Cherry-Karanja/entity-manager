/**
 * Formatting Utilities
 * 
 * Pure formatting functions with zero dependencies.
 * 
 * @module primitives/utils/formatting
 */

/**
 * Format a date to string
 */
export function formatDate(
  date: Date | string | number,
  format: string = 'YYYY-MM-DD'
): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return '';
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * Format a number to currency
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

/**
 * Format a number to percentage
 */
export function formatPercentage(
  value: number,
  decimals: number = 0
): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(
  value: number,
  decimals: number = 0,
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch {
    return value.toFixed(decimals);
  }
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Format phone number
 */
export function formatPhoneNumber(
  phone: string,
  format: string = '(XXX) XXX-XXXX'
): string {
  const digits = phone.replace(/\D/g, '');
  let formatted = format;
  let digitIndex = 0;

  for (let i = 0; i < formatted.length; i++) {
    if (formatted[i] === 'X' && digitIndex < digits.length) {
      formatted = formatted.substring(0, i) + digits[digitIndex] + formatted.substring(i + 1);
      digitIndex++;
    }
  }

  return formatted;
}

/**
 * Truncate text to specified length
 */
export function truncate(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Title case
 */
export function titleCase(text: string): string {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Camel case to title case
 */
export function camelToTitle(text: string): string {
  if (!text) return '';
  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * Snake case to title case
 */
export function snakeToTitle(text: string): string {
  if (!text) return '';
  return text
    .split('_')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
  
  const diffYear = Math.floor(diffMonth / 12);
  return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
}

/**
 * Format boolean to Yes/No
 */
export function formatBoolean(value: boolean, trueText: string = 'Yes', falseText: string = 'No'): string {
  return value ? trueText : falseText;
}

/**
 * Format array to comma-separated string
 */
export function formatArray(arr: unknown[], maxItems?: number, separator: string = ', '): string {
  if (!arr || arr.length === 0) return '';
  
  const items = maxItems ? arr.slice(0, maxItems) : arr;
  const formatted = items.map(item => String(item)).join(separator);
  
  if (maxItems && arr.length > maxItems) {
    return `${formatted} (+${arr.length - maxItems} more)`;
  }
  
  return formatted;
}
