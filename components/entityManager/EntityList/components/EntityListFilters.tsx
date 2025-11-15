'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, CalendarIcon, HelpCircle, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { EntityListFilter } from '../types'
import { useIsMobile } from '@/hooks/use-mobile'

interface EntityListFiltersProps {
  filters: EntityListFilter[]
  activeFilters: Record<string, unknown>
  onChange: (filters: Record<string, unknown>) => void
  layout?: 'horizontal' | 'vertical' | 'inline' | 'compact'
  showReset?: boolean
  showCount?: boolean
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export const EntityListFilters: React.FC<EntityListFiltersProps> = ({
  filters,
  activeFilters,
  onChange,
  layout = 'horizontal',
  showReset = true,
  showCount = true,
  collapsible = false,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const isMobile = useIsMobile()

  const handleFilterChange = (filterId: string, value: unknown) => {
    const newFilters = { ...activeFilters }
    if (value === null || value === undefined || value === '') {
      delete newFilters[filterId]
    } else {
      newFilters[filterId] = value
    }
    onChange(newFilters)
  }

  const handleReset = () => {
    onChange({})
  }

  const activeFilterCount = Object.keys(activeFilters).length

  if (filters.length === 0) return null

  const renderLabel = (filter: EntityListFilter) => (
    <div className="flex items-center gap-2">
      {filter.icon && <filter.icon className="h-4 w-4 text-muted-foreground" />}
      <span className="text-sm font-medium">
        {filter.label}
        {filter.required && <span className="text-destructive ml-1">*</span>}
      </span>
      {filter.tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">{filter.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )

  const renderFilterControl = (filter: EntityListFilter) => {
    const value = activeFilters[filter.field.name]

    switch (filter.field.type) {
      case 'text':
        return (
          <div className="space-y-1">
            <Input
              placeholder={filter.placeholder || `Filter by ${filter.label}`}
              value={value as string || ''}
              onChange={(e) => handleFilterChange(filter.field.name, e.target.value)}
              className={cn("w-full", filter.className)}
            />
            {filter.helpText && (
              <p className="text-xs text-muted-foreground">{filter.helpText}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div className="space-y-1">
            <Select
              value={value as string || ''}
              onValueChange={(newValue) => handleFilterChange(filter.field.name, newValue)}
            >
              <SelectTrigger className={cn("w-full", filter.className)}>
                <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
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
              <p className="text-xs text-muted-foreground">{filter.helpText}</p>
            )}
          </div>
        )

      case 'multiselect':
        const selectedValues = (value as string[]) || []
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {filter.field.options?.map((option) => (
                <label key={option.value} className="flex items-center space-x-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={selectedValues.includes(String(option.value))}
                    onCheckedChange={(checked) => {
                      const newValues = checked
                        ? [...selectedValues, String(option.value)]
                        : selectedValues.filter(v => v !== String(option.value))
                      handleFilterChange(filter.field.name, newValues.length > 0 ? newValues : null)
                    }}
                    disabled={option.disabled}
                  />
                  <span className={option.disabled ? 'text-muted-foreground' : ''}>{option.label}</span>
                </label>
              ))}
            </div>
            {filter.helpText && (
              <p className="text-xs text-muted-foreground">{filter.helpText}</p>
            )}
          </div>
        )

      case 'boolean' as any:
        return (
          <div className="space-y-1">
            <Select
              value={value === undefined ? '' : String(value)}
              onValueChange={(newValue) => {
                if (newValue === '') {
                  handleFilterChange(filter.field.name, null)
                } else {
                  handleFilterChange(filter.field.name, newValue === 'true')
                }
              }}
            >
              <SelectTrigger className={cn("w-full", filter.className)}>
                <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
            {filter.helpText && (
              <p className="text-xs text-muted-foreground">{filter.helpText}</p>
            )}
          </div>
        )

      case 'number':
        return (
          <div className="space-y-1">
            <Input
              type="number"
              placeholder={filter.placeholder || `Enter ${filter.label}`}
              value={value as number || ''}
              onChange={(e) => {
                const numValue = e.target.value ? Number(e.target.value) : null
                handleFilterChange(filter.field.name, numValue)
              }}
              min={filter.field.min}
              max={filter.field.max}
              step={filter.field.step}
              className={cn("w-full", filter.className)}
            />
            {filter.helpText && (
              <p className="text-xs text-muted-foreground">{filter.helpText}</p>
            )}
          </div>
        )

      case 'range' as any:
        const rangeValue = (value as { min?: number; max?: number }) || {}
        return (
          <div className="space-y-1">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={rangeValue.min || ''}
                onChange={(e) => {
                  const newRange = {
                    ...rangeValue,
                    min: e.target.value ? Number(e.target.value) : undefined
                  }
                  handleFilterChange(filter.field.name, Object.keys(newRange).length > 0 ? newRange : null)
                }}
                min={filter.field.min}
                max={filter.field.max}
                step={filter.field.step}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Max"
                value={rangeValue.max || ''}
                onChange={(e) => {
                  const newRange = {
                    ...rangeValue,
                    max: e.target.value ? Number(e.target.value) : undefined
                  }
                  handleFilterChange(filter.field.name, Object.keys(newRange).length > 0 ? newRange : null)
                }}
                min={filter.field.min}
                max={filter.field.max}
                step={filter.field.step}
                className="flex-1"
              />
            </div>
            {filter.helpText && (
              <p className="text-xs text-muted-foreground">{filter.helpText}</p>
            )}
          </div>
        )

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(value as Date, "PPP") : <span>{filter.field.placeholder || "Pick a date"}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value as Date}
                required={true}
                onSelect={(date: Date) => handleFilterChange(filter.field.name, date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )

      case 'daterange' as any:
        const dateRangeValue = (value as { start?: Date; end?: Date }) || {}
        return (
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal",
                    !dateRangeValue.start && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRangeValue.start ? format(dateRangeValue.start, "PP") : <span>Start</span>}
                </Button>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRangeValue.start}
                    required={true}
                    onSelect={(date) => {
                      const newRange = { ...dateRangeValue, start: date }
                      handleFilterChange(filter.field.name, newRange.start || newRange.end ? newRange : null)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </PopoverTrigger>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal",
                    !dateRangeValue.end && "text-muted-foreground"
                  )}
                />
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRangeValue.end ? format(dateRangeValue.end, "PP") : <span>End</span>}
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateRangeValue.end}
                  required={true}
                  onSelect={(date) => {
                    const newRange = { ...dateRangeValue, end: date }
                    handleFilterChange(filter.field.name, newRange.start || newRange.end ? newRange : null)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </PopoverTrigger>
            </Popover>
          </div>
        )

      default:
        return (
          <div className="text-sm text-muted-foreground">
            Unsupported filter type: {filter.field.type}
          </div>
        )
    }
  }

  return (
    <Card className="border-l-4 border-l-primary/50">
      <CardContent className={cn("p-2", isCollapsed && "py-1")}>
        <div className={cn("flex items-center justify-between", isCollapsed ? "mb-0" : "mb-2")}>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Filters</h3>
            {showCount && activeFilterCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showReset && activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <X className="h-3.5 w-3.5 mr-1" />
                Clear all
              </Button>
            )}
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="gap-1"
              >
                {isCollapsed ? (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show Filters
                  </>
                ) : (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Hide Filters
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <div
            className={cn(
              'gap-4',
              layout === 'vertical' ? 'flex flex-col space-y-4' : '',
              layout === 'horizontal' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : '',
              layout === 'inline' ? 'flex flex-wrap gap-x-6 gap-y-4' : '',
              layout === 'compact' ? 'flex flex-wrap gap-3' : ''
            )}
          >
            {filters.map((filter) => (
              <div
                key={filter.field.name}
                className={cn(
                  'flex flex-col gap-2',
                  layout === 'horizontal' && 'min-h-[100px]',
                  layout === 'inline' ? 'flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]' : '',
                  layout === 'compact' ? 'flex-none w-[200px]' : '',
                  layout === 'vertical' && 'p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors'
                )}
              >
                {renderLabel(filter)}
                {renderFilterControl(filter)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}