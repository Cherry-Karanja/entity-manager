/**
 * Entity Config Builder
 * 
 * Fluent API for building complete entity configurations.
 */

import { BaseEntity } from '../../primitives/types';
import { EntityConfig, BuilderCallback, EntityListConfig, EntityFormConfig, EntityViewConfig, EntityActionsConfig, EntityExporterConfig } from './types';
import { FieldBuilder } from './FieldBuilder';
import { ColumnBuilder } from './ColumnBuilder';
import { ActionBuilder } from './ActionBuilder';
import { Column } from '../../components/list/types';
import { FormField } from '../../components/form/types';
import { ViewField } from '../../components/view/types';
import { Action } from '../../components/actions/types';
import { ExportField } from '../../components/exporter/types';

/**
 * Internal builder state that maps to EntityConfig structure
 */
interface BuilderState<T extends BaseEntity> {
  name: string;
  pluralName?: string;
  label: string;
  labelPlural: string;
  description?: string;
  list: Partial<EntityListConfig<T>> & { columns: Column<T>[] };
  form: Partial<EntityFormConfig<T>> & { fields: FormField<T>[] };
  view: Partial<EntityViewConfig<T>> & { fields: ViewField<T>[] };
  actions: { actions: Action<T>[] };
  exporter: { fields: ExportField[] };
  permissions?: EntityConfig['permissions'];
  metadata?: Record<string, unknown>;
  apiEndpoint?: string;
  icon?: string;
}

/**
 * Entity config builder class
 */
export class EntityConfigBuilder<T extends BaseEntity = BaseEntity> {
  private state: BuilderState<T>;

  constructor(name: string) {
    this.state = {
      name,
      label: name,
      labelPlural: name + 's',
      list: { columns: [] },
      form: { fields: [] },
      view: { fields: [] },
      actions: { actions: [] },
      exporter: { fields: [] }
    };
  }

  /**
   * Set plural name
   */
  pluralName(pluralName: string): this {
    this.state.pluralName = pluralName;
    this.state.labelPlural = pluralName;
    return this;
  }

  /**
   * Set description
   */
  description(description: string): this {
    this.state.description = description;
    return this;
  }

  /**
   * Add a column
   */
  addColumn(column: Column<T>): this {
    this.state.list.columns.push(column);
    return this;
  }

  /**
   * Set columns
   */
  columns(columns: Column<T>[]): this {
    this.state.list.columns = columns;
    return this;
  }

  /**
   * Add column with builder
   */
  column(
    key: keyof T | string,
    label: string,
    callback?: BuilderCallback<Column<T>, ColumnBuilder<T>>
  ): this {
    const builder = new ColumnBuilder<T>(key, label);
    const column = callback ? (callback(builder) || builder.build()) : builder.build();
    return this.addColumn(column);
  }

  /**
   * Add a field
   */
  addField(field: FormField<T>): this {
    this.state.form.fields.push(field);
    return this;
  }

  /**
   * Set fields
   */
  fields(fields: FormField<T>[]): this {
    this.state.form.fields = fields;
    return this;
  }

  /**
   * Add field with builder
   */
  field(
    name: string,
    label: string,
    callback?: BuilderCallback<FormField<T>, FieldBuilder<T>>
  ): this {
    const builder = new FieldBuilder<T>(name, label);
    const field = callback ? (callback(builder) || builder.build()) : builder.build();
    return this.addField(field);
  }

  /**
   * Add a view field
   */
  addViewField(field: ViewField<T>): this {
    this.state.view.fields.push(field);
    return this;
  }

  /**
   * Set view fields
   */
  viewFields(fields: ViewField<T>[]): this {
    this.state.view.fields = fields;
    return this;
  }

  /**
   * Add view field with builder
   */
  viewField(
    name: string,
    label: string,
    callback?: BuilderCallback<ViewField<T>, FieldBuilder<T>>
  ): this {
    const builder = new FieldBuilder<T>(name, label);
    const field = callback ? (callback(builder) || builder.buildViewField()) : builder.buildViewField();
    return this.addViewField(field);
  }

  /**
   * Add an action
   */
  addAction(action: Action<T>): this {
    this.state.actions.actions.push(action);
    return this;
  }

  /**
   * Set actions
   */
  actions(actions: Action<T>[]): this {
    this.state.actions.actions = actions;
    return this;
  }

  /**
   * Add action with builder
   */
  action(
    id: string,
    label: string,
    callback?: BuilderCallback<Action<T>, ActionBuilder<T>>
  ): this {
    const builder = new ActionBuilder<T>(id, label);
    const action = callback ? (callback(builder) || builder.build()) : builder.build();
    return this.addAction(action);
  }

  /**
   * Add export field
   */
  addExportField(field: ExportField): this {
    this.state.exporter.fields.push(field);
    return this;
  }

  /**
   * Set export fields
   */
  exportFields(fields: ExportField[]): this {
    this.state.exporter.fields = fields;
    return this;
  }

  /**
   * Set default sort
   */
  defaultSort(field: string, direction: 'asc' | 'desc' = 'asc'): this {
    this.state.list.sortConfig = { field, direction };
    return this;
  }

  /**
   * Set default page size
   */
  defaultPageSize(size: number): this {
    this.state.list.paginationConfig = {
      ...this.state.list.paginationConfig,
      page: 1,
      pageSize: size
    };
    return this;
  }

  /**
   * Enable searchable list
   */
  searchable(placeholder?: string): this {
    this.state.list.searchable = true;
    if (placeholder) {
      this.state.list.searchPlaceholder = placeholder;
    }
    return this;
  }

  /**
   * Enable filterable list
   */
  filterable(): this {
    this.state.list.filterable = true;
    return this;
  }

  /**
   * Set title field (for card/list views)
   */
  titleField(field: string): this {
    this.state.list.titleField = field as keyof T | string;
    return this;
  }

  /**
   * Set subtitle field (for card/list views)
   */
  subtitleField(field: string): this {
    this.state.list.subtitleField = field as keyof T | string;
    return this;
  }

  /**
   * Set image field (for gallery view)
   */
  imageField(field: string): this {
    this.state.list.imageField = field as keyof T | string;
    return this;
  }

  /**
   * Set date field (for timeline view)
   */
  dateField(field: string): this {
    this.state.list.dateField = field as keyof T | string;
    return this;
  }

  /**
   * Set permissions
   */
  permissions(permissions: EntityConfig['permissions']): this {
    this.state.permissions = permissions;
    return this;
  }

  /**
   * Allow all permissions
   */
  allowAll(): this {
    return this.permissions({
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true
    });
  }

  /**
   * Set read-only permissions
   */
  readOnly(): this {
    return this.permissions({
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true
    });
  }

  /**
   * Set metadata
   */
  metadata(metadata: Record<string, unknown>): this {
    this.state.metadata = metadata;
    return this;
  }

  /**
   * Set metadata value
   */
  meta(key: string, value: unknown): this {
    if (!this.state.metadata) {
      this.state.metadata = {};
    }
    this.state.metadata[key] = value;
    return this;
  }

  /**
   * Auto-generate export fields from columns
   */
  autoExportFields(): this {
    this.state.exporter.fields = this.state.list.columns.map(col => ({
      key: String(col.key),
      label: col.label,
      formatter: col.formatter as ((value: unknown) => string) | undefined
    }));
    return this;
  }

  /**
   * Auto-generate view fields from columns
   */
  autoViewFields(): this {
    this.state.view.fields = this.state.list.columns.map(col => {
      // Map select type to text for view fields
      const viewType = col.type === 'select' ? 'text' : col.type;
      return {
        key: String(col.key),
        label: col.label,
        type: viewType as ViewField<T>['type'],
        visible: col.visible,
        order: col.order
      };
    });
    return this;
  }

  /**
   * Build the configuration
   */
  build(): EntityConfig<T> {
    return {
      name: this.state.name,
      pluralName: this.state.pluralName,
      label: this.state.label,
      labelPlural: this.state.labelPlural,
      description: this.state.description,
      list: this.state.list as EntityListConfig<T>,
      form: this.state.form as EntityFormConfig<T>,
      view: this.state.view as EntityViewConfig<T>,
      actions: this.state.actions as EntityActionsConfig<T>,
      exporter: this.state.exporter as EntityExporterConfig<T>,
      permissions: this.state.permissions,
      metadata: this.state.metadata,
      apiEndpoint: this.state.apiEndpoint,
      icon: this.state.icon
    };
  }

  /**
   * Create a new entity config builder
   */
  static create<T extends BaseEntity = BaseEntity>(name: string): EntityConfigBuilder<T> {
    return new EntityConfigBuilder<T>(name);
  }

  /**
   * Create config with callback
   */
  static build<T extends BaseEntity = BaseEntity>(
    name: string,
    callback: BuilderCallback<EntityConfig<T>, EntityConfigBuilder<T>>
  ): EntityConfig<T> {
    const builder = new EntityConfigBuilder<T>(name);
    const result = callback(builder);
    return result || builder.build();
  }

  /**
   * Create from existing config
   */
  static from<T extends BaseEntity = BaseEntity>(config: Partial<EntityConfig<T>>): EntityConfigBuilder<T> {
    const builder = new EntityConfigBuilder<T>(config.name || 'Entity');
    // Copy over existing config
    if (config.pluralName) builder.pluralName(config.pluralName);
    if (config.description) builder.description(config.description);
    if (config.list?.columns) builder.columns(config.list.columns);
    if (config.form?.fields) builder.fields(config.form.fields);
    if (config.view?.fields) builder.viewFields(config.view.fields);
    if (config.actions?.actions) builder.actions(config.actions.actions);
    if (config.exporter?.fields) builder.exportFields(config.exporter.fields as ExportField[]);
    if (config.permissions) builder.permissions(config.permissions);
    if (config.metadata) builder.metadata(config.metadata);
    return builder;
  }
}
