// ===== ACCOUNTS API ENDPOINTS =====

import { Endpoints } from '../../../connectionManager/apiConfig'

// ===== BASE ENDPOINTS =====

export const ACCOUNTS_ENDPOINTS = {
  base: `${Endpoints.BaseUrl}/accounts`,

  // User endpoints
  users: {
    list: `${Endpoints.BaseUrl}/accounts/users`,
    create: `${Endpoints.BaseUrl}/accounts/users`,
    detail: (id: string) => `${Endpoints.BaseUrl}/accounts/users/${id}`,
    update: (id: string) => `${Endpoints.BaseUrl}/accounts/users/${id}`,
    delete: (id: string) => `${Endpoints.BaseUrl}/accounts/users/${id}`,
    changePassword: (id: string) => `${Endpoints.BaseUrl}/accounts/users/${id}/change-password`,
    activate: (id: string) => `${Endpoints.BaseUrl}/accounts/users/${id}/activate`,
    deactivate: (id: string) => `${Endpoints.BaseUrl}/accounts/users/${id}/deactivate`,
    resetPassword: (id: string) => `${Endpoints.BaseUrl}/accounts/users/${id}/reset-password`
  },

  // UserRole endpoints
  userRoles: {
    list: `${Endpoints.BaseUrl}/accounts/user-roles`,
    create: `${Endpoints.BaseUrl}/accounts/user-roles`,
    detail: (id: string) => `${Endpoints.BaseUrl}/accounts/user-roles/${id}`,
    update: (id: string) => `${Endpoints.BaseUrl}/accounts/user-roles/${id}`,
    delete: (id: string) => `${Endpoints.BaseUrl}/accounts/user-roles/${id}`,
    permissions: (id: string) => `${Endpoints.BaseUrl}/accounts/user-roles/${id}/permissions`,
    assignUsers: (id: string) => `${Endpoints.BaseUrl}/accounts/user-roles/${id}/assign-users`
  },

  // UserProfile endpoints
  userProfiles: {
    list: `${Endpoints.BaseUrl}/accounts/user-profiles`,
    detail: (id: string) => `${Endpoints.BaseUrl}/accounts/user-profiles/${id}`,
    update: (id: string) => `${Endpoints.BaseUrl}/accounts/user-profiles/${id}`,
    approve: (id: string) => `${Endpoints.BaseUrl}/accounts/user-profiles/${id}/approve`,
    reject: (id: string) => `${Endpoints.BaseUrl}/accounts/user-profiles/${id}/reject`
  },

  // UserSession endpoints
  userSessions: {
    list: `${Endpoints.BaseUrl}/accounts/user-sessions`,
    detail: (id: string) => `${Endpoints.BaseUrl}/accounts/user-sessions/${id}`,
    terminate: (id: string) => `${Endpoints.BaseUrl}/accounts/user-sessions/${id}/terminate`,
    terminateAll: (userId: string) => `${Endpoints.BaseUrl}/accounts/users/${userId}/sessions/terminate-all`
  },

  // Permission endpoints
  permissions: {
    list: `${Endpoints.BaseUrl}/accounts/permissions`,
    create: `${Endpoints.BaseUrl}/accounts/permissions`,
    detail: (id: string) => `${Endpoints.BaseUrl}/accounts/permissions/${id}`,
    update: (id: string) => `${Endpoints.BaseUrl}/accounts/permissions/${id}`,
    delete: (id: string) => `${Endpoints.BaseUrl}/accounts/permissions/${id}`,
    byApp: `${Endpoints.BaseUrl}/accounts/permissions/by_app`,
    byModel: `${Endpoints.BaseUrl}/accounts/permissions/by_model`
  },

  // LoginAttempt endpoints
  loginAttempts: {
    list: `${Endpoints.BaseUrl}/accounts/login-attempts`,
    detail: (id: string) => `${Endpoints.BaseUrl}/accounts/login-attempts/${id}`,
    blockIp: (ip: string) => `${Endpoints.BaseUrl}/accounts/login-attempts/block-ip/${ip}`
  },

  // UserRoleHistory endpoints
  userRoleHistory: {
    list: `${Endpoints.BaseUrl}/accounts/user-role-history`,
    detail: (id: string) => `${Endpoints.BaseUrl}/accounts/user-role-history/${id}`,
    byUser: (userId: string) => `${Endpoints.BaseUrl}/accounts/users/${userId}/role-history`
  },

  // Authentication endpoints
  auth: {
    login: `${Endpoints.BaseUrl}/accounts/auth/login`,
    logout: `${Endpoints.BaseUrl}/accounts/auth/logout`,
    refresh: `${Endpoints.BaseUrl}/accounts/auth/refresh`,
    me: `${Endpoints.BaseUrl}/accounts/auth/me`,
    forgotPassword: `${Endpoints.BaseUrl}/accounts/auth/forgot-password`,
    resetPassword: `${Endpoints.BaseUrl}/accounts/auth/reset-password`
  },

  // Bulk operations
  bulk: {
    users: `${Endpoints.BaseUrl}/accounts/users/bulk`,
    userRoles: `${Endpoints.BaseUrl}/accounts/user-roles/bulk`,
    userProfiles: `${Endpoints.BaseUrl}/accounts/user-profiles/bulk`
  },

  // Export/Import
  export: {
    users: `${Endpoints.BaseUrl}/accounts/users/export`,
    userRoles: `${Endpoints.BaseUrl}/accounts/user-roles/export`,
    userProfiles: `${Endpoints.BaseUrl}/accounts/user-profiles/export`,
    loginAttempts: `${Endpoints.BaseUrl}/accounts/login-attempts/export`
  },

  // Audit & Security
  audit: {
    logs: `${Endpoints.BaseUrl}/accounts/audit/logs`,
    securityEvents: `${Endpoints.BaseUrl}/accounts/audit/security-events`
  },

  // Statistics & Analytics
  stats: {
    users: `${Endpoints.BaseUrl}/accounts/stats/users`,
    sessions: `${Endpoints.BaseUrl}/accounts/stats/sessions`,
    security: `${Endpoints.BaseUrl}/accounts/stats/security`
  }
}

// ===== ENDPOINT UTILITIES =====

export const buildAccountsUrl = (path: string, params?: Record<string, any>): string => {
  const baseUrl = `${ACCOUNTS_ENDPOINTS.base}${path.startsWith('/') ? '' : '/'}${path}`

  if (!params) return baseUrl

  const url = new URL(baseUrl, Endpoints.BaseUrl)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value))
    }
  })

  return url.pathname + url.search
}

export const getEntityEndpoint = (
  entity: 'users' | 'userRoles' | 'userProfiles' | 'userSessions' | 'loginAttempts' | 'userRoleHistory' | 'permissions',
  operation: 'list' | 'create' | 'detail' | 'update' | 'delete',
  id?: string
): string => {
  const endpoints = ACCOUNTS_ENDPOINTS[entity]
  if (!endpoints) throw new Error(`Unknown entity: ${entity}`)

  switch (operation) {
    case 'list':
      return endpoints.list
    case 'create':
      if ('create' in endpoints) {
        return endpoints.create
      }
      throw new Error(`Create operation not supported for entity: ${entity}`)
    case 'detail':
    case 'update':
    case 'delete':
      if (!id) throw new Error(`ID required for ${operation} operation`)
      if ('detail' in endpoints) {
        return endpoints.detail(id)
      }
      throw new Error(`${operation} operation not supported for entity: ${entity}`)
    default:
      throw new Error(`Unknown operation: ${operation}`)
  }
}