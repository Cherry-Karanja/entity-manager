/**
 * Configuration Exports
 * 
 * Public API for configuration builders and adapters.
 */

// Builders
export { EntityConfigBuilder } from './EntityConfigBuilder';
export { FieldBuilder } from './FieldBuilder';
export { ColumnBuilder } from './ColumnBuilder';
export { ActionBuilder } from './ActionBuilder';

// Adapters
export {
  JsonSchemaAdapter,
  OpenApiAdapter,
  TypeScriptInterfaceAdapter,
  DatabaseSchemaAdapter,
  AdapterFactory
} from './adapters';

// Types
export type {
  EntityConfig,
  BuilderCallback,
  FieldBuilderOptions,
  ColumnBuilderOptions,
  ActionBuilderOptions,
  ConfigAdapter
} from './types';
