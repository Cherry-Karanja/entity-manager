// ===== PERMISSION VIEW CONFIGURATION =====
// This file defines the view configuration for Permission entities in the EntityManager system.
// It controls how permission data is displayed, organized, and interacted with in detail views.

/**
 * Permission View Configuration
 *
 * This configuration defines how Permission entities are displayed in the EntityManager.
 * It uses the EntityViewConfig<Permission> interface which extends BaseEntity.
 *
 * Key Features:
 * - Tabs layout for organized field groups
 * - Card theme for clean presentation
 * - Collapsible metadata section
 * - Integrated permission actions
 */

import { permissionActionsConfig } from './actions'
import { EntityViewConfig } from '@/components/entityManager/EntityView/types'
import { Permission } from '@/components/features/accounts/types/permission.types'

/**
 * Permission Entity View Configuration
 *
 * Defines the complete view behavior for Permission entities including:
 * - Display mode and layout
 * - Field organization and grouping
 * - UI customization options
 * - Action integration
 * - Navigation settings
 */
export const permissionViewConfig: EntityViewConfig<Permission> = {
  // ===== VIEW MODE AND LAYOUT =====
  /**
   * View Mode: Controls the overall presentation style
   * - 'detail': Full detailed view with field groups and actions
   * - 'card': Compact card-based display
   * - 'summary': Brief overview with key information
   * - 'timeline': Chronological view of changes
   */
  mode: 'detail',

  /**
   * Layout: Controls how field groups are arranged
   * - 'single': All groups stacked vertically
   * - 'grid': Groups arranged in a responsive grid
   * - 'tabs': Groups displayed as tabbed sections (currently active)
   * - 'accordion': Groups as collapsible accordion sections
   * - 'masonry': Pinterest-style masonry layout
   * - 'list': Simple list format
   */
  layout: 'tabs',

  /**
   * Theme: Visual styling theme
   * - 'card': Clean card-based design with shadows and borders
   * - 'minimal': Minimal styling with subtle borders
   * - 'bordered': Strong borders and structured layout
   */
  theme: 'card',

  // ===== DATA DISPLAY CONFIGURATION =====
  /**
   * Field Groups: Organize fields into logical sections
   * Each group can have its own layout, styling, and behavior
   */
  fieldGroups: [
    {
      /**
       * Basic Information Group
       * Contains core permission identification fields
       */
      id: 'basic-info',                    // Unique identifier for the group
      title: 'Basic Information',          // Display title shown in UI
      description: 'Permission identification details', // Help text under title
      layout: 'grid',                      // Layout within this group: 'grid', 'single', 'horizontal', 'vertical'
      columns: 2,                          // Number of columns for grid layout (1-4)
      collapsible: false,                  // Whether group can be collapsed (true/false)
      collapsed: false,                    // Initial collapsed state (only if collapsible: true)

      /**
       * Fields: Individual data fields within this group
       * Each field maps to a property on the Permission entity
       */
      fields: [
        {
          key: 'name',           // Property name on Permission entity
          label: 'Permission Name', // Display label in UI
          type: 'text'           // Field type: 'text', 'number', 'boolean', 'date', 'select', etc.
        },
        {
          key: 'codename',       // Unique codename for the permission
          label: 'Codename',
          type: 'text'
        },
        {
          key: 'app_label',      // Django app label this permission belongs to
          label: 'App Label',
          type: 'text'
        },
        {
          key: 'model',          // Model name this permission applies to
          label: 'Model',
          type: 'text'
        }
      ]
    },

    {
      /**
       * Metadata Group
       * Contains system-generated information and IDs
       */
      id: 'metadata',
      title: 'Metadata',
      description: 'Additional permission information',
      layout: 'grid',           // Single column for metadata
      columns: 1,
      collapsible: true,        // Can be collapsed to save space
      collapsed: false,         // Initially expanded

      fields: [
        {
          key: 'content_type_name', // Human-readable content type name
          label: 'Content Type Name',
          type: 'text'
        },
        {
          key: 'id',             // Primary key ID
          label: 'Permission ID',
          type: 'number'
        }
      ]
    }
  ],

  // ===== DISPLAY OPTIONS =====
  /**
   * UI Display Controls
   * Fine-tune which UI elements are shown
   */
  showHeader: true,      // Show entity title and actions header
  showActions: true,     // Show action buttons (edit, delete, etc.)
  showMetadata: true,    // Show creation/update timestamps
  showNavigation: true,  // Show prev/next navigation buttons
  compact: true,         // Use compact spacing and sizing

  // ===== NAVIGATION AND ACTIONS =====
  /**
   * Entity Actions Configuration
   * Links to the permission actions config which defines:
   * - View actions (edit, delete, duplicate)
   * - Bulk actions (batch operations)
   * - Custom actions (permission-specific operations)
   */
  entityActions: permissionActionsConfig,

  // ===== ADDITIONAL CONFIGURATION =====
  /**
   * Additional configuration options available:
   *
   * Custom Components:
   * customComponents: {
   *   header: CustomHeaderComponent,
   *   content: CustomContentComponent,
   *   actions: CustomActionsComponent,
   *   metadata: CustomMetadataComponent
   * }
   *
   * Data Transformation:
   * dataTransformer: (data: Permission) => transformedData
   * fieldMapper: (data: Permission) => mappedFields
   *
   * Hooks:
   * hooks: {
   *   onViewLoad: (data) => void,
   *   onActionClick: (action, data) => void
   * }
   *
   * Permissions:
   * permissions: {
   *   view: true,
   *   edit: hasEditPermission,
   *   delete: hasDeletePermission
   * }
   */
}