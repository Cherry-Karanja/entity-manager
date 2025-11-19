/**
 * EntityList Display Variants
 * 
 * Different density and spacing variants for list display.
 * Provides compact, comfortable, and spacious options with comprehensive styling.
 */

export type ListDensity = 'compact' | 'comfortable' | 'spacious';

export interface DensityConfig {
  rowHeight: string;
  rowPadding: string;
  fontSize: string;
  avatarSize: string;
  spacing: string;
  iconSize: string;
  badgeSize: string;
  buttonSize: string;
}

/**
 * Density configuration presets
 */
export const densityConfigs: Record<ListDensity, DensityConfig> = {
  compact: {
    rowHeight: 'min-h-[40px]',
    rowPadding: 'px-2 py-1',
    fontSize: 'text-xs',
    avatarSize: 'h-6 w-6',
    spacing: 'gap-1',
    iconSize: 'h-3.5 w-3.5',
    badgeSize: 'text-[10px] px-1.5 py-0.5',
    buttonSize: 'h-7 w-7 text-xs',
  },
  comfortable: {
    rowHeight: 'min-h-[48px]',
    rowPadding: 'px-3 py-2',
    fontSize: 'text-sm',
    avatarSize: 'h-8 w-8',
    spacing: 'gap-2',
    iconSize: 'h-4 w-4',
    badgeSize: 'text-xs px-2 py-0.5',
    buttonSize: 'h-8 w-8 text-sm',
  },
  spacious: {
    rowHeight: 'min-h-[64px]',
    rowPadding: 'px-4 py-3',
    fontSize: 'text-base',
    avatarSize: 'h-10 w-10',
    spacing: 'gap-3',
    iconSize: 'h-5 w-5',
    badgeSize: 'text-sm px-2.5 py-1',
    buttonSize: 'h-9 w-9 text-base',
  },
};

/**
 * Get CSS classes for a specific density
 */
export function getDensityClasses(density: ListDensity = 'comfortable'): DensityConfig {
  return densityConfigs[density];
}

/**
 * Apply density to table row
 */
export function getTableRowClasses(density: ListDensity = 'comfortable'): string {
  const config = densityConfigs[density];
  return `${config.rowHeight} ${config.rowPadding} ${config.fontSize}`;
}

/**
 * Apply density to table cell
 */
export function getTableCellClasses(density: ListDensity = 'comfortable'): string {
  const config = densityConfigs[density];
  return `${config.rowPadding} ${config.fontSize}`;
}

/**
 * Apply density to card
 */
export function getCardClasses(density: ListDensity = 'comfortable'): string {
  const config = densityConfigs[density];
  return `${config.rowPadding} ${config.spacing} ${config.fontSize}`;
}

/**
 * Apply density to list item
 */
export function getListItemClasses(density: ListDensity = 'comfortable'): string {
  const config = densityConfigs[density];
  return `${config.rowHeight} ${config.rowPadding} ${config.spacing} ${config.fontSize}`;
}

/**
 * Apply density to grid item
 */
export function getGridItemClasses(density: ListDensity = 'comfortable'): string {
  const config = densityConfigs[density];
  return `${config.rowPadding} ${config.spacing} ${config.fontSize}`;
}

/**
 * Get avatar classes for density
 */
export function getAvatarClasses(density: ListDensity = 'comfortable'): string {
  const config = densityConfigs[density];
  return config.avatarSize;
}

/**
 * Get icon classes for density
 */
export function getIconClasses(density: ListDensity = 'comfortable'): string {
  const config = densityConfigs[density];
  return config.iconSize;
}

/**
 * Get badge classes for density
 */
export function getBadgeClasses(density: ListDensity = 'comfortable'): string {
  const config = densityConfigs[density];
  return config.badgeSize;
}

/**
 * Get button classes for density
 */
export function getButtonClasses(density: ListDensity = 'comfortable'): string {
  const config = densityConfigs[density];
  return config.buttonSize;
}
