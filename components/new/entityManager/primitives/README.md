# Primitives Layer

**Layer 1: Zero Dependencies Foundation**

The primitives layer provides the core building blocks for the entire entity management system. All types, hooks, and utilities in this layer have **ZERO internal dependencies** and can be safely imported anywhere without risk of circular dependencies or coupling.

## Overview

### Structure

```
primitives/
├── types/          # Type definitions
├── hooks/          # Primitive React hooks  
├── utils/          # Pure utility functions
└── index.ts        # Public API
```

### Design Principles

1. **Zero Dependencies**: No internal imports between modules
2. **Pure Functions**: All utilities are side-effect free
3. **Type Safety**: Full TypeScript coverage with strict mode
4. **Reusability**: Can be used in any context
5. **Tree-shakeable**: Import only what you need

## Types

### Entity Types (`types/entity.ts`)

Core entity interfaces and types:

- `BaseEntity` - Minimal entity contract
- `EntityMetadata` - Entity metadata (timestamps, audit fields)
- `EntitySelection` - Selection state
- `PaginatedResponse` - API pagination response
- `SortConfig` - Sort configuration
- `FilterConfig` - Filter configuration
- `PaginationConfig` - Pagination state

### Field Types (`types/field.ts`)

Field definition types for forms and displays:

- `FieldType` - 30+ supported field types
- `FieldDefinition` - Base field configuration
- `TextFieldConfig` - Text input fields
- `NumberFieldConfig` - Number fields
- `SelectFieldConfig` - Select/dropdown fields
- `DateFieldConfig` - Date/time fields
- `FileFieldConfig` - File upload fields
- `RelationFieldConfig` - Relationship fields
- `FieldGroup` - Field grouping

### Action Types (`types/action.ts`)

Action definitions for entity operations:

- `ActionType` - 8 action types
- `ActionDefinition` - Base action configuration
- `ImmediateAction` - Execute immediately
- `ConfirmAction` - Require confirmation
- `FormAction` - Show form modal
- `ModalAction` - Custom modal
- `NavigationAction` - Navigate to URL
- `BulkAction` - Batch operations
- `DownloadAction` - Export/download
- `CustomAction` - Custom handler

### Validation Types (`types/validation.ts`)

Validation rules and schemas:

- `ValidationRule` - Base validation rule
- `ValidationSchema` - Form validation schema
- `ValidationResult` - Validation result
- `ValidationError` - Validation error
- `CrossFieldValidation` - Multi-field validation

### API Types (`types/api.ts`)

API request/response types:

- `EntityEndpoints` - CRUD endpoints config
- `ApiRequest` - Request configuration
- `ListQueryParams` - List query parameters
- `CreateRequest` - Create request
- `UpdateRequest` - Update request
- `BulkCreateRequest` - Bulk create
- `ExportRequest` - Export configuration
- `ApiError` - Error structure
- `CacheConfig` - Cache configuration

### Config Types (`types/config.ts`)

Configuration types:

- `EntityConfig` - Complete entity configuration
- `PermissionConfig` - Permissions
- `DisplayConfig` - Display settings
- `ListConfig` - List view configuration
- `FormConfig` - Form configuration
- `ViewConfig` - Detail view configuration
- `FeatureFlags` - Feature toggles
- `ThemeConfig` - Theme settings

## Hooks

### useSelection

Manage entity selection state with support for single/multiple selection.

```typescript
import { useSelection } from '@/entityManager/primitives/hooks';

const {
  selectedIds,
  selectedEntities,
  select,
  deselect,
  toggle,
  selectAll,
  clear
} = useSelection({ 
  entities: users, 
  multiple: true 
});
```

**Features:**
- Single or multiple selection
- Maximum selection limit
- Select all / deselect all
- Selection callbacks
- Selection count and state

### usePagination

Manage pagination state with navigation and page size control.

```typescript
import { usePagination } from '@/entityManager/primitives/hooks';

const {
  page,
  pageSize,
  totalPages,
  goToPage,
  nextPage,
  previousPage,
  setPageSize
} = usePagination({
  initialPage: 1,
  initialPageSize: 10,
  totalCount: 100
});
```

**Features:**
- Page navigation (first, last, next, previous)
- Dynamic page size
- Total pages calculation
- Index range calculation
- Page change callbacks

### useFilters

Manage filter state for entity lists.

```typescript
import { useFilters } from '@/entityManager/primitives/hooks';

const {
  filters,
  addFilter,
  removeFilter,
  clearFilters,
  hasFilter
} = useFilters({
  initialFilters: [
    { field: 'status', operator: 'equals', value: 'active' }
  ]
});
```

**Features:**
- Add/remove/update filters
- Multiple filters support
- Filter operators (equals, contains, greaterThan, etc.)
- Clear all filters
- Filter callbacks

### useSort

Manage sort state with toggle support.

```typescript
import { useSort } from '@/entityManager/primitives/hooks';

const {
  sort,
  toggleSort,
  clearSort,
  isSortedBy
} = useSort({
  initialField: 'createdAt',
  initialDirection: 'desc'
});
```

**Features:**
- Toggle sort (asc → desc → none)
- Single field sorting
- Sort callbacks
- Sort state checking

## Utilities

### Validation (`utils/validation.ts`)

Pure validation functions:

```typescript
import { 
  validateSchema, 
  isValidEmail, 
  isValidUrl 
} from '@/entityManager/primitives/utils';

// Validate form data
const result = validateSchema(values, schema);

// Check email
if (isValidEmail(email)) { ... }

// Check URL
if (isValidUrl(website)) { ... }
```

**Functions:**
- `validateRule` - Validate single rule
- `validateField` - Validate field with multiple rules
- `validateSchema` - Validate entire form
- `isValidEmail` - Email validation
- `isValidUrl` - URL validation
- `isValidPhone` - Phone validation
- `isEmpty` - Empty check
- `hasMinLength` / `hasMaxLength` - Length validation
- `isInRange` - Number range validation
- `matchesPattern` - Regex validation

### Formatting (`utils/formatting.ts`)

Data formatting functions:

```typescript
import { 
  formatDate, 
  formatCurrency, 
  formatFileSize 
} from '@/entityManager/primitives/utils';

// Format date
const formatted = formatDate(new Date(), 'YYYY-MM-DD');

// Format currency
const price = formatCurrency(1234.56, 'USD');

// Format file size
const size = formatFileSize(1024000); // "1.00 MB"
```

**Functions:**
- `formatDate` - Date formatting
- `formatCurrency` - Currency formatting
- `formatPercentage` - Percentage formatting
- `formatNumber` - Number formatting with locale
- `formatFileSize` - File size (B, KB, MB, GB)
- `formatPhoneNumber` - Phone number formatting
- `truncate` - Truncate text
- `capitalize` / `titleCase` - Text casing
- `camelToTitle` / `snakeToTitle` - Case conversion
- `formatRelativeTime` - Relative time (e.g., "2 hours ago")
- `formatBoolean` - Boolean to Yes/No
- `formatArray` - Array to comma-separated string

### Transformation (`utils/transformation.ts`)

Data transformation functions:

```typescript
import { 
  deepClone, 
  groupBy, 
  sortBy, 
  filterBy 
} from '@/entityManager/primitives/utils';

// Clone object
const clone = deepClone(original);

// Group by field
const grouped = groupBy(users, 'role');

// Sort array
const sorted = sortBy(users, 'name', 'asc');

// Filter array
const filtered = filterBy(users, filters);
```

**Functions:**
- `deepClone` - Deep copy object
- `deepMerge` - Deep merge objects
- `pick` / `omit` - Select/exclude keys
- `groupBy` - Group array by key
- `sortBy` - Sort array by key
- `filterBy` - Filter array with FilterConfig
- `searchBy` - Search array across fields
- `paginate` - Paginate array
- `uniqueBy` - Remove duplicates by key
- `flatten` - Flatten nested arrays
- `toQueryString` / `fromQueryString` - Query string conversion
- `toApiFormat` / `fromApiFormat` - API transformation

## Usage Examples

### Complete Example

```typescript
import {
  // Types
  type BaseEntity,
  type FieldDefinition,
  type ActionDefinition,
  // Hooks
  useSelection,
  usePagination,
  useFilters,
  useSort,
  // Utils
  formatDate,
  validateSchema,
  sortBy,
  filterBy
} from '@/entityManager/primitives';

interface User extends BaseEntity {
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

function UserList({ users }: { users: User[] }) {
  // Selection
  const selection = useSelection({ entities: users, multiple: true });
  
  // Pagination
  const pagination = usePagination({
    initialPageSize: 10,
    totalCount: users.length
  });
  
  // Filters
  const filters = useFilters();
  
  // Sort
  const sort = useSort({ initialField: 'createdAt', initialDirection: 'desc' });
  
  // Apply filters and sort
  let processedUsers = users;
  if (filters.hasFilters) {
    processedUsers = filterBy(processedUsers, filters.filters);
  }
  if (sort.sort) {
    processedUsers = sortBy(processedUsers, sort.sort.field, sort.sort.direction);
  }
  
  // Render...
}
```

## Testing

All primitives should have **100% test coverage**. Example test structure:

```typescript
// useSelection.test.ts
describe('useSelection', () => {
  it('should select entity', () => { ... });
  it('should deselect entity', () => { ... });
  it('should toggle selection', () => { ... });
  it('should select all', () => { ... });
  it('should respect maxSelections', () => { ... });
});

// validation.test.ts
describe('validateSchema', () => {
  it('should validate required fields', () => { ... });
  it('should validate email format', () => { ... });
  it('should validate cross-field rules', () => { ... });
});
```

## Architecture Compliance

✅ **Zero Dependencies**: No internal imports  
✅ **Pure Functions**: No side effects in utilities  
✅ **Type Safety**: Full TypeScript strict mode  
✅ **Tree-shakeable**: ES modules with named exports  
✅ **Single Responsibility**: Each file has one clear purpose  

## Next Steps

The primitives layer is now complete. Next phase:

**Phase 2: Build Components Layer**
- Import primitives for types
- Create standalone UI components
- Each component works independently
- No dependencies on other components

---

**Layer Status:** ✅ Complete  
**Files:** 17 files  
**Test Coverage Target:** 100%  
**Dependencies:** 0 internal, React only
