'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import EntityView from '../index'
import {
  EntityViewConfig,
  ViewField,
  ViewAction,
  ViewFieldGroup,
} from '../types'

// ===== SAMPLE DATA =====

const sampleUserData = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://via.placeholder.com/150',
  role: 'Administrator',
  department: 'IT',
  status: 'active',
  createdAt: new Date('2023-01-15'),
  updatedAt: new Date('2024-01-15'),
  lastLogin: new Date('2024-01-14'),
  permissions: ['read', 'write', 'delete', 'admin'],
  profile: {
    bio: 'Experienced software developer with 10+ years in web development.',
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    location: 'San Francisco, CA',
  },
  stats: {
    projectsCompleted: 45,
    hoursWorked: 1200,
    rating: 4.8,
  },
}

const sampleProductData = {
  id: 'prod-001',
  name: 'Wireless Headphones',
  sku: 'WH-2024-BLK',
  category: 'Electronics',
  price: 199.99,
  discountPrice: 149.99,
  stock: 150,
  rating: 4.5,
  reviews: 128,
  brand: 'TechSound',
  description: 'High-quality wireless headphones with noise cancellation.',
  features: ['Noise Cancellation', '30hr Battery', 'Bluetooth 5.0'],
  images: ['https://via.placeholder.com/300x300'],
  tags: ['wireless', 'headphones', 'bluetooth'],
  availability: 'in-stock',
  warranty: '2 years',
}

// ===== BASIC VIEW EXAMPLE =====

const BasicViewExample: React.FC = () => {
  const config: EntityViewConfig = {
    mode: 'detail',
    layout: 'single',
    theme: 'default',
    showHeader: true,
    showActions: true,
    fieldGroups: [
      {
        id: 'basic-info',
        title: 'Basic Information',
        fields: [
          {
            key: 'name',
            label: 'Name',
            type: 'text',
          },
          {
            key: 'email',
            label: 'Email',
            type: 'email',
          },
          {
            key: 'phone',
            label: 'Phone',
            type: 'phone',
          },
          {
            key: 'role',
            label: 'Role',
            type: 'badge',
          },
        ],
      },
      {
        id: 'account-info',
        title: 'Account Information',
        fields: [
          {
            key: 'status',
            label: 'Status',
            type: 'badge',
            format: (value: unknown) => (
              <Badge variant={value === 'active' ? 'default' : 'secondary'}>
                {String(value).toUpperCase()}
              </Badge>
            ),
          },
          {
            key: 'createdAt',
            label: 'Created',
            type: 'datetime',
          },
          {
            key: 'lastLogin',
            label: 'Last Login',
            type: 'datetime',
          },
        ],
      },
    ],
    actions: [
      {
        id: 'edit',
        label: 'Edit',
        variant: 'outline',
        onClick: () => alert('Edit clicked'),
      },
      {
        id: 'delete',
        label: 'Delete',
        variant: 'destructive',
        onClick: () => alert('Delete clicked'),
      },
    ],
  }

  return (
    <EntityView
      config={config}
      data={sampleUserData}
      onActionClick={(action: ViewAction, data: unknown) => {
        console.log('Action clicked:', action.id, data)
      }}
    />
  )
}

// ===== CARD VIEW EXAMPLE =====

const CardViewExample: React.FC = () => {
  const config: EntityViewConfig = {
    mode: 'card',
    theme: 'card',
    showHeader: true,
    showActions: true,
    fields: [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        bold: true,
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
      },
      {
        key: 'role',
        label: 'Role',
        type: 'badge',
      },
      {
        key: 'status',
        label: 'Status',
        type: 'badge',
        format: (value: unknown) => (
          <Badge variant={value === 'active' ? 'default' : 'secondary'}>
            {String(value).toUpperCase()}
          </Badge>
        ),
      },
      {
        key: 'department',
        label: 'Department',
        type: 'text',
      },
    ],
    actions: [
      {
        id: 'view',
        label: 'View Details',
        variant: 'default',
      },
      {
        id: 'edit',
        label: 'Edit',
        variant: 'outline',
      },
    ],
  }

  return (
    <EntityView
      config={config}
      data={sampleUserData}
    />
  )
}

// ===== ADVANCED VIEW EXAMPLE =====

const AdvancedViewExample: React.FC = () => {
  const config: EntityViewConfig = {
    mode: 'detail',
    layout: 'single',
    theme: 'default',
    showHeader: true,
    showActions: true,
    showMetadata: true,
    fieldGroups: [
      {
        id: 'personal-info',
        title: 'Personal Information',
        layout: 'grid',
        columns: 2,
        fields: [
          {
            key: 'name',
            label: 'Full Name',
            type: 'text',
            prefix: '👤',
          },
          {
            key: 'email',
            label: 'Email Address',
            type: 'email',
            prefix: '📧',
          },
          {
            key: 'phone',
            label: 'Phone Number',
            type: 'phone',
            prefix: '📱',
          },
          {
            key: 'profile.location',
            label: 'Location',
            type: 'text',
            prefix: '📍',
          },
        ],
      },
      {
        id: 'professional-info',
        title: 'Professional Information',
        collapsible: true,
        fields: [
          {
            key: 'role',
            label: 'Role',
            type: 'badge',
            suffix: 'position',
          },
          {
            key: 'department',
            label: 'Department',
            type: 'text',
          },
          {
            key: 'profile.skills',
            label: 'Skills',
            type: 'tags',
            format: (value: unknown) => Array.isArray(value) ? value : [],
          },
          {
            key: 'profile.bio',
            label: 'Bio',
            type: 'text',
            render: (value: unknown) => (
              <div className="max-w-md">
                {String(value)}
              </div>
            ),
          },
        ],
      },
      {
        id: 'stats',
        title: 'Statistics',
        layout: 'horizontal',
        fields: [
          {
            key: 'stats.projectsCompleted',
            label: 'Projects Completed',
            type: 'number',
            suffix: 'projects',
          },
          {
            key: 'stats.hoursWorked',
            label: 'Hours Worked',
            type: 'number',
            suffix: 'hours',
          },
          {
            key: 'stats.rating',
            label: 'Rating',
            type: 'number',
            suffix: '/5',
            format: (value: unknown) => `${value} ⭐`,
          },
        ],
      },
    ],
    actions: [
      {
        id: 'edit-profile',
        label: 'Edit Profile',
        variant: 'default',
        icon: () => '✏️',
      },
      {
        id: 'view-projects',
        label: 'View Projects',
        variant: 'outline',
        icon: () => '📁',
      },
      {
        id: 'send-message',
        label: 'Send Message',
        variant: 'outline',
        icon: () => '💬',
      },
    ],
    customComponents: {
      metadata: ({ data }: { data: unknown }) => (
        <div className="text-sm text-muted-foreground space-y-1">
          <div>Created: {(data as any)?.createdAt?.toLocaleDateString()}</div>
          <div>Last Updated: {(data as any)?.updatedAt?.toLocaleDateString()}</div>
          <div>Last Login: {(data as any)?.lastLogin?.toLocaleDateString()}</div>
        </div>
      ),
    },
  }

  return (
    <EntityView
      config={config}
      data={sampleUserData}
    />
  )
}

// ===== PRODUCT VIEW EXAMPLE =====

const ProductViewExample: React.FC = () => {
  const config: EntityViewConfig = {
    mode: 'detail',
    layout: 'single',
    theme: 'card',
    showHeader: true,
    showActions: true,
    fieldGroups: [
      {
        id: 'product-info',
        title: 'Product Information',
        layout: 'grid',
        columns: 2,
        fields: [
          {
            key: 'name',
            label: 'Product Name',
            type: 'text',
            bold: true,
          },
          {
            key: 'sku',
            label: 'SKU',
            type: 'text',
            badge: true,
          },
          {
            key: 'category',
            label: 'Category',
            type: 'text',
          },
          {
            key: 'brand',
            label: 'Brand',
            type: 'text',
          },
        ],
      },
      {
        id: 'pricing',
        title: 'Pricing & Inventory',
        layout: 'horizontal',
        fields: [
          {
            key: 'price',
            label: 'Original Price',
            type: 'currency',
          },
          {
            key: 'discountPrice',
            label: 'Discount Price',
            type: 'currency',
            format: (value: unknown, data: unknown) => {
              const originalPrice = (data as any)?.price
              const discountPrice = value as number
              const discount = originalPrice && discountPrice
                ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
                : 0

              return (
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">
                    ${discountPrice?.toFixed(2)}
                  </span>
                  {discount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      -{discount}%
                    </Badge>
                  )}
                </div>
              )
            },
          },
          {
            key: 'stock',
            label: 'Stock',
            type: 'number',
            format: (value: unknown) => {
              const stock = value as number
              return (
                <Badge variant={stock > 50 ? 'default' : stock > 10 ? 'secondary' : 'destructive'}>
                  {stock} in stock
                </Badge>
              )
            },
          },
        ],
      },
      {
        id: 'details',
        title: 'Product Details',
        fields: [
          {
            key: 'description',
            label: 'Description',
            type: 'text',
            render: (value: unknown) => (
              <div className="max-w-lg">
                {String(value)}
              </div>
            ),
          },
          {
            key: 'features',
            label: 'Features',
            type: 'tags',
          },
          {
            key: 'tags',
            label: 'Tags',
            type: 'tags',
          },
          {
            key: 'rating',
            label: 'Rating',
            type: 'number',
            suffix: '/5 ⭐',
            format: (value: unknown, data: unknown) => {
              const rating = value as number
              const reviews = (data as any)?.reviews || 0
              return `${rating} ⭐ (${reviews} reviews)`
            },
          },
        ],
      },
    ],
    actions: [
      {
        id: 'add-to-cart',
        label: 'Add to Cart',
        variant: 'default',
        icon: () => '🛒',
      },
      {
        id: 'buy-now',
        label: 'Buy Now',
        variant: 'default',
        icon: () => '⚡',
      },
      {
        id: 'add-to-wishlist',
        label: 'Add to Wishlist',
        variant: 'outline',
        icon: () => '❤️',
      },
    ],
  }

  return (
    <EntityView
      config={config}
      data={sampleProductData}
    />
  )
}

// ===== CONDITIONAL FIELDS EXAMPLE =====

const ConditionalFieldsExample: React.FC = () => {
  const config: EntityViewConfig = {
    mode: 'detail',
    layout: 'single',
    theme: 'default',
    showHeader: true,
    showActions: true,
    fieldGroups: [
      {
        id: 'user-info',
        title: 'User Information',
        fields: [
          {
            key: 'name',
            label: 'Name',
            type: 'text',
          },
          {
            key: 'role',
            label: 'Role',
            type: 'text',
          },
          {
            key: 'department',
            label: 'Department',
            type: 'text',
            condition: (data: unknown) => (data as any)?.role !== 'Guest',
          },
          {
            key: 'permissions',
            label: 'Permissions',
            type: 'tags',
            condition: (data: unknown) => (data as any)?.role === 'Administrator',
          },
          {
            key: 'profile.bio',
            label: 'Bio',
            type: 'text',
            condition: (data: unknown) => Boolean((data as any)?.profile?.bio),
          },
        ],
      },
    ],
    actions: [
      {
        id: 'promote',
        label: 'Promote',
        variant: 'default',
        condition: (data: unknown) => (data as any)?.role !== 'Administrator',
      },
      {
        id: 'demote',
        label: 'Demote',
        variant: 'outline',
        condition: (data: unknown) => (data as any)?.role === 'Administrator',
      },
    ],
  }

  return (
    <EntityView
      config={config}
      data={sampleUserData}
    />
  )
}

// ===== MAIN EXAMPLES COMPONENT =====

const EntityViewExamples: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">EntityView Examples</h1>
        <p className="text-muted-foreground">
          Comprehensive examples demonstrating the EntityView component with various configurations,
          view modes, and use cases.
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic View</TabsTrigger>
          <TabsTrigger value="card">Card View</TabsTrigger>
          <TabsTrigger value="advanced">Advanced View</TabsTrigger>
          <TabsTrigger value="product">Product View</TabsTrigger>
          <TabsTrigger value="conditional">Conditional Fields</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic EntityView</CardTitle>
              <p className="text-sm text-muted-foreground">
                Simple detail view with grouped fields and basic actions.
              </p>
            </CardHeader>
            <CardContent>
              <BasicViewExample />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="card" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Card View</CardTitle>
              <p className="text-sm text-muted-foreground">
                Compact card layout showing key information at a glance.
              </p>
            </CardHeader>
            <CardContent>
              <CardViewExample />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced View</CardTitle>
              <p className="text-sm text-muted-foreground">
                Complex view with collapsible groups, custom formatting, metadata, and rich interactions.
              </p>
            </CardHeader>
            <CardContent>
              <AdvancedViewExample />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="product" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product View</CardTitle>
              <p className="text-sm text-muted-foreground">
                E-commerce style product display with pricing, inventory, and purchase actions.
              </p>
            </CardHeader>
            <CardContent>
              <ProductViewExample />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conditional Fields</CardTitle>
              <p className="text-sm text-muted-foreground">
                Dynamic field visibility based on data conditions and role-based actions.
              </p>
            </CardHeader>
            <CardContent>
              <ConditionalFieldsExample />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EntityViewExamples