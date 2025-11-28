/**
 * View Selector
 *
 * UI component for switching between EntityList view modes.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LayoutGrid } from 'lucide-react';
import { ListView } from '../types';

export interface ViewSelectorProps {
  value: ListView;
  onChange: (view: ListView) => void;
  variant?: 'dropdown' | 'buttons';
  className?: string;
}

const viewOptions: Array<{ value: ListView; label: string; description: string }> = [
  { value: 'table', label: 'Table', description: 'Columnar table view' },
  { value: 'card', label: 'Card', description: 'Card grid' },
  { value: 'list', label: 'List', description: 'Simple list' },
  { value: 'grid', label: 'Grid', description: 'Grid layout' },
  { value: 'compact', label: 'Compact', description: 'Dense table' },
  { value: 'timeline', label: 'Timeline', description: 'Timeline view' },
  { value: 'detailed', label: 'Detailed', description: 'Detailed list' },
  { value: 'gallery', label: 'Gallery', description: 'Image gallery' },
];

function DropdownViewSelector({ value, onChange, className }: ViewSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn('min-h-[44px]', className)} title="Change view">
          <LayoutGrid className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">View</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>View mode</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={(v) => onChange(v as ListView)}>
          {viewOptions.map((opt) => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value}>
              <div className="flex flex-col">
                <span className="font-medium">{opt.label}</span>
                <span className="text-xs text-muted-foreground">{opt.description}</span>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ButtonGroupViewSelector({ value, onChange, className }: ViewSelectorProps) {
  return (
    <div className={cn('inline-flex rounded-md shadow-sm', className)} role="group">
      {viewOptions.map((option, index) => (
        <TooltipProvider key={option.value}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={value === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange(option.value)}
                className={cn(
                  'px-3',
                  index === 0 && 'rounded-r-none',
                  index === viewOptions.length - 1 && 'rounded-l-none',
                  index > 0 && index < viewOptions.length - 1 && 'rounded-none border-l-0 border-r-0'
                )}
              >
                {option.label.charAt(0)}
                <span className="ml-1 hidden md:inline">{option.label.slice(1)}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{option.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}

export function ViewSelector({ value, onChange, variant = 'dropdown', className }: ViewSelectorProps) {
  if (variant === 'buttons') {
    return <ButtonGroupViewSelector value={value} onChange={onChange} className={className} />;
  }

  return <DropdownViewSelector value={value} onChange={onChange} className={className} />;
}
