/**
 * Primitives Types Index
 * 
 * Exports all primitive types for easy importing.
 * All types have ZERO dependencies and can be imported anywhere.
 * 
 * @module primitives/types
 */

// Entity types
export type {
  BaseEntity,
  EntityMetadata,
  EntityWithMetadata,
  EntitySelection,
  EntityState,
  ApiResponse,
  PaginatedResponse,
  SortDirection,
  SortConfig,
  FilterOperator,
  FilterConfig,
  PaginationConfig,
  SearchConfig,
} from './entity';

// Field types
export type {
  FieldType,
  FieldAlignment,
  FieldWidth,
  FieldDefinition,
  FieldOption,
  TextFieldConfig,
  NumberFieldConfig,
  SelectFieldConfig,
  DateFieldConfig,
  TextareaFieldConfig,
  FileFieldConfig,
  RelationFieldConfig,
  BooleanFieldConfig,
  AnyFieldConfig,
  FieldGroup,
} from './field';

// Action types
export type {
  ActionType,
  ActionVariant,
  ActionSize,
  ActionPosition,
  ActionDefinition,
  ImmediateAction,
  ConfirmAction,
  FormAction,
  ModalAction,
  NavigationAction,
  BulkAction,
  DownloadAction,
  CustomAction,
  AnyActionConfig,
  ActionContext,
  ModalContentProps,
  CustomActionProps,
  ActionResult,
  ActionPermission,
} from './action';

// Validation types
export type {
  ValidationRuleType,
  ValidationSeverity,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationRule,
  RequiredRule,
  LengthRule,
  NumberRule,
  PatternRule,
  EmailRule,
  UrlRule,
  CustomRule,
  AnyValidationRule,
  FieldValidation,
  ValidationSchema,
  CrossFieldValidation,
  ValidationState,
} from './validation';

// API types
export type {
  HttpMethod,
  ApiEndpoint,
  EntityEndpoints,
  ApiRequest,
  ListQueryParams,
  CreateRequest,
  UpdateRequest,
  DeleteRequest,
  BulkCreateRequest,
  BulkUpdateRequest,
  BulkDeleteRequest,
  ExportRequest,
  ApiError,
  MutationResult,
  CacheConfig,
} from './api';

// Config types
export type {
  ViewMode,
  FormLayout,
  DetailViewMode,
  PermissionConfig,
  DisplayConfig,
  ListConfig,
  FormConfig,
  ViewConfig,
  EntityConfig,
  FeatureFlags,
  ThemeConfig,
  GlobalConfig,
} from './config';
