import axios, { AxiosError, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { BASE_URL, TOKEN_REFRESH_URL, CSRF_TOKEN_URL } from '@/handler/apiConfig';
import { toast } from 'sonner';

interface ApiErrorResponse {
    detail?: string;
    [key: string]: unknown;
}

interface AuthResponse {
    access_token: string;
    refresh_token?: string;
}

interface DecodedToken {
    exp: number;
}

// Create Axios instance
export const api = axios.create({
    baseURL: BASE_URL,
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
export const apiPlain = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Function to check if a token is expired
export const isTokenExpired = (token: string | undefined): boolean => {
    if (!token) return true;
    try {
        const decoded: DecodedToken = jwtDecode(token);
        return decoded.exp * 1000 < Date.now();
    } catch (error) {
        return true;
    }
};

// Token refresh queue handler
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

const onRefreshed = (newToken: string) => {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
};

// Function to fetch CSRF token
const fetchCsrfToken = async () => {
    try {
        await api.get(CSRF_TOKEN_URL);
    } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
    }
};

// Request Interceptor with automatic token refresh
api.interceptors.request.use(
    async (config: AxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        let access_token = Cookies.get('access_token');
        const refresh_token = Cookies.get('refresh_token');

        // If access token is expired, try to refresh it
        if (isTokenExpired(access_token) && refresh_token) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const response = await axios.post<AuthResponse>(
                        TOKEN_REFRESH_URL, 
                        { refresh: refresh_token }, 
                        { withCredentials: true }
                    );

                    if (response.status === 200) {
                        access_token = response.data.access_token;
                        Cookies.set('access_token', access_token, { 
                            expires: 1, 
                            secure: process.env.NODE_ENV === 'production', 
                            sameSite: 'lax' 
                        });
                        onRefreshed(access_token);
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    Cookies.remove('access_token');
                    Cookies.remove('refresh_token');
                    window.location.href = '/auth/login';
                } finally {
                    isRefreshing = false;
                }
            }
        }

        // Add authorization header
        if (access_token && !isTokenExpired(access_token)) {
            (config as InternalAxiosRequestConfig).headers.Authorization = `Bearer ${access_token}`;
        }

        // Ensure credentials are always included
        (config as InternalAxiosRequestConfig).withCredentials = true;

        // Add CSRF token if available
        const csrfToken = Cookies.get('csrftoken');
        if (!csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
            // Fetch CSRF token before proceeding with the request
            await fetchCsrfToken();
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
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
        // Log error for debugging
        console.error('API Error:', error);

        // Handle authentication errors
        if (error.response?.status === 401) {
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            window.location.href = '/auth/login';
            return Promise.reject(error);
        }

        // Handle token refresh for 403 errors that might be due to expired tokens
        if (error.response?.status === 403) {
            const refreshToken = Cookies.get('refresh_token');
            if (refreshToken && !error.config?.url?.includes('/token/refresh/')) {
                try {
                    const refreshResponse = await apiPlain.post('/dj-rest-auth/token/refresh/', {
                        refresh: refreshToken
                    });

                    if (refreshResponse.data.access) {
                        Cookies.set('access_token', refreshResponse.data.access);
                        // Retry the original request with new token
                        if (error.config) {
                            error.config.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
                            return api.request(error.config);
                        }
                    }
                } catch (refreshError) {
                    // Refresh failed, redirect to login
                    Cookies.remove('access_token');
                    Cookies.remove('refresh_token');
                    window.location.href = '/auth/login';
                    return Promise.reject(error);
                }
            }
        }

        return Promise.reject(error);
    }
);

// Polling utility for checking task status
export interface PollOptions {
  maxAttempts?: number;
  interval?: number;
  onProgress?: (attempt: number, data: any) => void;
  stopCondition?: (data: any) => boolean;
}

export const pollTaskStatus = async <T = any>(
  taskId: string,
  statusUrl: string,
  options: PollOptions = {}
): Promise<T> => {
  const {
    maxAttempts = 30, // 5 minutes with 10s intervals
    interval = 10000, // 10 seconds
    onProgress,
    stopCondition
  } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await api.get(statusUrl);
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
};

export const handleApiError = (error: any, customMessage?: string) => {
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
        toast.error('Session expired. Please login again');
        errorShown = true;
        // You might want to trigger a logout or redirect here
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