import { EntityActionsConfig } from '@/components/entityManager/types'
import { UserProfileEntity } from './types'

// ===== USER PROFILE ACTIONS CONFIGURATION =====

export const actionsConfig: EntityActionsConfig<UserProfileEntity> = {
  // Global actions (always visible)
  actions: [
    {
      id: 'create',
      label: 'Create Profile',
      description: 'Add a new user profile to the system',
      type: 'primary',
      actionType: 'navigation',
      onExecute: async (_, context) => {
        console.log('Navigate to create user profile form')
        // Navigation logic will be handled by orchestrator
      },
    },
    {
      id: 'refresh',
      label: 'Refresh',
      description: 'Reload the profile list',
      type: 'default',
      actionType: 'immediate',
      onExecute: async (_, context) => {
        console.log('Refresh user profile list')
        // Refresh logic will be handled by orchestrator
      },
    },
    {
      id: 'export',
      label: 'Export',
      description: 'Export user profiles to file',
      type: 'default',
      actionType: 'modal',
      onExecute: async () => {
        console.log('Open export modal')
      },
    },
  ],
  
  // Row actions (visible per item)
  rowActions: [
    {
      id: 'view',
      label: 'View',
      description: 'View profile details',
      type: 'default',
      actionType: 'navigation',
      onExecute: async (profile) => {
        console.log('View profile:', profile.id)
      },
    },
    {
      id: 'edit',
      label: 'Edit',
      description: 'Edit profile information',
      type: 'default',
      actionType: 'navigation',
      onExecute: async (profile) => {
        console.log('Edit profile:', profile.id)
      },
    },
    {
      id: 'approve',
      label: 'Approve',
      description: 'Approve this user profile',
      type: 'default',
      actionType: 'confirm',
      condition: (profile) => profile.status === 'pending',
      confirm: {
        title: 'Approve Profile',
        content: 'Are you sure you want to approve this user profile?',
        okText: 'Approve',
        okType: 'primary',
        cancelText: 'Cancel',
        centered: true,
      },
      onExecute: async (profile) => {
        console.log('Approve profile:', profile.id)
        // API call to approve profile
      },
      async: {
        loadingText: 'Approving profile...',
        successMessage: 'Profile approved successfully',
        errorMessage: 'Failed to approve profile',
      },
    },
    {
      id: 'reject',
      label: 'Reject',
      description: 'Reject this user profile',
      type: 'default',
      danger: true,
      actionType: 'confirm',
      condition: (profile) => profile.status === 'pending',
      confirm: {
        title: 'Reject Profile',
        content: 'Are you sure you want to reject this user profile? This action cannot be undone.',
        okText: 'Reject',
        okType: 'danger',
        cancelText: 'Cancel',
        centered: true,
      },
      onExecute: async (profile) => {
        console.log('Reject profile:', profile.id)
        // API call to reject profile
      },
      async: {
        loadingText: 'Rejecting profile...',
        successMessage: 'Profile rejected',
        errorMessage: 'Failed to reject profile',
      },
    },
    {
      id: 'suspend',
      label: 'Suspend',
      description: 'Suspend this user profile',
      type: 'default',
      danger: true,
      actionType: 'confirm',
      condition: (profile) => profile.status === 'approved',
      confirm: {
        title: 'Suspend Profile',
        content: 'Are you sure you want to suspend this user profile?',
        okText: 'Suspend',
        okType: 'danger',
        cancelText: 'Cancel',
        centered: true,
      },
      onExecute: async (profile) => {
        console.log('Suspend profile:', profile.id)
        // API call to suspend profile
      },
      async: {
        loadingText: 'Suspending profile...',
        successMessage: 'Profile suspended',
        errorMessage: 'Failed to suspend profile',
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      description: 'Delete this user profile permanently',
      type: 'default',
      danger: true,
      actionType: 'confirm',
      confirm: {
        title: 'Delete Profile',
        content: 'Are you sure you want to delete this user profile? This action cannot be undone.',
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        centered: true,
      },
      onExecute: async (profile) => {
        console.log('Delete profile:', profile.id)
        // API call to delete profile
      },
      async: {
        loadingText: 'Deleting profile...',
        successMessage: 'Profile deleted successfully',
        errorMessage: 'Failed to delete profile',
      },
    },
  ],
  
  // Bulk actions (only visible when items are selected)
  bulkActions: [
    {
      id: 'bulk-approve',
      label: 'Approve Selected',
      description: 'Approve all selected profiles',
      type: 'default',
      actionType: 'async',
      condition: (item, context) => {
        // Only show if at least one pending profile is selected
        return true
      },
      onExecute: async (profiles) => {
        console.log('Approve profiles:', profiles)
        // Bulk approve API call
      },
      async: {
        loadingText: 'Approving profiles...',
        successMessage: (_, result) => 'Profiles approved successfully',
        errorMessage: (_, error) => `Failed to approve profiles: ${error}`,
        showProgress: true,
      },
    },
    {
      id: 'bulk-reject',
      label: 'Reject Selected',
      description: 'Reject all selected profiles',
      type: 'default',
      danger: true,
      actionType: 'confirm',
      confirm: {
        title: 'Reject Profiles',
        content: (profiles) => {
          const count = Array.isArray(profiles) ? profiles.length : 0
          return `Are you sure you want to reject ${count} profile(s)? This action cannot be undone.`
        },
        okText: 'Reject',
        okType: 'danger',
        cancelText: 'Cancel',
        centered: true,
      },
      onExecute: async (profiles) => {
        console.log('Reject profiles:', profiles)
        // Bulk reject API call
      },
      async: {
        loadingText: 'Rejecting profiles...',
        successMessage: 'Profiles rejected',
        errorMessage: 'Failed to reject profiles',
        showProgress: true,
      },
    },
    {
      id: 'bulk-delete',
      label: 'Delete Selected',
      description: 'Delete all selected profiles',
      type: 'default',
      danger: true,
      actionType: 'confirm',
      confirm: {
        title: 'Delete Profiles',
        content: (profiles) => {
          const count = Array.isArray(profiles) ? profiles.length : 0
          return `Are you sure you want to delete ${count} profile(s)? This action cannot be undone.`
        },
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        centered: true,
      },
      onExecute: async (profiles) => {
        console.log('Delete profiles:', profiles)
        // Bulk delete API call
      },
      async: {
        loadingText: 'Deleting profiles...',
        successMessage: (profiles) => {
          const count = Array.isArray(profiles) ? profiles.length : 0
          return `${count} profile(s) deleted successfully`
        },
        errorMessage: 'Failed to delete profiles',
        showProgress: true,
      },
    },
    {
      id: 'bulk-export',
      label: 'Export Selected',
      description: 'Export selected profiles to file',
      type: 'default',
      actionType: 'async',
      onExecute: async (profiles) => {
        console.log('Export profiles:', profiles)
        // Export selected profiles
      },
      async: {
        loadingText: 'Exporting profiles...',
        successMessage: 'Profiles exported successfully',
        errorMessage: 'Failed to export profiles',
      },
    },
  ],
  
  // Custom actions
  customActions: [
    {
      id: 'send-notification',
      label: 'Send Notification',
      description: 'Send notification to profile owner',
      type: 'default',
      actionType: 'modal',
      onExecute: async (profile) => {
        console.log('Send notification to:', profile.user)
        // Open notification modal
      },
    },
  ],
}
