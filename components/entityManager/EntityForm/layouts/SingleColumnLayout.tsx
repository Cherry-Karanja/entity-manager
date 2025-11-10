'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import FormFieldRenderer from '../components/FormFieldRenderer'
import { FormHeader } from '../components/FormHeader'
import { FormActions } from '../components/FormActions'
import { FormMessages } from '../components/FormMessages'
import { BulkImportDialog } from '../components/BulkImportDialog'
import { EntityFormConfig, FormState, BulkImportState, FormField } from '../types'

export interface SingleColumnLayoutProps {
  config: EntityFormConfig
  formState: FormState
  bulkImportState: BulkImportState
  visibleFields: FormField[]
  showBulkImport: boolean
  submitError: string | null
  isFormDisabled: boolean
  isViewMode: boolean
  canSubmit: boolean
  canImport: boolean
  onFieldChange: (fieldName: string, value: unknown) => void
  onFieldBlur: (fieldName: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  onBulkImportClick: () => void
  onBulkImport: (data: Record<string, unknown>[]) => Promise<void>
  onBulkImportClose: () => void
}

export const SingleColumnLayout: React.FC<SingleColumnLayoutProps> = ({
  config,
  formState,
  bulkImportState,
  visibleFields,
  showBulkImport,
  submitError,
  isFormDisabled,
  isViewMode,
  canSubmit,
  canImport,
  onFieldChange,
  onFieldBlur,
  onSubmit,
  onCancel,
  onBulkImportClick,
  onBulkImport,
  onBulkImportClose,
}) => {
  const fieldSpacingClass = config.fieldSpacing === 'sm' ? 'gap-2' : config.fieldSpacing === 'lg' ? 'gap-6' : 'gap-4'

  return (
    <div className={`space-y-6 ${config.className || ''}`}>
      {/* Form Header */}
      <FormHeader
        mode={config.mode}
        canImport={canImport}
        isFormDisabled={isFormDisabled}
        onBulkImportClick={onBulkImportClick}
      />

      {/* Progress Indicator */}
      {config.showProgress && formState.isSubmitting && (
        <Progress value={100} className="w-full" />
      )}

      {/* Success/Error Messages */}
      <FormMessages
        errorMessage={submitError}
        showError={!!submitError}
      />

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Form Fields - Single Column */}
            <div className={`grid grid-cols-1 ${fieldSpacingClass}`}>
              {visibleFields.map((field) => (
                <FormFieldRenderer
                  key={field.name}
                  field={field}
                  value={formState.data[field.name]}
                  onChange={(value: unknown) => onFieldChange(field.name, value)}
                  onBlur={() => onFieldBlur(field.name)}
                  error={formState.errors[field.name]}
                  touched={formState.touched[field.name]}
                  disabled={isFormDisabled || field.disabled}
                  required={field.required}
                  layout={config.layout}
                />
              ))}
            </div>

            {/* Form Actions */}
            {!isViewMode && canSubmit && (
              <FormActions
                onCancel={config.onCancel ? onCancel : undefined}
                isSubmitting={formState.isSubmitting}
                isDisabled={isFormDisabled}
                isValid={formState.isValid}
                submitButtonText={config.submitButtonText}
                cancelButtonText={config.cancelButtonText}
                buttonSize={config.buttonSize}
                buttonVariant={config.buttonVariant}
                showCancel={!!config.onCancel}
              />
            )}
          </form>
        </CardContent>
      </Card>

      {/* Bulk Import Dialog */}
      {canImport && (
        <BulkImportDialog
          open={showBulkImport}
          onOpenChange={onBulkImportClose}
          formats={config.bulkImportFormats || []}
          fields={config.fields}
          onImport={onBulkImport}
          importState={bulkImportState}
        />
      )}
    </div>
  )
}

export default SingleColumnLayout
