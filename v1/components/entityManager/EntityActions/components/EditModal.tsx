import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash2, Edit } from "lucide-react"

interface ArrayEditorProps {
  arrayKey: string
  array: any[]
  onChange: (key: string, value: any) => void
}

const ArrayEditor: React.FC<ArrayEditorProps> = ({ arrayKey, array, onChange }) => {
  const addItem = () => {
    const newArray = [...array, ""]
    onChange(arrayKey, newArray)
  }

  const removeItem = (index: number) => {
    const newArray = array.filter((_, i) => i !== index)
    onChange(arrayKey, newArray)
  }

  const updateItem = (index: number, value: any) => {
    const newArray = [...array]
    newArray[index] = value
    onChange(arrayKey, newArray)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Array Items</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="h-8 px-2"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {array.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={String(item)}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={`Item ${index + 1}`}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeItem(index)}
              className="h-8 px-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      {array.length === 0 && (
        <p className="text-xs text-muted-foreground">No items in array</p>
      )}
    </div>
  )
}

interface ObjectEditorProps {
  objectKey: string
  object: Record<string, any>
  onChange: (key: string, value: any) => void
}

const ObjectEditor: React.FC<ObjectEditorProps> = ({ objectKey, object, onChange }) => {
  const addProperty = () => {
    const newObject = { ...object, "": "" }
    onChange(objectKey, newObject)
  }

  const removeProperty = (propKey: string) => {
    const newObject = { ...object }
    delete newObject[propKey]
    onChange(objectKey, newObject)
  }

  const updateProperty = (propKey: string, newKey: string, value: any) => {
    const newObject = { ...object }
    if (propKey !== newKey) {
      delete newObject[propKey]
    }
    newObject[newKey] = value
    onChange(objectKey, newObject)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Object Properties</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addProperty}
          className="h-8 px-2"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {Object.entries(object).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <Input
              value={key}
              onChange={(e) => updateProperty(key, e.target.value, value)}
              placeholder="Property name"
              className="w-32"
            />
            <Input
              value={String(value)}
              onChange={(e) => updateProperty(key, key, e.target.value)}
              placeholder="Property value"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeProperty(key)}
              className="h-8 px-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      {Object.keys(object).length === 0 && (
        <p className="text-xs text-muted-foreground">No properties in object</p>
      )}
    </div>
  )
}

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
      <ArrayEditor
        key={key}
        arrayKey={key}
        array={value}
        onChange={onChange}
      />
    )
  }

  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return (
      <ObjectEditor
        key={key}
        objectKey={key}
        object={value}
        onChange={onChange}
      />
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