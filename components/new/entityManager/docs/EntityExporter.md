# EntityExporter Component

Export component with 3 formats (CSV, JSON, XLSX), field selection, and custom formatters.

## Features

- **3 Export Formats**: CSV, JSON, XLSX (Excel)
- **Field Selection**: Choose which fields to export
- **Custom Formatters**: Transform values during export
- **Large Dataset Support**: Streaming for large exports
- **Filename Customization**: Dynamic filename generation
- **Progress Tracking**: Progress for large exports

## Usage

### Basic Example

```typescript
import { EntityExporter } from '@/components/new/entityManager';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

const fields = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'createdAt', label: 'Created', type: 'date' }
];

function ExportUsers({ users }: { users: User[] }) {
  return (
    <EntityExporter<User>
      data={users}
      fields={fields}
      formats={['csv', 'json', 'xlsx']}
      filename="users"
    />
  );
}
```

### CSV Export

```typescript
<EntityExporter
  data={users}
  fields={fields}
  formats={['csv']}
  filename="users.csv"
  csvConfig={{
    delimiter: ',',
    includeHeaders: true,
    encoding: 'utf-8',
    bom: true // Add BOM for Excel compatibility
  }}
/>
```

### JSON Export

```typescript
<EntityExporter
  data={users}
  fields={fields}
  formats={['json']}
  filename="users.json"
  jsonConfig={{
    pretty: true, // Pretty print with indentation
    indent: 2,
    includeMetadata: true,
    metadata: {
      exportedAt: new Date(),
      exportedBy: currentUser.id,
      totalRecords: users.length
    }
  }}
/>
```

### XLSX (Excel) Export

```typescript
<EntityExporter
  data={users}
  fields={fields}
  formats={['xlsx']}
  filename="users.xlsx"
  xlsxConfig={{
    sheetName: 'Users',
    includeHeaders: true,
    autoFilter: true,
    freezeHeader: true,
    columnWidths: 'auto', // or { name: 20, email: 30 }
    styles: {
      header: {
        bold: true,
        bgColor: '#4A90E2',
        textColor: '#FFFFFF'
      },
      cell: {
        wrapText: false
      }
    }
  }}
/>
```

### Field Selection

```typescript
function UserExportWithSelection() {
  const [selectedFields, setSelectedFields] = useState([
    'name', 'email', 'role'
  ]);

  const availableFields = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'phone', label: 'Phone' },
    { key: 'createdAt', label: 'Created', type: 'date' },
    { key: 'updatedAt', label: 'Updated', type: 'date' }
  ];

  return (
    <EntityExporter
      data={users}
      fields={availableFields}
      formats={['csv', 'json', 'xlsx']}
      filename="users"
      
      // Enable field selection UI
      fieldSelection
      selectedFields={selectedFields}
      onFieldSelectionChange={setSelectedFields}
    />
  );
}
```

### Custom Formatters

```typescript
const fields = [
  {
    key: 'name',
    label: 'Name',
    formatter: (value) => value.toUpperCase()
  },
  {
    key: 'email',
    label: 'Email',
    formatter: (value) => value.toLowerCase()
  },
  {
    key: 'salary',
    label: 'Salary',
    type: 'number',
    formatter: (value) => `$${value.toLocaleString('en-US')}`
  },
  {
    key: 'createdAt',
    label: 'Created',
    type: 'date',
    formatter: (value) => 
      new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
  },
  {
    key: 'status',
    label: 'Status',
    formatter: (value) => {
      const statusMap = {
        active: 'Active',
        inactive: 'Inactive',
        pending: 'Pending Approval'
      };
      return statusMap[value] || value;
    }
  },
  {
    key: 'roles',
    label: 'Roles',
    type: 'array',
    formatter: (value: string[]) => value.join(', ')
  }
];
```

### Nested Fields

```typescript
const fields = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  
  // Nested object fields
  { key: 'address.street', label: 'Street' },
  { key: 'address.city', label: 'City' },
  { key: 'address.state', label: 'State' },
  { key: 'address.zip', label: 'ZIP' },
  
  // Related entity
  {
    key: 'company.name',
    label: 'Company',
    formatter: (value, entity) => 
      entity.company ? entity.company.name : 'N/A'
  },
  
  // Computed field
  {
    key: 'fullAddress',
    label: 'Full Address',
    formatter: (value, entity) => 
      `${entity.address.street}, ${entity.address.city}, ${entity.address.state} ${entity.address.zip}`
  }
];
```

### Large Dataset Export with Progress

```typescript
function LargeDatasetExport() {
  const [progress, setProgress] = useState(0);
  const [exporting, setExporting] = useState(false);

  return (
    <EntityExporter
      data={largeDataset} // e.g., 100,000+ records
      fields={fields}
      formats={['csv', 'xlsx']}
      filename="large-export"
      
      // Enable streaming for large datasets
      streaming
      chunkSize={1000} // Process 1000 records at a time
      
      // Track progress
      onProgress={setProgress}
      onExportStart={() => setExporting(true)}
      onExportComplete={() => {
        setExporting(false);
        setProgress(0);
      }}
      
      // Show progress UI
      showProgress
    />
  );
}
```

### Filtered/Selected Export

```typescript
function UserListWithExport() {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  return (
    <div>
      <div className="toolbar">
        {/* Export selected users */}
        {selectedUsers.length > 0 && (
          <EntityExporter
            data={selectedUsers}
            fields={fields}
            formats={['csv', 'xlsx']}
            filename={`users-selected-${selectedUsers.length}`}
            buttonLabel={`Export Selected (${selectedUsers.length})`}
          />
        )}
        
        {/* Export filtered users */}
        <EntityExporter
          data={filteredUsers}
          fields={fields}
          formats={['csv', 'json', 'xlsx']}
          filename="users-filtered"
          buttonLabel="Export All Filtered"
        />
      </div>

      <EntityList
        data={users}
        columns={columns}
        selectable
        multiSelect
        onSelectionChange={(ids) => {
          const selected = users.filter(u => ids.has(u.id));
          setSelectedUsers(selected);
        }}
        onFilterChange={(filters) => {
          const filtered = applyFilters(users, filters);
          setFilteredUsers(filtered);
        }}
      />
    </div>
  );
}
```

### Custom Export Button

```typescript
<EntityExporter
  data={users}
  fields={fields}
  formats={['csv', 'json', 'xlsx']}
  filename="users"
  
  // Custom button rendering
  renderButton={(exportFn, format) => (
    <button
      onClick={() => exportFn(format)}
      className="btn btn-primary"
    >
      <DownloadIcon />
      Export as {format.toUpperCase()}
    </button>
  )}
/>
```

### Multiple Format Exports

```typescript
<EntityExporter
  data={users}
  fields={fields}
  formats={['csv', 'json', 'xlsx']}
  filename="users"
  
  // Show separate button for each format
  layout="separate" // or 'dropdown' for single button
  
  // Customize labels
  formatLabels={{
    csv: 'Export CSV',
    json: 'Export JSON',
    xlsx: 'Export Excel'
  }}
/>
```

## Props

### EntityExporterProps<T>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | required | Data to export |
| `fields` | `ExportField<T>[]` | required | Field definitions |
| `formats` | `ExportFormat[]` | `['csv']` | Export formats (csv, json, xlsx) |
| `filename` | `string` | `'export'` | Export filename (without extension) |
| `buttonLabel` | `string` | `'Export'` | Button label |
| `layout` | `'dropdown'\|'separate'` | `'dropdown'` | Button layout |
| `formatLabels` | `Record<ExportFormat, string>` | - | Custom format labels |
| `fieldSelection` | `boolean` | `false` | Enable field selection UI |
| `selectedFields` | `string[]` | - | Selected field keys |
| `onFieldSelectionChange` | `(fields) => void` | - | Field selection handler |
| `csvConfig` | `CSVConfig` | - | CSV export configuration |
| `jsonConfig` | `JSONConfig` | - | JSON export configuration |
| `xlsxConfig` | `XLSXConfig` | - | XLSX export configuration |
| `streaming` | `boolean` | `false` | Enable streaming for large datasets |
| `chunkSize` | `number` | `1000` | Chunk size for streaming |
| `showProgress` | `boolean` | `false` | Show progress indicator |
| `onProgress` | `(progress: number) => void` | - | Progress callback (0-100) |
| `onExportStart` | `() => void` | - | Export start callback |
| `onExportComplete` | `() => void` | - | Export complete callback |
| `onExportError` | `(error) => void` | - | Export error callback |
| `renderButton` | `Component` | - | Custom button renderer |
| `className` | `string` | `''` | Custom CSS class |

### ExportField Definition

| Prop | Type | Description |
|------|------|-------------|
| `key` | `keyof T \| string` | Field key (supports nested paths) |
| `label` | `string` | Column header label |
| `type` | `'text'\|'number'\|'date'\|'boolean'\|'array'\|'object'` | Field type (affects formatting) |
| `formatter` | `(value, entity, index) => string\|number` | Value formatter |
| `visible` | `boolean` | Field visibility |
| `order` | `number` | Column order |

### CSVConfig

| Prop | Type | Default |
|------|------|---------|
| `delimiter` | `string` | `','` |
| `lineBreak` | `string` | `'\n'` |
| `includeHeaders` | `boolean` | `true` |
| `encoding` | `'utf-8'\|'utf-16'` | `'utf-8'` |
| `bom` | `boolean` | `true` |
| `quoteStrings` | `boolean` | `true` |

### JSONConfig

| Prop | Type | Default |
|------|------|---------|
| `pretty` | `boolean` | `true` |
| `indent` | `number` | `2` |
| `includeMetadata` | `boolean` | `false` |
| `metadata` | `object` | - |

### XLSXConfig

| Prop | Type | Default |
|------|------|---------|
| `sheetName` | `string` | `'Sheet1'` |
| `includeHeaders` | `boolean` | `true` |
| `autoFilter` | `boolean` | `false` |
| `freezeHeader` | `boolean` | `false` |
| `columnWidths` | `'auto'\|object` | `'auto'` |
| `styles` | `object` | - |

## Examples

See the [demo page](../examples/EntityExporterDemo.tsx) for live examples.

## Performance

- Use `streaming` for datasets >10,000 records
- Consider server-side export for >100,000 records
- XLSX export is slower than CSV for large datasets
