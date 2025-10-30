import React, { useState } from 'react'
import { EntityForm } from '../index'
import { userFormVariation } from '../variations/userForm'
import { productFormVariation } from '../variations/productForm'
import { orderFormVariation } from '../variations/orderForm'
import { settingsFormVariation } from '../variations/settingsForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

/**
 * EntityForm Variations Example
 * Demonstrates all pre-configured form variations
 */
export function VariationsExample() {
  const [submitResults, setSubmitResults] = useState<Record<string, string>>({})

  const handleUserSubmit = async (data: Record<string, unknown>) => {
    console.log('User form submitted:', data)
    setSubmitResults({ user: 'User created successfully!' })
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleProductSubmit = async (data: Record<string, unknown>) => {
    console.log('Product form submitted:', data)
    setSubmitResults({ product: 'Product created successfully!' })
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleOrderSubmit = async (data: Record<string, unknown>) => {
    console.log('Order form submitted:', data)
    setSubmitResults({ order: 'Order created successfully!' })
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleSettingsSubmit = async (data: Record<string, unknown>) => {
    console.log('Settings saved:', data)
    setSubmitResults({ settings: 'Settings saved successfully!' })
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleCancel = () => {
    console.log('Form cancelled')
  }

  const handleBulkImport = async (data: Record<string, unknown>[]) => {
    console.log('Bulk import data:', data)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">EntityForm Variations</h1>
        <p className="text-muted-foreground">
          Pre-configured form variations for common use cases. Each variation includes appropriate fields,
          validation rules, and layout configurations.
        </p>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          These variations can be used directly or customized by spreading the configuration and
          overriding specific properties.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="user" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="user">User Form</TabsTrigger>
          <TabsTrigger value="product">Product Form</TabsTrigger>
          <TabsTrigger value="order">Order Form</TabsTrigger>
          <TabsTrigger value="settings">Settings Form</TabsTrigger>
        </TabsList>

        {/* User Form Variation */}
        <TabsContent value="user" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Account Form</CardTitle>
              <CardDescription>
                Create new user accounts with validation for email, phone, username, and password requirements.
                Features 12 fields including role selection, status, and account settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitResults.user && (
                <Alert className="mb-4">
                  <AlertDescription>{submitResults.user}</AlertDescription>
                </Alert>
              )}
              <EntityForm
                config={{
                  ...userFormVariation,
                  onSubmit: handleUserSubmit,
                  onCancel: handleCancel,
                  onBulkImport: handleBulkImport,
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Example</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { EntityForm } from '@/components/entityManager/EntityForm'
import { userFormVariation } from '@/components/entityManager/EntityForm/variations'

function CreateUserPage() {
  const handleSubmit = async (data) => {
    // Create user via API
    await api.createUser(data)
  }

  return (
    <EntityForm
      config={{
        ...userFormVariation,
        onSubmit: handleSubmit,
        initialData: { role: 'user', status: 'active' }
      }}
    />
  )
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Form Variation */}
        <TabsContent value="product" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Management Form</CardTitle>
              <CardDescription>
                Create and manage products with comprehensive fields for e-commerce. Includes pricing,
                inventory, descriptions, features, tags, and product specifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitResults.product && (
                <Alert className="mb-4">
                  <AlertDescription>{submitResults.product}</AlertDescription>
                </Alert>
              )}
              <EntityForm
                config={{
                  ...productFormVariation,
                  onSubmit: handleProductSubmit,
                  onCancel: handleCancel,
                  onBulkImport: handleBulkImport,
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Example</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { EntityForm } from '@/components/entityManager/EntityForm'
import { productFormVariation } from '@/components/entityManager/EntityForm/variations'

function CreateProductPage() {
  const handleSubmit = async (data) => {
    // Create product via API
    await api.createProduct(data)
  }

  return (
    <EntityForm
      config={{
        ...productFormVariation,
        onSubmit: handleSubmit,
        initialData: { 
          status: 'draft',
          featured: false,
          allowReviews: true
        }
      }}
    />
  )
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Order Form Variation */}
        <TabsContent value="order" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Management Form</CardTitle>
              <CardDescription>
                Complete order form with customer information, shipping details, order items, pricing,
                and payment information. Includes validation for totals and order items.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitResults.order && (
                <Alert className="mb-4">
                  <AlertDescription>{submitResults.order}</AlertDescription>
                </Alert>
              )}
              <EntityForm
                config={{
                  ...orderFormVariation,
                  onSubmit: handleOrderSubmit,
                  onCancel: handleCancel,
                  initialData: {
                    orderDate: new Date().toISOString(),
                    status: 'pending',
                    priority: 'normal',
                    paymentStatus: 'pending',
                    giftWrap: false,
                    includeGiftMessage: false,
                  },
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Example</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { EntityForm } from '@/components/entityManager/EntityForm'
import { orderFormVariation } from '@/components/entityManager/EntityForm/variations'

function CreateOrderPage() {
  const handleSubmit = async (data) => {
    // Create order via API
    await api.createOrder(data)
  }

  return (
    <EntityForm
      config={{
        ...orderFormVariation,
        onSubmit: handleSubmit,
        initialData: {
          orderDate: new Date().toISOString(),
          status: 'pending',
          paymentStatus: 'pending'
        }
      }}
    />
  )
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Form Variation */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings Form</CardTitle>
              <CardDescription>
                Comprehensive settings form with sections for general, appearance, security, notifications,
                privacy, performance, and maintenance. Features conditional fields and extensive options.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitResults.settings && (
                <Alert className="mb-4">
                  <AlertDescription>{submitResults.settings}</AlertDescription>
                </Alert>
              )}
              <EntityForm
                config={{
                  ...settingsFormVariation,
                  onSubmit: handleSettingsSubmit,
                  onCancel: handleCancel,
                  initialData: {
                    siteName: 'My Application',
                    language: 'en',
                    timezone: 'UTC',
                    theme: 'auto',
                    compactMode: false,
                    showAnimations: true,
                    enableTwoFactor: false,
                    sessionTimeout: 30,
                    passwordMinLength: 8,
                    requirePasswordComplexity: true,
                    enableEmailNotifications: false,
                    enablePushNotifications: true,
                    dataRetentionDays: 90,
                    enableAnalytics: false,
                    shareDataWithPartners: false,
                    enableCaching: true,
                    enableCompression: true,
                    maxUploadSize: 10,
                    allowRegistration: true,
                    maintenanceMode: false,
                  },
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Example</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { EntityForm } from '@/components/entityManager/EntityForm'
import { settingsFormVariation } from '@/components/entityManager/EntityForm/variations'

function SettingsPage() {
  const [settings, setSettings] = useState(currentSettings)

  const handleSubmit = async (data) => {
    // Save settings via API
    await api.updateSettings(data)
    setSettings(data)
  }

  return (
    <EntityForm
      config={{
        ...settingsFormVariation,
        onSubmit: handleSubmit,
        initialData: settings
      }}
    />
  )
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Customization Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Customizing Variations</CardTitle>
          <CardDescription>
            All variations can be customized by spreading the configuration and overriding properties
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Adding Fields</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`const customUserForm = {
  ...userFormVariation,
  fields: [
    ...userFormVariation.fields,
    {
      name: 'customField',
      label: 'Custom Field',
      type: 'text',
      required: false
    }
  ]
}`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Modifying Layout</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`const singleColumnForm = {
  ...productFormVariation,
  layout: 'vertical',
  columns: 1
}`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Filtering Fields</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`const simplifiedForm = {
  ...userFormVariation,
  fields: userFormVariation.fields.filter(
    field => ['name', 'email', 'role'].includes(field.name)
  )
}`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Changing Validation</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`const customValidationForm = {
  ...orderFormVariation,
  fields: orderFormVariation.fields.map(field =>
    field.name === 'customerEmail'
      ? { ...field, required: false }
      : field
  )
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VariationsExample
