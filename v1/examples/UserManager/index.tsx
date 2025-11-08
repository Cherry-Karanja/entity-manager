import { EntityConfig } from '@/components/entityManager/manager/types';
import { userFields } from './configs/fields';
import { userListConfig } from './configs/list';
import { userFormConfig } from './configs/form';
import { userViewConfig } from './configs/view';
import { userCustomActions } from './configs/actions';
import { userBulkImport } from './configs/exporter';
import { User, UserFormData } from './configs/types';

export const userConfig: EntityConfig<User, UserFormData> = {
  name: 'User',
  namePlural: 'Users',
  displayName: 'User',
  fields: userFields,
  endpoints: {
    list: '/user-manager/users/',
    create: '/user-manager/users/',
    update: '/user-manager/users/',
    delete: '/user-manager/users/',
  },
  listConfig: userListConfig,
  formConfig: userFormConfig,
  viewConfig: userViewConfig,
  permissions: {
    create: true,
    view: true,
    update: true,
    delete: true,
    export: true,
  },
  customActions: userCustomActions,
  bulkImport: userBulkImport,
};

export default userConfig;
