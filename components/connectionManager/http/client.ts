'use client';

import axios, { AxiosError, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { Endpoints } from '../apiConfig';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { AuthAPI } from '@/components/auth/lib/auth-api';
import { AuthTokens } from '@/components/auth/types/auth-types';

interface ApiErrorResponse {
    detail?: string;
    [key: string]: unknown;
}

// Polling utility for checking task status
export interface PollOptions<T = unknown> {
  maxAttempts?: number;
  interval?: number;
  onProgress?: (attempt: number, data: T) => void;
  stopCondition?: (data: T) => boolean;
}

/**
 * Unified HTTP Client for handling all API communications
 * Combines Axios setup, interceptors, error handling, and utilities
 */
export class HttpClient {
  private authApi: ReturnType<typeof axios.create>;
  private plainApi: ReturnType<typeof axios.create>;
  private refreshApi: ReturnType<typeof axios.create>; // Special instance for refresh calls
  private isRefreshing = false;
  private refreshPromise: Promise<AuthTokens> | null = null;

  constructor() {
    // Create Axios instance
    this.authApi = axios.create({
      baseURL: Endpoints.BaseUrl,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      xsrfCookieName: 'csrftoken',
      xsrfHeaderName: 'X-CSRFToken'
    });

    // Create plain Axios instance for authentication calls
    this.plainApi = axios.create({
      baseURL: Endpoints.BaseUrl,
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Create refresh Axios instance (sends cookies but no interceptors)
    this.refreshApi = axios.create({
      baseURL: Endpoints.BaseUrl,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  /**
   * Get the main API instance
   */
  get instance() {
    return this.authApi;
  }

  /**
   * Get the plain API instance (for auth calls)
   */
  get plainInstance() {
    return this.plainApi;
  }

  /**
   * Get the refresh API instance (sends cookies but no interceptors)
   */
  get refreshInstance() {
    return this.refreshApi;
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors() {
    // Request Interceptor - simplified to just ensure credentials are sent
    this.authApi.interceptors.request.use(
      async (config: AxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        // Ensure credentials are always included for cookie-based auth
        (config as InternalAxiosRequestConfig).withCredentials = true;

        // Add CSRF token if available for non-GET requests
        const csrfToken = Cookies.get('csrftoken');
        if (!csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
          // Fetch CSRF token before proceeding with the request
          await this.fetchCsrfToken();
          const newCsrfToken = Cookies.get('csrftoken');
          if (newCsrfToken) {
            (config as InternalAxiosRequestConfig).headers['X-CSRFToken'] = newCsrfToken;
          }
        } else if (csrfToken) {
          (config as InternalAxiosRequestConfig).headers['X-CSRFToken'] = csrfToken;
        }

        return config as InternalAxiosRequestConfig;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.authApi.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError<ApiErrorResponse>) => {
        // if response status is 401, handle token refresh logic here
        if (error.response?.status === 401) {
          try {
            // Attempt to refresh token (with queue management)
            await this.refreshTokenWithQueue();

            // Retry the original request if config exists
            const originalConfig = error.config as AxiosRequestConfig | undefined;
            if (!originalConfig) {
              // If there's no original config, reject with the original error
              return Promise.reject(error);
            }
            return this.authApi.request(originalConfig);
          } catch (refreshError) {
            const toast = (await import('sonner')).toast;
            console.error('Token refresh failed:', refreshError);
            toast.error('Session expired. Please login again.', {
              action: {
                label: 'Login',
                onClick: () => {
                  AuthAPI.clearTokens();
                  window.location.href = '/auth/login';
                }
              }
            });
            return Promise.reject(refreshError);
          }
        }

        // Log error for debugging
        console.error('API Error:', error);

        return Promise.reject(error);
      }
    );
  }

  /**
   * Refresh token with queue management to prevent concurrent refresh calls
   */
  private async refreshTokenWithQueue(): Promise<AuthTokens> {
    // If a refresh is already in progress, wait for it
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start the refresh process
    this.isRefreshing = true;
    this.refreshPromise = AuthAPI.refreshToken();

    try {
      const tokens = await this.refreshPromise;
      return tokens;
    } finally {
      // Reset the refresh state
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Function to fetch CSRF token
   */
  private async fetchCsrfToken() {
    try {
      await this.authApi.get(Endpoints.Auth.CsrfToken);
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  }
  async pollTaskStatus<T = unknown>(
    taskId: string,
    statusUrl: string,
    options: PollOptions<T> = {}
  ): Promise<T> {
    const {
      maxAttempts = 30, // 5 minutes with 10s intervals
      interval = 10000, // 10 seconds
      onProgress,
      stopCondition
    } = options;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.authApi.get(statusUrl);
        const data = response.data;

        // Call progress callback if provided
        if (onProgress) {
          onProgress(attempt, data);
        }

        // Check if we should stop polling
        if (stopCondition && stopCondition(data)) {
          return data;
        }

        // Check for completion status
        if (data.status === 'completed' || data.status === 'failed') {
          return data;
        }

        // Wait before next attempt (except on last attempt)
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, interval));
        }
      } catch (error) {
        console.error(`Polling attempt ${attempt} failed:`, error);
        // Continue polling on error, unless it's the last attempt
        if (attempt === maxAttempts) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }

    throw new Error(`Polling timed out after ${maxAttempts} attempts`);
  }

  /**
   * Handle API errors with user-friendly messages
   */
  handleApiError(error: AxiosError, customMessage?: string) {
    // Flag to track if we've already shown an error toast
    let errorShown = false;

    // Network or axios cancellation errors
    if (!error.response) {
      toast.error('🌐 Network error occurred. Please check your connection and try again.');
      return;
    }

    const { status, data } = error.response;

    // First check: Direct extraction of ErrorDetail from the entire response
    if (!errorShown) {
      const responseText = JSON.stringify(data);
      const errorDetailPattern = /ErrorDetail\(string='([^']+)',\s*code='([^']+)'\)/g;
      const matches = Array.from(responseText.matchAll(errorDetailPattern));

      if (matches.length > 0) {
        toast.error(matches[0][1]);
        errorShown = true;
      }
    }

    // Handle string data that might be a representation of an object
    if (!errorShown && typeof data === 'string') {
      try {
        // Try to parse if it's a JSON string
        const parsedData = JSON.parse(data);
        error.response.data = parsedData;
      } catch {
        // If it's not JSON, check if it's a Python-like error format
        const errorMatch = data.match(/\[ErrorDetail\(string='([^']+)',\s*code='([^']+)'\)\]/);
        if (errorMatch && errorMatch[1]) {
          toast.error(errorMatch[1]);
          errorShown = true;
        }
      }
    }

    // Handle different HTTP status codes
    if (!errorShown) {
      switch (status) {
        case 400:
          // Handle validation errors
          if (typeof data === 'object' && data !== null) {
            // Loop through once to look for ErrorDetail objects
            for (const [key, value] of Object.entries(data)) {
              if (errorShown) break;

              if (Array.isArray(value) && value.length > 0) {
                // Try to extract ErrorDetail directly
                const valueStr = JSON.stringify(value[0]);
                const errorMatch = valueStr.match(/string='([^']+)'/);
                if (errorMatch && errorMatch[1]) {
                  toast.error(`${key}: ${errorMatch[1]}`);
                  errorShown = true;
                  break;
                }

                // Handle standard array of strings/objects
                if (typeof value[0] === 'object' && value[0].string) {
                  toast.error(`${key}: ${value[0].string}`);
                  errorShown = true;
                  break;
                } else if (typeof value[0] === 'string') {
                  toast.error(`${key}: ${value[0]}`);
                  errorShown = true;
                  break;
                } else if (value[0] !== null) {
                  toast.error(`${key}: ${value[0]}`);
                  errorShown = true;
                  break;
                }
              } else if (value) {
                toast.error(`${key}: ${value}`);
                errorShown = true;
                break;
              }
            }
          }

          if (!errorShown) {
            toast.error(customMessage || ((data as Record<string, unknown>)?.detail as string) || 'Invalid request');
            errorShown = true;
          }
          break;

        case 401:
          // Clear any client-side cookies
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          toast.error('Ooops!😔 Session expired. Please login again', {
            action: {
              label: 'Okay',
              onClick: () => window.location.href = '/'
            }
          });
          errorShown = true;
          break;

        case 403:
          if (data && (data as Record<string, unknown>).error) {
            toast.error((data as Record<string, unknown>).error as string);
          } else {
            toast.error('🚫 You do not have permission to perform this action');
          }
          errorShown = true;
          break;

        case 404:
          toast.error('🔍 Resource not found. The page or data you\'re looking for doesn\'t exist.');
          errorShown = true;
          break;

        case 429:
          toast.error('⏱️ Too many requests! Please wait a moment before trying again.');
          errorShown = true;
          break;

        case 500:
          toast.error('🔧 Server error occurred. Our team has been notified. Please try again later.');
          errorShown = true;
          break;

        default:
          toast.error('❌ An unexpected error occurred. Please try again or contact support if the problem persists.');
          errorShown = true;
      }
    }

    // Log error for debugging
    console.error('API Error:', {
      status,
      data,
      endpoint: error.config?.url,
      method: error.config?.method
    });
  }
}

// Create singleton instance
export const httpClient = new HttpClient();

// Export convenience functions
export const authApi = httpClient.instance;
export const plainApi = httpClient.plainInstance;
export const refreshApi = httpClient.refreshInstance;
export const handleApiError = httpClient.handleApiError.bind(httpClient);
export const pollTaskStatus = httpClient.pollTaskStatus.bind(httpClient);