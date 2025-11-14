import React from 'react'

// Import component configs to use in EntityManagerConfig
import type { EntityListConfig } from '../../types'
import type { EntityFormConfig } from '../../EntityForm/types'
import type { EntityViewConfig } from '../../EntityView/types'
import type { EntityActionsConfig } from '../../EntityActions/types'
import type { EntityExporterConfig } from '../../EntityExporter/types'

import { BaseEntity } from "../types"


export interface EntityEndpoints {
  list: string
  create: string
  read: string
  update: string
  delete: string
  export?: string
  import?: string
  bulk?: string
  [key: string]: string | undefined
}

export interface EntityPermissions {
  create?: boolean
  read?: boolean
  update?: boolean
  delete?: boolean
  export?: boolean
  import?: boolean
  bulk?: boolean
  [key: string]: boolean | undefined
}

export interface EntityFeatures {
  search?: boolean
  filter?: boolean
  sort?: boolean
  pagination?: boolean
  export?: boolean
  import?: boolean
  bulk?: boolean
  audit?: boolean
  versioning?: boolean
  [key: string]: boolean | undefined
}

export interface EntityHooks<TEntity = BaseEntity> {
  // Lifecycle hooks
  beforeCreate?: (data: Partial<TEntity>) => Partial<TEntity> | Promise<Partial<TEntity>>
  afterCreate?: (data: TEntity) => void | Promise<void>
  beforeUpdate?: (data: Partial<TEntity>) => Partial<TEntity> | Promise<Partial<TEntity>>
  afterUpdate?: (data: TEntity) => void | Promise<void>
  beforeDelete?: (id: string | number) => boolean | Promise<boolean>
  afterDelete?: (id: string | number) => void | Promise<void>
  
  // Data hooks
  beforeFetch?: () => void | Promise<void>
  afterFetch?: (data: TEntity[]) => TEntity[] | Promise<TEntity[]>
  
  // Validation hooks
  validateCreate?: (data: Partial<TEntity>) => string | null | Promise<string | null>
  validateUpdate?: (data: Partial<TEntity>) => string | null | Promise<string | null>
}


export interface EntityConfig<TEntity extends BaseEntity = BaseEntity, TFormData = Record<string, unknown>> {
  // Entity identification
  entityName: string
  entityNamePlural?: string
  
  // API endpoints (CENTRALIZED - Single source of truth)
  endpoints: EntityEndpoints
  
  // Component configurations
  list: EntityListConfig<TEntity>
  form: EntityFormConfig<TEntity>
  view: EntityViewConfig<TEntity>
  actions?: EntityActionsConfig<TEntity>
  exporter?: EntityExporterConfig<TEntity>
  
  // Global settings
  permissions?: EntityPermissions
  features?: EntityFeatures
  hooks?: EntityHooks<TEntity>
  
  // Advanced
  className?: string
  theme?: 'light' | 'dark' | 'system'
}

