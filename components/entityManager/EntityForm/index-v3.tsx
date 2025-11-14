// ===== ENTITY FORM V3 - STANDALONE COMPONENT =====
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
import { Entity, EntityFormConfig, FormField } from '../types'

export interface EntityFormProps<TEntity extends Entity = Entity> {
  config: EntityFormConfig<TEntity>
  data?: TEntity
  onSubmit: (data: Partial<TEntity>) => void | Promise<void>
  onCancel?: () => void
}

export const EntityForm = <TEntity extends Entity = Entity>({
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
    if (!field.validation) return null

    // Required validation
    if (field.validation.required && !value) {
      return typeof field.validation.required === 'string'
        ? field.validation.required
        : `${field.label} is required`
    }

    // String validations
    if (typeof value === 'string') {
      if (field.validation.minLength && value.length < field.validation.minLength) {
        return typeof field.validation.minLength === 'string'
          ? field.validation.minLength
          : `${field.label} must be at least ${field.validation.minLength} characters`
      }
      
      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        return typeof field.validation.maxLength === 'string'
          ? field.validation.maxLength
          : `${field.label} must be at most ${field.validation.maxLength} characters`
      }

      if (field.validation.pattern) {
        const regex = typeof field.validation.pattern === 'string'
          ? new RegExp(field.validation.pattern)
          : field.validation.pattern
        if (!regex.test(value)) {
          return `${field.label} format is invalid`
        }
      }

      if (field.validation.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return typeof field.validation.email === 'string'
          ? field.validation.email
          : `${field.label} must be a valid email`
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (field.validation.min !== undefined && value < Number(field.validation.min)) {
        return `${field.label} must be at least ${field.validation.min}`
      }
      
      if (field.validation.max !== undefined && value > Number(field.validation.max)) {
        return `${field.label} must be at most ${field.validation.max}`
      }
    }

    // Custom validation
    if (field.validation.custom) {
      const result = field.validation.custom(value)
      if (typeof result === 'string') return result
      if (result === false) return `${field.label} is invalid`
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
              {field.helpText || field.label}
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
              {config.cancelText || 'Cancel'}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (config.submitText || 'Save')}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

EntityForm.displayName = 'EntityForm'
