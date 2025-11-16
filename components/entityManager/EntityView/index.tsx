// ===== ENTITY VIEW V3 - STANDALONE COMPONENT =====
// Pure presentation component that works with EntityViewConfig<TEntity>

'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { EntityViewConfig } from './types'
import { BaseEntity } from '../manager'

export interface EntityViewProps<TEntity extends BaseEntity = BaseEntity> {
  config: EntityViewConfig<TEntity>
  data: TEntity
  onEdit?: () => void
  onDelete?: () => void
  onBack?: () => void
}

export const EntityView = <TEntity extends BaseEntity = BaseEntity>({
  config,
  data,
  onEdit,
  onDelete,
  onBack,
}: EntityViewProps<TEntity>) => {
  // Render field value
  const renderValue = (field: string, value: unknown) => {
    // Check if there's a custom format function in field groups
    for (const group of config.fieldGroups || []) {
      const fieldDef = group.fields.find(f => f.key === field)
      if (fieldDef?.component) {
        const Component = fieldDef.component
        return <Component field={fieldDef} value={value} data={data} />
      }
      if (fieldDef?.render) {
        return fieldDef.render(value, data)
      }
      if (fieldDef?.format) {
        return fieldDef.format(value, data)
      }
    }

    // Default rendering
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">Not set</span>
    }

    if (typeof value === 'boolean') {
      return value ? <Badge>Yes</Badge> : <Badge variant="outline">No</Badge>
    }

    if (value instanceof Date) {
      return value.toLocaleString()
    }

    if (typeof value === 'object') {
      return <pre className="text-xs">{JSON.stringify(value, null, 2)}</pre>
    }

    return String(value)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}

        <div className="flex gap-2">
          {onEdit && (
            <Button variant="outline" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Field Groups */}
      {config.fieldGroups && config.fieldGroups.length > 0 ? (
        <div className="space-y-4">
          {config.fieldGroups.map(group => (
            <Card key={group.title}>
              <CardHeader>
                <CardTitle className="text-lg">{group.title}</CardTitle>
                {group.description && (
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className={group.layout === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
                  {group.fields.map(field => (
                    <div key={field.key} className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">
                        {field.label}
                      </div>
                      <div className="text-base">
                        {renderValue(field.key, (data as Record<string, unknown>)[field.key])}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Simple key-value display if no field groups defined
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-muted-foreground">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div className="col-span-2">
                    {renderValue(key, value)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter>
            {/* You can add footer content here if needed */}
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

EntityView.displayName = 'EntityView'