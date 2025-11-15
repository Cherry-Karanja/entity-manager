import { FileText, Building2, Calendar, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react'
import { EntityViewConfig } from '../types'
import { BaseEntity } from '../../manager/types'

export const invoiceViewVariation: EntityViewConfig<BaseEntity> = {
  mode: 'detail',
  layout: 'single',
  theme: 'card',
  showHeader: true,
  showActions: true,
  fieldSpacing: 'md',
  
  fieldGroups: [
    {
      id: 'invoice-header',
      title: 'Invoice Information',
      layout: 'grid',
      columns: 3,
      fields: [
        {
          key: 'invoiceNumber',
          label: 'Invoice #',
          type: 'text',
          icon: FileText,
          bold: true,
        },
        {
          key: 'invoiceDate',
          label: 'Invoice Date',
          type: 'date',
          icon: Calendar,
        },
        {
          key: 'dueDate',
          label: 'Due Date',
          type: 'date',
          icon: AlertCircle,
        },
      ],
    },
    {
      id: 'parties',
      title: 'Billing Information',
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'billTo',
          label: 'Bill To',
          type: 'text',
          icon: Building2,
        },
        {
          key: 'billFrom',
          label: 'Bill From',
          type: 'text',
          icon: Building2,
        },
      ],
    },
    {
      id: 'amounts',
      title: 'Amount Breakdown',
      layout: 'horizontal',
      fields: [
        {
          key: 'subtotal',
          label: 'Subtotal',
          type: 'currency',
          icon: DollarSign,
        },
        {
          key: 'tax',
          label: 'Tax',
          type: 'currency',
        },
        {
          key: 'discount',
          label: 'Discount',
          type: 'currency',
          condition: (data: unknown): boolean => {
            return Boolean(data && typeof data === 'object' && 'discount' in data && data.discount)
          },
        },
        {
          key: 'total',
          label: 'Total Amount',
          type: 'currency',
          bold: true,
        },
      ],
    },
    {
      id: 'payment-info',
      title: 'Payment Details',
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'paymentStatus',
          label: 'Payment Status',
          type: 'badge',
          icon: CheckCircle2,
        },
        {
          key: 'paymentMethod',
          label: 'Payment Method',
          type: 'text',
        },
        {
          key: 'paidDate',
          label: 'Paid Date',
          type: 'date',
          condition: (data: unknown): boolean => {
            return Boolean(data && typeof data === 'object' && 'paidDate' in data && data.paidDate)
          },
        },
        {
          key: 'amountPaid',
          label: 'Amount Paid',
          type: 'currency',
          condition: (data: unknown): boolean => {
            return Boolean(data && typeof data === 'object' && 'amountPaid' in data && data.amountPaid)
          },
        },
      ],
    },
    {
      id: 'notes',
      title: 'Additional Information',
      collapsible: true,
      collapsed: true,
      layout: 'vertical',
      fields: [
        {
          key: 'notes',
          label: 'Notes',
          type: 'text',
        },
        {
          key: 'terms',
          label: 'Terms & Conditions',
          type: 'text',
        },
      ],
    },
  ],
}

export default invoiceViewVariation
