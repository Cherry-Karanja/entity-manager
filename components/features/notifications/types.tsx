/**
 * Notification Type Definition
 * 
 * Type definition for system notifications.
 */

import { BaseEntity } from '@/components/entityManager/primitives/types';

export interface Notification extends BaseEntity {
  // Primary identifier
  id: string;
  
  // Notification details
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  
  // Recipient
  user_id: string;
  user_name?: string;
  
  // Status
  is_read: boolean;
  read_at?: string | null;
  
  // Action link (optional)
  action_url?: string | null;
  action_label?: string | null;
  
  // Metadata
  metadata?: Record<string, unknown>;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * Notification API Request/Response Types
 */
export interface NotificationListResponse {
  results: Notification[];
  count: number;
  unread_count: number;
  next?: string | null;
  previous?: string | null;
}
