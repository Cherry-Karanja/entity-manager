/**
 * Unified Entity Manager Component
 * 
 * A wrapper around the existing EntityManager that accepts UnifiedEntityConfig
 * and automatically converts it to the legacy format for backward compatibility.
 * 
 * @module manager/UnifiedEntityManager
 */

'use client'

import React from 'react'
import { EntityManager, EntityManagerProps } from './orchestrator'
import { UnifiedEntityConfig, BaseEntity } from '../core/types'
import { normalizeConfig, validateUnifiedConfig } from './compatibility'

export interface UnifiedEntityManagerProps<
  TEntity extends BaseEntity = BaseEntity,
  TFormData extends Record<string, unknown> = Record<string, unknown>
> {
  /** Unified entity configuration */
  config: UnifiedEntityConfig<TEntity, TFormData>
  
  /** Initial mode when component mounts */
  initialMode?: 'list' | 'view' | 'create' | 'edit'
  
  /** Initial data for view/edit modes */
  initialData?: TEntity
  
  /** Additional CSS classes */
  className?: string
  
  /** Whether chat is initially open */
  chatOpen?: boolean
  
  /** Callback when chat toggle state changes */
  onChatToggle?: (isOpen: boolean) => void
  
  /** Whether to validate config on mount (dev mode only) */
  validateOnMount?: boolean
}

/**
 * Unified Entity Manager
 * 
 * This component accepts the new UnifiedEntityConfig format and automatically
 * converts it to work with the existing EntityManager infrastructure.
 * 
 * @example
 * ```tsx
 * import { UnifiedEntityManager } from '@/components/entityManager/manager'
 * import { userConfig } from './configs/user'
 * 
 * function UsersPage() {
 *   return <UnifiedEntityManager config={userConfig} />
 * }
 * ```
 */
export function UnifiedEntityManager<
  TEntity extends BaseEntity = BaseEntity,
  TFormData extends Record<string, unknown> = Record<string, unknown>
>({
  config,
  initialMode = 'list',
  initialData,
  className,
  chatOpen,
  onChatToggle,
  validateOnMount = process.env.NODE_ENV === 'development'
}: UnifiedEntityManagerProps<TEntity, TFormData>) {
  // Validate config in development mode
  React.useEffect(() => {
    if (validateOnMount) {
      const errors = validateUnifiedConfig(config)
      if (errors.length > 0) {
        console.error('[UnifiedEntityManager] Configuration validation failed:', errors)
        console.error('[UnifiedEntityManager] Config:', config)
      } else {
        console.info('[UnifiedEntityManager] Configuration validated successfully')
      }
    }
  }, [config, validateOnMount])

  // Convert unified config to legacy format
  const legacyConfig = React.useMemo(() => {
    try {
      return normalizeConfig(config)
    } catch (error) {
      console.error('[UnifiedEntityManager] Failed to convert config:', error)
      throw error
    }
  }, [config])

  // Pass through to existing EntityManager
  return (
    <EntityManager
      config={legacyConfig}
      initialMode={initialMode}
      initialData={initialData}
      className={className}
      chatOpen={chatOpen}
      onChatToggle={onChatToggle}
    />
  )
}

// Export for convenience
export default UnifiedEntityManager
