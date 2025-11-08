'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

export interface FormHeaderProps {
  mode?: 'create' | 'edit' | 'view'
  canImport?: boolean
  isFormDisabled?: boolean
  onBulkImportClick?: () => void
  className?: string
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  mode,
  canImport,
  isFormDisabled,
  onBulkImportClick,
  className,
}) => {
  if (!mode && !canImport) return null

  return (
    <div className={`flex items-center justify-between ${className || ''}`}>
      <div className="flex items-center gap-2">
        {mode && (
          <Badge
            variant={
              mode === 'create'
                ? 'default'
                : mode === 'edit'
                ? 'secondary'
                : 'outline'
            }
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Badge>
        )}
      </div>

      {canImport && onBulkImportClick && (
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkImportClick}
          disabled={isFormDisabled}
        >
          <Upload className="w-4 h-4 mr-2" />
          Bulk Import
        </Button>
      )}
    </div>
  )
}

export default FormHeader
