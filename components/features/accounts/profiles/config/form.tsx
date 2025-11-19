/**
 * UserProfile Form Configuration
 * 
 * Defines form layout and sections for profile management.
 */

import { FormLayout, FieldSection } from '@/components/entityManager/components/form/types';
import { User, Phone, Building2, Settings, Lock } from 'lucide-react';

export const profileFormLayout: FormLayout = 'vertical';

export const profileFormSections: FieldSection[] = [
  {
    id: 'basic',
    label: 'Profile Information',
    description: 'Avatar and biography',
    fields: ['avatar', 'bio'],
    icon: <User className="h-4 w-4" />,
    collapsible: false,
    order: 1,
  },
  {
    id: 'contact',
    label: 'Contact Information',
    description: 'Phone number and contact details',
    fields: ['phone_number'],
    icon: <Phone className="h-4 w-4" />,
    collapsible: false,
    order: 2,
  },
  {
    id: 'organization',
    label: 'Organization',
    description: 'Department and job title',
    fields: ['department', 'job_title'],
    icon: <Building2 className="h-4 w-4" />,
    collapsible: false,
    order: 3,
  },
  {
    id: 'preferences',
    label: 'Preferences',
    description: 'Language, theme, and notification settings',
    fields: ['preferred_language', 'interface_theme', 'allow_notifications'],
    icon: <Settings className="h-4 w-4" />,
    collapsible: true,
    defaultCollapsed: false,
    order: 4,
  },
  {
    id: 'privacy',
    label: 'Privacy Settings',
    description: 'Control what information is publicly visible',
    fields: ['show_email', 'show_phone'],
    icon: <Lock className="h-4 w-4" />,
    collapsible: true,
    defaultCollapsed: true,
    order: 5,
  },
];

export const profileFormMode: Record<string, Partial<{ layout: FormLayout; sections: FieldSection[] }>> = {
  create: {
    layout: 'sections',
    sections: profileFormSections,
  },
  edit: {
    layout: 'sections',
    sections: profileFormSections,
  },
};
