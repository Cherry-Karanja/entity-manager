import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface EditModalProps {
  item: unknown
  onClose: () => void
}

const EditModal: React.FC<EditModalProps> = ({ item, onClose }) => {
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    if (!item || typeof item !== 'object') {
      return {}
    }
    return { ...item as Record<string, unknown> }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd call an API to update the item
    console.log('Updated data:', formData)
    onClose()
  }

  const handleChange = (key: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  if (!item || typeof item !== 'object') {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">No data to edit</p>
      </div>
    )
  }

  const data = item as Record<string, unknown>

  return (
    <form onSubmit={handleSubmit}>
      <ScrollArea className="max-h-96">
        <div className="p-6 space-y-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="text-sm font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
              {renderEditField(key, value, formData[key], handleChange)}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex justify-end gap-2 p-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  )
}

function renderEditField(
  key: string,
  originalValue: unknown,
  currentValue: unknown,
  onChange: (key: string, value: unknown) => void
): React.ReactNode {
  const value = currentValue !== undefined ? currentValue : originalValue

  if (typeof value === 'boolean') {
    return (
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={key}
          checked={Boolean(value)}
          onChange={(e) => onChange(key, e.target.checked)}
          className="rounded"
          aria-label={key}
        />
        <Label htmlFor={key}>{value ? 'Yes' : 'No'}</Label>
      </div>
    )
  }

  if (typeof value === 'string' && value.length > 100) {
    return (
      <Textarea
        id={key}
        value={String(value)}
        onChange={(e) => onChange(key, e.target.value)}
        rows={3}
      />
    )
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return (
      <Input
        id={key}
        type={typeof value === 'number' ? 'number' : 'text'}
        value={String(value)}
        onChange={(e) => onChange(key, typeof originalValue === 'number' ? Number(e.target.value) : e.target.value)}
      />
    )
  }

  if (value instanceof Date) {
    return (
      <Input
        id={key}
        type="datetime-local"
        value={value.toISOString().slice(0, 16)}
        onChange={(e) => onChange(key, new Date(e.target.value))}
      />
    )
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1">
          {value.map((item, index) => (
            <Badge key={index} variant="outline">
              {String(item)}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Array editing not implemented</p>
      </div>
    )
  }

  if (typeof value === 'object' && value !== null) {
    return (
      <div className="p-2 border rounded bg-muted">
        <p className="text-xs text-muted-foreground">Object editing not implemented</p>
        <pre className="text-xs mt-1">{JSON.stringify(value, null, 2)}</pre>
      </div>
    )
  }

  return (
    <Input
      id={key}
      value={String(value)}
      onChange={(e) => onChange(key, e.target.value)}
    />
  )
}

export default EditModal