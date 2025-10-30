import { EntityFormConfig } from '../types'
import { Package, User, Mail, Phone, MapPin, CreditCard, Calendar, Truck, FileText, DollarSign, Hash } from 'lucide-react'

/**
 * Pre-configured form for order management
 * Includes customer details, shipping, and order items
 */
export const orderFormVariation: EntityFormConfig = {
  mode: 'create',
  layout: 'grid',
  columns: 2,
  fieldSpacing: 'md',
  showProgress: true,
  enableBulkImport: true,
  
  fields: [
    // Order Information
    {
      name: 'orderNumber',
      label: 'Order Number',
      type: 'text',
      required: true,
      icon: Hash,
      placeholder: 'ORD-2024-0001',
      helpText: 'Unique order identifier',
      pattern: '^ORD-\\d{4}-\\d{4}$',
    },
    {
      name: 'orderDate',
      label: 'Order Date',
      type: 'datetime',
      required: true,
      icon: Calendar,
      helpText: 'Date and time the order was placed',
    },
    {
      name: 'status',
      label: 'Order Status',
      type: 'select',
      required: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      helpText: 'Current status of the order',
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'select',
      required: false,
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },

    // Customer Information
    {
      name: 'customerName',
      label: 'Customer Name',
      type: 'text',
      required: true,
      icon: User,
      placeholder: 'John Doe',
      minLength: 2,
      maxLength: 100,
    },
    {
      name: 'customerEmail',
      label: 'Customer Email',
      type: 'email',
      required: true,
      icon: Mail,
      placeholder: 'customer@example.com',
    },
    {
      name: 'customerPhone',
      label: 'Customer Phone',
      type: 'tel',
      required: true,
      icon: Phone,
      placeholder: '+1 (555) 000-0000',
      pattern: '^\\+?[1-9]\\d{1,14}$',
    },
    {
      name: 'customerNotes',
      label: 'Customer Notes',
      type: 'textarea',
      required: false,
      icon: FileText,
      placeholder: 'Any special instructions from customer...',
      maxLength: 500,
    },

    // Shipping Information
    {
      name: 'shippingAddress',
      label: 'Shipping Address',
      type: 'textarea',
      required: true,
      icon: MapPin,
      placeholder: '123 Main St, Apt 4B, City, State, ZIP',
      minLength: 10,
      maxLength: 200,
    },
    {
      name: 'shippingMethod',
      label: 'Shipping Method',
      type: 'select',
      required: true,
      icon: Truck,
      options: [
        { label: 'Standard (5-7 days)', value: 'standard' },
        { label: 'Express (2-3 days)', value: 'express' },
        { label: 'Overnight', value: 'overnight' },
        { label: 'International', value: 'international' },
      ],
    },
    {
      name: 'trackingNumber',
      label: 'Tracking Number',
      type: 'text',
      required: false,
      placeholder: '1Z999AA10123456784',
      helpText: 'Carrier tracking number (if shipped)',
    },
    {
      name: 'estimatedDelivery',
      label: 'Estimated Delivery',
      type: 'date',
      required: false,
      icon: Calendar,
      helpText: 'Expected delivery date',
    },

    // Order Details
    {
      name: 'items',
      label: 'Order Items',
      type: 'json',
      required: true,
      icon: Package,
      placeholder: '[\n  {\n    "productId": "123",\n    "name": "Product Name",\n    "quantity": 2,\n    "price": 29.99\n  }\n]',
      helpText: 'JSON array of order items with product details',
    },
    {
      name: 'subtotal',
      label: 'Subtotal',
      type: 'number',
      required: true,
      icon: DollarSign,
      placeholder: '0.00',
      min: 0,
      step: 0.01,
      helpText: 'Order subtotal before tax and shipping',
    },
    {
      name: 'tax',
      label: 'Tax Amount',
      type: 'number',
      required: true,
      icon: DollarSign,
      placeholder: '0.00',
      min: 0,
      step: 0.01,
    },
    {
      name: 'shippingCost',
      label: 'Shipping Cost',
      type: 'number',
      required: true,
      icon: DollarSign,
      placeholder: '0.00',
      min: 0,
      step: 0.01,
    },
    {
      name: 'total',
      label: 'Total Amount',
      type: 'number',
      required: true,
      icon: DollarSign,
      placeholder: '0.00',
      min: 0,
      step: 0.01,
      helpText: 'Total order amount including tax and shipping',
    },

    // Payment Information
    {
      name: 'paymentMethod',
      label: 'Payment Method',
      type: 'select',
      required: true,
      icon: CreditCard,
      options: [
        { label: 'Credit Card', value: 'credit_card' },
        { label: 'Debit Card', value: 'debit_card' },
        { label: 'PayPal', value: 'paypal' },
        { label: 'Bank Transfer', value: 'bank_transfer' },
        { label: 'Cash on Delivery', value: 'cod' },
      ],
    },
    {
      name: 'paymentStatus',
      label: 'Payment Status',
      type: 'select',
      required: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Authorized', value: 'authorized' },
        { label: 'Captured', value: 'captured' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'transactionId',
      label: 'Transaction ID',
      type: 'text',
      required: false,
      placeholder: 'txn_1234567890',
      helpText: 'Payment gateway transaction identifier',
    },

    // Additional Options
    {
      name: 'giftWrap',
      label: 'Gift Wrap',
      type: 'switch',
      required: false,
      helpText: 'Enable gift wrapping for this order',
    },
    {
      name: 'includeGiftMessage',
      label: 'Include Gift Message',
      type: 'switch',
      required: false,
      helpText: 'Include a gift message with the order',
    },
    {
      name: 'giftMessage',
      label: 'Gift Message',
      type: 'textarea',
      required: false,
      placeholder: 'Your personalized gift message...',
      maxLength: 200,
      condition: (values) => values.includeGiftMessage === true,
    },
    {
      name: 'internalNotes',
      label: 'Internal Notes',
      type: 'textarea',
      required: false,
      icon: FileText,
      placeholder: 'Internal notes for staff only...',
      maxLength: 1000,
      helpText: 'Notes visible only to staff members',
    },
  ],

  hooks: {
    onSubmitStart: (values: Record<string, unknown>) => {
      // Validate order number format
      if (typeof values.orderNumber === 'string' && !/^ORD-\d{4}-\d{4}$/.test(values.orderNumber)) {
        throw new Error('Order number must be in format ORD-YYYY-NNNN')
      }

      // Validate total calculation
      const subtotal = typeof values.subtotal === 'number' ? values.subtotal : 0
      const tax = typeof values.tax === 'number' ? values.tax : 0
      const shippingCost = typeof values.shippingCost === 'number' ? values.shippingCost : 0
      const total = typeof values.total === 'number' ? values.total : 0
      const calculatedTotal = subtotal + tax + shippingCost
      
      if (Math.abs(calculatedTotal - total) > 0.01) {
        throw new Error('Total must equal subtotal + tax + shipping')
      }

      // Validate items JSON
      if (typeof values.items === 'string' && values.items) {
        try {
          const items = JSON.parse(values.items)
          if (!Array.isArray(items) || items.length === 0) {
            throw new Error('Order must contain at least one item')
          }
        } catch (e) {
          if (e instanceof Error && e.message.includes('must contain')) {
            throw e
          }
          throw new Error('Invalid JSON format for order items')
        }
      }
    },
  },

  submitButtonText: 'Create Order',
  cancelButtonText: 'Cancel',
}

// Export with alias for consistency
export const createOrderForm = orderFormVariation
