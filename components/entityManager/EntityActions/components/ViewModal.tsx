import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ViewModalProps {
  item: unknown
  onClose: () => void
}

const ViewModal: React.FC<ViewModalProps> = ({ item, onClose }) => {
  if (!item || typeof item !== 'object') {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">No data to display</p>
      </div>
    )
  }

  const data = item as Record<string, unknown>

  return (
    <ScrollArea className="max-h-96">
      <div className="p-6 space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between items-start">
            <span className="font-medium text-sm text-muted-foreground capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}:
            </span>
            <div className="text-sm max-w-xs truncate">
              {renderValue(value)}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

function renderValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>
  }

  if (typeof value === 'boolean') {
    return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (value instanceof Date) {
    return value.toLocaleString()
  }

  if (Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1">
        {value.slice(0, 3).map((item, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {String(item)}
          </Badge>
        ))}
        {value.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{value.length - 3} more
          </Badge>
        )}
      </div>
    )
  }

  if (typeof value === 'object') {
    return <Badge variant="secondary">Object</Badge>
  }

  return String(value)
}

export default ViewModal