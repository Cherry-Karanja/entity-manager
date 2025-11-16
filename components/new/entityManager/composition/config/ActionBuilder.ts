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
  ValidationRule
} from '../../components/actions/types';
import { BuilderCallback } from './types';

/**
 * Action builder class
 */
export class ActionBuilder {
  private action: Partial<Action>;

  constructor(id: string, label: string, type: ActionType = 'immediate') {
    this.action = { id, label, type };
  }

  /**
   * Set action icon
   */
  icon(icon: string): this {
    this.action.icon = icon;
    return this;
  }

  /**
   * Set action variant
   */
  variant(variant: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'): this {
    this.action.variant = variant;
    return this;
  }

  /**
   * Set action position
   */
  position(position: 'toolbar' | 'row' | 'bulk' | 'dropdown'): this {
    this.action.position = position;
    return this;
  }

  /**
   * Set action priority
   */
  priority(priority: number): this {
    this.action.priority = priority;
    return this;
  }

  /**
   * Set visibility condition
   */
  visible(visible: Action['visible']): this {
    this.action.visible = visible;
    return this;
  }

  /**
   * Set disabled condition
   */
  disabled(disabled: Action['disabled']): this {
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
   * Set loading state
   */
  loading(loading: boolean): this {
    this.action.loading = loading;
    return this;
  }

  /**
   * Set confirmation message
   */
  confirm(message: string): this {
    (this.action as ConfirmAction).confirmMessage = message;
    return this;
  }

  /**
   * Set confirm title
   */
  confirmTitle(title: string): this {
    (this.action as ConfirmAction).confirmTitle = title;
    return this;
  }

  /**
   * Set confirm button text
   */
  confirmButton(text: string): this {
    (this.action as ConfirmAction).confirmButtonText = text;
    return this;
  }

  /**
   * Set cancel button text
   */
  cancelButton(text: string): this {
    (this.action as ConfirmAction).cancelButtonText = text;
    return this;
  }

  /**
   * Set form fields
   */
  fields(fields: FormFieldDefinition[]): this {
    (this.action as FormAction).fields = fields;
    return this;
  }

  /**
   * Set form title
   */
  formTitle(title: string): this {
    (this.action as FormAction).formTitle = title;
    return this;
  }

  /**
   * Set submit button text
   */
  submitButton(text: string): this {
    (this.action as FormAction).submitButtonText = text;
    return this;
  }

  /**
   * Set form validation
   */
  validation(validate: (values: Record<string, unknown>) => Record<string, string>): this {
    (this.action as FormAction).validate = validate;
    return this;
  }

  /**
   * Set modal content
   */
  modalContent(content: React.ReactNode): this {
    (this.action as ModalAction).modalContent = content;
    return this;
  }

  /**
   * Set modal title
   */
  modalTitle(title: string): this {
    (this.action as ModalAction).modalTitle = title;
    return this;
  }

  /**
   * Set modal width
   */
  modalWidth(width: string): this {
    (this.action as ModalAction).modalWidth = width;
    return this;
  }

  /**
   * Set navigation URL
   */
  url(url: string): this {
    (this.action as NavigationAction).url = url;
    return this;
  }

  /**
   * Set navigation target
   */
  target(target: '_self' | '_blank' | '_parent' | '_top'): this {
    (this.action as NavigationAction).target = target;
    return this;
  }

  /**
   * Set bulk confirmation message
   */
  bulkConfirm(message: string): this {
    (this.action as BulkAction).bulkConfirmMessage = message;
    return this;
  }

  /**
   * Require selection for bulk action
   */
  requiresSelection(required = true): this {
    (this.action as BulkAction).requiresSelection = required;
    return this;
  }

  /**
   * Set download URL
   */
  downloadUrl(url: string): this {
    (this.action as DownloadAction).downloadUrl = url;
    return this;
  }

  /**
   * Set download filename
   */
  filename(filename: string): this {
    (this.action as DownloadAction).filename = filename;
    return this;
  }

  /**
   * Set custom handler
   */
  handler(handler: CustomAction['handler']): this {
    (this.action as CustomAction).handler = handler;
    return this;
  }

  /**
   * Set custom render
   */
  render(render: CustomAction['render']): this {
    (this.action as CustomAction).render = render;
    return this;
  }

  /**
   * Build the action
   */
  build(): Action {
    return this.action as Action;
  }

  /**
   * Create a new action builder
   */
  static create(id: string, label: string, type?: ActionType): ActionBuilder {
    return new ActionBuilder(id, label, type);
  }

  /**
   * Create immediate action
   */
  static immediate(id: string, label: string): ActionBuilder {
    return new ActionBuilder(id, label, 'immediate');
  }

  /**
   * Create confirm action
   */
  static confirm(id: string, label: string, message: string): ActionBuilder {
    return new ActionBuilder(id, label, 'confirm').confirm(message);
  }

  /**
   * Create form action
   */
  static form(id: string, label: string, fields: FormFieldDefinition[]): ActionBuilder {
    return new ActionBuilder(id, label, 'form').fields(fields);
  }

  /**
   * Create modal action
   */
  static modal(id: string, label: string, content: React.ReactNode): ActionBuilder {
    return new ActionBuilder(id, label, 'modal').modalContent(content);
  }

  /**
   * Create navigation action
   */
  static navigation(id: string, label: string, url: string): ActionBuilder {
    return new ActionBuilder(id, label, 'navigation').url(url);
  }

  /**
   * Create bulk action
   */
  static bulk(id: string, label: string): ActionBuilder {
    return new ActionBuilder(id, label, 'bulk').requiresSelection();
  }

  /**
   * Create download action
   */
  static download(id: string, label: string, url: string): ActionBuilder {
    return new ActionBuilder(id, label, 'download').downloadUrl(url);
  }

  /**
   * Create custom action
   */
  static custom(id: string, label: string, handler: CustomAction['handler']): ActionBuilder {
    return new ActionBuilder(id, label, 'custom').handler(handler);
  }

  /**
   * Create action with callback
   */
  static build(
    id: string,
    label: string,
    type: ActionType,
    callback: BuilderCallback<Action, ActionBuilder>
  ): Action {
    const builder = new ActionBuilder(id, label, type);
    const result = callback(builder);
    return result || builder.build();
  }
}
