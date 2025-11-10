"use client"

import { useCallback, useMemo } from "react"
import { useAuth } from "@/components/auth/contexts/auth-context"

// Permission mapping based on user types and Django permissions
const USER_TYPE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    'can_view_dashboard',
    'can_edit_profile',
    'can_manage_properties',
    'can_manage_units',
    'can_assign_tenant_to_unit',
    'can_view_tenants',
    'can_manage_tenants',
    'can_manage_users',
    'can_view_rent_payments',
    'can_view_rent_payments_history',
    'can_record_rent_payment',
    'can_view_overdue_rent',
    'can_configure_reminders',
    'can_send_reminders',
    'can_submit_maintenance_request',
    'can_view_maintenance_requests',
    'can_update_maintenance_request_status',
    'can_generate_reports'
  ],
  landlord: [
    'can_view_dashboard',
    'can_edit_profile',
    'can_manage_properties',
    'can_manage_units',
    'can_assign_tenant_to_unit',
    'can_view_tenants',
    'can_manage_tenants',
    'can_view_rent_payments',
    'can_view_rent_payments_history',
    'can_record_rent_payment',
    'can_view_overdue_rent',
    'can_configure_reminders',
    'can_send_reminders',
    'can_view_maintenance_requests',
    'can_generate_reports'
  ],
  property_manager: [
    'can_view_dashboard',
    'can_edit_profile',
    'can_manage_properties',
    'can_manage_units',
    'can_assign_tenant_to_unit',
    'can_view_tenants',
    'can_manage_tenants',
    'can_view_rent_payments',
    'can_view_rent_payments_history',
    'can_record_rent_payment',
    'can_view_overdue_rent',
    'can_configure_reminders',
    'can_send_reminders',
    'can_view_maintenance_requests',
    'can_update_maintenance_request_status'
  ],
  caretaker: [
    'can_view_dashboard',
    'can_edit_profile',
    'can_view_tenants',
    'can_view_maintenance_requests',
    'can_update_maintenance_request_status'
  ],
  tenant: [
    'can_view_dashboard',
    'can_edit_profile',
    'can_pay_rent',
    'can_submit_maintenance_request',
    'can_view_maintenance_requests'
  ]
}

// Map entity actions to Django permissions
const ENTITY_PERMISSION_MAPPING = {
  create: ['can_manage_properties', 'can_manage_tenants', 'can_manage_units', 'can_manage_users'],
  read: ['can_view_dashboard', 'can_view_tenants', 'can_view_rent_payments', 'can_view_maintenance_requests'],
  update: ['can_manage_properties', 'can_manage_tenants', 'can_manage_units', 'can_manage_users'],
  delete: ['can_manage_properties', 'can_manage_tenants', 'can_manage_units', 'can_manage_users']
} as const

export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth()

  // Get user permissions based on user type
  const userPermissions = useMemo(() => {
    if (!user?.role || !isAuthenticated) return []

    return USER_TYPE_PERMISSIONS[user.role as keyof typeof USER_TYPE_PERMISSIONS] || []
  }, [user?.role, isAuthenticated])

  // Check if user has a specific permission
  const hasPermission = useCallback((permission?: string | undefined) => {
    if (!permission) return true
    if (!isAuthenticated) return false

    // Check if user has the specific permission
    return userPermissions.includes(permission)
  }, [userPermissions, isAuthenticated])

  // Check entity-level permissions (create, read, update, delete)
  const hasEntityPermission = useCallback((action: 'create' | 'read' | 'update' | 'delete', entityType?: string) => {
    if (!isAuthenticated) return false

    const requiredPermissions = ENTITY_PERMISSION_MAPPING[action]

    // Check if user has any of the required permissions for this action
    return requiredPermissions.some(permission => userPermissions.includes(permission))
  }, [userPermissions, isAuthenticated])

  // Check field-level permissions
  const hasFieldPermission = useCallback((
    action: 'create' | 'read' | 'update' | 'delete',
    fieldPermissions?: { create?: boolean; read?: boolean; update?: boolean; delete?: boolean }
  ) => {
    if (!isAuthenticated) return false

    // If field has specific permissions, check those first
    if (fieldPermissions?.[action] !== undefined) {
      return Boolean(fieldPermissions[action])
    }

    // Otherwise, fall back to entity-level permissions
    return hasEntityPermission(action)
  }, [hasEntityPermission, isAuthenticated])

  return {
    hasPermission,
    hasEntityPermission,
    hasFieldPermission,
    userPermissions,
    userType: user?.role,
    isAuthenticated
  }
}

export default usePermissions