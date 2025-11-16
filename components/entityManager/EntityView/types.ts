import React from "react"
import { EntityActionsConfig } from "../EntityActions/types"
import { BaseEntity } from "../manager"

// ===== TYPE DEFINITIONS =====

/**
 * EntityView Configuration Interface
 *
 * This is the main configuration interface for EntityView components.
 * It defines how entities are displayed, organized, and interacted with.
 *
 * @template TEntity - The entity type that extends BaseEntity
 */
export interface EntityViewConfig<TEntity extends BaseEntity = BaseEntity> {
  // ===== VIEW MODE AND LAYOUT =====

  /**
   * View Mode: Controls the overall presentation style
   * - 'detail': Full detailed view with field groups and actions (default)
   * - 'card': Compact card-based display for lists
   * - 'summary': Brief overview with key information only
   * - 'timeline': Chronological view of entity changes/events
   * - 'gallery': Image-based grid layout
   * - 'list': Simple list format
   * - 'table': Tabular data presentation
   * - 'custom': Custom rendering via customComponents
   */
  mode?: ViewMode

  /**
   * Layout: Controls how content is arranged within the view
   * - 'single': All content stacked vertically in one column
   * - 'grid': Responsive grid layout for field groups
   * - 'tabs': Field groups displayed as tabbed sections
   * - 'accordion': Collapsible accordion sections
   * - 'masonry': Pinterest-style masonry layout
   * - 'list': Simple vertical list
   */
  layout?: ViewLayout

  /**
   * Theme: Visual styling preset
   * - 'default': Standard theme with default styling
   * - 'card': Card-based design with shadows and borders
   * - 'minimal': Minimal styling with subtle elements
   * - 'bordered': Strong borders and structured appearance
   * - 'flat': Flat design without shadows or borders
   */
  theme?: ViewTheme

  // ===== DATA DISPLAY CONFIGURATION =====

  /**
   * Fields: Simple field configuration for basic views
   * Alternative to fieldGroups for simpler layouts
   */
  fields?: ViewField[]

  /**
   * Field Groups: Organized field collections with layout control
   * Primary way to structure complex entity displays
   */
  fieldGroups?: ViewFieldGroup[]

  /**
   * Static Data: Pre-defined data for the view (alternative to data prop)
   */
  data?: TEntity

  /**
   * Data Fetcher: Function to asynchronously load data
   * Called when component mounts if no data prop provided
   */
  dataFetcher?: () => Promise<TEntity>

  // ===== DISPLAY OPTIONS =====

  /** Show entity header with title and actions */
  showHeader?: boolean

  /** Show action buttons (edit, delete, custom actions) */
  showActions?: boolean

  /** Show metadata (created/updated timestamps) */
  showMetadata?: boolean

  /** Show navigation buttons (prev/next) */
  showNavigation?: boolean

  /** Use compact spacing and sizing */
  compact?: boolean

  // ===== VIEW COMPONENTS =====

  /**
   * Custom Components: Override default rendering components
   * Allows complete customization of view sections
   */
  customComponents?: {
    /** Custom header component */
    header?: React.ComponentType<ViewHeaderProps<TEntity>>
    /** Custom content component */
    content?: React.ComponentType<ViewContentProps<TEntity>>
    /** Custom actions component */
    actions?: React.ComponentType<ViewActionsProps<TEntity>>
    /** Custom metadata component */
    metadata?: React.ComponentType<ViewMetadataProps<TEntity>>
  }

  // ===== DATA TRANSFORMATION =====

  /**
   * Data Transformer: Transform entity data before display
   * Useful for computed fields or data normalization
   */
  dataTransformer?: (data: TEntity) => TEntity

  /**
   * Field Mapper: Map entity fields to different display values
   * Returns key-value pairs for field rendering
   */
  fieldMapper?: (data: TEntity) => Record<string, unknown>

  // ===== NAVIGATION AND ACTIONS =====

  /**
   * Actions: Legacy action configuration (deprecated)
   * Use entityActions instead for new implementations
   */
  actions?: ViewAction[]

  /**
   * Entity Actions: Modern action configuration system
   * Provides comprehensive action management with EntityActionsConfig
   */
  entityActions?: EntityActionsConfig<TEntity>

  /**
   * Navigation: Custom navigation handlers
   * Define prev/next behavior for entity browsing
   */
  navigation?: {
    /** Navigate to previous entity */
    prev?: () => void | Promise<void>
    /** Navigate to next entity */
    next?: () => void | Promise<void>
    /** Whether previous navigation is available */
    canGoPrev?: boolean
    /** Whether next navigation is available */
    canGoNext?: boolean
  }

  // ===== PERMISSIONS & HOOKS =====

  /**
   * Permissions: Control what actions are available
   * Determines UI state based on user permissions
   */
  permissions?: {
    /** Can view the entity */
    view?: boolean
    /** Can edit the entity */
    edit?: boolean
    /** Can delete the entity */
    delete?: boolean
    /** Can navigate between entities */
    navigate?: boolean
  }

  /**
   * Hooks: Lifecycle and interaction callbacks
   * Called at various points during view lifecycle
   */
  hooks?: {
    /** Called when view loads with data */
    onViewLoad?: (data: TEntity) => void
    /** Called when view data changes */
    onViewChange?: (data: TEntity) => void
    /** Called when an action is clicked */
    onActionClick?: (action: ViewAction, data: TEntity) => void
    /** Called when navigation occurs */
    onNavigate?: (direction: 'prev' | 'next') => void
  }

  // ===== STYLING AND CUSTOMIZATION =====

  /** Additional CSS classes for the view container */
  className?: string

  /** Inline styles for the view container */
  style?: React.CSSProperties

  /** Spacing between fields: 'sm' | 'md' | 'lg' */
  fieldSpacing?: ViewFieldSpacing

  /** Border radius size: 'none' | 'sm' | 'md' | 'lg' | 'xl' */
  borderRadius?: ViewBorderRadius

  /** Shadow depth: 'none' | 'sm' | 'md' | 'lg' | 'xl' */
  shadow?: ViewShadow
}

/**
 * View Mode Types
 * Defines available display modes for EntityView
 */
export type ViewMode = 'card' | 'list' | 'table' | 'detail' | 'summary' | 'timeline' | 'gallery' | 'custom'

/**
 * View Layout Types
 * Defines available layout arrangements for content
 */
export type ViewLayout = 'single' | 'grid' | 'masonry' | 'list' | 'tabs' | 'accordion'

/**
 * View Theme Types
 * Defines available visual themes
 */
export type ViewTheme = 'default' | 'minimal' | 'card' | 'bordered' | 'flat'

/**
 * View Field Configuration
 *
 * Defines how individual entity properties are displayed and formatted.
 * Supports various data types and display customizations.
 */
export interface ViewField {
  /** Property key on the entity object */
  key: string

  /** Display label shown in the UI */
  label: string

  /**
   * Field Display Type: Controls how the value is rendered
   * - 'text': Plain text (default)
   * - 'number': Formatted number
   * - 'date'/'datetime': Date/time formatting
   * - 'boolean': Checkbox or yes/no display
   * - 'currency'/'percentage': Formatted numbers
   * - 'email'/'phone'/'url': Clickable links
   * - 'image'/'avatar': Image display
   * - 'badge'/'tags': Styled labels
   * - 'json'/'markdown'/'html': Rich content
   * - 'custom': Custom rendering via render/component
   */
  type?: FieldDisplayType

  /** Static value override (ignores entity data) */
  value?: unknown

  /**
   * Custom Format Function
   * Transform the field value for display
   * @param value - Raw field value
   * @param data - Complete entity data
   * @returns Formatted React node or value
   */
  format?: (value: unknown, data: unknown) => React.ReactNode

  /**
   * Display Condition
   * Only show field when this returns true
   * @param data - Complete entity data
   * @returns Whether to display the field
   */
  condition?: (data: unknown) => boolean

  /** Hide this field from display */
  hidden?: boolean

  // ===== DISPLAY OPTIONS =====

  /** Field width (CSS value or number for flex) */
  width?: number | string

  /** Text alignment: 'left' | 'center' | 'right' */
  align?: 'left' | 'center' | 'right'

  /** Make text bold */
  bold?: boolean

  /** Make text italic */
  italic?: boolean

  /** Text color (CSS color value) */
  color?: string

  /** Background color (CSS color value) */
  backgroundColor?: string

  // ===== ADVANCED FEATURES =====

  /** Content to show before the field value */
  prefix?: React.ReactNode

  /** Content to show after the field value */
  suffix?: React.ReactNode

  /** Icon component to display */
  icon?: React.ComponentType<{ className?: string }>

  /** Display value as a badge/chip */
  badge?: boolean

  /** Allow copying field value to clipboard */
  copyable?: boolean

  /**
   * Link Configuration
   * Make field value clickable
   */
  link?: {
    /** Link URL or function to generate URL */
    href: string | ((data: unknown) => string)
    /** Link target: '_blank' | '_self' */
    target?: '_blank' | '_self'
  }

  // ===== CUSTOM RENDERING =====

  /**
   * Custom Render Function
   * Complete control over field rendering
   * @param value - Field value
   * @param data - Complete entity data
   * @returns React node to render
   */
  render?: (value: unknown, data: unknown) => React.ReactNode

  /**
   * Custom Component
   * React component for field rendering
   * Receives field, value, and data as props
   */
  component?: React.ComponentType<FieldRenderProps>
}

/**
 * View Field Group Configuration
 *
 * Groups related fields together with shared layout and behavior.
 * Used for organizing complex forms and displays.
 */
export interface ViewFieldGroup {
  /** Unique identifier for the group */
  id: string

  /** Display title for the group */
  title?: string

  /** Description text shown under the title */
  description?: string

  /** Fields belonging to this group */
  fields: ViewField[]

  /** Whether group starts collapsed (only if collapsible) */
  collapsed?: boolean

  /** Whether group can be collapsed/expanded by user */
  collapsible?: boolean

  /**
   * Group Layout: How fields are arranged within the group
   * - 'vertical': Fields stacked vertically (default)
   * - 'horizontal': Fields in a horizontal row
   * - 'grid': Fields in a responsive grid
   */
  layout?: 'vertical' | 'horizontal' | 'grid'

  /** Number of columns for grid layout (1-4) */
  columns?: number

  /** Additional CSS classes for the group container */
  className?: string
}

/**
 * Field Display Types
 *
 * Defines available rendering types for field values.
 * Each type has specific formatting and interaction behavior.
 */
export type FieldDisplayType =
  | 'text'        // Plain text display
  | 'number'      // Number formatting with locale
  | 'date'        // Date only (YYYY-MM-DD)
  | 'datetime'    // Date and time with timezone
  | 'boolean'     // True/false as checkbox or text
  | 'currency'    // Currency formatting ($1,234.56)
  | 'percentage'  // Percentage formatting (12.34%)
  | 'email'       // Clickable mailto link
  | 'phone'       // Clickable tel link
  | 'url'         // Clickable external link
  | 'image'       // Image display with fallback
  | 'avatar'      // User avatar with initials fallback
  | 'badge'       // Colored badge/chip
  | 'tags'        // Multiple tags/badges
  | 'json'        // Formatted JSON with syntax highlighting
  | 'markdown'    // Rendered markdown content
  | 'html'        // Rendered HTML content (sanitized)
  | 'custom'      // Custom rendering via render/component

/**
 * View Action Configuration
 *
 * Defines actions that can be performed on entities (edit, delete, custom).
 * Supports various interaction patterns and confirmation dialogs.
 */
export interface ViewAction {
  /** Unique identifier for the action */
  id: string

  /** Display label for the action button */
  label: string

  /** Icon component for the action */
  icon?: React.ComponentType<{ className?: string }>

  /**
   * Button Variant: Visual style of the action button
   * - 'default': Primary action style
   * - 'outline': Outlined button style
   * - 'ghost': Minimal button style
   * - 'link': Link-style button
   * - 'destructive': Red/delete style for dangerous actions
   */
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive'

  /**
   * Button Size: Size of the action button
   * - 'sm': Small button
   * - 'default': Standard size
   * - 'lg': Large button
   */
  size?: 'sm' | 'default' | 'lg'

  /** Whether the action is disabled */
  disabled?: boolean

  /** Whether the action is in loading state */
  loading?: boolean

  /**
   * Display Condition
   * Only show action when this returns true
   * @param data - Complete entity data
   * @returns Whether to display the action
   */
  condition?: (data: unknown) => boolean

  /**
   * Click Handler
   * Called when action is clicked
   * @param data - Complete entity data
   */
  onClick?: (data: unknown) => void | Promise<void>

  /**
   * Link URL: Make action a link instead of button
   * Can be static string or function returning URL
   */
  href?: string | ((data: unknown) => string)

  /** Link target for navigation */
  target?: '_blank' | '_self'

  /**
   * Confirmation Dialog Configuration
   * Shows confirmation dialog before executing action
   */
  confirm?: {
    /** Dialog title */
    title: string
    /** Dialog description text */
    description?: string
    /** Confirm button text */
    confirmText?: string
    /** Cancel button text */
    cancelText?: string
  }
}

/**
 * Field Render Props
 *
 * Props passed to custom field components
 */
export interface FieldRenderProps {
  /** Field configuration */
  field: ViewField
  /** Field value */
  value: unknown
  /** Complete entity data */
  data: unknown
}

/**
 * View Header Component Props
 *
 * Props for custom header components
 */
export interface ViewHeaderProps<TEntity extends BaseEntity = BaseEntity> {
  /** Entity data */
  data: TEntity
  /** View configuration */
  config: EntityViewConfig<TEntity>
  /** Override title */
  title?: string
  /** Override subtitle */
  subtitle?: string
}

/**
 * View Content Component Props
 *
 * Props for custom content components
 */
export interface ViewContentProps<TEntity extends BaseEntity = BaseEntity> {
  /** Entity data */
  data: TEntity
  /** View configuration */
  config: EntityViewConfig<TEntity>
  /** Simple fields array */
  fields: ViewField[]
  /** Field groups array */
  fieldGroups: ViewFieldGroup[]
}

/**
 * View Actions Component Props
 *
 * Props for custom actions components
 */
export interface ViewActionsProps<TEntity extends BaseEntity = BaseEntity> {
  /** Entity data */
  data: TEntity
  /** View configuration */
  config: EntityViewConfig<TEntity>
  /** Available actions */
  actions: ViewAction[]
}

/**
 * View Metadata Component Props
 *
 * Props for custom metadata components
 */
export interface ViewMetadataProps<TEntity extends BaseEntity = BaseEntity> {
  /** Entity data */
  data: TEntity
  /** View configuration */
  config: EntityViewConfig<TEntity>
  /** Creation timestamp */
  createdAt?: string
  /** Last update timestamp */
  updatedAt?: string
  /** Created by user */
  createdBy?: string
  /** Updated by user */
  updatedBy?: string
}

// ===== VIEW MODE COMPONENTS =====

/**
 * Card View Props
 *
 * Props for card-based entity display
 * Used when mode is 'card'
 */
export interface CardViewProps {
  /** Entity data */
  data: unknown
  /** View configuration */
  config: EntityViewConfig
  /** Fields to display */
  fields: ViewField[]
  /** Action click handler */
  onActionClick?: (action: ViewAction) => void
}

/**
 * List View Props
 *
 * Props for list-based entity display
 * Used when mode is 'list'
 */
export interface ListViewProps {
  /** Array of entity data */
  data: unknown[]
  /** View configuration */
  config: EntityViewConfig
  /** Fields to display for each item */
  fields: ViewField[]
  /** Item click handler */
  onItemClick?: (item: unknown) => void
  /** Action click handler */
  onActionClick?: (action: ViewAction, item: unknown) => void
}

/**
 * Table View Props
 *
 * Props for table-based entity display
 * Used when mode is 'table'
 */
export interface TableViewProps {
  /** Array of entity data */
  data: unknown[]
  /** View configuration */
  config: EntityViewConfig
  /** Fields to display as columns */
  fields: ViewField[]
  /** Enable column sorting */
  sortable?: boolean
  /** Enable row selection */
  selectable?: boolean
  /** Sort change handler */
  onSort?: (field: string, direction: 'asc' | 'desc') => void
  /** Selection change handler */
  onSelect?: (items: unknown[]) => void
  /** Action click handler */
  onActionClick?: (action: ViewAction, item: unknown) => void
}

/**
 * Detail View Props
 *
 * Props for detailed entity display
 * Used when mode is 'detail' (default)
 */
export interface DetailViewProps {
  /** Single entity data */
  data: unknown
  /** View configuration */
  config: EntityViewConfig
  /** Field groups to display */
  fieldGroups: ViewFieldGroup[]
  /** Action click handler */
  onActionClick?: (action: ViewAction) => void
}

/**
 * Timeline View Props
 *
 * Props for timeline-based entity display
 * Used when mode is 'timeline'
 */
export interface TimelineViewProps {
  /** Array of timeline events */
  data: unknown[]
  /** View configuration */
  config: EntityViewConfig
  /** Field key for event dates */
  dateField: string
  /** Field key for event titles */
  titleField: string
  /** Field key for event descriptions */
  descriptionField?: string
  /** Field key to group events by */
  groupBy?: string
}

/**
 * Gallery View Props
 *
 * Props for gallery/image-based entity display
 * Used when mode is 'gallery'
 */
export interface GalleryViewProps {
  /** Array of gallery items */
  data: unknown[]
  /** View configuration */
  config: EntityViewConfig
  /** Field key for image URLs */
  imageField: string
  /** Field key for item titles */
  titleField?: string
  /** Field key for item descriptions */
  descriptionField?: string
  /** Item click handler */
  onItemClick?: (item: unknown) => void
}

// ===== DEFAULT CONFIGURATIONS =====

/**
 * Default View Configuration
 *
 * Provides sensible defaults for EntityViewConfig.
 * Can be spread into custom configurations.
 */
export const DEFAULT_VIEW_CONFIG: Partial<EntityViewConfig> = {
  mode: 'detail',           // Default to detailed view
  layout: 'single',         // Single column layout
  theme: 'default',         // Standard theme
  showHeader: true,         // Show headers
  showActions: true,        // Show action buttons
  showMetadata: false,      // Hide metadata by default
  showNavigation: false,    // Hide navigation by default
  compact: false,           // Use normal spacing
  fieldSpacing: 'md',       // Medium field spacing
  borderRadius: 'md',       // Medium border radius
  shadow: 'sm',             // Small shadow
  permissions: {
    view: true,             // Allow viewing
    edit: false,            // Disable editing by default
    delete: false,          // Disable deletion by default
    navigate: false,        // Disable navigation by default
  },
}

/**
 * Default View Actions
 *
 * Standard CRUD actions that can be used as starting point.
 * Customize or replace with entity-specific actions.
 */
export const DEFAULT_VIEW_ACTIONS: ViewAction[] = [
  {
    id: 'edit',
    label: 'Edit',
    icon: () => React.createElement('span', null, '✏️'), // Placeholder icon
    variant: 'outline',
    condition: () => true, // Always show
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: () => React.createElement('span', null, '🗑️'), // Placeholder icon
    variant: 'destructive',
    condition: () => true, // Always show
    confirm: {
      title: 'Delete Item',
      description: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    },
  },
]

// ===== UTILITY TYPES =====

/**
 * EntityView Component Props
 *
 * Main props interface for the EntityView component
 */
export interface EntityViewProps<TEntity extends BaseEntity = BaseEntity> {
  /** View configuration */
  config: EntityViewConfig<TEntity>
  /** Entity data (can be undefined if using dataFetcher) */
  data?: TEntity
  /** Action click handler */
  onActionClick?: (action: ViewAction, data?: TEntity) => void
  /** Navigation handler */
  onNavigate?: (direction: 'prev' | 'next') => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Field Spacing Options
 * Controls spacing between fields
 */
export type ViewFieldSpacing = 'sm' | 'md' | 'lg'

/**
 * Border Radius Options
 * Controls corner rounding
 */
export type ViewBorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Shadow Options
 * Controls shadow depth
 */
export type ViewShadow = 'none' | 'sm' | 'md' | 'lg' | 'xl'