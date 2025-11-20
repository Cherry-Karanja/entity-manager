/**
 * Field Builder
 * 
 * Fluent API for building form/view fields.
 */

import { BaseEntity } from '../../primitives/types';
import { FormField, FieldType, ValidationRule } from '../../components/form/types';
import { ViewField } from '../../components/view/types';
import { BuilderCallback } from './types';

/**
 * Field builder class
 */
export class FieldBuilder<T extends BaseEntity = BaseEntity> {
  private field: Partial<FormField<T>>;

  constructor(name: string, label: string) {
    this.field = { name, label };
  }

  /**
   * Set field type
   */
  type(type: FieldType): this {
    this.field.type = type;
    return this;
  }

  /**
   * Set placeholder
   */
  placeholder(placeholder: string): this {
    this.field.placeholder = placeholder;
    return this;
  }

  /**
   * Set help text
   */
  helpText(helpText: string): this {
    this.field.helpText = helpText;
    return this;
  }

  /**
   * Set default value
   */
  defaultValue(value: unknown): this {
    this.field.defaultValue = value;
    return this;
  }

  /**
   * Mark as required
   */
  required(message?: string): this {
    this.field.required = true;
    if (message) {
      this.addValidation({ type: 'required', message });
    }
    return this;
  }

  /**
   * Mark as disabled
   */
  disabled(disabled: boolean | ((values: Record<string, unknown>) => boolean) = true): this {
    this.field.disabled = disabled;
    return this;
  }

  /**
   * Set visibility condition
   */
  visible(visible: boolean | ((values: Record<string, unknown>) => boolean)): this {
    this.field.visible = visible;
    return this;
  }

  /**
   * Add validation rule
   */
  addValidation(rule: ValidationRule): this {
    if (!this.field.validation) {
      this.field.validation = [];
    }
    this.field.validation.push(rule);
    return this;
  }

  /**
   * Set email validation
   */
  email(message = 'Please enter a valid email address'): this {
    this.addValidation({ type: 'email', message });
    return this;
  }

  /**
   * Set URL validation
   */
  url(message = 'Please enter a valid URL'): this {
    this.addValidation({ type: 'url', message });
    return this;
  }

  /**
   * Set min length validation
   */
  minLength(value: number, message = `Minimum length is ${value}`): this {
    this.addValidation({ type: 'minLength', value, message });
    return this;
  }

  /**
   * Set max length validation
   */
  maxLength(value: number, message = `Maximum length is ${value}`): this {
    this.addValidation({ type: 'maxLength', value, message });
    return this;
  }

  /**
   * Set min value validation
   */
  min(value: number, message = `Minimum value is ${value}`): this {
    this.addValidation({ type: 'min', value, message });
    return this;
  }

  /**
   * Set max value validation
   */
  max(value: number, message = `Maximum value is ${value}`): this {
    this.addValidation({ type: 'max', value, message });
    return this;
  }

  /**
   * Set pattern validation
   */
  pattern(value: string | RegExp, message = 'Please match the required pattern'): this {
    this.addValidation({ type: 'pattern', value, message });
    return this;
  }

  /**
   * Set custom validation
   */
  custom(validator: (value: unknown, values: Record<string, unknown>) => string | null, message = 'Validation failed'): this {
    this.addValidation({ type: 'custom', validator: validator as any, message });
    return this;
  }

  /**
   * Set field width
   */
  width(width: number): this {
    this.field.width = width;
    return this;
  }

  /**
   * Set field group
   */
  group(group: string): this {
    this.field.group = group;
    return this;
  }

  /**
   * Set field order
   */
  order(order: number): this {
    this.field.order = order;
    return this;
  }

  /**
   * Set select options
   */
  options(options: Array<{ label: string; value: string | number | boolean }>): this {
    this.field.options = options as any;
    return this;
  }

  /**
   * Set number constraints
   */
  number(min?: number, max?: number, step?: number): this {
    if (min !== undefined) this.field.min = min;
    if (max !== undefined) this.field.max = max;
    if (step !== undefined) this.field.step = step;
    return this;
  }

  /**
   * Set text constraints
   */
  text(minLength?: number, maxLength?: number): this {
    if (minLength !== undefined) this.field.minLength = minLength;
    if (maxLength !== undefined) this.field.maxLength = maxLength;
    return this;
  }

  /**
   * Set textarea rows
   */
  rows(rows: number): this {
    this.field.rows = rows;
    return this;
  }

  /**
   * Set file accept types
   */
  accept(accept: string): this {
    this.field.accept = accept;
    return this;
  }

  /**
   * Allow multiple values
   */
  multiple(multiple = true): this {
    this.field.multiple = multiple;
    return this;
  }

  /**
   * Set custom renderer
   */
  render(render: FormField<T>['render']): this {
    this.field.render = render;
    return this;
  }

  /**
   * Set value transformer
   */
  transform(transform: FormField['transform']): this {
    this.field.transform = transform;
    return this;
  }

  /**
   * Build the field
   */
  build(): FormField<T> {
    return this.field as FormField<T>;
  }

  /**
   * Build as view field
   */
  buildViewField(): ViewField<T> {
    // Map select type to text for view (select isn't a valid ViewField type)
    const viewType = this.field.type === 'select' ? 'text' : this.field.type;
    
    return {
      key: this.field.name!,
      label: this.field.label!,
      type: viewType as any,
      visible: typeof this.field.visible === 'boolean' ? this.field.visible : undefined,
      order: this.field.order,
      group: this.field.group
    };
  }

  /**
   * Create a new field builder
   */
  static create(name: string, label: string): FieldBuilder {
    return new FieldBuilder(name, label);
  }

  /**
   * Create field with callback
   */
  static build(name: string, label: string, callback: BuilderCallback<FormField, FieldBuilder>): FormField {
    const builder = new FieldBuilder(name, label);
    const result = callback(builder);
    return result || builder.build();
  }
}
