/**
 * UserRole Form Configuration
 * 
 * Defines form layout and sections for role management.
 */

import { FormLayout, FieldSection } from '@/components/entityManager/components/form/types';
import { Shield, FileText, Lock } from 'lucide-react';

export const roleFormLayout: FormLayout = 'vertical';

export const roleFormSections: FieldSection[] = [
  {
    id: 'basic',
    label: 'Basic Information',
    description: 'Role name and description',
    fields: ['name', 'display_name', 'description'],
    icon: <Shield className="h-4 w-4" />,
    collapsible: false,
    order: 1,
  },
  {
    id: 'permissions',
    label: 'Permissions',
    description: 'Assign permissions to this role',
    fields: ['permissions'],
    icon: <Lock className="h-4 w-4" />,
    collapsible: true,
    defaultCollapsed: false,
    order: 2,
  },
  {
    id: 'status',
    label: 'Status',
    description: 'Role activation status',
    fields: ['is_active'],
    icon: <FileText className="h-4 w-4" />,
    collapsible: false,
    order: 3,
  },
];

export const roleFormMode: Record<string, Partial<{ layout: FormLayout; sections: FieldSection[] }>> = {
  create: {
    layout: 'tabs',
    sections: roleFormSections,
  },
  edit: {
    layout: 'tabs',
    sections: roleFormSections,
  },
};
