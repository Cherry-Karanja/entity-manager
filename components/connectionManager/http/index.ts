// Unified HTTP Handler for Entity Manager v2
// Combines all HTTP connection logic from v1 into a single, cohesive module

// Core HTTP client and utilities
export { HttpClient, httpClient, authApi, plainApi, refreshApi, handleApiError, pollTaskStatus } from './client';

// React Query hooks
export { useApi } from './hooks';

// Service layer for CRUD operations
export { createApiService } from './service';

// Query provider component
export { QueryProvider } from './provider';

// Types
export type {
  ApiErrorResponse,
  DjangoPaginatedResponse,
  EntityConfig,
  NestedResourceContext,
  ApiServiceOptions
} from './types';

// Connection status hook using TanStack Query
export { useConnectionStatus, useConnectionStatusColor } from './connection-status-hook';

// Re-export commonly used types from external libraries for convenience
export type { AxiosError, AxiosRequestConfig } from 'axios';