'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { X, Plus, Filter, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EntityListFilter, DjangoLookupOperator } from '../types'

interface FilterCondition {
  id: string
  field: string
  operator: DjangoLookupOperator
  value: unknown
  label: string
}

interface FilterBuilderProps {
  filters: EntityListFilter[]
  activeFilters: Record<string, unknown>
  onChange: (filters: Record<string, unknown>) => void
  className?: string
}

const OPERATOR_LABELS: Record<DjangoLookupOperator, string> = {
  // String lookups
  exact: 'Equals',
  iexact: 'Equals (case insensitive)',
  contains: 'Contains',
  icontains: 'Contains (case insensitive)',
  startswith: 'Starts with',
  istartswith: 'Starts with (case insensitive)',
  endswith: 'Ends with',
  iendswith: 'Ends with (case insensitive)',
  // Numeric lookups
  gt: 'Greater than',
  gte: 'Greater than or equal',
  lt: 'Less than',
  lte: 'Less than or equal',
  // Array lookups
  in: 'In list',
  range: 'In range',
  // Null lookups
  isnull: 'Is null',
  // Date/time lookups
  date: 'Date equals',
  year: 'Year equals',
  month: 'Month equals',
  day: 'Day equals',
  week_day: 'Week day',
  hour: 'Hour equals',
  minute: 'Minute equals',
  second: 'Second equals',
  // Special lookups
  regex: 'Regex match',
  iregex: 'Regex match (case insensitive)'
}

const getDefaultOperator = (filter: EntityListFilter): DjangoLookupOperator => {
  if (filter.operator) return filter.operator

  switch (filter.type) {
    case 'text':
      return 'icontains'
    case 'number':
      return 'exact'
    case 'date':
    case 'daterange':
      return 'gte'
    case 'boolean':
      return 'exact'
    case 'select':
    case 'multiselect':
      return 'in'
    default:
      return 'exact'
  }
}

const getAvailableOperators = (filter: EntityListFilter): DjangoLookupOperator[] => {
  if (filter.operators && filter.operators.length > 0) {
    return filter.operators
  }

  switch (filter.type) {
    case 'text':
      return ['exact', 'iexact', 'contains', 'icontains', 'startswith', 'istartswith', 'endswith', 'iendswith']
    case 'number':
      return ['exact', 'gt', 'gte', 'lt', 'lte']
    case 'date':
      return ['exact', 'gt', 'gte', 'lt', 'lte', 'date', 'year', 'month', 'day']
    case 'daterange':
      return ['range', 'gt', 'gte', 'lt', 'lte']
    case 'boolean':
      return ['exact', 'isnull']
    case 'select':
      return ['exact', 'in', 'isnull']
    case 'multiselect':
      return ['in', 'isnull']
    case 'range':
      return ['range', 'gt', 'gte', 'lt', 'lte']
    default:
      return ['exact']
  }
}

export const FilterBuilder: React.FC<FilterBuilderProps> = ({
  filters,
  activeFilters,
  onChange,
  className
}) => {
  const [conditions, setConditions] = React.useState<FilterCondition[]>([])
  const [isOpen, setIsOpen] = React.useState(false)

  // Convert active filters to conditions on mount and when filters change
  React.useEffect(() => {
    const newConditions: FilterCondition[] = []

    Object.entries(activeFilters).forEach(([filterId, value]) => {
      const filter = filters.find(f => f.id === filterId)
      if (filter && filter.field) {
        // Try to parse operator from the key (e.g., "name__icontains" -> "icontains")
        const parts = filterId.split('__')
        const fieldName = parts[0]
        const operator = (parts[1] as DjangoLookupOperator) || getDefaultOperator(filter)

        newConditions.push({
          id: `${fieldName}__${operator}`,
          field: fieldName,
          operator,
          value,
          label: filter.label
        })
      }
    })

    setConditions(newConditions)
  }, [activeFilters, filters])

  const handleAddCondition = () => {
    if (filters.length === 0) return

    const firstAvailableFilter = filters.find(f => f.field && !conditions.some(c => c.field === f.field))
    if (!firstAvailableFilter || !firstAvailableFilter.field) return

    const operator = getDefaultOperator(firstAvailableFilter)
    const newCondition: FilterCondition = {
      id: `${firstAvailableFilter.field}__${operator}`,
      field: firstAvailableFilter.field,
      operator,
      value: '',
      label: firstAvailableFilter.label
    }

    setConditions(prev => [...prev, newCondition])
  }

  const handleRemoveCondition = (conditionId: string) => {
    setConditions(prev => prev.filter(c => c.id !== conditionId))
  }

  const handleConditionChange = (conditionId: string, updates: Partial<FilterCondition>) => {
    setConditions(prev => prev.map(c => {
      if (c.id === conditionId) {
        const updated = { ...c, ...updates }

        // Update ID if field or operator changed
        if (updates.field || updates.operator) {
          updated.id = `${updated.field}__${updated.operator}`
        }

        return updated
      }
      return c
    }))
  }

  const handleApplyFilters = () => {
    const newFilters: Record<string, unknown> = {}

    conditions.forEach(condition => {
      if (condition.value !== null && condition.value !== undefined && condition.value !== '') {
        const key = condition.operator === 'exact'
          ? condition.field
          : `${condition.field}__${condition.operator}`
        newFilters[key] = condition.value
      }
    })

    onChange(newFilters)
    setIsOpen(false)
  }

  const handleClearFilters = () => {
    setConditions([])
    onChange({})
    setIsOpen(false)
  }

  const activeFilterCount = conditions.length

  const renderConditionValue = (condition: FilterCondition, filter: EntityListFilter) => {
    switch (filter.type) {
      case 'text':
      case 'number':
        return (
          <Input
            value={condition.value as string || ''}
            onChange={(e) => handleConditionChange(condition.id, { value: e.target.value })}
            placeholder={`Enter ${filter.label.toLowerCase()}`}
            className="h-8"
          />
        )

      case 'select':
        return (
          <Select
            value={condition.value as string || ''}
            onValueChange={(value) => handleConditionChange(condition.id, { value })}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'boolean':
        return (
          <Select
            value={condition.value === undefined ? '' : String(condition.value)}
            onValueChange={(value) => {
              handleConditionChange(condition.id, {
                value: value === '' ? null : value === 'true'
              })
            }}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        )

      default:
        return (
          <Input
            value={String(condition.value || '')}
            onChange={(e) => handleConditionChange(condition.id, { value: e.target.value })}
            placeholder={`Enter ${filter.label.toLowerCase()}`}
            className="h-8"
          />
        )
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="start">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Filter Builder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {conditions.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No filters applied</p>
                  <p className="text-xs">Add conditions to filter your data</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {conditions.map((condition) => {
                    const filter = filters.find(f => f.field === condition.field)
                    if (!filter) return null

                    const availableOperators = getAvailableOperators(filter)

                    return (
                      <div key={condition.id} className="flex items-center gap-2 p-3 border rounded-lg">
                        <div className="flex-1 space-y-2">
                          <div className="text-xs font-medium text-muted-foreground">
                            {condition.label}
                          </div>
                          <div className="flex gap-2">
                            <Select
                              value={condition.operator}
                              onValueChange={(operator: DjangoLookupOperator) =>
                                handleConditionChange(condition.id, { operator })
                              }
                            >
                              <SelectTrigger className="h-8 flex-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {availableOperators.map((op) => (
                                  <SelectItem key={op} value={op}>
                                    {OPERATOR_LABELS[op]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex-1">
                              {renderConditionValue(condition, filter)}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCondition(condition.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddCondition}
                  disabled={conditions.length >= filters.length}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Condition
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    disabled={conditions.length === 0}
                  >
                    Clear All
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleApplyFilters}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  )
}