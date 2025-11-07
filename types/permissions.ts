export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'contains' | 'not_contains' | 'gt' | 'lt' | 'gte' | 'lte';
  value: any;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  parent_roles?: string[];
  is_system_role?: boolean;
}

export interface UserPermissions {
  user_id: number;
  roles: Role[];
  direct_permissions: Permission[];
  effective_permissions: Permission[];
}

export interface EntityPermissionCheck {
  entity_type: string;
  entity_id: string;
  user_id: number;
  action: string;
  context?: Record<string, any>;
}

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
  required_permissions?: Permission[];
  missing_permissions?: Permission[];
}

export interface ActionVisibilityRule {
  action: string;
  conditions: PermissionCondition[];
  show_when_allowed: boolean;
  hide_when_denied: boolean;
}

export interface DynamicActionConfig {
  entity_type: string;
  actions: ActionVisibilityRule[];
}

export interface PermissionContext {
  user: {
    id: number;
    roles: string[];
    attributes: Record<string, any>;
  };
  entity: {
    type: string;
    id: string;
    data: Record<string, any>;
    owner_id?: number;
    created_by?: number;
    updated_by?: number;
  };
  environment: {
    timestamp: number;
    ip_address?: string;
    user_agent?: string;
  };
}