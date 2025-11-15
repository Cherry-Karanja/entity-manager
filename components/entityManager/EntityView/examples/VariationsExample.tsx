'use client'

import React from 'react'
import { EntityView } from '../index'
import {
  userProfileVariation,
  productDetailsVariation,
  orderViewVariation,
  invoiceViewVariation,
  dashboardSummaryVariation,
} from '../variations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Sample data for each variation
const userData = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main St, New York, NY 10001',
  username: 'johndoe',
  role: 'Administrator',
  status: 'Active',
  joinedDate: new Date('2023-01-15'),
  lastLogin: new Date('2025-10-29'),
  permissions: ['users:read', 'users:write', 'settings:read'],
}

const productData = {
  id: 2,
  name: 'Premium Wireless Headphones',
  sku: 'WH-1000XM5',
  category: 'Electronics',
  brand: 'Sony',
  price: 399.99,
  discountPrice: 349.99,
  stock: 45,
  rating: 4.8,
  reviews: 1247,
  description: 'Industry-leading noise canceling with Dual Noise Sensor technology',
  features: ['30hr battery life', 'Quick charging', 'Multipoint connection', 'Touch controls'],
  tags: ['wireless', 'noise-canceling', 'premium', 'bluetooth'],
}

const orderData = {
  id: 3,
  orderNumber: 'ORD-2025-10-30-001',
  orderDate: new Date('2025-10-30'),
  status: 'Processing',
  customerName: 'Jane Smith',
  customerEmail: 'jane.smith@example.com',
  customerPhone: '+1 (555) 987-6543',
  shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
  shippingMethod: 'Express Shipping (2-3 days)',
  trackingNumber: '1Z999AA1234567890',
  paymentMethod: 'Credit Card (****4242)',
  paymentStatus: 'Paid',
  subtotal: 299.98,
  shipping: 15.00,
  tax: 26.25,
  total: 341.23,
  notes: 'Please deliver after 5 PM',
}

const invoiceData = {
  id: 4,
  invoiceNumber: 'INV-2025-001234',
  invoiceDate: new Date('2025-10-30'),
  dueDate: new Date('2025-11-29'),
  billTo: 'Acme Corporation\n789 Business Blvd\nChicago, IL 60601',
  billFrom: 'Tech Solutions Inc.\n321 Tech Park\nSan Francisco, CA 94102',
  subtotal: 5000.00,
  tax: 450.00,
  discount: 250.00,
  total: 5200.00,
  paymentStatus: 'Paid',
  paymentMethod: 'Wire Transfer',
  paidDate: new Date('2025-10-28'),
  amountPaid: 5200.00,
  notes: 'Thank you for your business!',
  terms: 'Payment due within 30 days. Late payments subject to 1.5% monthly interest.',
}

const dashboardData = {
  id: 5,
  revenue: 125750.50,
  users: 1543,
  growth: 23.5,
  status: 'Healthy',
  lastUpdated: new Date('2025-10-30'),
  activeProjects: 12,
  completionRate: 87.5,
}

export default function VariationsExample() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">EntityView Variations</h1>
        <p className="text-muted-foreground">
          Pre-configured EntityView variations for common use cases. Each variation is optimized for specific data types and use cases.
        </p>
      </div>

      <Tabs defaultValue="user-profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="user-profile">User Profile</TabsTrigger>
          <TabsTrigger value="product">Product</TabsTrigger>
          <TabsTrigger value="order">Order</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="user-profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Profile Variation</CardTitle>
              <CardDescription>
                Displays user account information with organized field groups for personal details, account info, and permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EntityView
                config={userProfileVariation}
                data={userData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="product" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Details Variation</CardTitle>
              <CardDescription>
                Perfect for e-commerce product pages with pricing, inventory, ratings, and detailed features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EntityView
                config={productDetailsVariation}
                data={productData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="order" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order View Variation</CardTitle>
              <CardDescription>
                Complete order management interface with customer info, shipping details, payment info, and totals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EntityView
                config={orderViewVariation}
                data={orderData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice View Variation</CardTitle>
              <CardDescription>
                Professional invoice display with billing parties, amount breakdown, and payment tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EntityView
                config={invoiceViewVariation}
                data={invoiceData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Summary Variation</CardTitle>
              <CardDescription>
                Dashboard metrics display with prominent key performance indicators and secondary information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EntityView
                config={dashboardSummaryVariation}
                data={dashboardData}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
