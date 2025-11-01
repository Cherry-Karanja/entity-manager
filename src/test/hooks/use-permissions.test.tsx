import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePermissions } from '../../../hooks/use-permissions'

// Mock the auth context
vi.mock('../../../contexts/auth-context', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      username: 'testuser',
      user_type: 'landlord',
      permissions: ['view_properties', 'edit_properties', 'delete_properties']
    },
    isAuthenticated: true,
  }),
}))

describe('usePermissions Hook', () => {
  describe('Permission Checking', () => {
    it('should return true for allowed permissions', () => {
      const { result } = renderHook(() => usePermissions())
      expect(result.current.hasPermission('can_view_dashboard')).toBe(true)
      expect(result.current.hasPermission('can_edit_profile')).toBe(true)
      expect(result.current.hasPermission('can_manage_properties')).toBe(true)
    })

    it('should return false for denied permissions', () => {
      const { result } = renderHook(() => usePermissions())
      expect(result.current.hasPermission('can_update_maintenance_request_status')).toBe(false) // admin only
      expect(result.current.hasPermission('nonexistent_permission')).toBe(false)
    })

    it('should return true for undefined permission (public access)', () => {
      const { result } = renderHook(() => usePermissions())
      expect(result.current.hasPermission()).toBe(true)
      expect(result.current.hasPermission(undefined)).toBe(true)
    })
  })

  describe('Entity Permissions', () => {
    it('should check entity-level permissions for CRUD operations', () => {
      const { result } = renderHook(() => usePermissions())
      expect(result.current.hasEntityPermission('create')).toBe(true) // landlord can manage properties
      expect(result.current.hasEntityPermission('read')).toBe(true)   // landlord can view dashboard
      expect(result.current.hasEntityPermission('update')).toBe(true) // landlord can manage properties
      expect(result.current.hasEntityPermission('delete')).toBe(true) // landlord can manage properties
    })

    it('should handle entity type parameter (currently not used in logic)', () => {
      const { result } = renderHook(() => usePermissions())
      expect(result.current.hasEntityPermission('read', 'property')).toBe(true)
      expect(result.current.hasEntityPermission('create', 'tenant')).toBe(true)
    })
  })

  describe('Field Permissions', () => {
    it('should use field-specific permissions when provided', () => {
      const { result } = renderHook(() => usePermissions())
      const fieldPerms = { create: true, read: false, update: true, delete: false }

      expect(result.current.hasFieldPermission('create', fieldPerms)).toBe(true)
      expect(result.current.hasFieldPermission('read', fieldPerms)).toBe(false)
      expect(result.current.hasFieldPermission('update', fieldPerms)).toBe(true)
      expect(result.current.hasFieldPermission('delete', fieldPerms)).toBe(false)
    })

    it('should fall back to entity permissions when field permissions not specified', () => {
      const { result } = renderHook(() => usePermissions())
      expect(result.current.hasFieldPermission('create')).toBe(true) // falls back to entity permission
      expect(result.current.hasFieldPermission('read')).toBe(true)
    })

    it('should handle undefined field permissions', () => {
      const { result } = renderHook(() => usePermissions())
      expect(result.current.hasFieldPermission('create', undefined)).toBe(true)
    })
  })

  describe('User Permissions Array', () => {
    it('should return correct permissions array for landlord', () => {
      const { result } = renderHook(() => usePermissions())
      expect(result.current.userType).toBe('landlord')
      expect(result.current.userPermissions).toContain('can_view_dashboard')
      expect(result.current.userPermissions).toContain('can_manage_properties')
      expect(result.current.userPermissions).toContain('can_manage_tenants')
      expect(result.current.userPermissions).not.toContain('can_update_maintenance_request_status') // admin only
    })
  })

  describe('Authentication State', () => {
    it('should reflect authentication state', () => {
      const { result } = renderHook(() => usePermissions())
      expect(result.current.isAuthenticated).toBe(true)
    })
  })
})