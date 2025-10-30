// Authentication and User Types

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  isEmailVerified: boolean;
  subscription?: SubscriptionTier;
  phone_number?: string;
  profile?: {
    phone?: string;
    avatar?: string;
    bio?: string;
    idDocument?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionTier {
  tier: string;
  expiresAt: string;
  isActive: boolean;
}

// Subscription tier configurations
export const SUBSCRIPTION_TIERS = {
  FREE: {
    features: ['basic_dashboard', 'email_notifications'],
  },
  PREMIUM: {
    features: ['advanced_dashboard', 'all_notifications'],
  },
} as const;

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}