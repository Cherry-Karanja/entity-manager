# EntityView Variations

Pre-configured EntityView variations for common use cases. These variations provide ready-to-use configurations that you can import and apply directly to your EntityView components.

## Available Variations

### 1. User Profile (`userProfile`)

Perfect for displaying user account information with organized field groups.

**Features:**
- Personal information (name, email, phone, address)
- Account details (username, role, status)
- Permissions and activity tracking

**Usage:**
```tsx
import { EntityView } from '@/components/entityManager/EntityView'
import { userProfileVariation } from '@/components/entityManager/EntityView/variations'

<EntityView
  {...userProfileVariation}
  data={userData}
/>
```

### 2. Product Details (`productDetails`)

Designed for e-commerce product pages with pricing, inventory, and ratings.

**Features:**
- Basic product information (name, SKU, category, brand)
- Pricing and stock levels
- Customer ratings and reviews
- Collapsible detailed description and features

**Usage:**
```tsx
import { productDetailsVariation } from '@/components/entityManager/EntityView/variations'

<EntityView
  {...productDetailsVariation}
  data={productData}
/>
```

### 3. Order View (`orderView`)

Complete order management interface with customer, shipping, and payment details.

**Features:**
- Order summary (number, date, status)
- Customer information
- Shipping details with tracking
- Payment information
- Order totals breakdown
- Optional notes section

**Usage:**
```tsx
import { orderViewVariation } from '@/components/entityManager/EntityView/variations'

<EntityView
  {...orderViewVariation}
  data={orderData}
/>
```

### 4. Invoice View (`invoiceView`)

Professional invoice display with billing and payment tracking.

**Features:**
- Invoice header (number, dates)
- Bill to/from information
- Amount breakdown (subtotal, tax, discount)
- Payment status and details
- Terms and conditions section

**Usage:**
```tsx
import { invoiceViewVariation } from '@/components/entityManager/EntityView/variations'

<EntityView
  {...invoiceViewVariation}
  data={invoiceData}
/>
```

### 5. Dashboard Summary (`dashboardSummary`)

Dashboard metrics display with key performance indicators.

**Features:**
- Primary metrics (revenue, users, growth) in large format
- Secondary metrics as compact badges
- Icon support for visual clarity
- Optimized for at-a-glance viewing

**Usage:**
```tsx
import { dashboardSummaryVariation } from '@/components/entityManager/EntityView/variations'

<EntityView
  {...dashboardSummaryVariation}
  data={dashboardData}
/>
```

## Customizing Variations

You can extend any variation by spreading it and overriding specific properties:

```tsx
import { userProfileVariation } from '@/components/entityManager/EntityView/variations'

<EntityView
  {...userProfileVariation}
  data={userData}
  showActions={true}
  entityActions={customActions}
  fieldSpacing="lg"
/>
```

## Creating Custom Variations

Create your own variation by defining an `EntityViewConfig` object:

```tsx
import { EntityViewConfig } from '@/components/entityManager/EntityView/types'
import { User, Mail } from 'lucide-react'

export const customVariation: EntityViewConfig = {
  mode: 'detail',
  layout: 'single',
  theme: 'card',
  showHeader: true,
  
  fieldGroups: [
    {
      id: 'group-1',
      title: 'Group Title',
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'name',
          label: 'Name',
          type: 'text',
          icon: User,
        },
        {
          key: 'email',
          label: 'Email',
          type: 'email',
          icon: Mail,
        },
      ],
    },
  ],
}
```

## Integration with EntityActions

All variations support EntityActions configuration:

```tsx
import { EntityActionsConfig } from '@/components/entityManager/EntityActions/types'
import { userProfileVariation } from '@/components/entityManager/EntityView/variations'

const actions: EntityActionsConfig = {
  modalActions: [
    {
      id: 'edit',
      label: 'Edit Profile',
      icon: Edit,
      action: 'edit-profile',
    },
  ],
}

<EntityView
  {...userProfileVariation}
  data={userData}
  entityActions={actions}
/>
```

## Field Types Supported

All variations support these field types:
- `text`, `number`, `date`, `datetime`
- `currency`, `percentage`
- `email`, `phone`, `url`
- `image`, `avatar`
- `badge`, `tags`
- `json`, `markdown`, `html`
- `boolean`, `custom`

## Layout Options

Each variation can use different layouts:
- **Grid**: Multi-column responsive layout
- **Horizontal**: Inline fields with labels
- **Vertical**: Stacked field display

## Icons

Variations use [Lucide React](https://lucide.dev/) icons for visual enhancement. You can replace icons in your custom variations with any Lucide icon.

## Dark Mode

All variations automatically support dark mode through Tailwind CSS classes.
