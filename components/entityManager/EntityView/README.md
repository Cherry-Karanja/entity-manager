# EntityView Component

A powerful, flexible, and modular component for displaying entity data in various view modes with built-in support for actions, navigation, and customization.

## Features

✅ **Multiple View Modes**: Card, Detail, Summary, Timeline
✅ **Modular Architecture**: Reusable components and views
✅ **Pre-configured Variations**: Ready-to-use configurations for common use cases
✅ **EntityActions Integration**: Unified action handling with modals, drawers, and forms
✅ **Responsive Design**: Mobile-friendly with dark mode support
✅ **Type-Safe**: Full TypeScript support with comprehensive type definitions
✅ **Highly Customizable**: Extensive configuration options for fields, groups, and layouts

## Installation

The component is already part of the entity-manager project:

```tsx
import { EntityView } from '@/components/entityManager/EntityView'
```

## Quick Start

### Using Pre-configured Variations

The easiest way to get started is using one of the pre-configured variations:

```tsx
import { EntityView } from '@/components/entityManager/EntityView'
import { userProfileVariation } from '@/components/entityManager/EntityView/variations'

function UserProfile({ user }) {
  return <EntityView config={userProfileVariation} data={user} />
}
```

### Basic Usage with Custom Configuration

```tsx
import { EntityView } from '@/components/entityManager/EntityView'

const config = {
  mode: 'detail',
  layout: 'single',
  theme: 'card',
  showHeader: true,
  
  fieldGroups: [
    {
      id: 'basic-info',
      title: 'Basic Information',
      layout: 'grid',
      columns: 2,
      fields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'email', label: 'Email', type: 'email' },
      ],
    },
  ],
}

<EntityView config={config} data={userData} />
```

## View Modes

### 1. Card View (`mode: 'card'`)

Simple key-value pair display in a card format.

**Use Cases:**
- Quick entity overview
- Dashboard cards
- List item details

**Features:**
- Hover effects on rows
- Configurable spacing
- Compact layout

### 2. Detail View (`mode: 'detail'`)

Comprehensive view with collapsible field groups.

**Use Cases:**
- Full entity details
- Settings pages
- Configuration forms

**Features:**
- Multiple field groups
- Collapsible sections
- Grid, horizontal, or vertical layouts
- Group descriptions

### 3. Summary View (`mode: 'summary'`)

Prominent display of key metrics with secondary information.

**Use Cases:**
- Dashboard metrics
- KPI displays
- Performance summaries

**Features:**
- Large primary fields (first 3)
- Compact secondary fields as badges
- Responsive grid layout

### 4. Timeline View (`mode: 'timeline'`)

Visual timeline with chronological field groups.

**Use Cases:**
- Activity history
- Order tracking
- Audit logs
- Status progression

**Features:**
- Visual timeline line
- Animated dots with rings
- Icon support per group
- Chronological organization

## Pre-configured Variations

### User Profile

```tsx
import { userProfileVariation } from '@/components/entityManager/EntityView/variations'

<EntityView config={userProfileVariation} data={userData} />
```

**Includes:**
- Personal Information (name, email, phone, address)
- Account Details (username, role, status, dates)
- Permissions (collapsed by default)

### Product Details

```tsx
import { productDetailsVariation } from '@/components/entityManager/EntityView/variations'

<EntityView config={productDetailsVariation} data={productData} />
```

**Includes:**
- Basic product info (name, SKU, category, brand)
- Pricing & stock
- Customer ratings
- Features and description (collapsible)

### Order View

```tsx
import { orderViewVariation } from '@/components/entityManager/EntityView/variations'

<EntityView config={orderViewVariation} data={orderData} />
```

**Includes:**
- Order summary
- Customer information
- Shipping details with tracking
- Payment information
- Order totals breakdown

### Invoice View

```tsx
import { invoiceViewVariation } from '@/components/entityManager/EntityView/variations'

<EntityView config={invoiceViewVariation} data={invoiceData} />
```

**Includes:**
- Invoice header (number, dates)
- Bill to/from information
- Amount breakdown
- Payment status and details
- Terms & conditions (collapsible)

### Dashboard Summary

```tsx
import { dashboardSummaryVariation } from '@/components/entityManager/EntityView/variations'

<EntityView config={dashboardSummaryVariation} data={dashboardData} />
```

**Includes:**
- Key metrics (revenue, users, growth)
- Secondary metrics (status, projects, completion rate)
- Icon support for visual clarity

## Configuration Options

### EntityViewConfig

```typescript
interface EntityViewConfig {
  // View mode and layout
  mode?: 'card' | 'detail' | 'summary' | 'timeline'
  layout?: 'single' | 'grid' | 'masonry' | 'list' | 'tabs' | 'accordion'
  theme?: 'default' | 'minimal' | 'card' | 'bordered' | 'flat'

  // Data display
  fields?: ViewField[]
  fieldGroups?: ViewFieldGroup[]
  
  // Display options
  showHeader?: boolean
  showActions?: boolean
  showMetadata?: boolean
  showNavigation?: boolean
  compact?: boolean

  // Actions (use entityActions for EntityActions integration)
  actions?: ViewAction[] // Legacy support
  entityActions?: EntityActionsConfig // New EntityActions config
  
  // Navigation
  navigation?: {
    prev?: () => void | Promise<void>
    next?: () => void | Promise<void>
    canGoPrev?: boolean
    canGoNext?: boolean
  }

  // Styling
  className?: string
  fieldSpacing?: 'sm' | 'md' | 'lg'
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}
```

### ViewField

```typescript
interface ViewField {
  key: string
  label: string
  type?: 'text' | 'number' | 'date' | 'currency' | 'email' | 'phone' | 'url' | 'image' | 'avatar' | 'badge' | 'tags' | 'json' | 'markdown' | 'html'
  
  // Display options
  width?: number | string
  align?: 'left' | 'center' | 'right'
  bold?: boolean
  italic?: boolean
  
  // Advanced features
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  icon?: React.ComponentType
  badge?: boolean
  condition?: (data: unknown) => boolean
  format?: (value: unknown, data: unknown) => React.ReactNode
  render?: (value: unknown, data: unknown) => React.ReactNode
}
```

### ViewFieldGroup

```typescript
interface ViewFieldGroup {
  id: string
  title?: string
  description?: string
  fields: ViewField[]
  collapsed?: boolean
  collapsible?: boolean
  layout?: 'vertical' | 'horizontal' | 'grid'
  columns?: number
  className?: string
}
```

## EntityActions Integration

EntityView fully supports the EntityActions system for unified action handling:

```tsx
import { EntityActionsConfig } from '@/components/entityManager/EntityActions/types'

const actions: EntityActionsConfig = {
  modalActions: [
    {
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      action: 'edit-entity',
    },
  ],
  drawerActions: [
    {
      id: 'history',
      label: 'View History',
      icon: History,
      action: 'view-history',
    },
  ],
}

<EntityView
  config={userProfileVariation}
  data={userData}
  config={{ ...userProfileVariation, entityActions: actions }}
/>
```

## Field Types

EntityView supports 15+ field types:

- **text**: Plain text display
- **number**: Formatted numbers with locale support
- **currency**: Formatted currency values
- **percentage**: Percentage values with % suffix
- **date/datetime**: Formatted dates and timestamps
- **email**: Mailto links
- **phone**: Tel links
- **url**: External links
- **image**: Image display
- **avatar**: Avatar with initials
- **badge**: Badge/chip display
- **tags**: Multiple tags/badges
- **json**: Formatted JSON display
- **markdown**: Markdown rendering
- **html**: HTML rendering
- **boolean**: Yes/No display

## Customization

### Custom Field Rendering

```tsx
const field = {
  key: 'status',
  label: 'Status',
  render: (value, data) => (
    <Badge variant={value === 'active' ? 'success' : 'secondary'}>
      {value}
    </Badge>
  ),
}
```

### Conditional Fields

```tsx
const field = {
  key: 'discount',
  label: 'Discount',
  type: 'currency',
  condition: (data) => Boolean(data.discount && data.discount > 0),
}
```

### Field Formatting

```tsx
const field = {
  key: 'price',
  label: 'Price',
  type: 'currency',
  format: (value, data) => {
    const discount = data.discount || 0
    return `$${(value - discount).toFixed(2)}`
  },
}
```

## Folder Structure

```
EntityView/
├── index.tsx                  # Main component
├── types.ts                   # Type definitions
├── components/                # Reusable components
│   ├── FieldRenderer.tsx      # Field rendering logic
│   ├── ViewActions.tsx        # Action buttons
│   └── ViewHeader.tsx         # Header component
├── views/                     # View mode components
│   ├── CardView.tsx
│   ├── DetailView.tsx
│   ├── SummaryView.tsx
│   └── TimelineView.tsx
├── variations/                # Pre-configured setups
│   ├── userProfile.ts
│   ├── productDetails.ts
│   ├── orderView.ts
│   ├── invoiceView.ts
│   ├── dashboardSummary.ts
│   └── README.md
└── examples/                  # Usage examples
    ├── VariationsExample.tsx
    └── index.tsx
```

## Examples

Check out the examples in:
- `components/entityManager/EntityView/examples/VariationsExample.tsx` - Showcases all pre-configured variations
- `components/entityManager/EntityView/examples/index.tsx` - Comprehensive usage examples

## Dark Mode

All views and variations automatically support dark mode through Tailwind CSS classes.

## Mobile Responsive

EntityView is fully responsive and optimized for mobile devices with:
- Adaptive layouts
- Touch-friendly controls
- Mobile-optimized spacing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## TypeScript

Full TypeScript support with comprehensive type definitions. All props, configs, and return types are fully typed.

## License

Part of the MyLandlord-Frontend project.
