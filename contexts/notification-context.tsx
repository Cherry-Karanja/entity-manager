'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { useEntityNotificationWebSocket } from '../components/entityManager/manager/hooks/useEntityWebSocket';

export interface NotificationItem {
  id: number;
  user_id: number;
  notification_type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: string;
  created_at: string;
  is_read: boolean;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (notification: NotificationItem) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // WebSocket connection disabled for now - backend doesn't support websockets yet
  // const { isConnected } = useEntityNotificationWebSocket();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, is_read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, is_read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notification: NotificationItem) => {
    setNotifications(prev => [notification, ...prev]);

    // Show toast for new notifications
    const { title, message, priority } = notification;

    switch (priority) {
      case 'high':
        toast.error(title, { description: message });
        break;
      case 'medium':
        toast.warning(title, { description: message });
        break;
      default:
        toast.success(title, { description: message });
    }
  };

  // Load initial notifications (this would typically come from an API call)
  useEffect(() => {
    // TODO: Load notifications from API
    // For now, we'll start with an empty array
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};