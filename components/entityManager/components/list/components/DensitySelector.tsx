/**
 * Density Selector
 * 
 * UI component for switching between list density modes.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlignJustify } from 'lucide-react';
import { ListDensity } from '../variants';

export interface DensitySelectorProps {
  /** Current density */
  value: ListDensity;
  /** Change handler */
  onChange: (density: ListDensity) => void;
  /** Show as button group instead of dropdown */
  variant?: 'dropdown' | 'buttons';
  /** Custom className */
  className?: string;
}

const densityOptions: Array<{
  value: ListDensity;
  label: string;
  description: string;
}> = [
  {
    value: 'compact',
    label: 'Compact',
    description: 'Minimal spacing, fits more items',
  },
  {
    value: 'comfortable',
    label: 'Comfortable',
    description: 'Balanced spacing, easy to scan',
  },
  {
    value: 'spacious',
    label: 'Spacious',
    description: 'Maximum spacing, easier to read',
  },
];

/**
 * Dropdown density selector
 */
function DropdownDensitySelector({ value, onChange, className }: DensitySelectorProps) {
  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={cn("min-h-[44px]", className)}>
                <AlignJustify className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Density</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Change row density</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Row Density</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={(v) => onChange(v as ListDensity)}>
          {densityOptions.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              <div className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.description}</span>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Button group density selector
 */
function ButtonGroupDensitySelector({ value, onChange, className }: DensitySelectorProps) {
  return (
    <div className={cn('inline-flex rounded-md shadow-sm', className)} role="group">
      {densityOptions.map((option, index) => (
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
                  index === densityOptions.length - 1 && 'rounded-l-none',
                  index > 0 && index < densityOptions.length - 1 && 'rounded-none border-l-0 border-r-0'
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

/**
 * Density selector component
 */
export function DensitySelector({
  value,
  onChange,
  variant = 'dropdown',
  className,
}: DensitySelectorProps) {
  if (variant === 'buttons') {
    return <ButtonGroupDensitySelector value={value} onChange={onChange} className={className} />;
  }

  return <DropdownDensitySelector value={value} onChange={onChange} className={className} />;
}
