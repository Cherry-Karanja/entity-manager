/**
 * Notifications Center Page
 * 
 * Manage and view all user notifications.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Notification } from '@/components/features/notifications/types';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Profile Approved',
      message: 'Your profile has been approved by Admin User. You now have full access to the system.',
      type: 'success',
      user_id: 'current-user',
      is_read: false,
      action_url: '/dashboard/profile',
      action_label: 'View Profile',
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: 'New Role Assigned',
      message: 'You have been assigned the "Manager" role. Check your new permissions in your profile.',
      type: 'info',
      user_id: 'current-user',
      is_read: false,
      action_url: '/dashboard/profile',
      action_label: 'View Permissions',
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      title: 'Password Expiring Soon',
      message: 'Your password will expire in 7 days. Please change it to maintain account security.',
      type: 'warning',
      user_id: 'current-user',
      is_read: true,
      read_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      action_url: '/dashboard/profile',
      action_label: 'Change Password',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      title: 'System Maintenance Scheduled',
      message: 'System maintenance is scheduled for this Sunday from 2 AM to 4 AM. The system will be unavailable during this time.',
      type: 'info',
      user_id: 'current-user',
      is_read: true,
      read_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      title: 'Welcome to the Platform!',
      message: 'Thank you for joining our platform. Explore the features and let us know if you need any help.',
      type: 'success',
      user_id: 'current-user',
      is_read: true,
      read_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      action_url: '/dashboard',
      action_label: 'Get Started',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setNotifications(mockNotifications);
      
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ 
      ...n, 
      is_read: true, 
      read_at: new Date().toISOString() 
    })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline">
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'unread')}>
            <TabsList>
              <TabsTrigger value="all">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({unreadCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {activeTab === 'unread' ? 'No unread notifications' : 'No notifications'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <div 
                    className={cn(
                      "flex gap-4 p-4 rounded-lg transition-colors",
                      !notification.is_read && "bg-primary/5"
                    )}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3 className={cn(
                          "text-sm font-medium",
                          !notification.is_read && "font-semibold"
                        )}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {getTimeAgo(notification.created_at)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {notification.message}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {notification.action_url && (
                          <Button variant="ghost" size="sm" className="h-8">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {notification.action_label || 'View'}
                          </Button>
                        )}
                        
                        {!notification.is_read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Mark as Read
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(notification.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {index < filteredNotifications.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
