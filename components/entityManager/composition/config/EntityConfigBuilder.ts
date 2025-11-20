/**
 * Entity Config Builder
 * 
 * Fluent API for building complete entity configurations.
 */

import { BaseEntity } from '../../primitives/types';
import { EntityConfig, BuilderCallback } from './types';
import { FieldBuilder } from './FieldBuilder';
import { ColumnBuilder } from './ColumnBuilder';
import { ActionBuilder } from './ActionBuilder';
import { Column } from '../../components/list/types';
import { FormField } from '../../components/form/types';
import { ViewField } from '../../components/view/types';
import { Action } from '../../components/actions/types';
import { ExportField } from '../../components/exporter/types';

/**
 * Entity config builder class
 */
export class EntityConfigBuilder<T extends BaseEntity = BaseEntity> {
  private config: Partial<EntityConfig<T>>;

  constructor(name: string) {
    this.config = {
      name,
      columns: [],
      fields: [],
      viewFields: [],
      actions: [],
      exportFields: []
    };
  }

  /**
   * Set plural name
   */
  pluralName(pluralName: string): this {
    this.config.pluralName = pluralName;
    return this;
  }

  /**
   * Set description
   */
  description(description: string): this {
    this.config.description = description;
    return this;
  }

  /**
   * Add a column
   */
  addColumn(column: Column<T>): this {
    this.config.columns!.push(column);
    return this;
  }

  /**
   * Add columns
   */
  columns(columns: Column<T>[]): this {
    this.config.columns = columns;
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
    this.config.fields!.push(field);
    return this;
  }

  /**
   * Set fields
   */
  fields(fields: FormField<T>[]): this {
    this.config.fields = fields;
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
    this.config.viewFields!.push(field);
    return this;
  }

  /**
   * Set view fields
   */
  viewFields(fields: ViewField<T>[]): this {
    this.config.viewFields = fields;
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
    this.config.actions!.push(action);
    return this;
  }

  /**
   * Set actions
   */
  actions(actions: Action<T>[]): this {
    this.config.actions = actions;
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
    this.config.exportFields!.push(field);
    return this;
  }

  /**
   * Set export fields
   */
  exportFields(fields: ExportField[]): this {
    this.config.exportFields = fields;
    return this;
  }

  /**
   * Set default sort
   */
  defaultSort(field: string, direction: 'asc' | 'desc' = 'asc'): this {
    this.config.defaultSort = { field, direction };
    return this;
  }

  /**
   * Set default page size
   */
  defaultPageSize(size: number): this {
    this.config.defaultPageSize = size;
    return this;
  }

  /**
   * Set searchable fields
   */
  searchable(...fields: string[]): this {
    this.config.searchableFields = fields;
    return this;
  }

  /**
   * Set filterable fields
   */
  filterable(...fields: string[]): this {
    this.config.filterableFields = fields;
    return this;
  }

  /**
   * Set title field
   */
  titleField(field: string): this {
    this.config.titleField = field;
    return this;
  }

  /**
   * Set subtitle field
   */
  subtitleField(field: string): this {
    this.config.subtitleField = field;
    return this;
  }

  /**
   * Set image field
   */
  imageField(field: string): this {
    this.config.imageField = field;
    return this;
  }

  /**
   * Set date field
   */
  dateField(field: string): this {
    this.config.dateField = field;
    return this;
  }

  /**
   * Set permissions
   */
  permissions(permissions: EntityConfig['permissions']): this {
    this.config.permissions = permissions;
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
    this.config.metadata = metadata;
    return this;
  }

  /**
   * Set metadata value
   */
  meta(key: string, value: unknown): this {
    if (!this.config.metadata) {
      this.config.metadata = {};
    }
    this.config.metadata[key] = value;
    return this;
  }

  /**
   * Auto-generate export fields from columns
   */
  autoExportFields(): this {
    this.config.exportFields = this.config.columns!.map(col => ({
      key: String(col.key),
      label: col.label,
      formatter: col.formatter as any
    }));
    return this;
  }

  /**
   * Auto-generate view fields from columns
   */
  autoViewFields(): this {
    this.config.viewFields = this.config.columns!.map(col => {
      // Map select type to text for view fields
      const viewType = col.type === 'select' ? 'text' : col.type;
      return {
        key: String(col.key),
        label: col.label,
        type: viewType as any,
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
    return this.config as EntityConfig<T>;
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
    builder.config = { ...config };
    return builder;
  }
}
