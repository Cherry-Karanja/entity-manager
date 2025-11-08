/**
 * Authentication Validation Schemas
 * 
 * Zod schemas for form validation with comprehensive error messages
 * and user-friendly feedback for the My Landlord property management system.
 */

import { z } from 'zod';

// ===================================================================
// Common Validation Rules
// ===================================================================

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(255, 'Email address is too long');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password is too long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
  );

const nameSchema = z
  .string()
  .min(1, 'This field is required')
  .max(50, 'Name is too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

// ===================================================================
// Authentication Schemas
// ===================================================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

export const registerSchema = z.object({
  firstName: nameSchema.refine(val => val.trim().length > 0, 'First name is required'),
  lastName: nameSchema.refine(val => val.trim().length > 0, 'Last name is required'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  role: z.enum(['student', 'teacher', 'admin'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }).optional(),
  institutionId: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  subscribeNewsletter: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
});

// ===================================================================
// Profile Management Schemas
// ===================================================================

export const updateProfileSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  phone: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  subjects: z.array(z.string()).optional(),
  gradeLevel: z.string().optional(),
  educationLevel: z.string().optional(),
  experience: z.number().min(0, 'Experience cannot be negative').optional(),
  specializations: z.array(z.string()).optional(),
});

export const updatePreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string().min(1, 'Language is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    examReminders: z.boolean(),
    gradeNotifications: z.boolean(),
    systemUpdates: z.boolean(),
  }),
  accessibility: z.object({
    fontSize: z.enum(['small', 'medium', 'large', 'extra-large']),
    highContrast: z.boolean(),
    reducedMotion: z.boolean(),
    screenReader: z.boolean(),
  }),
});

// ===================================================================
// API Key Management Schemas
// ===================================================================

export const createAPIKeySchema = z.object({
  name: z
    .string()
    .min(1, 'API key name is required')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Name can only contain letters, numbers, spaces, hyphens, and underscores'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
  expiresAt: z.string().optional(),
  rateLimitRpm: z
    .number()
    .min(1, 'Rate limit must be at least 1 request per minute')
    .max(10000, 'Rate limit cannot exceed 10,000 requests per minute')
    .optional(),
});

export const updateAPIKeySchema = z.object({
  name: z
    .string()
    .min(1, 'API key name is required')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Name can only contain letters, numbers, spaces, hyphens, and underscores')
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  rateLimitRpm: z
    .number()
    .min(1, 'Rate limit must be at least 1 request per minute')
    .max(10000, 'Rate limit cannot exceed 10,000 requests per minute')
    .optional(),
});

// ===================================================================
// Type Exports
// ===================================================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type UpdatePreferencesFormData = z.infer<typeof updatePreferencesSchema>;
export type CreateAPIKeyFormData = z.infer<typeof createAPIKeySchema>;
export type UpdateAPIKeyFormData = z.infer<typeof updateAPIKeySchema>;

// ===================================================================
// Validation Helpers
// ===================================================================

export const validateEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

export const validatePassword = (password: string): boolean => {
  return passwordSchema.safeParse(password).success;
};

export const getPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
  isValid: boolean;
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('Use at least 8 characters');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letters');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Include numbers');

  if (/[@$!%*?&]/.test(password)) score += 1;
  else feedback.push('Include special characters (@$!%*?&)');

  if (password.length >= 12) score += 1;
  if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) score += 1;

  return {
    score: Math.min(score, 5),
    feedback,
    isValid: passwordSchema.safeParse(password).success,
  };
};
