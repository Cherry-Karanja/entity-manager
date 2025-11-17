/**
 * Entity Manager Types
 * 
 * Type definitions for the orchestrator.
 */

import { BaseEntity } from '../primitives/types';
import { EntityConfig } from '../composition/config/types';
import { ApiClient } from '../composition/api/types';

/**
 * Entity manager configuration
 */
export interface EntityManagerConfig<T extends BaseEntity = BaseEntity> {
  /** Entity configuration */
  config: EntityConfig<T>;
  
  /** API client (optional) */
  apiClient?: ApiClient<T>;

  /** Initial view mode (default: 'list') */
  initialView?: EntityManagerView;
  
  /** Initial data (optional) */
  initialData?: T[];
  
  /** Enable features */
  features?: {
    offline?: boolean;
    realtime?: boolean;
    optimistic?: boolean;
    collaborative?: boolean;
  };
}

/**
 * Entity manager props
 */
export interface EntityManagerProps<T extends BaseEntity = BaseEntity> {
  /** Configuration */
  config: EntityManagerConfig<T>;
  
  /** Initial view mode (default: 'list') */
  initialView?: EntityManagerView;
  
  /** Initial entity ID (required when initialView is 'edit' or 'view') */
  initialId?: string | number;
  
  /** Custom className */
  className?: string;
  
  /** Children (optional - for custom layouts) */
  children?: React.ReactNode;
}

/**
 * View mode for entity manager
 */
export type EntityManagerView = 'list' | 'create' | 'edit' | 'view';

/**
 * Entity manager state
 */
export interface EntityManagerState {
  /** Current view */
  view: EntityManagerView;
  
  /** Selected entity ID (for edit/view) */
  selectedId: string | number | null;
}
