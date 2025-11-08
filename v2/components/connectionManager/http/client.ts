import axios, { AxiosError, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { Endpoints } from '../apiConfig';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

interface ApiErrorResponse {
    detail?: string;
    [key: string]: unknown;
}

interface AuthResponse {
    access_token: string;
    refresh_token?: string;
}

// Polling utility for checking task status
export interface PollOptions {
  maxAttempts?: number;
  interval?: number;
  onProgress?: (attempt: number, data: any) => void;
  stopCondition?: (data: any) => boolean;
}

/**
 * Unified HTTP Client for handling all API communications
 * Combines Axios setup, interceptors, error handling, and utilities
 */
export class HttpClient {
  private api: ReturnType<typeof axios.create>;
  private apiPlain: ReturnType<typeof axios.create>;

  constructor() {
    // Create Axios instance
    this.api = axios.create({
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
    this.apiPlain = axios.create({
      baseURL: Endpoints.BaseUrl,
      withCredentials: false,
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
    return this.api;
  }

  /**
   * Get the plain API instance (for auth calls)
   */
  get plainInstance() {
    return this.apiPlain;
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors() {
    // Request Interceptor - simplified to just ensure credentials are sent
    this.api.interceptors.request.use(
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
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError<ApiErrorResponse>) => {
        // Log error for debugging
        console.error('API Error:', error);

        return Promise.reject(error);
      }
    );
  }

  /**
   * Function to fetch CSRF token
   */
  private async fetchCsrfToken() {
    try {
      await this.api.get(Endpoints.Auth.CsrfToken);
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  }

  /**
   * Poll task status utility
   */
  async pollTaskStatus<T = any>(
    taskId: string,
    statusUrl: string,
    options: PollOptions = {}
  ): Promise<T> {
    const {
      maxAttempts = 30, // 5 minutes with 10s intervals
      interval = 10000, // 10 seconds
      onProgress,
      stopCondition
    } = options;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.api.get(statusUrl);
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
  handleApiError(error: any, customMessage?: string) {
    // Flag to track if we've already shown an error toast
    let errorShown = false;

    // Network or axios cancellation errors
    if (!error.response) {
      toast.error(error.message || 'Network error occurred');
      return;
    }

    const { status, data } = error.response;

    // First check: Direct extraction of ErrorDetail from the entire response
    if (!errorShown) {
      const responseText = JSON.stringify(data);
      const errorDetailPattern = /ErrorDetail\(string='([^']+)',\s*code='([^']+)'\)/g;
      const matches = [...responseText.matchAll(errorDetailPattern)];

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
      } catch (e) {
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
            toast.error(customMessage || (data?.detail) || 'Invalid request');
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
          if (data && data.error) {
            toast.error(data.error);
          } else {
            toast.error('You do not have permission to perform this action');
          }
          errorShown = true;
          break;

        case 404:
          toast.error(customMessage || 'Resource not found');
          errorShown = true;
          break;

        case 429:
          toast.error('Too many requests. Please try again later');
          errorShown = true;
          break;

        case 500:
          toast.error('Server error occurred. Please try again later');
          errorShown = true;
          break;

        default:
          toast.error(customMessage || (data?.detail) || 'An unexpected error occurred');
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
export const api = httpClient.instance;
export const apiPlain = httpClient.plainInstance;
export const handleApiError = httpClient.handleApiError.bind(httpClient);
export const pollTaskStatus = httpClient.pollTaskStatus.bind(httpClient);