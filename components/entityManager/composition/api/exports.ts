/**
 * API Integration Exports
 * 
 * Public API for entity API integration.
 */

// Provider and hooks
export { EntityApiProvider, useEntityApiContext } from './EntityApiProvider';
export { useEntityApi } from './useEntityApi';
export { useEntityMutations } from './useEntityMutations';

// HTTP Client Factory
export { createHttpClient } from './createHttpClient';
export type { HttpClientConfig } from './createHttpClient';

// Types
export type {
  ApiResponse,
  ListQueryParams,
  ApiClient,
  RequestConfig,
  EntityApiProviderProps,
  UseEntityApiReturn,
  UseEntityMutationsReturn,
  EntityApiContextValue
} from './types';
