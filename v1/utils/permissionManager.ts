import {
  Permission,
  PermissionCondition,
  Role,
  UserPermissions,
  EntityPermissionCheck,
  PermissionResult,
  PermissionContext,
  ActionVisibilityRule,
  DynamicActionConfig
} from '../types/permissions';

export class PermissionManager {
  private roles: Map<string, Role> = new Map();
  private permissions: Map<string, Permission> = new Map();
  private userPermissions: Map<number, UserPermissions> = new Map();
  private dynamicActions: Map<string, DynamicActionConfig> = new Map();

  // Role management
  registerRole(role: Role): void {
    this.roles.set(role.id, role);
  }

  getRole(roleId: string): Role | undefined {
    return this.roles.get(roleId);
  }

  getAllRoles(): Role[] {
    return Array.from(this.roles.values());
  }

  // Permission management
  registerPermission(permission: Permission): void {
    this.permissions.set(permission.id, permission);
  }

  getPermission(permissionId: string): Permission | undefined {
    return this.permissions.get(permissionId);
  }

  getAllPermissions(): Permission[] {
    return Array.from(this.permissions.values());
  }

  // User permission management
  setUserPermissions(userId: number, userPermissions: UserPermissions): void {
    this.userPermissions.set(userId, userPermissions);
  }

  getUserPermissions(userId: number): UserPermissions | undefined {
    return this.userPermissions.get(userId);
  }

  // Dynamic action configuration
  registerDynamicActions(config: DynamicActionConfig): void {
    this.dynamicActions.set(config.entity_type, config);
  }

  getDynamicActions(entityType: string): DynamicActionConfig | undefined {
    return this.dynamicActions.get(entityType);
  }

  // Permission checking
  async checkPermission(check: EntityPermissionCheck): Promise<PermissionResult> {
    const userPermissions = this.getUserPermissions(check.user_id);
    if (!userPermissions) {
      return {
        allowed: false,
        reason: 'User permissions not found'
      };
    }

    // Build permission context
    const context: PermissionContext = {
      user: {
        id: check.user_id,
        roles: userPermissions.roles.map(r => r.id),
        attributes: {} // Would be populated from user profile
      },
      entity: {
        type: check.entity_type,
        id: check.entity_id,
        data: check.context?.entity_data || {},
        owner_id: check.context?.owner_id,
        created_by: check.context?.created_by,
        updated_by: check.context?.updated_by
      },
      environment: {
        timestamp: Date.now(),
        ip_address: check.context?.ip_address,
        user_agent: check.context?.user_agent
      }
    };

    // Check effective permissions
    const relevantPermissions = userPermissions.effective_permissions.filter(
      p => p.resource === check.entity_type && p.action === check.action
    );

    if (relevantPermissions.length === 0) {
      return {
        allowed: false,
        reason: 'No relevant permissions found',
        required_permissions: [{
          id: `${check.entity_type}_${check.action}`,
          name: `${check.action} ${check.entity_type}`,
          description: `Permission to ${check.action} ${check.entity_type}`,
          resource: check.entity_type,
          action: check.action
        }]
      };
    }

    // Evaluate conditions for each permission
    for (const permission of relevantPermissions) {
      if (!permission.conditions || permission.conditions.length === 0) {
        // No conditions means always allowed
        return { allowed: true };
      }

      const conditionMet = this.evaluateConditions(permission.conditions, context);
      if (conditionMet) {
        return { allowed: true };
      }
    }

    return {
      allowed: false,
      reason: 'Permission conditions not met',
      required_permissions: relevantPermissions
    };
  }

  // Condition evaluation
  private evaluateConditions(conditions: PermissionCondition[], context: PermissionContext): boolean {
    // Simple AND logic for now - all conditions must be met
    return conditions.every(condition => this.evaluateCondition(condition, context));
  }

  private evaluateCondition(condition: PermissionCondition, context: PermissionContext): boolean {
    const fieldValue = this.getFieldValue(condition.field, context);

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'not_equals':
        return fieldValue !== condition.value;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue);
      case 'not_in':
        return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
      case 'contains':
        return typeof fieldValue === 'string' && fieldValue.includes(condition.value);
      case 'not_contains':
        return typeof fieldValue === 'string' && !fieldValue.includes(condition.value);
      case 'gt':
        return typeof fieldValue === 'number' && fieldValue > condition.value;
      case 'lt':
        return typeof fieldValue === 'number' && fieldValue < condition.value;
      case 'gte':
        return typeof fieldValue === 'number' && fieldValue >= condition.value;
      case 'lte':
        return typeof fieldValue === 'number' && fieldValue <= condition.value;
      default:
        return false;
    }
  }

  private getFieldValue(field: string, context: PermissionContext): any {
    const parts = field.split('.');
    let value: any = context;

    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = value[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  // Dynamic action visibility
  async getVisibleActions(
    entityType: string,
    entityId: string,
    userId: number,
    context?: Record<string, any>
  ): Promise<string[]> {
    const config = this.getDynamicActions(entityType);
    if (!config) {
      return []; // No dynamic configuration, return empty
    }

    const visibleActions: string[] = [];

    for (const rule of config.actions) {
      const check: EntityPermissionCheck = {
        entity_type: entityType,
        entity_id: entityId,
        user_id: userId,
        action: rule.action,
        context
      };

      const result = await this.checkPermission(check);

      if (result.allowed && rule.show_when_allowed) {
        visibleActions.push(rule.action);
      } else if (!result.allowed && !rule.hide_when_denied) {
        visibleActions.push(rule.action);
      }
    }

    return visibleActions;
  }

  // Bulk permission checking
  async checkBulkPermissions(checks: EntityPermissionCheck[]): Promise<PermissionResult[]> {
    const results = await Promise.all(
      checks.map(check => this.checkPermission(check))
    );
    return results;
  }

  // Permission inheritance resolution
  resolveEffectivePermissions(userPermissions: UserPermissions): Permission[] {
    const allPermissions = new Map<string, Permission>();

    // Add direct permissions
    userPermissions.direct_permissions.forEach(perm => {
      allPermissions.set(perm.id, perm);
    });

    // Add role permissions
    const processedRoles = new Set<string>();

    const processRole = (role: Role) => {
      if (processedRoles.has(role.id)) return;
      processedRoles.add(role.id);

      // Add role permissions
      role.permissions.forEach(perm => {
        allPermissions.set(perm.id, perm);
      });

      // Process parent roles
      if (role.parent_roles) {
        role.parent_roles.forEach(parentRoleId => {
          const parentRole = this.roles.get(parentRoleId);
          if (parentRole) {
            processRole(parentRole);
          }
        });
      }
    };

    userPermissions.roles.forEach(role => processRole(role));

    return Array.from(allPermissions.values());
  }
}

// Global permission manager instance
let permissionManager: PermissionManager | null = null;

export const getPermissionManager = (): PermissionManager => {
  if (!permissionManager) {
    permissionManager = new PermissionManager();
  }
  return permissionManager;
};

export const destroyPermissionManager = (): void => {
  if (permissionManager) {
    permissionManager = null;
  }
};