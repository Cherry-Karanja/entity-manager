/**
 * API Configuration - Base Template
 *
 * This file centralizes all API endpoints for the application.
 */

// Base URL Configuration
export const BASE_URL = "http://127.0.0.1:8000"; // Replace with your actual base URL

// ===================================================================
// Authentication & User Management
// ===================================================================
export const LOGIN_URL = `${BASE_URL}/dj-rest-auth/login/`;
export const LOGOUT_URL = `${BASE_URL}/dj-rest-auth/logout/`;
export const REGISTRATION_URL = `${BASE_URL}/dj-rest-auth/registration/`;
export const USER_DETAILS_URL = `${BASE_URL}/dj-rest-auth/user/`;
export const TOKEN_REFRESH_URL = `${BASE_URL}/dj-rest-auth/token/refresh/`;
export const TOKEN_VERIFY_URL = `${BASE_URL}/dj-rest-auth/token/verify/`;
export const PASSWORD_RESET_URL = `${BASE_URL}/dj-rest-auth/password/reset/`;
export const PASSWORD_CHANGE_URL = `${BASE_URL}/dj-rest-auth/password/change/`;
export const PASSWORD_RESET_CONFIRM_URL = `${BASE_URL}/dj-rest-auth/password/reset/confirm/`;
export const EMAIL_VERIFICATION_URL = `${BASE_URL}/dj-rest-auth/account-confirm-email/`;
export const RESEND_EMAIL_VERIFICATION_URL = `${BASE_URL}/dj-rest-auth/registration/resend-email/`;
export const CSRF_TOKEN_URL = `${BASE_URL}/dj-rest-auth/csrf-cookie/`;

// ===================================================================
// User Management Endpoints
// ===================================================================
export const USER_MANAGER_BASE = `${BASE_URL}/user-manager`;
export const USERS_URL = `${USER_MANAGER_BASE}/users/`;
export const TENANT_PROFILES_URL = `${USER_MANAGER_BASE}/tenant-profiles/`;
export const LANDLORD_PROFILES_URL = `${USER_MANAGER_BASE}/landlord-profiles/`;
export const CARETAKER_PROFILES_URL = `${USER_MANAGER_BASE}/caretaker-profiles/`;
export const PROPERTY_MANAGER_PROFILES_URL = `${USER_MANAGER_BASE}/property-manager-profiles/`;

// ===================================================================
// Property Management Endpoints
// ===================================================================
export const PROPERTY_MANAGER_BASE = `${BASE_URL}/property-manager`;
export const APARTMENTS_URL = `${PROPERTY_MANAGER_BASE}/apartment/`;
export const HOUSES_URL = `${PROPERTY_MANAGER_BASE}/house/`;
export const UNITS_URL = `${PROPERTY_MANAGER_BASE}/units/`;
export const MAINTENANCE_REQUESTS_URL = `${PROPERTY_MANAGER_BASE}/maintenance-requests/`;
export const PROPERTY_STATISTICS_URL = `${PROPERTY_MANAGER_BASE}/statistics/`;

// ===================================================================
// Rent Management Endpoints
// ===================================================================
export const RENT_MANAGER_BASE = `${BASE_URL}/rent-manager`;
export const RENTS_URL = `${RENT_MANAGER_BASE}/rents/`;
export const RENT_PAYMENTS_URL = `${RENT_MANAGER_BASE}/rent-payments/`;
export const MY_RENT_PAYMENT_HISTORY_URL = `${RENT_MANAGER_BASE}/my-rent-payment-history/`;

// ===================================================================
// Notifications Management Endpoints
// ===================================================================
export const NOTIFICATIONS_MANAGER_BASE = `${BASE_URL}/notifications-manager`;

// ===================================================================
// Generic API Endpoints (Legacy - kept for compatibility)
// ===================================================================
export const API_BASE = `${BASE_URL}/api`;
export const ENTITIES_URL = `${API_BASE}/entities/`;