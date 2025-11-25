/**
 * Configuration Adapters
 * 
 * Adapters for converting external configurations to internal format.
 */

import { EntityConfig, ConfigAdapter } from './types';
import { BaseEntity } from '../../primitives/types';
import { FormField } from '../../components/form/types';
import { Column } from '../../components/list/types';
import { ViewField } from '../../components/view/types';

/**
 * Helper interface for adapter internal state
 */
interface AdaptedConfig {
  name: string;
  description?: string;
  formFields: FormField<BaseEntity>[];
  columns: Column<BaseEntity>[];
  viewFields: ViewField<BaseEntity>[];
}

/**
 * JSON Schema adapter
 * Converts JSON Schema to entity config
 */
export class JsonSchemaAdapter implements ConfigAdapter<any> {
  adapt(schema: any): Partial<EntityConfig> {
    const adaptedConfig: AdaptedConfig = {
      name: schema.title || 'Entity',
      description: schema.description,
      formFields: [],
      columns: [],
      viewFields: []
    };

    // Convert properties to fields
    if (schema.properties) {
      Object.entries(schema.properties).forEach(([key, prop]: [string, any]) => {
        const formField: FormField<BaseEntity> = {
          name: key,
          label: prop.title || key,
          type: this.mapFormType(prop.type),
          required: schema.required?.includes(key),
          helpText: prop.description
        };

        // Add validation
        if (prop.minLength) formField.minLength = prop.minLength;
        if (prop.maxLength) formField.maxLength = prop.maxLength;
        if (prop.minimum) formField.min = prop.minimum;
        if (prop.maximum) formField.max = prop.maximum;
        if (prop.pattern) formField.validation = [{ type: 'pattern', value: prop.pattern, message: `Value must match pattern: ${prop.pattern}` }];
        if (prop.enum) formField.options = prop.enum.map((v: any) => ({ label: v, value: v }));

        adaptedConfig.formFields.push(formField);
        
        // Add as column
        adaptedConfig.columns.push({
          key,
          label: prop.title || key,
          type: this.mapColumnType(prop.type),
          sortable: true,
          filterable: true
        });
        
        // Add as view field
        adaptedConfig.viewFields.push({
          key,
          label: prop.title || key,
          type: this.mapViewType(prop.type)
        });
      });
    }

    return {
      name: adaptedConfig.name,
      description: adaptedConfig.description,
      label: adaptedConfig.name,
      labelPlural: adaptedConfig.name + 's',
      list: {
        columns: adaptedConfig.columns,
      },
      form: {
        fields: adaptedConfig.formFields,
      },
      view: {
        fields: adaptedConfig.viewFields,
      },
      actions: {
        actions: [],
      },
      exporter: {
        fields: [],
      },
    };
  }

  private mapFormType(jsonType: string): FormField<BaseEntity>['type'] {
    const typeMap: Record<string, FormField<BaseEntity>['type']> = {
      'string': 'text',
      'number': 'number',
      'integer': 'number',
      'boolean': 'checkbox',
      'array': 'json',
      'object': 'json'
    };
    return typeMap[jsonType] || 'text';
  }

  private mapColumnType(jsonType: string): Column<BaseEntity>['type'] {
    const typeMap: Record<string, Column<BaseEntity>['type']> = {
      'string': 'text',
      'number': 'number',
      'integer': 'number',
      'boolean': 'boolean'
    };
    return typeMap[jsonType] || 'text';
  }

  private mapViewType(jsonType: string): ViewField<BaseEntity>['type'] {
    const typeMap: Record<string, ViewField<BaseEntity>['type']> = {
      'string': 'text',
      'number': 'number',
      'integer': 'number',
      'boolean': 'boolean',
      'array': 'json',
      'object': 'json'
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
    const adaptedConfig: AdaptedConfig = {
      name: metadata.name || 'Entity',
      formFields: [],
      columns: [],
      viewFields: []
    };

    if (metadata.properties) {
      metadata.properties.forEach((prop: any) => {
        const formField: FormField<BaseEntity> = {
          name: prop.name,
          label: this.toLabel(prop.name),
          type: this.mapTsFormType(prop.type),
          required: !prop.optional
        };

        adaptedConfig.formFields.push(formField);
        adaptedConfig.columns.push({
          key: prop.name,
          label: this.toLabel(prop.name),
          sortable: true
        });
        adaptedConfig.viewFields.push({
          key: prop.name,
          label: this.toLabel(prop.name)
        });
      });
    }

    return {
      name: adaptedConfig.name,
      label: adaptedConfig.name,
      labelPlural: adaptedConfig.name + 's',
      list: {
        columns: adaptedConfig.columns,
      },
      form: {
        fields: adaptedConfig.formFields,
      },
      view: {
        fields: adaptedConfig.viewFields,
      },
      actions: {
        actions: [],
      },
      exporter: {
        fields: [],
      },
    };
  }

  private toLabel(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private mapTsFormType(tsType: string): FormField<BaseEntity>['type'] {
    const typeMap: Record<string, FormField<BaseEntity>['type']> = {
      'string': 'text',
      'number': 'number',
      'boolean': 'checkbox',
      'Date': 'date',
      'Array': 'custom'
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
    const adaptedConfig: AdaptedConfig = {
      name: schema.tableName || 'Entity',
      formFields: [],
      columns: [],
      viewFields: []
    };

    if (schema.columns) {
      schema.columns.forEach((col: any) => {
        const formField: FormField<BaseEntity> = {
          name: col.name,
          label: this.toLabel(col.name),
          type: this.mapDbFormType(col.type),
          required: !col.nullable
        };

        // Add constraints
        if (col.maxLength) formField.maxLength = col.maxLength;
        if (col.defaultValue !== undefined) formField.defaultValue = col.defaultValue;

        adaptedConfig.formFields.push(formField);
        adaptedConfig.columns.push({
          key: col.name,
          label: this.toLabel(col.name),
          type: this.mapColumnDbType(col.type),
          sortable: true,
          filterable: true
        });
        adaptedConfig.viewFields.push({
          key: col.name,
          label: this.toLabel(col.name)
        });
      });
    }

    return {
      name: adaptedConfig.name,
      label: adaptedConfig.name,
      labelPlural: adaptedConfig.name + 's',
      list: {
        columns: adaptedConfig.columns,
      },
      form: {
        fields: adaptedConfig.formFields,
      },
      view: {
        fields: adaptedConfig.viewFields,
      },
      actions: {
        actions: [],
      },
      exporter: {
        fields: [],
      },
    };
  }

  private toLabel(name: string): string {
    return name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  private mapDbFormType(dbType: string): FormField<BaseEntity>['type'] {
    const type = dbType.toLowerCase();
    if (type.includes('varchar') || type.includes('text')) return 'text';
    if (type.includes('int') || type.includes('decimal') || type.includes('float')) return 'number';
    if (type.includes('bool')) return 'checkbox';
    if (type.includes('date') || type.includes('time')) return 'date';
    if (type.includes('json')) return 'json';
    return 'text';
  }

  private mapColumnDbType(dbType: string): Column<BaseEntity>['type'] {
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
