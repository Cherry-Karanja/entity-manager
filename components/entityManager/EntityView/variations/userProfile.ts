import { User, Mail, Phone, MapPin, Calendar, Shield, Activity } from 'lucide-react'
import { EntityViewConfig } from '../types'
import { BaseEntity } from '../../manager/types'

export const userProfileVariation: EntityViewConfig<BaseEntity> = {
  mode: 'detail',
  layout: 'single',
  theme: 'card',
  showHeader: true,
  showActions: true,
  showMetadata: true,
  fieldSpacing: 'md',
  
  fieldGroups: [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Basic user details',
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'name',
          label: 'Full Name',
          type: 'text',
          icon: User,
          bold: true,
        },
        {
          key: 'email',
          label: 'Email Address',
          type: 'email',
          icon: Mail,
        },
        {
          key: 'phone',
          label: 'Phone Number',
          type: 'phone',
          icon: Phone,
        },
        {
          key: 'location',
          label: 'Location',
          type: 'text',
          icon: MapPin,
        },
      ],
    },
    {
      id: 'account-info',
      title: 'Account Information',
      description: 'User account details and status',
      layout: 'grid',
      columns: 2,
      fields: [
        {
          key: 'role',
          label: 'Role',
          type: 'badge',
          icon: Shield,
        },
        {
          key: 'status',
          label: 'Status',
          type: 'badge',
          icon: Activity,
        },
        {
          key: 'createdAt',
          label: 'Member Since',
          type: 'date',
          icon: Calendar,
        },
        {
          key: 'lastLogin',
          label: 'Last Login',
          type: 'datetime',
          icon: Calendar,
        },
      ],
    },
    {
      id: 'permissions',
      title: 'Permissions',
      description: 'User access rights',
      collapsed: true,
      collapsible: true,
      layout: 'vertical',
      fields: [
        {
          key: 'permissions',
          label: 'Access Rights',
          type: 'tags',
        },
      ],
    },
  ],
}

export default userProfileVariation
