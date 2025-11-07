import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { AlertCircle, HelpCircle } from 'lucide-react'
import { FormField, FieldRenderProps } from '../types'
import { cn } from '@/lib/utils'
import { FileDropZone, FilePreview } from '../../FileDropZone'
import { useFileUpload } from '@/hooks/useFileUpload'

interface FormFieldRendererProps extends FieldRenderProps {
  layout?: 'vertical' | 'horizontal' | 'grid'
}

export const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  value,
  onChange,
  onBlur,
  error,
  touched,
  disabled,
  required,
  layout = 'vertical',
}) => {
  const fieldId = `field-${field.name}`
  const hasError = error && touched
  const helpText = field.helpText || field.description

  // Custom render function
  if (field.render) {
    return field.render({
      field,
      value,
      onChange,
      onBlur,
      error,
      touched,
      disabled,
      required,
    })
  }

  // Custom component
  if (field.component) {
    const Component = field.component
    return (
      <Component
        field={field}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        touched={touched}
        disabled={disabled}
        required={required}
      />
    )
  }

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'url':
        return (
          <Input
            id={fieldId}
            type={field.type}
            value={value as string || ''}
            onChange={(e) => onChange(field.transform ? field.transform(e.target.value) : e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            disabled={disabled}
            required={required}
            aria-required={required}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={hasError ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
            min={field.min}
            max={field.max}
            step={field.step}
            pattern={field.pattern}
            minLength={field.minLength}
            maxLength={field.maxLength}
            className={cn(
              hasError && 'border-red-500 focus:border-red-500',
              field.className
            )}
          />
        )

      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            value={value as string || ''}
            onChange={(e) => onChange(field.transform ? field.transform(e.target.value) : e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            disabled={disabled}
            required={required}
            aria-required={required}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={hasError ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
            rows={field.rows || 3}
            className={cn(
              hasError && 'border-red-500 focus:border-red-500',
              field.className
            )}
          />
        )

      case 'select':
        return (
          <Select
            value={value as string || ''}
            onValueChange={(val) => onChange(field.transform ? field.transform(val) : val)}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                hasError && 'border-red-500 focus:border-red-500',
                field.className
              )}
            >
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem
                  key={String(option.value)}
                  value={String(option.value)}
                  disabled={option.disabled}
                >
                  <div className="flex items-center gap-2">
                    {option.icon && <option.icon className="w-4 h-4" />}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : []
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={String(option.value)} className="flex items-center space-x-2">
                <Checkbox
                  id={`${fieldId}-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    let newValue: unknown[]
                    if (checked) {
                      newValue = [...selectedValues, option.value]
                    } else {
                      newValue = selectedValues.filter(v => v !== option.value)
                    }
                    onChange(field.transform ? field.transform(newValue) : newValue)
                  }}
                  disabled={disabled || option.disabled}
                />
                <Label
                  htmlFor={`${fieldId}-${option.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {option.icon && <option.icon className="w-4 h-4" />}
                    <span>{option.label}</span>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={fieldId}
              checked={Boolean(value)}
              onCheckedChange={(checked) => onChange(field.transform ? field.transform(checked) : checked)}
              onBlur={onBlur}
              disabled={disabled}
              required={required}
            />
            <Label htmlFor={fieldId} className="text-sm font-normal cursor-pointer">
              {field.label}
            </Label>
          </div>
        )

      case 'radio':
        return (
          <RadioGroup
            value={String(value) || ''}
            onValueChange={(val) => onChange(field.transform ? field.transform(val) : val)}
            disabled={disabled}
          >
            {field.options?.map((option) => (
              <div key={String(option.value)} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={String(option.value)}
                  id={`${fieldId}-${option.value}`}
                  disabled={option.disabled}
                />
                <Label
                  htmlFor={`${fieldId}-${option.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {option.icon && <option.icon className="w-4 h-4" />}
                    <span>{option.label}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={fieldId}
              checked={Boolean(value)}
              onCheckedChange={(checked) => onChange(field.transform ? field.transform(checked) : checked)}
              onBlur={onBlur}
              disabled={disabled}
            />
            <Label htmlFor={fieldId} className="text-sm font-normal cursor-pointer">
              {field.label}
            </Label>
          </div>
        )

      case 'slider':
        return (
          <div className="space-y-2">
            <Slider
              value={[Number(value) || 0]}
              onValueChange={([val]) => onChange(field.transform ? field.transform(val) : val)}
              onBlur={onBlur}
              disabled={disabled}
              min={field.min}
              max={field.max}
              step={field.step}
              className={field.className}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{field.min || 0}</span>
              <span>{field.max || 100}</span>
            </div>
          </div>
        )

      case 'date':
      case 'datetime':
      case 'time':
        return (
          <Input
            id={fieldId}
            type={field.type === 'datetime' ? 'datetime-local' : field.type}
            value={value as string || ''}
            onChange={(e) => onChange(field.transform ? field.transform(e.target.value) : e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            className={cn(
              hasError && 'border-red-500 focus:border-red-500',
              field.className
            )}
          />
        )

      case 'file':
        // Check if advanced file upload is enabled
        const enableAdvancedUpload = field.multiple || field.max || field.min ||
          (field as any).enableDragDrop || (field as any).showPreview;

        if (enableAdvancedUpload) {
          // Advanced file upload with drag-drop and preview
          const accept = field.options?.map(opt => String(opt.value)) || [];
          const maxSize = (field as any).maxSize;
          const minSize = (field as any).minSize;
          const showPreview = (field as any).showPreview !== false;
          const enableDragDrop = (field as any).enableDragDrop !== false;

          return (
            <div className="space-y-2">
              {enableDragDrop ? (
                <FileDropZone
                  onFilesSelected={(files) => {
                    if (field.multiple) {
                      onChange(field.transform ? field.transform(files) : files);
                    } else {
                      const file = files[0];
                      onChange(field.transform ? field.transform(file) : file);
                    }
                  }}
                  accept={accept.length > 0 ? { [accept[0].split('/')[0] || '*']: accept } : undefined}
                  maxSize={maxSize}
                  minSize={minSize}
                  maxFiles={field.multiple ? field.max || 10 : 1}
                  disabled={disabled}
                  className={cn(
                    hasError && 'border-red-500',
                    field.className
                  )}
                />
              ) : (
                <Input
                  id={fieldId}
                  type="file"
                  multiple={field.multiple}
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (field.multiple) {
                      onChange(field.transform ? field.transform(files) : files);
                    } else {
                      const file = files[0];
                      onChange(field.transform ? field.transform(file) : file);
                    }
                  }}
                  onBlur={onBlur}
                  disabled={disabled}
                  required={required}
                  accept={accept.join(',')}
                  className={cn(
                    hasError && 'border-red-500 focus:border-red-500',
                    field.className
                  )}
                />
              )}

              {showPreview && value ? (
                <div className="space-y-2">
                  {Array.isArray(value) ? (
                    (value as File[]).map((file: File, index: number) => (
                      <FilePreview
                        key={index}
                        file={file}
                        onRemove={() => {
                          const newFiles = (value as File[]).filter((_: File, i: number) => i !== index);
                          onChange(newFiles);
                        }}
                      />
                    ))
                  ) : (
                    value instanceof File ? (
                      <FilePreview
                        file={value}
                        onRemove={() => onChange(null)}
                      />
                    ) : null
                  )}
                </div>
              ) : null}
            </div>
          );
        } else {
          // Simple file input
          return (
            <Input
              id={fieldId}
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0]
                onChange(field.transform ? field.transform(file) : file)
              }}
              onBlur={onBlur}
              disabled={disabled}
              required={required}
              accept={field.options?.map(opt => String(opt.value)).join(',')}
              className={cn(
                hasError && 'border-red-500 focus:border-red-500',
                field.className
              )}
            />
          )
        }

      case 'color':
        return (
          <Input
            id={fieldId}
            type="color"
            value={value as string || '#000000'}
            onChange={(e) => onChange(field.transform ? field.transform(e.target.value) : e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            className={cn(
              hasError && 'border-red-500 focus:border-red-500',
              field.className
            )}
          />
        )

      case 'json':
        const jsonValue = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
        return (
          <Textarea
            id={fieldId}
            value={jsonValue}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                onChange(field.transform ? field.transform(parsed) : parsed)
              } catch {
                onChange(field.transform ? field.transform(e.target.value) : e.target.value)
              }
            }}
            onBlur={onBlur}
            placeholder={field.placeholder || '{"key": "value"}'}
            disabled={disabled}
            required={required}
            rows={field.rows || 6}
            className={cn(
              'font-mono text-sm',
              hasError && 'border-red-500 focus:border-red-500',
              field.className
            )}
          />
        )

      default:
        return (
          <div className="text-sm text-gray-500 p-2 border rounded">
            Unsupported field type: {field.type}
          </div>
        )
    }
  }

  const fieldWidthClass = field.width
    ? typeof field.width === 'number'
      ? `w-[${field.width}px]`
      : field.width.startsWith('w-') ? field.width : `w-${field.width}`
    : ''

  return (
    <div
      className={cn(
        'space-y-2',
        layout === 'horizontal' && 'flex items-center gap-4',
        layout === 'grid' && 'col-span-1',
        fieldWidthClass
      )}
    >
      {/* Field Label */}
      {(field.type !== 'checkbox' && field.type !== 'switch') && (
        <Label
          htmlFor={fieldId}
          className={cn(
            'text-sm font-medium',
            layout === 'horizontal' && 'min-w-[120px]',
            required && "after:content-['*'] after:text-red-500 after:ml-1"
          )}
        >
          {field.label}
          {field.icon && <field.icon className="w-4 h-4 ml-2 inline" />}
        </Label>
      )}

      {/* Field Input */}
      <div className="flex-1">
        {renderField()}

        {/* Field Prefix/Suffix */}
        {(field.prefix || field.suffix) && (
          <div className="flex items-center mt-1 text-xs text-gray-500">
            {field.prefix && <span className="mr-2">{field.prefix}</span>}
            {field.suffix && <span>{field.suffix}</span>}
          </div>
        )}

        {/* Help Text */}
        {helpText && !hasError && (
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <HelpCircle className="w-3 h-3 mr-1" />
            {helpText}
          </div>
        )}

        {/* Error Message */}
        {hasError && (
          <div className="flex items-center mt-1 text-xs text-red-600">
            <AlertCircle className="w-3 h-3 mr-1" />
            {error}
          </div>
        )}
      </div>
    </div>
  )
}