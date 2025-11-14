// ===== ENTITY MANAGER V3.0 TYPES =====
// Complete rewrite with breaking changes

import {
  Entity,
  FormField,
  EntityManagerConfig,
  EntityListConfig,
  EntityFormConfig,
  EntityViewConfig,
  EntityActionsConfig,
  EntityExporterConfig,
  EntityPermissions,
  EntityFeatures,
  EntityHooks,
} from '../types'

// ===== RE-EXPORT EVERYTHING FROM UNIFIED TYPES =====

export type {
  Entity,
  FormField,
  EntityManagerConfig,
  EntityListConfig,
  EntityFormConfig,
  EntityViewConfig,
  EntityActionsConfig,
  EntityExporterConfig,
  EntityPermissions,
  EntityFeatures,
  EntityHooks,
}

// ===== MANAGER-SPECIFIC TYPES =====

export interface EntityManagerProps<TEntity = Entity> {
  config: EntityManagerConfig<TEntity>
  initialView?: EntityManagerView
  className?: string
}

export type EntityManagerView = 'list' | 'form' | 'view'

export interface EntityManagerState<TEntity = Entity> {
  view: EntityManagerView
  selectedEntity?: TEntity
  selectedEntities: TEntity[]
  entities: TEntity[]
  loading: boolean
  error?: string | null
}

// ===== LEGACY TYPE ALIASES (For migration compatibility) =====
// These will be removed in v4.0

/**
 * @deprecated Use FormField from '@/components/entityManager/types' instead
 */
export type FormFieldConfig = FormField

/**
 * @deprecated Use EntityFormConfig from '@/components/entityManager/types' instead
 */
export type FormConfig = EntityFormConfig

/**
 * @deprecated Use EntityListConfig from '@/components/entityManager/types' instead
 */
export type ListConfig = EntityListConfig

/**
 * @deprecated Use EntityViewConfig from '@/components/entityManager/types' instead
 */
export type ViewConfig = EntityViewConfig

/**
 * @deprecated Use EntityActionsConfig from '@/components/entityManager/types' instead
 */
export type ActionsConfig = EntityActionsConfig

/**
 * @deprecated Use EntityExporterConfig from '@/components/entityManager/types' instead
 */
export type ExporterConfig = EntityExporterConfig

/**
 * @deprecated Use Entity from '@/components/entityManager/types' instead
 */
export type BaseEntity = Entity

/**
 * @deprecated Use EntityManagerConfig from '@/components/entityManager/types' instead
 */
export type EntityConfig<TEntity = Entity> = EntityManagerConfig<TEntity>
