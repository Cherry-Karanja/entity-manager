// Pure presentation component that works with EntityFormConfig<TEntity>

'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BaseEntity } from '../manager'
import { EntityFormConfig, FormField } from './types'
 
export interface EntityFormProps<TEntity extends BaseEntity = BaseEntity> {
  config: EntityFormConfig<TEntity>
  data?: TEntity
  onSubmit: (data: Partial<TEntity>) => void | Promise<void>
  onCancel?: () => void
}

export const EntityForm = <TEntity extends BaseEntity = BaseEntity>({
  config,
  data,
  onSubmit,
  onCancel,
}: EntityFormProps<TEntity>) => {
  // Initialize form data from existing data or defaults
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {}
    
    config.fields.forEach(field => {
      if (data && field.name in data) {
        initial[field.name] = (data as Record<string, unknown>)[field.name]
      } else if (field.defaultValue !== undefined) {
        initial[field.name] = field.defaultValue
      }
    })
    
    return initial
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle field change
  const handleChange = useCallback((fieldName: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
    
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }, [errors])

  // Validate field
  const validateField = useCallback((field: FormField, value: unknown): string | null => {
    if (!field.validation || field.validation.length === 0) return null

    // Check each validation rule
    for (const validation of field.validation) {
      switch (validation.type) {
        case 'required':
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            return validation.message || `${field.label} is required`
          }
          break

        case 'minLength':
          if (typeof value === 'string' && validation.value && typeof validation.value === 'number' && value.length < validation.value) {
            return validation.message || `${field.label} must be at least ${validation.value} characters`
          }
          break

        case 'maxLength':
          if (typeof value === 'string' && validation.value && typeof validation.value === 'number' && value.length > validation.value) {
            return validation.message || `${field.label} must be at most ${validation.value} characters`
          }
          break

        case 'min':
          if (typeof value === 'number' && validation.value && typeof validation.value === 'number' && value < validation.value) {
            return validation.message || `${field.label} must be at least ${validation.value}`
          }
          break

        case 'max':
          if (typeof value === 'number' && validation.value && typeof validation.value === 'number' && value > validation.value) {
            return validation.message || `${field.label} must be at most ${validation.value}`
          }
          break

        case 'pattern':
          if (typeof value === 'string' && validation.value) {
            let regex: RegExp
            if (typeof validation.value === 'string') {
              regex = new RegExp(validation.value)
            } else if (validation.value instanceof RegExp) {
              regex = validation.value
            } else {
              break // Invalid pattern value
            }
            if (!regex.test(value)) {
              return validation.message || `${field.label} format is invalid`
            }
          }
          break

        case 'email':
          if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return validation.message || `${field.label} must be a valid email`
          }
          break

        case 'url':
          if (typeof value === 'string') {
            try {
              new URL(value)
            } catch {
              return validation.message || `${field.label} must be a valid URL`
            }
          }
          break

        case 'custom':
          // Custom validation would need to be implemented differently
          break
      }
    }

    return null
  }, [])

  // Handle submit
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: Record<string, string> = {}
    config.fields.forEach(field => {
      const value = formData[field.name]
      const error = validateField(field, value)
      if (error) {
        newErrors[field.name] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit
    setIsSubmitting(true)
    try {
      await onSubmit(formData as Partial<TEntity>)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [config.fields, formData, onSubmit, validateField])

  // Render field based on type
  const renderField = useCallback((field: FormField) => {
    if (field.hidden) return null
    if (field.condition && !field.condition(formData)) return null

    const value = formData[field.name]
    const error = errors[field.name]
    const isDisabled = field.disabled || field.readOnly || isSubmitting

    const fieldId = `field-${field.name}`

    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={fieldId} className={field.required ? 'after:content-["*"] after:ml-1 after:text-destructive' : ''}>
          {field.label}
        </Label>

        {/* Text inputs */}
        {['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'datetime', 'time'].includes(field.type) && (
          <Input
            id={fieldId}
            type={field.type}
            value={String(value ?? '')}
            onChange={(e) => handleChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            className={error ? 'border-destructive' : ''}
          />
        )}

        {/* Textarea */}
        {field.type === 'textarea' && (
          <Textarea
            id={fieldId}
            value={String(value ?? '')}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            className={error ? 'border-destructive' : ''}
            rows={4}
          />
        )}

        {/* Select */}
        {field.type === 'select' && field.options && (
          <Select
            value={String(value ?? '')}
            onValueChange={(val) => handleChange(field.name, val)}
            disabled={isDisabled}
          >
            <SelectTrigger className={error ? 'border-destructive' : ''}>
              <SelectValue placeholder={field.placeholder || 'Select...'} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map(option => (
                <SelectItem
                  key={String(option.value)}
                  value={String(option.value)}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Checkbox */}
        {field.type === 'checkbox' && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={fieldId}
              checked={Boolean(value)}
              onCheckedChange={(checked) => handleChange(field.name, checked)}
              disabled={isDisabled}
            />
            <label
              htmlFor={fieldId}
              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </label>
          </div>
        )}

        {/* Help text */}
        {field.helpText && field.type !== 'checkbox' && (
          <p className="text-sm text-muted-foreground">{field.helpText}</p>
        )}

        {/* Error message */}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }, [formData, errors, isSubmitting, handleChange])

  // Layout
  const gridCols = config.columns || 1
  const gridClass = gridCols === 1
    ? 'space-y-4'
    : `grid gap-4 ${gridCols === 2 ? 'grid-cols-2' : `grid-cols-${gridCols}`}`

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{data ? 'Edit' : 'Create'} {config.fields.length > 0 ? '' : 'Form'}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className={gridClass}>
            {config.fields.map(field => renderField(field))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {config.cancelButtonText || 'Cancel'}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (config.submitButtonText || 'Save')}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

EntityForm.displayName = 'EntityForm'