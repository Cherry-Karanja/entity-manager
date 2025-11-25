/**
 * UserRole Form Configuration
 * 
 * Defines form layout, sections, and behavior settings for role management.
 */

import { EntityFormConfig } from '@/components/entityManager/composition/config/types';
import { UserRole } from '../types';
import { Shield, Lock, FileText } from 'lucide-react';
import { roleFields } from './fields';

export const UserRoleFormConfig: EntityFormConfig<UserRole> = {
  /** Form fields */
  fields: roleFields,

  /** Layout configuration */
  layout: 'tabs',

  /** Form sections */
  sections: [
    {
      id: 'basic',
      label: 'Basic Information',
      description: 'Role name and description',
      fields: ['name', 'display_name', 'description'],
      icon: <Shield className="h-4 w-4" />,
      order: 1,
    },
    {
      id: 'permissions',
      label: 'Permissions',
      description: 'Assign permissions to this role',
      fields: ['permissions'],
      icon: <Lock className="h-4 w-4" />,
      order: 2,
    },
    {
      id: 'status',
      label: 'Status',
      description: 'Role activation status',
      fields: ['is_active'],
      icon: <FileText className="h-4 w-4" />,
      order: 3,
    },
  ],

  /** Form behavior settings */
  submitText: 'Save Role',
  cancelText: 'Cancel',
  showCancel: true,
  showReset: true,
  disabled: true,
  className: 'role-form',
  validateOnChange: true,
  validateOnBlur: true,
  resetOnSubmit: true,
};
