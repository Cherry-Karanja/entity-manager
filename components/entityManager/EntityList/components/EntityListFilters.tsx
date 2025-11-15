import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Calendar as CalendarIcon, HelpCircle, Filter, ChevronDown, ChevronUp, RotateCcw, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { EntityListFilter } from '../types';


interface EntityListFiltersProps {
  filters: EntityListFilter[];
  activeFilters: Record<string, unknown>;
  onChange: (filters: Record<string, unknown>) => void;
  layout?: 'horizontal' | 'vertical' | 'inline' | 'compact';
  showReset?: boolean;
  showCount?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export  const EntityListFilters: React.FC<EntityListFiltersProps> = ({
  filters,
  activeFilters,
  onChange,
  layout = 'horizontal',
  showReset = true,
  showCount = true,
  collapsible = false,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [focusedFilter, setFocusedFilter] = useState<string | null>(null);

  const handleFilterChange = (filterId: string, value: unknown) => {
    const newFilters = { ...activeFilters };
    if (value === null || value === undefined || value === '') {
      delete newFilters[filterId];
    } else {
      newFilters[filterId] = value;
    }
    onChange(newFilters);
  };

  const handleReset = () => {
    onChange({});
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  if (filters.length === 0) return null;

  const renderLabel = (filter: EntityListFilter) => (
    <div className="flex items-center gap-2 mb-2">
      {filter.icon && (
        <filter.icon className="h-4 w-4 text-primary/70 flex-shrink-0" />
      )}
      <span className="text-sm font-medium text-foreground">
        {filter.field.label}
        {filter.required && <span className="text-destructive ml-1">*</span>}
      </span>
      {filter.tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-sm">{filter.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );

  const renderFilterControl = (filter: EntityListFilter) => {
    const value = activeFilters[filter.field.name];
    const isActive = value !== undefined && value !== null && value !== '';
    const isFocused = focusedFilter === filter.field.name;

    switch (filter.field.type) {
      case 'text':
        return (
          <div className="space-y-1.5">
            <div className="relative">
              <Input
                placeholder={filter.placeholder || `Filter by ${filter.field.label}`}
                value={(value as string) || ''}
                onChange={(e) => handleFilterChange(filter.field.name, e.target.value)}
                onFocus={() => setFocusedFilter(filter.field.name)}
                onBlur={() => setFocusedFilter(null)}
                className={cn(
                  "w-full transition-all duration-200",
                  isActive && "border-primary/50 bg-primary/5",
                  isFocused && "ring-2 ring-primary/20",
                  filter.className
                )}
              />
              {isActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => handleFilterChange(filter.field.name, null)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            {filter.helpText && (
              <p className="text-xs text-muted-foreground pl-0.5">{filter.helpText}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div className="space-y-1.5">
            <Select
              value={(value as string) || ''}
              onValueChange={(newValue) => handleFilterChange(filter.field.name, newValue)}
            >
              <SelectTrigger
                className={cn(
                  "w-full transition-all duration-200",
                  isActive && "border-primary/50 bg-primary/5",
                  filter.className
                )}
              >
                <SelectValue placeholder={filter.placeholder || `Select ${filter.field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {filter.field.options?.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={String(option.value)}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filter.helpText && (
              <p className="text-xs text-muted-foreground pl-0.5">{filter.helpText}</p>
            )}
          </div>
        );

      case 'multiselect':
        const selectedValues = (value as string[]) || [];
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-1 gap-2">
              {filter.field.options?.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex items-center space-x-3 p-2 rounded-md transition-colors cursor-pointer hover:bg-accent/50",
                    selectedValues.includes(String(option.value)) && "bg-primary/5 border border-primary/20"
                  )}
                >
                  <Checkbox
                    checked={selectedValues.includes(String(option.value))}
                    onCheckedChange={(checked) => {
                      const newValues = checked
                        ? [...selectedValues, String(option.value)]
                        : selectedValues.filter((v) => v !== String(option.value));
                      handleFilterChange(filter.field.name, newValues.length > 0 ? newValues : null);
                    }}
                    disabled={option.disabled}
                  />
                  <span className={cn("text-sm", option.disabled && "text-muted-foreground")}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            {filter.helpText && (
              <p className="text-xs text-muted-foreground pl-0.5">{filter.helpText}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div className="space-y-1.5">
            <div className="relative">
              <Input
                type="number"
                placeholder={filter.placeholder || `Enter ${filter.field.label}`}
                value={(value as number) || ''}
                onChange={(e) => {
                  const numValue = e.target.value ? Number(e.target.value) : null;
                  handleFilterChange(filter.field.name, numValue);
                }}
                onFocus={() => setFocusedFilter(filter.field.name)}
                onBlur={() => setFocusedFilter(null)}
                min={filter.field.min}
                max={filter.field.max}
                step={filter.field.step}
                className={cn(
                  "w-full transition-all duration-200",
                  isActive && "border-primary/50 bg-primary/5",
                  isFocused && "ring-2 ring-primary/20",
                  filter.className
                )}
              />
              {isActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => handleFilterChange(filter.field.name, null)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            {filter.helpText && (
              <p className="text-xs text-muted-foreground pl-0.5">{filter.helpText}</p>
            )}
          </div>
        );

      case 'date':
        return (
          <div className="space-y-1.5">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal transition-all duration-200",
                    !value && "text-muted-foreground",
                    isActive && "border-primary/50 bg-primary/5"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? format(value as Date, "PPP") : <span>{filter.field.placeholder || "Pick a date"}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value as Date}
                  onSelect={(date) => handleFilterChange(filter.field.name, date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {filter.helpText && (
              <p className="text-xs text-muted-foreground pl-0.5">{filter.helpText}</p>
            )}
          </div>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground p-2 bg-muted/50 rounded-md">
            Unsupported filter type: {filter.field.type}
          </div>
        );
    }
  };

  const layoutClasses = {
    vertical: 'flex flex-col space-y-4',
    horizontal: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
    inline: 'flex flex-wrap gap-4',
    compact: 'grid grid-cols-1 sm:grid-cols-2 gap-3'
  };

  return (
    <Card className="border-l-4 border-l-primary shadow-sm">
      <CardContent className={cn("p-4 md:p-6", isCollapsed && "p-3")}>
        <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", isCollapsed ? "mb-0" : "mb-4")}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
              <Filter className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                Filters
                {showCount && activeFilterCount > 0 && (
                  <Badge variant="secondary" className="text-xs font-medium">
                    {activeFilterCount}
                  </Badge>
                )}
              </h3>
              {!isCollapsed && (
                <p className="text-xs text-muted-foreground">
                  Refine your search results
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showReset && activeFilterCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-1.5 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Clear all</span>
              </Button>
            )}
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="gap-1.5"
              >
                {isCollapsed ? (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span className="hidden sm:inline">Show</span>
                  </>
                ) : (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Hide</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <>
            <div className={cn(layoutClasses[layout], "mt-4")}>
              {filters.map((filter) => {
                const isActive = activeFilters[filter.field.name] !== undefined && 
                                activeFilters[filter.field.name] !== null && 
                                activeFilters[filter.field.name] !== '';
                
                return (
                  <div
                    key={filter.field.name}
                    className={cn(
                      "flex flex-col gap-1 p-3 rounded-lg border transition-all duration-200",
                      isActive 
                        ? "bg-primary/5 border-primary/30 shadow-sm" 
                        : "bg-card border-border hover:border-primary/20 hover:bg-accent/5",
                      layout === 'vertical' && "min-h-[90px]"
                    )}
                  >
                    {renderLabel(filter)}
                    {renderFilterControl(filter)}
                  </div>
                );
              })}
            </div>

            {activeFilterCount > 0 && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    {activeFilterCount === 1 
                      ? "1 filter applied" 
                      : `${activeFilterCount} filters applied`}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

