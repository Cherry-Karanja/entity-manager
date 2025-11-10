import { TrendingUp, DollarSign, Users, Activity, Target, Calendar } from 'lucide-react'
import { EntityViewConfig } from '../types'

export const dashboardSummaryVariation: EntityViewConfig = {
  mode: 'summary',
  layout: 'single',
  theme: 'card',
  showHeader: true,
  showActions: false,
  fieldSpacing: 'lg',
  
  fieldGroups: [
    {
      id: 'primary-metrics',
      title: 'Key Metrics',
      layout: 'grid',
      columns: 3,
      fields: [
        {
          key: 'revenue',
          label: 'Total Revenue',
          type: 'currency',
          icon: DollarSign,
          bold: true,
        },
        {
          key: 'users',
          label: 'Active Users',
          type: 'number',
          icon: Users,
          bold: true,
        },
        {
          key: 'growth',
          label: 'Growth Rate',
          type: 'percentage',
          icon: TrendingUp,
          bold: true,
        },
      ],
    },
    {
      id: 'secondary-metrics',
      title: 'Additional Information',
      layout: 'horizontal',
      fields: [
        {
          key: 'status',
          label: 'Status',
          type: 'badge',
        },
        {
          key: 'lastUpdated',
          label: 'Last Updated',
          type: 'date',
          icon: Calendar,
        },
        {
          key: 'activeProjects',
          label: 'Active Projects',
          type: 'number',
          icon: Target,
        },
        {
          key: 'completionRate',
          label: 'Completion',
          type: 'percentage',
          icon: Activity,
        },
      ],
    },
  ],
}

export default dashboardSummaryVariation
