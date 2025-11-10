// ===== ACCOUNTS API HOOKS =====

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { httpClient } from '../../../connectionManager/http/client'
import { useApi } from '../../../connectionManager/http/hooks'
import { ACCOUNTS_ENDPOINTS, getEntityEndpoint } from './endpoints'
import {
  User,
  UserRole,
  UserProfile,
  UserSession,
  LoginAttempt,
  UserRoleHistory,
  UserListParams,
  UserCreateRequest,
  UserUpdateRequest,
  UserChangePasswordRequest,
  UserRoleListParams,
  UserRoleCreateRequest,
  UserRoleUpdateRequest,
  UserProfileListParams,
  UserProfileUpdateRequest,
  UserSessionListParams,
  UserSessionTerminateRequest,
  LoginAttemptListParams,
  UserRoleHistoryListParams,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  BulkOperationRequest,
  BulkOperationResponse,
  ExportRequest,
  ApiResponse,
  ListResponse
} from './types'

// ===== BASE API HOOKS =====

const api = httpClient.instance

// ===== AUTHENTICATION HOOKS =====

export const useLogin = () => {
  return useMutation<LoginResponse, AxiosError, LoginRequest>({
    mutationFn: async (data: LoginRequest) => {
      const response = await api.post<LoginResponse>(ACCOUNTS_ENDPOINTS.auth.login, data)
      return response.data
    }
  })
}

export const useLogout = () => {
  return useMutation<void, AxiosError, void>({
    mutationFn: async () => {
      await api.post(ACCOUNTS_ENDPOINTS.auth.logout)
    }
  })
}

export const useRefreshToken = () => {
  return useMutation<RefreshTokenResponse, AxiosError, RefreshTokenRequest>({
    mutationFn: async (data: RefreshTokenRequest) => {
      const response = await api.post<RefreshTokenResponse>(ACCOUNTS_ENDPOINTS.auth.refresh, data)
      return response.data
    }
  })
}

export const useCurrentUser = () => {
  return useApi<User, ApiResponse<User>>(ACCOUNTS_ENDPOINTS.auth.me).useFetch()
}

// ===== USER HOOKS =====

export const useUsers = (params?: UserListParams, enabled: boolean = true) => {
  return useApi<User, ListResponse<User>>(ACCOUNTS_ENDPOINTS.users.list).useFetchData(params?.page || 1, params as any, enabled)
}

export const useUser = (id: string, enabled: boolean = true) => {
  return useApi<User, ApiResponse<User>>(ACCOUNTS_ENDPOINTS.users.detail(id)).useFetch({}, enabled)
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation<User, AxiosError, UserCreateRequest>({
    mutationFn: async (data: UserCreateRequest) => {
      const response = await api.post<User>(ACCOUNTS_ENDPOINTS.users.create, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.users.list] })
    }
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation<User, AxiosError, { id: string; data: UserUpdateRequest }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch<User>(ACCOUNTS_ENDPOINTS.users.update(id), data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.users.list] })
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.users.detail(data.id)] })
    }
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError, string>({
    mutationFn: async (id: string) => {
      await api.delete(ACCOUNTS_ENDPOINTS.users.delete(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.users.list] })
    }
  })
}

export const useChangeUserPassword = () => {
  return useMutation<void, AxiosError, { id: string; data: UserChangePasswordRequest }>({
    mutationFn: async ({ id, data }) => {
      await api.post(ACCOUNTS_ENDPOINTS.users.changePassword(id), data)
    }
  })
}

export const useActivateUser = () => {
  const queryClient = useQueryClient()

  return useMutation<User, AxiosError, string>({
    mutationFn: async (id: string) => {
      const response = await api.post<User>(ACCOUNTS_ENDPOINTS.users.activate(id))
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.users.list] })
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.users.detail(data.id)] })
    }
  })
}

export const useDeactivateUser = () => {
  const queryClient = useQueryClient()

  return useMutation<User, AxiosError, string>({
    mutationFn: async (id: string) => {
      const response = await api.post<User>(ACCOUNTS_ENDPOINTS.users.deactivate(id))
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.users.list] })
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.users.detail(data.id)] })
    }
  })
}

// ===== USER ROLE HOOKS =====

export const useUserRoles = (params?: UserRoleListParams, enabled: boolean = true) => {
  return useApi<UserRole, ListResponse<UserRole>>(ACCOUNTS_ENDPOINTS.userRoles.list).useFetchData(params?.page || 1, params as any, enabled)
}

export const useUserRole = (id: string, enabled: boolean = true) => {
  return useApi<UserRole, ApiResponse<UserRole>>(ACCOUNTS_ENDPOINTS.userRoles.detail(id)).useFetch({}, enabled)
}

export const useCreateUserRole = () => {
  const queryClient = useQueryClient()

  return useMutation<UserRole, AxiosError, UserRoleCreateRequest>({
    mutationFn: async (data: UserRoleCreateRequest) => {
      const response = await api.post<UserRole>(ACCOUNTS_ENDPOINTS.userRoles.create, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.userRoles.list] })
    }
  })
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()

  return useMutation<UserRole, AxiosError, { id: string; data: UserRoleUpdateRequest }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch<UserRole>(ACCOUNTS_ENDPOINTS.userRoles.update(id), data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.userRoles.list] })
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.userRoles.detail(data.id)] })
    }
  })
}

export const useDeleteUserRole = () => {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError, string>({
    mutationFn: async (id: string) => {
      await api.delete(ACCOUNTS_ENDPOINTS.userRoles.delete(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.userRoles.list] })
    }
  })
}

// ===== USER PROFILE HOOKS =====

export const useUserProfiles = (params?: UserProfileListParams, enabled: boolean = true) => {
  return useApi<UserProfile, ListResponse<UserProfile>>(ACCOUNTS_ENDPOINTS.userProfiles.list).useFetchData(params?.page || 1, params as any, enabled)
}

export const useUserProfile = (id: string, enabled: boolean = true) => {
  return useApi<UserProfile, ApiResponse<UserProfile>>(ACCOUNTS_ENDPOINTS.userProfiles.detail(id)).useFetch({}, enabled)
}

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()

  return useMutation<UserProfile, AxiosError, { id: string; data: UserProfileUpdateRequest }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch<UserProfile>(ACCOUNTS_ENDPOINTS.userProfiles.update(id), data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.userProfiles.list] })
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.userProfiles.detail(data.id)] })
    }
  })
}

export const useApproveUserProfile = () => {
  const queryClient = useQueryClient()

  return useMutation<UserProfile, AxiosError, string>({
    mutationFn: async (id: string) => {
      const response = await api.post<UserProfile>(ACCOUNTS_ENDPOINTS.userProfiles.approve(id))
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.userProfiles.list] })
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.userProfiles.detail(data.id)] })
    }
  })
}

export const useRejectUserProfile = () => {
  const queryClient = useQueryClient()

  return useMutation<UserProfile, AxiosError, string>({
    mutationFn: async (id: string) => {
      const response = await api.post<UserProfile>(ACCOUNTS_ENDPOINTS.userProfiles.reject(id))
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.userProfiles.list] })
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.userProfiles.detail(data.id)] })
    }
  })
}

// ===== USER SESSION HOOKS =====

export const useUserSessions = (params?: UserSessionListParams, enabled: boolean = true) => {
  return useApi<UserSession, ListResponse<UserSession>>(ACCOUNTS_ENDPOINTS.userSessions.list).useFetchData(params?.page || 1, params as any, enabled)
}

export const useUserSession = (id: string, enabled: boolean = true) => {
  return useApi<UserSession, ApiResponse<UserSession>>(ACCOUNTS_ENDPOINTS.userSessions.detail(id)).useFetch({}, enabled)
}

export const useTerminateUserSession = () => {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError, string>({
    mutationFn: async (id: string) => {
      await api.post(ACCOUNTS_ENDPOINTS.userSessions.terminate(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.userSessions.list] })
    }
  })
}

export const useTerminateAllUserSessions = () => {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError, string>({
    mutationFn: async (userId: string) => {
      await api.post(ACCOUNTS_ENDPOINTS.userSessions.terminateAll(userId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.userSessions.list] })
    }
  })
}

// ===== LOGIN ATTEMPT HOOKS =====

export const useLoginAttempts = (params?: LoginAttemptListParams, enabled: boolean = true) => {
  return useApi<LoginAttempt, ListResponse<LoginAttempt>>(ACCOUNTS_ENDPOINTS.loginAttempts.list).useFetchData(params?.page || 1, params as any, enabled)
}

export const useLoginAttempt = (id: string, enabled: boolean = true) => {
  return useApi<LoginAttempt, ApiResponse<LoginAttempt>>(ACCOUNTS_ENDPOINTS.loginAttempts.detail(id)).useFetch({}, enabled)
}

// ===== USER ROLE HISTORY HOOKS =====

export const useUserRoleHistory = (params?: UserRoleHistoryListParams, enabled: boolean = true) => {
  return useApi<UserRoleHistory, ListResponse<UserRoleHistory>>(ACCOUNTS_ENDPOINTS.userRoleHistory.list).useFetchData(params?.page || 1, params as any, enabled)
}

export const useUserRoleHistoryByUser = (userId: string, enabled: boolean = true) => {
  return useApi<UserRoleHistory, ListResponse<UserRoleHistory>>(ACCOUNTS_ENDPOINTS.userRoleHistory.byUser(userId)).useFetchData(1, {}, enabled)
}

// ===== BULK OPERATIONS HOOKS =====

export const useBulkUsersOperation = () => {
  const queryClient = useQueryClient()

  return useMutation<BulkOperationResponse, AxiosError, BulkOperationRequest>({
    mutationFn: async (data: BulkOperationRequest) => {
      const response = await api.post<BulkOperationResponse>(ACCOUNTS_ENDPOINTS.bulk.users, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.users.list] })
    }
  })
}

export const useBulkUserRolesOperation = () => {
  const queryClient = useQueryClient()

  return useMutation<BulkOperationResponse, AxiosError, BulkOperationRequest>({
    mutationFn: async (data: BulkOperationRequest) => {
      const response = await api.post<BulkOperationResponse>(ACCOUNTS_ENDPOINTS.bulk.userRoles, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_ENDPOINTS.userRoles.list] })
    }
  })
}

// ===== EXPORT HOOKS =====

export const useExportUsers = () => {
  return useMutation<Blob, AxiosError, ExportRequest>({
    mutationFn: async (data: ExportRequest) => {
      const response = await api.post(ACCOUNTS_ENDPOINTS.export.users, data, {
        responseType: 'blob'
      })
      return response.data
    }
  })
}

export const useExportUserRoles = () => {
  return useMutation<Blob, AxiosError, ExportRequest>({
    mutationFn: async (data: ExportRequest) => {
      const response = await api.post(ACCOUNTS_ENDPOINTS.export.userRoles, data, {
        responseType: 'blob'
      })
      return response.data
    }
  })
}

export const useExportLoginAttempts = () => {
  return useMutation<Blob, AxiosError, ExportRequest>({
    mutationFn: async (data: ExportRequest) => {
      const response = await api.post(ACCOUNTS_ENDPOINTS.export.loginAttempts, data, {
        responseType: 'blob'
      })
      return response.data
    }
  })
}