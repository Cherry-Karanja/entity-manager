import { EntityFormConfig } from '../types'
import { Settings, Bell, Lock, Globe, Palette, Mail, Shield, User, Eye, Clock, Database, Zap } from 'lucide-react'

/**
 * Pre-configured form for application settings
 * Includes general, security, notifications, and appearance settings
 */
export const settingsFormVariation: EntityFormConfig = {
  mode: 'edit',
  layout: 'grid',
  columns: 2,
  fieldSpacing: 'md',
  showProgress: false,
  enableBulkImport: false,
  
  fields: [
    // General Settings
    {
      name: 'siteName',
      label: 'Site Name',
      type: 'text',
      required: true,
      icon: Globe,
      placeholder: 'My Application',
      minLength: 2,
      maxLength: 100,
      helpText: 'Display name for your application',
    },
    {
      name: 'siteDescription',
      label: 'Site Description',
      type: 'textarea',
      required: false,
      placeholder: 'A brief description of your application...',
      maxLength: 500,
      helpText: 'Brief description shown in browser and search results',
    },
    {
      name: 'language',
      label: 'Default Language',
      type: 'select',
      required: true,
      icon: Globe,
      options: [
        { label: 'English', value: 'en' },
        { label: 'Spanish', value: 'es' },
        { label: 'French', value: 'fr' },
        { label: 'German', value: 'de' },
        { label: 'Japanese', value: 'ja' },
        { label: 'Chinese', value: 'zh' },
      ],
    },
    {
      name: 'timezone',
      label: 'Timezone',
      type: 'select',
      required: true,
      icon: Clock,
      options: [
        { label: 'UTC', value: 'UTC' },
        { label: 'America/New_York', value: 'America/New_York' },
        { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
        { label: 'Europe/London', value: 'Europe/London' },
        { label: 'Europe/Paris', value: 'Europe/Paris' },
        { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
        { label: 'Australia/Sydney', value: 'Australia/Sydney' },
      ],
    },

    // Appearance Settings
    {
      name: 'theme',
      label: 'Theme',
      type: 'select',
      required: true,
      icon: Palette,
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Auto', value: 'auto' },
      ],
      helpText: 'Choose your preferred color theme',
    },
    {
      name: 'primaryColor',
      label: 'Primary Color',
      type: 'color',
      required: false,
      icon: Palette,
      helpText: 'Main brand color for your application',
    },
    {
      name: 'compactMode',
      label: 'Compact Mode',
      type: 'switch',
      required: false,
      helpText: 'Reduce spacing and use smaller components',
    },
    {
      name: 'showAnimations',
      label: 'Enable Animations',
      type: 'switch',
      required: false,
      helpText: 'Show transitions and animated effects',
    },

    // Security Settings
    {
      name: 'enableTwoFactor',
      label: 'Two-Factor Authentication',
      type: 'switch',
      required: false,
      icon: Shield,
      helpText: 'Require 2FA for all user accounts',
    },
    {
      name: 'sessionTimeout',
      label: 'Session Timeout (minutes)',
      type: 'number',
      required: true,
      icon: Clock,
      placeholder: '30',
      min: 5,
      max: 1440,
      step: 5,
      helpText: 'Auto-logout after inactive period',
    },
    {
      name: 'passwordMinLength',
      label: 'Minimum Password Length',
      type: 'number',
      required: true,
      icon: Lock,
      placeholder: '8',
      min: 6,
      max: 32,
      step: 1,
    },
    {
      name: 'requirePasswordComplexity',
      label: 'Require Complex Passwords',
      type: 'switch',
      required: false,
      icon: Lock,
      helpText: 'Require uppercase, lowercase, numbers, and symbols',
    },
    {
      name: 'allowedIPs',
      label: 'Allowed IP Addresses',
      type: 'textarea',
      required: false,
      icon: Shield,
      placeholder: '192.168.1.1\n10.0.0.0/8',
      helpText: 'IP whitelist (one per line, leave empty to allow all)',
    },

    // Notification Settings
    {
      name: 'enableEmailNotifications',
      label: 'Email Notifications',
      type: 'switch',
      required: false,
      icon: Mail,
      helpText: 'Send notifications via email',
    },
    {
      name: 'emailFrom',
      label: 'From Email Address',
      type: 'email',
      required: false,
      icon: Mail,
      placeholder: 'noreply@example.com',
      condition: (values) => values.enableEmailNotifications === true,
    },
    {
      name: 'smtpHost',
      label: 'SMTP Host',
      type: 'text',
      required: false,
      placeholder: 'smtp.example.com',
      condition: (values) => values.enableEmailNotifications === true,
    },
    {
      name: 'smtpPort',
      label: 'SMTP Port',
      type: 'number',
      required: false,
      placeholder: '587',
      min: 1,
      max: 65535,
      condition: (values) => values.enableEmailNotifications === true,
    },
    {
      name: 'enablePushNotifications',
      label: 'Push Notifications',
      type: 'switch',
      required: false,
      icon: Bell,
      helpText: 'Enable browser push notifications',
    },
    {
      name: 'notificationTypes',
      label: 'Notification Types',
      type: 'multiselect',
      required: false,
      icon: Bell,
      options: [
        { label: 'System Alerts', value: 'system' },
        { label: 'User Activity', value: 'activity' },
        { label: 'Security Events', value: 'security' },
        { label: 'Updates', value: 'updates' },
        { label: 'Marketing', value: 'marketing' },
      ],
      helpText: 'Choose which types of notifications to receive',
    },

    // Privacy Settings
    {
      name: 'dataRetentionDays',
      label: 'Data Retention (days)',
      type: 'number',
      required: true,
      icon: Database,
      placeholder: '90',
      min: 1,
      max: 3650,
      step: 1,
      helpText: 'How long to keep user data before deletion',
    },
    {
      name: 'enableAnalytics',
      label: 'Enable Analytics',
      type: 'switch',
      required: false,
      icon: Eye,
      helpText: 'Collect anonymous usage statistics',
    },
    {
      name: 'analyticsId',
      label: 'Analytics Tracking ID',
      type: 'text',
      required: false,
      placeholder: 'GA-XXXXXXXXX',
      condition: (values) => values.enableAnalytics === true,
    },
    {
      name: 'shareDataWithPartners',
      label: 'Share Data with Partners',
      type: 'switch',
      required: false,
      helpText: 'Allow sharing anonymized data with trusted partners',
    },

    // Performance Settings
    {
      name: 'enableCaching',
      label: 'Enable Caching',
      type: 'switch',
      required: false,
      icon: Zap,
      helpText: 'Cache frequently accessed data for better performance',
    },
    {
      name: 'cacheExpiration',
      label: 'Cache Expiration (minutes)',
      type: 'number',
      required: false,
      placeholder: '60',
      min: 1,
      max: 1440,
      step: 5,
      condition: (values) => values.enableCaching === true,
    },
    {
      name: 'enableCompression',
      label: 'Enable Compression',
      type: 'switch',
      required: false,
      icon: Zap,
      helpText: 'Compress responses to reduce bandwidth usage',
    },
    {
      name: 'maxUploadSize',
      label: 'Max Upload Size (MB)',
      type: 'number',
      required: true,
      placeholder: '10',
      min: 1,
      max: 1024,
      step: 1,
      helpText: 'Maximum file size for uploads',
    },

    // User Management
    {
      name: 'allowRegistration',
      label: 'Allow User Registration',
      type: 'switch',
      required: false,
      icon: User,
      helpText: 'Allow new users to create accounts',
    },
    {
      name: 'requireEmailVerification',
      label: 'Require Email Verification',
      type: 'switch',
      required: false,
      icon: Mail,
      condition: (values) => values.allowRegistration === true,
    },
    {
      name: 'defaultUserRole',
      label: 'Default User Role',
      type: 'select',
      required: false,
      icon: Shield,
      options: [
        { label: 'User', value: 'user' },
        { label: 'Member', value: 'member' },
        { label: 'Contributor', value: 'contributor' },
      ],
      condition: (values) => values.allowRegistration === true,
    },

    // Maintenance
    {
      name: 'maintenanceMode',
      label: 'Maintenance Mode',
      type: 'switch',
      required: false,
      icon: Settings,
      helpText: 'Put the site in maintenance mode',
    },
    {
      name: 'maintenanceMessage',
      label: 'Maintenance Message',
      type: 'textarea',
      required: false,
      placeholder: 'We are performing scheduled maintenance...',
      maxLength: 500,
      condition: (values) => values.maintenanceMode === true,
    },
  ],

  hooks: {
    onSubmitStart: (values: Record<string, unknown>) => {
      // Validate email settings
      if (values.enableEmailNotifications === true) {
        if (!values.emailFrom) {
          throw new Error('From email is required when email notifications are enabled')
        }
        if (!values.smtpHost) {
          throw new Error('SMTP host is required when email notifications are enabled')
        }
        if (!values.smtpPort) {
          throw new Error('SMTP port is required when email notifications are enabled')
        }
      }

      // Validate analytics settings
      if (values.enableAnalytics === true && !values.analyticsId) {
        throw new Error('Analytics tracking ID is required when analytics are enabled')
      }

      // Validate session timeout
      const timeout = typeof values.sessionTimeout === 'number' ? values.sessionTimeout : 0
      if (timeout < 5 || timeout > 1440) {
        throw new Error('Session timeout must be between 5 and 1440 minutes')
      }
    },
  },

  submitButtonText: 'Save Settings',
  cancelButtonText: 'Reset',
}

// Export with alias for consistency
export const applicationSettingsForm = settingsFormVariation
