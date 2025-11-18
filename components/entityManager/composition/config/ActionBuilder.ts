/**
 * Action Builder
 * 
 * Fluent API for building entity actions.
 */

import { 
  Action, 
  ActionType,
  ImmediateAction,
  ConfirmAction,
  FormAction,
  ModalAction,
  NavigationAction,
  BulkAction,
  DownloadAction,
  CustomAction,
  FormFieldDefinition,
  ActionContext,
  ActionVariant
} from '../../components/actions/types';
import { BaseEntity } from '../../primitives/types';

/**
 * Action builder class
 */
export class ActionBuilder<T extends BaseEntity = BaseEntity> {
  private action: Partial<Action<T>>;

  constructor(id: string, label: string, actionType: ActionType = 'immediate') {
    this.action = { id, label, actionType } as Partial<Action<T>>;
  }

  /**
   * Set action icon
   */
  icon(icon: string | React.ReactNode): this {
    this.action.icon = icon;
    return this;
  }

  /**
   * Set action variant
   */
  variant(variant: ActionVariant): this {
    this.action.variant = variant;
    return this;
  }

  /**
   * Se action position
   */
  position(position: 'toolbar' | 'row' | 'dropdown' | 'context-menu'): this {
    this.action.position = position;
    return this;
  }

  /**
   * Set visibility condition
   */
  visible(visible: boolean | ((entity?: T, context?: ActionContext<T>) => boolean)): this {
    this.action.visible = visible;
    return this;
  }

  /**
   * Set disabled condition
   */
  disabled(disabled: boolean | ((entity?: T, context?: ActionContext<T>) => boolean)): this {
    this.action.disabled = disabled;
    return this;
  }

  /**
   * Set tooltip
   */
  tooltip(tooltip: string): this {
    this.action.tooltip = tooltip;
    return this;
  }

  /**
   * Set permission requirement
   */
  permission(permission: string): this {
    this.action.permission = permission;
    return this;
  }

  /**
   * Set requires selection
   */
  requiresSelection(required = true): this {
    this.action.requiresSelection = required;
    return this;
  }

  /**
   * Set allow multiple selection
   */
  allowMultiple(allow = true): this {
    this.action.allowMultiple = allow;
    return this;
  }

  // === Immediate Action Methods ===

  /**
   * Set immediate action handler
   */
  handler(handler: (entity?: T, context?: ActionContext<T>) => void | Promise<void>): this {
    (this.action as Partial<ImmediateAction<T>>).handler = handler;
    return this;
  }

  // === Confirm Action Methods ===

  /**
   * Set confirmation message
   */
  confirmMessage(message: string | ((entity?: T) => string)): this {
    (this.action as Partial<ConfirmAction<T>>).confirmMessage = message;
    return this;
  }

  /**
   * Set confirm button text
   */
  confirmText(text: string): this {
    (this.action as Partial<ConfirmAction<T>>).confirmText = text;
    return this;
  }

  /**
   * Set cancel button text
   */
  cancelText(text: string): this {
    (this.action as Partial<ConfirmAction<T>>).cancelText = text;
    return this;
  }

  /**
   * Set confirm handler
   */
  onConfirm(handler: (entity?: T, context?: ActionContext<T>) => void | Promise<void>): this {
    (this.action as Partial<ConfirmAction<T>>).onConfirm = handler;
    return this;
  }

  /**
   * Set cancel handler
   */
  onCancel(handler: () => void): this {
    (this.action as Partial<ConfirmAction<T>>).onCancel = handler;
    return this;
  }

  // === Form Action Methods ===

  /**
   * Set form title
   */
  formTitle(title: string): this {
    (this.action as Partial<FormAction<T>>).formTitle = title;
    return this;
  }

  /**
   * Set form fields
   */
  fields(fields: FormFieldDefinition[]): this {
    (this.action as Partial<FormAction<T>>).fields = fields;
    return this;
  }

  /**
   * Set initial form values
   */
  initialValues(values: Record<string, unknown> | ((entity?: T) => Record<string, unknown>)): this {
    (this.action as Partial<FormAction<T>>).initialValues = values;
    return this;
  }

  /**
   * Set form submit handler
   */
  onSubmit(handler: (values: Record<string, unknown>, entity?: T, context?: ActionContext<T>) => void | Promise<void>): this {
    (this.action as Partial<FormAction<T>>).onSubmit = handler;
    return this;
  }

  /**
   * Set form submit button text
   */
  submitText(text: string): this {
    (this.action as Partial<FormAction<T>>).submitText = text;
    return this;
  }

  // === Modal Action Methods ===

  /**
   * Set modal title
   */
  modalTitle(title: string): this {
    (this.action as Partial<ModalAction<T>>).modalTitle = title;
    return this;
  }

  /**
   * Set modal content component
   */
  content(content: React.ComponentType<{ entity?: T; context?: ActionContext<T>; onClose: () => void }>): this {
    (this.action as Partial<ModalAction<T>>).content = content;
    return this;
  }

  /**
   * Set modal size
   */
  modalSize(size: 'small' | 'medium' | 'large' | 'fullscreen'): this {
    (this.action as Partial<ModalAction<T>>).size = size;
    return this;
  }

  // === Navigation Action Methods ===

  /**
   * Set navigation URL
   */
  url(url: string | ((entity?: T, context?: ActionContext<T>) => string)): this {
    (this.action as Partial<NavigationAction<T>>).url = url;
    return this;
  }

  /**
   * Set whether to open in new tab
   */
  newTab(newTab = true): this {
    (this.action as Partial<NavigationAction<T>>).newTab = newTab;
    return this;
  }

  // === Bulk Action Methods ===

  /**
   * Set bulk action handler
   */
  bulkHandler(handler: (entities: T[], context?: ActionContext<T>) => void | Promise<void>): this {
    (this.action as Partial<BulkAction<T>>).handler = handler;
    return this;
  }

  /**
   * Set bulk confirmation message
   */
  bulkConfirmMessage(message: string | ((count: number) => string)): this {
    (this.action as Partial<BulkAction<T>>).bulkConfirmMessage = message;
    return this;
  }

  /**
   * Set whether to confirm bulk action
   */
  confirmBulk(confirm = true): this {
    (this.action as Partial<BulkAction<T>>).confirmBulk = confirm;
    return this;
  }

  // === Download Action Methods ===

  /**
   * Set download handler
   */
  downloadHandler(handler: (entity?: T, context?: ActionContext<T>) => void | Promise<void>): this {
    (this.action as Partial<DownloadAction<T>>).handler = handler;
    return this;
  }

  /**
   * Set download URL
   */
  downloadUrl(url: string | ((entity?: T) => string)): this {
    (this.action as Partial<DownloadAction<T>>).downloadUrl = url;
    return this;
  }

  /**
   * Set download filename
   */
  filename(filename: string | ((entity?: T) => string)): this {
    (this.action as Partial<DownloadAction<T>>).filename = filename;
    return this;
  }

  // === Custom Action Methods ===

  /**
   * Set custom component
   */
  component(component: React.ComponentType<{ entity?: T; context?: ActionContext<T> }>): this {
    (this.action as Partial<CustomAction<T>>).component = component;
    return this;
  }

  /**
   * Set custom handler
   */
  customHandler(handler: (entity?: T, context?: ActionContext<T>) => void | Promise<void>): this {
    (this.action as Partial<CustomAction<T>>).handler = handler;
    return this;
  }

  /**
   * Build the action
   */
  build(): Action<T> {
    return this.action as Action<T>;
  }

  /**
   * Create a new action builder
   */
  static create<T extends BaseEntity = BaseEntity>(id: string, label: string, actionType?: ActionType): ActionBuilder<T> {
    return new ActionBuilder<T>(id, label, actionType);
  }

  /**
   * Create immediate action
   */
  static immediate<T extends BaseEntity = BaseEntity>(
    id: string, 
    label: string,
    handler: (entity?: T, context?: ActionContext<T>) => void | Promise<void>
  ): ActionBuilder<T> {
    return new ActionBuilder<T>(id, label, 'immediate').handler(handler);
  }

  /**
   * Create confirm action
   */
  static confirm<T extends BaseEntity = BaseEntity>(
    id: string, 
    label: string, 
    message: string,
    onConfirm: (entity?: T, context?: ActionContext<T>) => void | Promise<void>
  ): ActionBuilder<T> {
    return new ActionBuilder<T>(id, label, 'confirm')
      .confirmMessage(message)
      .onConfirm(onConfirm);
  }

  /**
   * Create form action
   */
  static form<T extends BaseEntity = BaseEntity>(
    id: string, 
    label: string,
    fields: FormFieldDefinition[],
    onSubmit: (values: Record<string, unknown>, entity?: T, context?: ActionContext<T>) => void | Promise<void>
  ): ActionBuilder<T> {
    return new ActionBuilder<T>(id, label, 'form')
      .fields(fields)
      .onSubmit(onSubmit);
  }

  /**
   * Create modal action
   */
  static modal<T extends BaseEntity = BaseEntity>(
    id: string,
    label: string,
    content: React.ComponentType<{ entity?: T; context?: ActionContext<T>; onClose: () => void }>
  ): ActionBuilder<T> {
    return new ActionBuilder<T>(id, label, 'modal').content(content);
  }

  /**
   * Create navigation action
   */
  static navigation<T extends BaseEntity = BaseEntity>(
    id: string,
    label: string,
    url: string | ((entity?: T, context?: ActionContext<T>) => string)
  ): ActionBuilder<T> {
    return new ActionBuilder<T>(id, label, 'navigation').url(url);
  }

  /**
   * Create bulk action
   */
  static bulk<T extends BaseEntity = BaseEntity>(
    id: string,
    label: string,
    handler: (entities: T[], context?: ActionContext<T>) => void | Promise<void>
  ): ActionBuilder<T> {
    return new ActionBuilder<T>(id, label, 'bulk').bulkHandler(handler);
  }

  /**
   * Create download action
   */
  static download<T extends BaseEntity = BaseEntity>(
    id: string,
    label: string,
    handler: (entity?: T, context?: ActionContext<T>) => void | Promise<void>
  ): ActionBuilder<T> {
    return new ActionBuilder<T>(id, label, 'download').downloadHandler(handler);
  }

  /**
   * Create custom action
   */
  static custom<T extends BaseEntity = BaseEntity>(
    id: string,
    label: string,
    component: React.ComponentType<{ entity?: T; context?: ActionContext<T> }>
  ): ActionBuilder<T> {
    return new ActionBuilder<T>(id, label, 'custom').component(component);
  }
}
