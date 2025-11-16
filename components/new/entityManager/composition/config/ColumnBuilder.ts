/**
 * Column Builder
 * 
 * Fluent API for building list columns.
 */

import { BaseEntity } from '../../primitives/types';
import { Column } from '../../components/list/types';
import { BuilderCallback } from './types';

/**
 * Column builder class
 */
export class ColumnBuilder<T extends BaseEntity = BaseEntity> {
  private column: Partial<Column<T>>;

  constructor(key: keyof T | string, label: string) {
    this.column = { key, label };
  }

  /**
   * Set column width
   */
  width(width: number | string): this {
    this.column.width = width;
    return this;
  }

  /**
   * Make sortable
   */
  sortable(sortable = true): this {
    this.column.sortable = sortable;
    return this;
  }

  /**
   * Make filterable
   */
  filterable(filterable = true): this {
    this.column.filterable = filterable;
    return this;
  }

  /**
   * Set alignment
   */
  align(align: 'left' | 'center' | 'right'): this {
    this.column.align = align;
    return this;
  }

  /**
   * Set custom renderer
   */
  render(render: Column<T>['render']): this {
    this.column.render = render;
    return this;
  }

  /**
   * Set custom formatter
   */
  formatter(formatter: Column<T>['formatter']): this {
    this.column.formatter = formatter;
    return this;
  }

  /**
   * Set field type
   */
  type(type: 'text' | 'number' | 'date' | 'boolean' | 'select'): this {
    this.column.type = type;
    return this;
  }

  /**
   * Set filter options
   */
  filterOptions(options: Array<{ label: string; value: unknown }>): this {
    this.column.filterOptions = options;
    return this;
  }

  /**
   * Set visibility
   */
  visible(visible = true): this {
    this.column.visible = visible;
    return this;
  }

  /**
   * Fix column position
   */
  fixed(position: 'left' | 'right'): this {
    this.column.fixed = position;
    return this;
  }

  /**
   * Set column order
   */
  order(order: number): this {
    this.column.order = order;
    return this;
  }

  /**
   * Configure as text column
   */
  text(): this {
    return this.type('text').sortable().filterable();
  }

  /**
   * Configure as number column
   */
  number(): this {
    return this.type('number').sortable().filterable().align('right');
  }

  /**
   * Configure as date column
   */
  date(): this {
    return this.type('date').sortable().filterable();
  }

  /**
   * Configure as boolean column
   */
  boolean(): this {
    return this.type('boolean').sortable().filterable().align('center');
  }

  /**
   * Build the column
   */
  build(): Column<T> {
    return this.column as Column<T>;
  }

  /**
   * Create a new column builder
   */
  static create<T extends BaseEntity = BaseEntity>(
    key: keyof T | string,
    label: string
  ): ColumnBuilder<T> {
    return new ColumnBuilder<T>(key, label);
  }

  /**
   * Create column with callback
   */
  static build<T extends BaseEntity = BaseEntity>(
    key: keyof T | string,
    label: string,
    callback: BuilderCallback<Column<T>, ColumnBuilder<T>>
  ): Column<T> {
    const builder = new ColumnBuilder<T>(key, label);
    const result = callback(builder);
    return result || builder.build();
  }
}
