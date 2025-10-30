// EntityManager Orchestrator
// A comprehensive React component system that provides complete CRUD operations
// using existing EntityList/EntityView/EntityForm/EntityActions modules.

export { EntityManager } from './EntityManager/components/EntityManager'
export { EntityListView } from './components/EntityListView'
export { useEntityManager } from './hooks'
export { getEntityConfig } from './EntityManager/api/config'
export type {
  EntityManagerConfig,
  EntityFieldConfig,
  EntityListViewConfig,
  EntityDetailViewConfig,
  EntityFormViewConfig,
  EntityActionsConfig,
  EntityType,
  BaseEntity,
  User,
  TenantProfile,
  Property,
} from './EntityManager/types'