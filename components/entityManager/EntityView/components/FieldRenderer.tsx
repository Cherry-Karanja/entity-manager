'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ViewField } from '../types'
import { toast } from 'sonner'

export interface FieldRendererProps {
  field: ViewField
  value: unknown
  data: unknown
  className?: string
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  data,
  className,
}) => {
  const [copied, setCopied] = useState(false)

  const displayValue = useMemo(() => {
    if (field.format) {
      return field.format(value, data)
    }

    if (field.render) {
      return field.render(value, data)
    }

    if (field.component) {
      const Component = field.component
      return <Component field={field} value={value} data={data} />
    }

    return renderFieldValue(field, value)
  }, [field, value, data])

  const copyToClipboard = async () => {
    if (value === null || value === undefined) return

    const textToCopy = typeof value === 'string' ? value : String(value)

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      toast.success(`${field.label} copied to clipboard`)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const fieldClasses = cn(
    'flex items-center gap-2',
    field.align === 'center' && 'justify-center',
    field.align === 'right' && 'justify-end',
    field.bold && 'font-bold',
    field.italic && 'italic',
    field.color && `text-${field.color}`,
    field.backgroundColor && `bg-${field.backgroundColor}`,
    typeof field.width === 'number' && `w-${field.width}`,
    typeof field.width === 'string' && field.width.startsWith('w-') && field.width,
    className
  )

  const content = (
    <div className={fieldClasses}>
      {field.prefix && <span className="flex-shrink-0">{field.prefix}</span>}
      {field.icon && (
        <field.icon className="h-4 w-4 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        {field.badge ? (
          <Badge variant="secondary">{displayValue}</Badge>
        ) : (
          displayValue
        )}
      </div>
      {field.copyable && value !== null && value !== undefined && (
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-6 w-6 p-0 opacity-50 hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-600" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      )}
      {field.suffix && <span className="flex-shrink-0">{field.suffix}</span>}
    </div>
  )

  if (field.link) {
    const href = typeof field.link.href === 'function'
      ? field.link.href(data)
      : field.link.href

    return (
      <a
        href={href}
        target={field.link.target || '_self'}
        className="hover:underline"
      >
        {content}
      </a>
    )
  }

  return content
}

function renderFieldValue(field: ViewField, value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>
  }

  switch (field.type) {
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : String(value)

    case 'currency':
      return typeof value === 'number'
        ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(value)
        : String(value)

    case 'percentage':
      return typeof value === 'number' ? `${value}%` : String(value)

    case 'date':
      return value instanceof Date
        ? value.toLocaleDateString()
        : new Date(String(value)).toLocaleDateString()

    case 'datetime':
      return value instanceof Date
        ? value.toLocaleString()
        : new Date(String(value)).toLocaleString()

    case 'boolean':
      return value ? 'Yes' : 'No'

    case 'email':
      return (
        <a
          href={`mailto:${value}`}
          className="text-blue-600 hover:underline"
        >
          {String(value)}
        </a>
      )

    case 'phone':
      return (
        <a
          href={`tel:${value}`}
          className="text-blue-600 hover:underline"
        >
          {String(value)}
        </a>
      )

    case 'url':
      return (
        <a
          href={String(value)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {String(value)}
        </a>
      )

    case 'image':
      return (
        <Image
          src={String(value)}
          alt={field.label}
          width={32}
          height={32}
          className="h-8 w-8 rounded object-cover"
        />
      )

    case 'avatar':
      return (
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
          {typeof value === 'string' && value.length > 0
            ? value.charAt(0).toUpperCase()
            : '?'}
        </div>
      )

    case 'tags':
      return Array.isArray(value) ? (
        <div className="flex flex-wrap gap-1">
          {value.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {String(tag)}
            </Badge>
          ))}
        </div>
      ) : (
        String(value)
      )

    case 'json':
      return (
        <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded overflow-x-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      )

    case 'markdown':
      // For now, just render as text. In a real app, you'd use a markdown parser
      return <div className="whitespace-pre-wrap">{String(value)}</div>

    case 'html':
      return (
        <div
          dangerouslySetInnerHTML={{ __html: String(value) }}
          className="prose prose-sm max-w-none dark:prose-invert"
        />
      )

    default:
      return String(value)
  }
}

export default FieldRenderer
