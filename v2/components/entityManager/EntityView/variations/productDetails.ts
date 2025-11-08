import { Package, DollarSign, Star, Tag, Box, TrendingUp } from 'lucide-react'
import { EntityViewConfig } from '../types'

export const productDetailsVariation: EntityViewConfig = {
  mode: 'detail',
  layout: 'single',
  theme: 'card',
  showHeader: true,
  showActions: true,
  fieldSpacing: 'lg',
  
  fieldGroups: [
    {
      id: 'basic-info',
      title: 'Product Information',
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'name',
          label: 'Product Name',
          type: 'text',
          icon: Package,
          bold: true,
        },
        {
          key: 'sku',
          label: 'SKU',
          type: 'text',
          icon: Tag,
        },
        {
          key: 'category',
          label: 'Category',
          type: 'badge',
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
      title: 'Pricing & Stock',
      layout: 'grid',
      columns: 3,
      fields: [
        {
          key: 'price',
          label: 'Price',
          type: 'currency',
          icon: DollarSign,
        },
        {
          key: 'discountPrice',
          label: 'Sale Price',
          type: 'currency',
          icon: DollarSign,
          condition: (data: unknown): boolean => {
            return Boolean(data && typeof data === 'object' && 'discountPrice' in data && data.discountPrice !== null)
          },
        },
        {
          key: 'stock',
          label: 'In Stock',
          type: 'number',
          icon: Box,
        },
      ],
    },
    {
      id: 'ratings',
      title: 'Customer Feedback',
      layout: 'horizontal',
      fields: [
        {
          key: 'rating',
          label: 'Rating',
          type: 'number',
          icon: Star,
          suffix: '/ 5.0',
        },
        {
          key: 'reviews',
          label: 'Reviews',
          type: 'number',
          suffix: 'reviews',
        },
      ],
    },
    {
      id: 'details',
      title: 'Additional Details',
      collapsible: true,
      collapsed: false,
      layout: 'vertical',
      fields: [
        {
          key: 'description',
          label: 'Description',
          type: 'text',
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
      ],
    },
  ],
}

export default productDetailsVariation
