# EntityList Component

Complete list component with 8 view modes, search, filter, sort, and pagination.

## Features

- **8 View Modes**: table, card, list, grid, compact, timeline, detailed, gallery
- **Search**: Full-text search across columns
- **Filter**: Advanced filtering with multiple operators
- **Sort**: Single or multi-column sorting
- **Pagination**: Client-side or server-side pagination
- **Selection**: Single or multi-select with bulk actions
- **Row Actions**: Custom actions per row
- **Responsive**: Works on all screen sizes

## Usage

### Basic Example

```typescript
import { EntityList } from '@/components/new/entityManager';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', filterable: true },
  { key: 'createdAt', label: 'Created', type: 'date', sortable: true }
];

function UserList() {
  return (
    <EntityList<User>
      data={users}
      columns={columns}
      view="table"
      pagination
      sortable
      searchable
      selectable
    />
  );
}
```

### With All Features

```typescript
function AdvancedUserList() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState({ field: 'createdAt', direction: 'desc' });
  const [filters, setFilters] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  return (
    <EntityList<User>
      data={users}
      columns={columns}
      view="table"
      
      // Toolbar
      toolbar={{
        search: true,
        filters: true,
        viewSwitcher: true,
        columnSelector: true,
        refresh: true,
        export: true
      }}
      
      // Selection
      selectable
      multiSelect
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      
      // Pagination
      pagination
      paginationConfig={{ page, pageSize }}
      onPaginationChange={(config) => {
        setPage(config.page);
        setPageSize(config.pageSize);
      }}
      
      // Sorting
      sortable
      sortConfig={sort}
      onSortChange={setSort}
      
      // Filtering
      filterable
      filterConfigs={filters}
      onFilterChange={setFilters}
      
      // Search
      searchable
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search users..."
      
      // Interaction
      onRowClick={(user) => console.log('Clicked:', user)}
      onRowDoubleClick={(user) => navigate(`/users/${user.id}`)}
      
      // Styling
      hover
      striped
      bordered
    
      bulkActions={
        <div>
          <button onClick={handleBulkDelete}>Delete Selected</button>
          <button onClick={handleBulkExport}>Export Selected</button>
        </div>
      }
    />
  );
}
```

### Different View Modes

```typescript
// Table view
<EntityList data={users} columns={columns} view="table" />

// Card view with images
<EntityList 
  data={users} 
  columns={columns} 
  view="card"
  imageField="avatar"
  titleField="name"
  subtitleField="email"
/>

// Grid view
<EntityList data={users} columns={columns} view="grid" />

// List view
<EntityList 
  data={users} 
  columns={columns} 
  view="list"
  titleField="name"
  subtitleField="role"
/>

// Timeline view
<EntityList 
  data={events} 
  columns={columns} 
  view="timeline"
  dateField="createdAt"
  titleField="title"
/>

// Gallery view (images)
<EntityList 
  data={photos} 
  columns={columns} 
  view="gallery"
  imageField="url"
  titleField="caption"
/>
```

### Custom Column Rendering

```typescript
const columns = [
  {
    key: 'name',
    label: 'Name',
    render: (value, entity) => (
      <div className="flex items-center">
        <img src={entity.avatar} className="w-8 h-8 rounded-full mr-2" />
        <span className="font-medium">{value}</span>
      </div>
    )
  },
  {
    key: 'email',
    label: 'Email',
    formatter: (value) => value.toLowerCase()
  },
  {
    key: 'status',
    label: 'Status',
    render: (value) => (
      <span className={`badge badge-${value}`}>
        {value}
      </span>
    )
  },
  {
    key: 'salary',
    label: 'Salary',
    type: 'number',
    formatter: (value) => `$${value.toLocaleString()}`
  }
];
```

## Props

### EntityListProps<T>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | required | Array of entities to display |
| `columns` | `Column<T>[]` | required | Column definitions |
| `view` | `ListView` | `'table'` | View mode (table, card, list, grid, compact, timeline, detailed, gallery) |
| `toolbar` | `ToolbarConfig` | `{}` | Toolbar configuration |
| `selectable` | `boolean` | `false` | Enable row selection |
| `multiSelect` | `boolean` | `false` | Allow multiple selection |
| `selectedIds` | `Set<string\|number>` | - | Controlled selected IDs |
| `onSelectionChange` | `(ids: Set) => void` | - | Selection change handler |
| `onRowClick` | `(entity, index) => void` | - | Row click handler |
| `onRowDoubleClick` | `(entity, index) => void` | - | Row double click handler |
| `pagination` | `boolean` | `false` | Enable pagination |
| `paginationConfig` | `PaginationConfig` | - | Pagination configuration |
| `onPaginationChange` | `(config) => void` | - | Pagination change handler |
| `sortable` | `boolean` | `false` | Enable sorting |
| `sortConfig` | `SortConfig` | - | Current sort configuration |
| `onSortChange` | `(config) => void` | - | Sort change handler |
| `filterable` | `boolean` | `false` | Enable filtering |
| `filterConfigs` | `FilterConfig[]` | - | Active filters |
| `onFilterChange` | `(filters) => void` | - | Filter change handler |
| `searchable` | `boolean` | `false` | Enable search |
| `searchValue` | `string` | - | Search query |
| `onSearchChange` | `(value) => void` | - | Search change handler |
| `searchPlaceholder` | `string` | `'Search...'` | Search input placeholder |
| `emptyMessage` | `string` | `'No data available'` | Empty state message |
| `loading` | `boolean` | `false` | Loading state |
| `error` | `Error\|string` | - | Error state |
| `rowHeight` | `number\|'auto'` | `'auto'` | Row height |
| `bulkActions` | `ReactNode` | - | Bulk actions component |
| `className` | `string` | `''` | Custom CSS class |
| `rowClassName` | `(entity, index) => string` | - | Row className function |
| `hover` | `boolean` | `true` | Enable row hover effect |
| `striped` | `boolean` | `false` | Striped rows |
| `bordered` | `boolean` | `false` | Bordered table |
| `titleField` | `string` | - | Field for card/list title |
| `subtitleField` | `string` | - | Field for card/list subtitle |
| `imageField` | `string` | - | Field for gallery images |
| `dateField` | `string` | - | Field for timeline dates |

### Column Definition

| Prop | Type | Description |
|------|------|-------------|
| `key` | `keyof T \| string` | Column key (supports nested paths like 'user.name') |
| `label` | `string` | Column header label |
| `width` | `number\|string` | Column width |
| `sortable` | `boolean` | Enable sorting for this column |
| `filterable` | `boolean` | Enable filtering for this column |
| `align` | `'left'\|'center'\|'right'` | Column alignment |
| `render` | `(value, entity, index) => ReactNode` | Custom cell renderer |
| `formatter` | `(value, entity) => string\|number` | Value formatter |
| `type` | `'text'\|'number'\|'date'\|'boolean'\|'select'` | Column type (affects filtering) |
| `filterOptions` | `{label, value}[]` | Options for select filter |
| `visible` | `boolean` | Column visibility |
| `fixed` | `'left'\|'right'` | Fixed column position |
| `order` | `number` | Column display order |

## Examples

See the [demo page](../examples/EntityListDemo.tsx) for live examples.

## Styling

The component uses semantic CSS classes that can be styled:

```css
.entity-list { }
.entity-list-toolbar { }
.entity-list-table { }
.entity-list-cards { }
.entity-list-list { }
.entity-list-grid { }
.entity-list-timeline { }
.entity-list-gallery { }
.entity-list-pagination { }
.entity-list-loading { }
.entity-list-empty { }
.entity-list-error { }
```

## Performance

- Virtualization recommended for >1000 rows
- Use `memo` for custom renderers
- Debounce search input
- Server-side pagination for large datasets
