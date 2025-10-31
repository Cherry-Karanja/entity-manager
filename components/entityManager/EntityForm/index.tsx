import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { EntityFormConfig, EntityFormProps, FormState, BulkImportState } from './types'
import { DEFAULT_FORM_CONFIG, DEFAULT_BULK_IMPORT_FORMATS } from './types'
import { validateField, validateForm } from './utils/validation'
import { transformData } from './utils/dataTransform'
import { useIsMobile } from '@/hooks/use-mobile'

// Import modular layouts
import { SingleColumnLayout } from './layouts/SingleColumnLayout'
import { TwoColumnLayout } from './layouts/TwoColumnLayout'

export const EntityForm: React.FC<EntityFormProps> = ({
  config,
  data,
  onSubmit,
  onCancel,
  disabled = false,
  loading = false,
}) => {
  // Mobile detection
  const isMobile = useIsMobile()

  // Merge config with defaults
  const mergedConfig = useMemo(() => ({
    ...DEFAULT_FORM_CONFIG,
    ...config,
    bulkImportFormats: config.bulkImportFormats || DEFAULT_BULK_IMPORT_FORMATS,
  }), [config])

  // Form state
  const [formState, setFormState] = useState<FormState>({
    data: mergedConfig.initialData || data || {},
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
    submitCount: 0,
  })

  // Bulk import state
  const [bulkImportState, setBulkImportState] = useState<BulkImportState>({
    isImporting: false,
    progress: 0,
    totalRecords: 0,
    processedRecords: 0,
    errors: [],
  })

  // UI state
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Initialize form data when data prop changes
  useEffect(() => {
    if (data) {
      const transformedData = mergedConfig.dataTransformer
        ? mergedConfig.dataTransformer(data)
        : data

      setFormState(prev => ({
        ...prev,
        data: transformedData,
        errors: {},
        touched: {},
      }))
    }
  }, [data, mergedConfig.dataTransformer])

  // Validate form when data changes
  useEffect(() => {
    if (mergedConfig.validateOnChange) {
      const errors = validateForm(formState.data, mergedConfig.fields, mergedConfig.validationSchema)
      setFormState(prev => ({
        ...prev,
        errors,
        isValid: Object.keys(errors).length === 0,
      }))
    }
  }, [formState.data, mergedConfig.fields, mergedConfig.validationSchema, mergedConfig.validateOnChange])

  // Handle field change
  const handleFieldChange = useCallback((fieldName: string, value: unknown) => {
    setFormState(prev => {
      const newData = { ...prev.data, [fieldName]: value }
      const newTouched = { ...prev.touched, [fieldName]: true }

      // Validate field if validateOnChange is enabled
      const newErrors = { ...prev.errors }
      if (mergedConfig.validateOnChange) {
        const field = mergedConfig.fields.find(f => f.name === fieldName)
        if (field) {
          const fieldErrors = validateField(value, field, mergedConfig.validationSchema?.[fieldName])
          if (fieldErrors.length > 0) {
            newErrors[fieldName] = fieldErrors[0]
          } else {
            delete newErrors[fieldName]
          }
        }
      }

      const newState = {
        ...prev,
        data: newData,
        touched: newTouched,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0,
      }

      // Call form change hook
      mergedConfig.hooks?.onFormChange?.(newData, fieldName, value)

      return newState
    })
  }, [mergedConfig])

  // Handle field blur
  const handleFieldBlur = useCallback((fieldName: string) => {
    setFormState(prev => {
      const newTouched = { ...prev.touched, [fieldName]: true }

      // Validate field on blur if validateOnBlur is enabled
      const newErrors = { ...prev.errors }
      if (mergedConfig.validateOnBlur) {
        const field = mergedConfig.fields.find(f => f.name === fieldName)
        const value = prev.data[fieldName]
        if (field) {
          const fieldErrors = validateField(value, field, mergedConfig.validationSchema?.[fieldName])
          if (fieldErrors.length > 0) {
            newErrors[fieldName] = fieldErrors[0]
          } else {
            delete newErrors[fieldName]
          }
        }
      }

      return {
        ...prev,
        touched: newTouched,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0,
      }
    })
  }, [mergedConfig])

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate entire form
    const errors = validateForm(formState.data, mergedConfig.fields, mergedConfig.validationSchema)
    const isValid = Object.keys(errors).length === 0

    setFormState(prev => ({
      ...prev,
      errors,
      touched: Object.keys(prev.data).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
      isValid,
      submitCount: prev.submitCount + 1,
    }))

    if (!isValid) {
      mergedConfig.hooks?.onValidationError?.(errors)
      return
    }

    setSubmitError(null)

    try {
      setFormState(prev => ({ ...prev, isSubmitting: true }))

      // Call submit start hook
      mergedConfig.hooks?.onSubmitStart?.(formState.data)

      // Transform data for submission
      const submitData = mergedConfig.submitTransformer
        ? mergedConfig.submitTransformer(formState.data)
        : formState.data

      // Call config submit handler
      if (mergedConfig.onSubmit) {
        await mergedConfig.onSubmit(submitData)
      }

      // Call prop submit handler
      if (onSubmit) {
        await onSubmit(submitData)
      }

      // Call success hook
      mergedConfig.hooks?.onSubmitSuccess?.(submitData)

      // Show success toast
      toast.success(mergedConfig.submitSuccessMessage || 'Form submitted successfully!')

      // Reset form if in create mode
      if (mergedConfig.mode === 'create') {
        setFormState(prev => ({
          ...prev,
          data: mergedConfig.initialData || {},
          errors: {},
          touched: {},
          isSubmitting: false,
        }))
      } else {
        setFormState(prev => ({ ...prev, isSubmitting: false }))
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during submission'
      setSubmitError(errorMessage)
      mergedConfig.hooks?.onSubmitError?.(error)
      setFormState(prev => ({ ...prev, isSubmitting: false }))
    }
  }, [formState.data, mergedConfig, onSubmit])

  // Handle cancel
  const handleCancel = useCallback(() => {
    mergedConfig.onCancel?.()
    onCancel?.()
  }, [mergedConfig, onCancel])

  // Handle bulk import
  const handleBulkImport = useCallback(async (importData: Record<string, unknown>[]) => {
    try {
      setBulkImportState(prev => ({ ...prev, isImporting: true, progress: 0, errors: [] }))

      mergedConfig.hooks?.onBulkImportStart?.({} as File)

      if (mergedConfig.onBulkImport) {
        await mergedConfig.onBulkImport(importData)
      }

      mergedConfig.hooks?.onBulkImportSuccess?.(importData)

      setBulkImportState(prev => ({
        ...prev,
        isImporting: false,
        progress: 100,
        processedRecords: importData.length,
        totalRecords: importData.length,
      }))

      setShowBulkImport(false)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Import failed'
      mergedConfig.hooks?.onBulkImportError?.(error)
      setBulkImportState(prev => ({
        ...prev,
        isImporting: false,
        errors: [{ row: 0, field: 'general', message: errorMessage }],
      }))
    }
  }, [mergedConfig])

  // Filter visible fields based on conditions
  const visibleFields = useMemo(() => {
    return mergedConfig.fields.filter(field => {
      if (field.hidden) return false
      if (field.condition) return field.condition(formState.data)
      return true
    })
  }, [mergedConfig.fields, formState.data])

  // Check permissions
  const canSubmit = mergedConfig.permissions?.[mergedConfig.mode === 'create' ? 'create' : 'edit'] !== false
  const canImport = !!(mergedConfig.permissions?.import !== false && mergedConfig.enableBulkImport)

  const isFormDisabled = !!(disabled || loading || formState.isSubmitting || mergedConfig.disabled)
  const isViewMode = mergedConfig.mode === 'view'

  // Common props for all layouts
  const layoutProps = {
    config: mergedConfig,
    formState,
    bulkImportState,
    visibleFields,
    showBulkImport,
    submitError: submitError || null,
    isFormDisabled,
    isViewMode,
    canSubmit,
    canImport,
    onFieldChange: handleFieldChange,
    onFieldBlur: handleFieldBlur,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onBulkImportClick: () => setShowBulkImport(true),
    onBulkImport: handleBulkImport,
    onBulkImportClose: () => setShowBulkImport(false),
  }

  // Render appropriate layout based on configuration
  if (mergedConfig.layout === 'grid' && (mergedConfig.columns || 2) > 1) {
    return <TwoColumnLayout {...layoutProps} />
  }

  // Default to single column layout
  return <SingleColumnLayout {...layoutProps} />
}

export default EntityForm