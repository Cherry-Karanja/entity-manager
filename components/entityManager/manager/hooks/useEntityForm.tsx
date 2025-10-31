'use client'

import { useState, useMemo, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { EntityConfig, BaseEntity, FormFieldConfig } from '../types'
import { transformEntityFieldsToFormFields } from '../utils'
import { useRelatedData } from '../../../../hooks/useRelatedData'

export interface UseEntityFormOptions<TEntity extends BaseEntity, TFormData extends Record<string, unknown>> {
  config: EntityConfig<TEntity, TFormData>
  mode: 'create' | 'edit'
}

export interface EntityFormState {
  modalState: {
    isOpen: boolean
    entityType: string
    fieldKey: string
  }
  isRelatedDataLoading: boolean
}

export interface EntityFormActions {
  handleEntityCreated: (newEntity: any) => void
  handleFieldChange: (fieldKey: string, value: any) => any
  setModalState: React.Dispatch<React.SetStateAction<EntityFormState['modalState']>>
}

export interface UseEntityFormReturn {
  formConfig: {
    title: string
    description?: string
    fields: FormFieldConfig[]
    onSubmit: (data: Record<string, unknown>) => Promise<void>
    submitLabel: string
    cancelLabel: string
    maxWidth?: string
    layout?: 'grid' | 'flex' | 'stack'
    columns?: number
  }
  formState: EntityFormState
  formActions: EntityFormActions
  relatedDataMap: Record<string, Array<{ value: string | number; label: string }>>
}

// Custom hook to manage multiple related data queries
function useRelatedDataMap(fields: any[]) {
  const foreignKeyFields = fields.filter((field: any) => field.foreignKey && field.relatedEntity && field.endpoint)

  // Create a map to track which entities are needed and their configs
  const entityConfigs: Record<string, any> = {}
  foreignKeyFields.forEach(field => {
    if (field.relatedEntity && field.endpoint) {
      entityConfigs[field.relatedEntity] = field
    }
  })

  // Always call all possible hooks in the same order, but enable only when needed
  const categoriesQuery = useRelatedData('categories', {
    endpoint: entityConfigs.categories?.endpoint,
    displayField: entityConfigs.categories?.displayField,
    valueField: entityConfigs.categories?.relatedField || 'id',
    filter: entityConfigs.categories?.relatedQuery?.filter,
    sort: entityConfigs.categories?.relatedQuery?.sort,
    limit: entityConfigs.categories?.relatedQuery?.limit,
    enabled: !!entityConfigs.categories
  })

  const usersQuery = useRelatedData('users', {
    endpoint: entityConfigs.users?.endpoint,
    displayField: entityConfigs.users?.displayField,
    valueField: entityConfigs.users?.relatedField || 'id',
    filter: entityConfigs.users?.relatedQuery?.filter,
    sort: entityConfigs.users?.relatedQuery?.sort,
    limit: entityConfigs.users?.relatedQuery?.limit,
    enabled: !!entityConfigs.users
  })

  const unitsQuery = useRelatedData('units', {
    endpoint: entityConfigs.units?.endpoint,
    displayField: entityConfigs.units?.displayField,
    valueField: entityConfigs.units?.relatedField || 'id',
    filter: entityConfigs.units?.relatedQuery?.filter,
    sort: entityConfigs.units?.relatedQuery?.sort,
    limit: entityConfigs.units?.relatedQuery?.limit,
    enabled: !!entityConfigs.units
  })

  const rolesQuery = useRelatedData('roles', {
    endpoint: entityConfigs.roles?.endpoint,
    displayField: entityConfigs.roles?.displayField,
    valueField: entityConfigs.roles?.relatedField || 'id',
    filter: entityConfigs.roles?.relatedQuery?.filter,
    sort: entityConfigs.roles?.relatedQuery?.sort,
    limit: entityConfigs.roles?.relatedQuery?.limit,
    enabled: !!entityConfigs.roles
  })

  // Create the related data map
  const relatedDataMap: Record<string, Array<{ value: string | number; label: string }>> = {}

  if (categoriesQuery.data) relatedDataMap.categories = categoriesQuery.data
  if (usersQuery.data) relatedDataMap.users = usersQuery.data
  if (unitsQuery.data) relatedDataMap.units = unitsQuery.data
  if (rolesQuery.data) relatedDataMap.roles = rolesQuery.data

  const isLoading = [categoriesQuery, usersQuery, unitsQuery, rolesQuery]
    .filter((_, index) => !!Object.keys(entityConfigs)[index])
    .some(query => query.isLoading)

  return { relatedDataMap, isLoading }
}

export function useEntityForm<TEntity extends BaseEntity, TFormData extends Record<string, unknown>>({
  config,
  mode
}: UseEntityFormOptions<TEntity, TFormData>): UseEntityFormReturn {
  const queryClient = useQueryClient()

  // Modal state for creating related entities
  const [modalState, setModalState] = useState<EntityFormState['modalState']>({
    isOpen: false,
    entityType: '',
    fieldKey: ''
  })

  // Related data queries
  const { relatedDataMap, isLoading: isRelatedDataLoading } = useRelatedDataMap(config.fields)

  // Handle when a new related entity is created
  const handleEntityCreated = useCallback((newEntity: any) => {
    // Invalidate and refetch the related data for this entity type
    queryClient.invalidateQueries({
      queryKey: ['relatedData', modalState.entityType]
    })
    setModalState({ isOpen: false, entityType: '', fieldKey: '' })
  }, [queryClient, modalState.entityType])

  // Handle field change for create new functionality
  const handleFieldChange = useCallback((fieldKey: string, value: any) => {
    if (value === '__create_new__') {
      // Find the field config to get the related entity type
      const field = config.fields.find(f => f.key === fieldKey)
      if (field?.relatedEntity) {
        setModalState({
          isOpen: true,
          entityType: field.relatedEntity,
          fieldKey
        })
      }
      return null // Don't update the field value
    }
    return value // Return the value for normal processing
  }, [config.fields])

  // Transform entity config to form config with related data
  const baseFormFields = useMemo(() => transformEntityFieldsToFormFields(config.fields), [config.fields])

  // Enhance fields with related data
  const enhancedFormFields = useMemo(() => baseFormFields.map(field => {
    const entityField = config.fields.find(f => f.key === field.name)
    if (entityField?.foreignKey && entityField.relatedEntity && relatedDataMap[entityField.relatedEntity]) {
      const options = [...relatedDataMap[entityField.relatedEntity]]

      // Add 'Create New' option if allowed
      if (entityField.allowCreateNew) {
        options.unshift({
          value: '__create_new__',
          label: 'Create New'
        })
      }

      return {
        ...field,
        options,
        searchable: true, // Make foreign key selects searchable
        // Add custom onChange handler for create new functionality
        onChange: entityField.allowCreateNew ? (value: any) => handleFieldChange(field.name, value) : undefined
      }
    }
    return field
  }), [baseFormFields, config.fields, relatedDataMap, handleFieldChange])

  // Form configuration
  const formConfig = useMemo(() => ({
    title: mode === 'create'
      ? (config.formConfig?.createTitle || `Create ${config.displayName}`)
      : (config.formConfig?.editTitle || `Edit ${config.displayName}`),
    description: config.formConfig?.description,
    fields: enhancedFormFields,
    onSubmit: async (data: Record<string, unknown>) => {
      // This will be overridden by the component using this hook
      throw new Error('onSubmit must be provided by the component')
    },
    submitLabel: config.formConfig?.submitLabel || (mode === 'create' ? 'Create' : 'Update'),
    cancelLabel: config.formConfig?.cancelLabel || 'Cancel',
    maxWidth: config.formConfig?.maxWidth,
    layout: config.formConfig?.layout || 'grid',
    columns: config.formConfig?.columns || 2,
  }), [config, enhancedFormFields, mode])

  return {
    formConfig,
    formState: {
      modalState,
      isRelatedDataLoading
    },
    formActions: {
      handleEntityCreated,
      handleFieldChange,
      setModalState
    },
    relatedDataMap
  }
}