/**
 * Configuration Adapters
 * 
 * Adapters for converting external configurations to internal format.
 */

import { EntityConfig, ConfigAdapter } from './types';
import { BaseEntity } from '../../primitives/types';

/**
 * JSON Schema adapter
 * Converts JSON Schema to entity config
 */
export class JsonSchemaAdapter implements ConfigAdapter<any> {
  adapt(schema: any): Partial<EntityConfig> {
    const config: Partial<EntityConfig> = {
      name: schema.title || 'Entity',
      description: schema.description,
      fields: [],
      columns: [],
      viewFields: []
    };

    // Convert properties to fields
    if (schema.properties) {
      Object.entries(schema.properties).forEach(([key, prop]: [string, any]) => {
        const field: any = {
          name: key,
          label: prop.title || key,
          type: this.mapType(prop.type),
          required: schema.required?.includes(key),
          helpText: prop.description
        };

        // Add validation
        if (prop.minLength) field.minLength = prop.minLength;
        if (prop.maxLength) field.maxLength = prop.maxLength;
        if (prop.minimum) field.min = prop.minimum;
        if (prop.maximum) field.max = prop.maximum;
        if (prop.pattern) field.validation = [{ type: 'pattern', value: prop.pattern }];
        if (prop.enum) field.options = prop.enum.map((v: any) => ({ label: v, value: v }));

        config.fields!.push(field);
        
        // Add as column
        config.columns!.push({
          key,
          label: prop.title || key,
          type: this.mapColumnType(prop.type),
          sortable: true,
          filterable: true
        });
        
        // Add as view field
        config.viewFields!.push({
          key,
          label: prop.title || key,
          type: this.mapType(prop.type)
        });
      });
    }

    return config;
  }

  private mapType(jsonType: string): string {
    const typeMap: Record<string, string> = {
      'string': 'text',
      'number': 'number',
      'integer': 'number',
      'boolean': 'checkbox',
      'array': 'multiselect',
      'object': 'json'
    };
    return typeMap[jsonType] || 'text';
  }

  private mapColumnType(jsonType: string): 'text' | 'number' | 'date' | 'boolean' | 'select' {
    const typeMap: Record<string, any> = {
      'string': 'text',
      'number': 'number',
      'integer': 'number',
      'boolean': 'boolean'
    };
    return typeMap[jsonType] || 'text';
  }

  validate(schema: any): boolean {
    return schema && typeof schema === 'object' && (schema.properties || schema.type);
  }
}

/**
 * OpenAPI adapter
 * Converts OpenAPI schema to entity config
 */
export class OpenApiAdapter implements ConfigAdapter<any> {
  adapt(schema: any): Partial<EntityConfig> {
    // OpenAPI schemas are similar to JSON Schema
    const jsonSchemaAdapter = new JsonSchemaAdapter();
    const config = jsonSchemaAdapter.adapt(schema);
    
    // Add OpenAPI-specific metadata
    if (schema['x-entity-config']) {
      Object.assign(config, schema['x-entity-config']);
    }
    
    return config;
  }

  validate(schema: any): boolean {
    return schema && typeof schema === 'object' && schema.properties;
  }
}

/**
 * TypeScript interface adapter
 * Converts TypeScript interface metadata to entity config
 */
export class TypeScriptInterfaceAdapter implements ConfigAdapter<any> {
  adapt(metadata: any): Partial<EntityConfig> {
    const config: Partial<EntityConfig> = {
      name: metadata.name || 'Entity',
      fields: [],
      columns: [],
      viewFields: []
    };

    if (metadata.properties) {
      metadata.properties.forEach((prop: any) => {
        const field: any = {
          name: prop.name,
          label: this.toLabel(prop.name),
          type: this.mapTsType(prop.type),
          required: !prop.optional
        };

        config.fields!.push(field);
        config.columns!.push({
          key: prop.name,
          label: this.toLabel(prop.name),
          sortable: true
        });
        config.viewFields!.push({
          key: prop.name,
          label: this.toLabel(prop.name)
        });
      });
    }

    return config;
  }

  private toLabel(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private mapTsType(tsType: string): string {
    const typeMap: Record<string, string> = {
      'string': 'text',
      'number': 'number',
      'boolean': 'checkbox',
      'Date': 'date',
      'Array': 'multiselect'
    };
    return typeMap[tsType] || 'text';
  }

  validate(metadata: any): boolean {
    return metadata && metadata.properties && Array.isArray(metadata.properties);
  }
}

/**
 * Database schema adapter
 * Converts database schema to entity config
 */
export class DatabaseSchemaAdapter implements ConfigAdapter<any> {
  adapt(schema: any): Partial<EntityConfig> {
    const config: Partial<EntityConfig> = {
      name: schema.tableName || 'Entity',
      fields: [],
      columns: [],
      viewFields: []
    };

    if (schema.columns) {
      schema.columns.forEach((col: any) => {
        const field: any = {
          name: col.name,
          label: this.toLabel(col.name),
          type: this.mapDbType(col.type),
          required: !col.nullable
        };

        // Add constraints
        if (col.maxLength) field.maxLength = col.maxLength;
        if (col.defaultValue !== undefined) field.defaultValue = col.defaultValue;

        config.fields!.push(field);
        config.columns!.push({
          key: col.name,
          label: this.toLabel(col.name),
          type: this.mapColumnDbType(col.type),
          sortable: true,
          filterable: true
        });
        config.viewFields!.push({
          key: col.name,
          label: this.toLabel(col.name)
        });
      });
    }

    return config;
  }

  private toLabel(name: string): string {
    return name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  private mapDbType(dbType: string): string {
    const type = dbType.toLowerCase();
    if (type.includes('varchar') || type.includes('text')) return 'text';
    if (type.includes('int') || type.includes('decimal') || type.includes('float')) return 'number';
    if (type.includes('bool')) return 'checkbox';
    if (type.includes('date') || type.includes('time')) return 'date';
    if (type.includes('json')) return 'json';
    return 'text';
  }

  private mapColumnDbType(dbType: string): 'text' | 'number' | 'date' | 'boolean' | 'select' {
    const type = dbType.toLowerCase();
    if (type.includes('int') || type.includes('decimal') || type.includes('float')) return 'number';
    if (type.includes('bool')) return 'boolean';
    if (type.includes('date') || type.includes('time')) return 'date';
    return 'text';
  }

  validate(schema: any): boolean {
    return schema && schema.columns && Array.isArray(schema.columns);
  }
}

/**
 * Adapter factory
 */
export class AdapterFactory {
  private static adapters: Map<string, ConfigAdapter> = new Map([
    ['jsonSchema', new JsonSchemaAdapter()],
    ['openApi', new OpenApiAdapter()],
    ['typescript', new TypeScriptInterfaceAdapter()],
    ['database', new DatabaseSchemaAdapter()]
  ]);

  /**
   * Register a custom adapter
   */
  static register(name: string, adapter: ConfigAdapter): void {
    this.adapters.set(name, adapter);
  }

  /**
   * Get adapter by name
   */
  static get(name: string): ConfigAdapter | undefined {
    return this.adapters.get(name);
  }

  /**
   * Auto-detect and adapt
   */
  static adapt(data: any): Partial<EntityConfig> | null {
    for (const [name, adapter] of this.adapters) {
      if (adapter.validate && adapter.validate(data)) {
        return adapter.adapt(data);
      }
    }
    return null;
  }
}
