/**
 * API Configuration - Base Template
 *
 * This file centralizes all API endpoints for the application.
 */

// Base URL Configuration
export const BASE_URL = "http://localhost:8000"; // Replace with your actual base URL

// ===================================================================
// Authentication & User Management
// ===================================================================
export const LOGIN_URL = `${BASE_URL}/auth/login/`;
export const LOGOUT_URL = `${BASE_URL}/auth/logout/`;
export const REGISTRATION_URL = `${BASE_URL}/auth/registration/`;
export const USER_DETAILS_URL = `${BASE_URL}/auth/user/`;
export const TOKEN_REFRESH_URL = `${BASE_URL}/auth/token/refresh/`;
export const TOKEN_VERIFY_URL = `${BASE_URL}/auth/token/verify/`;
export const PASSWORD_RESET_URL = `${BASE_URL}/auth/password/reset/`;
export const PASSWORD_CHANGE_URL = `${BASE_URL}/auth/password/change/`;
export const CSRF_TOKEN_URL = `${BASE_URL}/auth/csrf-cookie/`;

// ===================================================================
// Generic API Endpoints
// ===================================================================
export const API_BASE = `${BASE_URL}/api`;
export const ENTITIES_URL = `${API_BASE}/entities/`;