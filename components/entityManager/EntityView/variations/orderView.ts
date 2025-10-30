import { ShoppingCart, User, MapPin, CreditCard, Truck, Calendar, DollarSign } from 'lucide-react'
import { EntityViewConfig } from '../types'

export const orderViewVariation: EntityViewConfig = {
  mode: 'detail',
  layout: 'single',
  theme: 'card',
  showHeader: true,
  showActions: true,
  fieldSpacing: 'md',
  
  fieldGroups: [
    {
      id: 'order-summary',
      title: 'Order Summary',
      layout: 'grid',
      columns: 3,
      fields: [
        {
          key: 'orderNumber',
          label: 'Order #',
          type: 'text',
          icon: ShoppingCart,
          bold: true,
        },
        {
          key: 'orderDate',
          label: 'Order Date',
          type: 'date',
          icon: Calendar,
        },
        {
          key: 'status',
          label: 'Status',
          type: 'badge',
        },
      ],
    },
    {
      id: 'customer-info',
      title: 'Customer Information',
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'customerName',
          label: 'Customer',
          type: 'text',
          icon: User,
        },
        {
          key: 'customerEmail',
          label: 'Email',
          type: 'email',
        },
        {
          key: 'customerPhone',
          label: 'Phone',
          type: 'phone',
        },
      ],
    },
    {
      id: 'shipping',
      title: 'Shipping Details',
      layout: 'vertical',
      fields: [
        {
          key: 'shippingAddress',
          label: 'Shipping Address',
          type: 'text',
          icon: MapPin,
        },
        {
          key: 'shippingMethod',
          label: 'Shipping Method',
          type: 'text',
          icon: Truck,
        },
        {
          key: 'trackingNumber',
          label: 'Tracking Number',
          type: 'text',
          condition: (data: unknown): boolean => {
            return Boolean(data && typeof data === 'object' && 'trackingNumber' in data && data.trackingNumber)
          },
        },
      ],
    },
    {
      id: 'payment',
      title: 'Payment Information',
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'paymentMethod',
          label: 'Payment Method',
          type: 'text',
          icon: CreditCard,
        },
        {
          key: 'paymentStatus',
          label: 'Payment Status',
          type: 'badge',
        },
      ],
    },
    {
      id: 'totals',
      title: 'Order Totals',
      layout: 'horizontal',
      fields: [
        {
          key: 'subtotal',
          label: 'Subtotal',
          type: 'currency',
          icon: DollarSign,
        },
        {
          key: 'shipping',
          label: 'Shipping',
          type: 'currency',
        },
        {
          key: 'tax',
          label: 'Tax',
          type: 'currency',
        },
        {
          key: 'total',
          label: 'Total',
          type: 'currency',
          bold: true,
        },
      ],
    },
    {
      id: 'notes',
      title: 'Order Notes',
      collapsible: true,
      collapsed: true,
      layout: 'vertical',
      fields: [
        {
          key: 'notes',
          label: 'Notes',
          type: 'text',
        },
      ],
    },
  ],
}

export default orderViewVariation
