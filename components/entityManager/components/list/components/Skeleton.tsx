/**
 * List Skeleton Loader
 * 
 * Provides skeleton loading states for different list views and densities.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ListDensity, getDensityClasses } from '../variants';
import { ListView } from '../types';

export interface SkeletonProps {
  /** Number of skeleton items to show */
  count?: number;
  /** List view mode */
  view?: ListView;
  /** Density */
  density?: ListDensity;
  /** Number of columns for table view */
  columns?: number;
  /** Show avatar skeleton */
  showAvatar?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Skeleton loading component
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

/**
 * Table row skeleton
 */
function TableRowSkeleton({
  columns = 4,
  density = 'comfortable',
  showAvatar = false,
}: {
  columns?: number;
  density?: ListDensity;
  showAvatar?: boolean;
}) {
  const densityConfig = getDensityClasses(density);

  return (
    <tr className={cn('border-b', densityConfig.rowHeight)}>
      {showAvatar && (
        <td className={densityConfig.rowPadding}>
          <Skeleton className={cn('rounded-full', densityConfig.avatarSize)} />
        </td>
      )}
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className={densityConfig.rowPadding}>
          <Skeleton className="h-4 w-full max-w-[200px]" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Card skeleton
 */
function CardSkeleton({
  density = 'comfortable',
  showAvatar = true,
}: {
  density?: ListDensity;
  showAvatar?: boolean;
}) {
  const densityConfig = getDensityClasses(density);

  return (
    <div className={cn('border rounded-lg bg-card', densityConfig.rowPadding, densityConfig.spacing)}>
      {showAvatar && (
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className={cn('rounded-full', densityConfig.avatarSize)} />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
      <div className="flex gap-2 mt-4">
        <Skeleton className={cn('rounded', densityConfig.buttonSize)} />
        <Skeleton className={cn('rounded', densityConfig.buttonSize)} />
      </div>
    </div>
  );
}

/**
 * List item skeleton
 */
function ListItemSkeleton({
  density = 'comfortable',
  showAvatar = true,
}: {
  density?: ListDensity;
  showAvatar?: boolean;
}) {
  const densityConfig = getDensityClasses(density);

  return (
    <div className={cn('flex items-center border-b', densityConfig.rowHeight, densityConfig.rowPadding, densityConfig.spacing)}>
      {showAvatar && (
        <Skeleton className={cn('rounded-full flex-shrink-0', densityConfig.avatarSize)} />
      )}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="flex gap-2">
        <Skeleton className={cn('rounded', densityConfig.buttonSize)} />
      </div>
    </div>
  );
}

/**
 * Grid item skeleton
 */
function GridItemSkeleton({
  density = 'comfortable',
  showAvatar = true,
}: {
  density?: ListDensity;
  showAvatar?: boolean;
}) {
  const densityConfig = getDensityClasses(density);

  return (
    <div className={cn('border rounded-lg bg-card', densityConfig.rowPadding, densityConfig.spacing)}>
      {showAvatar && (
        <Skeleton className="w-full aspect-square rounded-lg mb-3" />
      )}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-3 w-3/4 mb-3" />
      <div className="flex gap-2">
        <Skeleton className={cn('rounded flex-1', densityConfig.buttonSize)} />
        <Skeleton className={cn('rounded', densityConfig.buttonSize)} />
      </div>
    </div>
  );
}

/**
 * Main list skeleton component
 */
export function ListSkeleton({
  count = 5,
  view = 'table',
  density = 'comfortable',
  columns = 4,
  showAvatar = false,
  className,
}: SkeletonProps) {
  const items = Array.from({ length: count });

  // Table view
  if (view === 'table' || view === 'compact') {
    return (
      <div className={cn('w-full', className)}>
        <table className="w-full">
          <tbody>
            {items.map((_, i) => (
              <TableRowSkeleton
                key={i}
                columns={columns}
                density={view === 'compact' ? 'compact' : density}
                showAvatar={showAvatar}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Card view
  if (view === 'card') {
    return (
      <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
        {items.map((_, i) => (
          <CardSkeleton key={i} density={density} showAvatar={showAvatar} />
        ))}
      </div>
    );
  }

  // Grid view
  if (view === 'grid' || view === 'gallery') {
    return (
      <div className={cn('grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5', className)}>
        {items.map((_, i) => (
          <GridItemSkeleton key={i} density={density} showAvatar={showAvatar} />
        ))}
      </div>
    );
  }

  // List/Detailed/Timeline view
  return (
    <div className={cn('space-y-0', className)}>
      {items.map((_, i) => (
        <ListItemSkeleton key={i} density={density} showAvatar={showAvatar} />
      ))}
    </div>
  );
}

/**
 * Skeleton for toolbar/header
 */
export function ToolbarSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-between gap-4 mb-4', className)}>
      <div className="flex-1 max-w-sm">
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
}

/**
 * Complete loading skeleton with toolbar
 */
export function CompleteListSkeleton(props: SkeletonProps) {
  return (
    <div className="space-y-4">
      <ToolbarSkeleton />
      <ListSkeleton {...props} />
    </div>
  );
}
