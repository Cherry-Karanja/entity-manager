# EntityForm Component

Comprehensive form component with 21 field types, 5 layouts, and advanced validation.

## Features

- **21 Field Types**: text, email, password, number, date, time, datetime, select, multiselect, checkbox, radio, switch, textarea, richtext, file, image, color, range, url, tel, json
- **5 Layouts**: vertical, horizontal, grid, tabs, wizard
- **10 Validation Rules**: required, email, url, min, max, minLength, maxLength, pattern, custom, async
- **Field Dependencies**: Show/hide fields based on values
- **Auto-save**: Optional auto-save on change
- **Dirty Tracking**: Track unsaved changes

## Usage

### Basic Example

```typescript
import { EntityForm } from '@/components/new/entityManager';

interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  bio?: string;
}

const fields = [
  {
    key: 'name',
    type: 'text',
    label: 'Name',
    required: true,
    placeholder: 'Enter name'
  },
  {
    key: 'email',
    type: 'email',
    label: 'Email',
    required: true,
    validation: [{ type: 'email', message: 'Invalid email' }]
  },
  {
    key: 'role',
    type: 'select',
    label: 'Role',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' }
    ]
  },
  {
    key: 'bio',
    type: 'textarea',
    label: 'Bio',
    rows: 4
  }
];

function UserForm() {
  const handleSubmit = async (data: User) => {
    await saveUser(data);
  };

  return (
    <EntityForm<User>
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Save User"
    />
  );
}
```

### All Field Types

```typescript
const allFieldTypes = [
  {
    key: 'text',
    type: 'text',
    label: 'Text Field',
    placeholder: 'Enter text'
  },
  {
    key: 'email',
    type: 'email',
    label: 'Email',
    validation: [{ type: 'email' }]
  },
  {
    key: 'password',
    type: 'password',
    label: 'Password',
    validation: [{ type: 'minLength', value: 8 }]
  },
  {
    key: 'number',
    type: 'number',
    label: 'Number',
    min: 0,
    max: 100,
    step: 1
  },
  {
    key: 'date',
    type: 'date',
    label: 'Date'
  },
  {
    key: 'time',
    type: 'time',
    label: 'Time'
  },
  {
    key: 'datetime',
    type: 'datetime',
    label: 'Date & Time'
  },
  {
    key: 'select',
    type: 'select',
    label: 'Select',
    options: [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' }
    ]
  },
  {
    key: 'multiselect',
    type: 'multiselect',
    label: 'Multi Select',
    options: [
      { label: 'Tag 1', value: '1' },
      { label: 'Tag 2', value: '2' }
    ]
  },
  {
    key: 'checkbox',
    type: 'checkbox',
    label: 'Checkbox',
    description: 'Check to agree'
  },
  {
    key: 'radio',
    type: 'radio',
    label: 'Radio',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' }
    ]
  },
  {
    key: 'switch',
    type: 'switch',
    label: 'Switch',
    description: 'Toggle feature'
  },
  {
    key: 'textarea',
    type: 'textarea',
    label: 'Textarea',
    rows: 5
  },
  {
    key: 'richtext',
    type: 'richtext',
    label: 'Rich Text Editor',
    toolbar: ['bold', 'italic', 'link']
  },
  {
    key: 'file',
    type: 'file',
    label: 'File Upload',
    accept: '.pdf,.doc,.docx',
    maxSize: 5 * 1024 * 1024 // 5MB
  },
  {
    key: 'image',
    type: 'image',
    label: 'Image Upload',
    accept: 'image/*',
    preview: true
  },
  {
    key: 'color',
    type: 'color',
    label: 'Color Picker'
  },
  {
    key: 'range',
    type: 'range',
    label: 'Range Slider',
    min: 0,
    max: 100,
    step: 10
  },
  {
    key: 'url',
    type: 'url',
    label: 'URL',
    validation: [{ type: 'url' }]
  },
  {
    key: 'tel',
    type: 'tel',
    label: 'Phone',
    placeholder: '+1 (555) 000-0000'
  },
  {
    key: 'json',
    type: 'json',
    label: 'JSON Editor',
    formatOnBlur: true
  }
];
```

### Different Layouts

```typescript
// Vertical layout (default)
<EntityForm fields={fields} layout="vertical" />

// Horizontal layout (label beside field)
<EntityForm fields={fields} layout="horizontal" />

// Grid layout (2 columns)
<EntityForm 
  fields={fields} 
  layout="grid"
  gridColumns={2}
/>

// Tabs layout
<EntityForm 
  fields={fields} 
  layout="tabs"
  tabs={[
    { key: 'basic', label: 'Basic Info', fields: ['name', 'email'] },
    { key: 'details', label: 'Details', fields: ['role', 'bio'] }
  ]}
/>

// Wizard layout (multi-step)
<EntityForm 
  fields={fields} 
  layout="wizard"
  steps={[
    { key: 'step1', label: 'Account', fields: ['name', 'email'] },
    { key: 'step2', label: 'Profile', fields: ['role', 'bio'] }
  ]}
/>
```

### Advanced Validation

```typescript
const fields = [
  {
    key: 'username',
    type: 'text',
    label: 'Username',
    validation: [
      { type: 'required', message: 'Username is required' },
      { type: 'minLength', value: 3, message: 'Min 3 characters' },
      { type: 'maxLength', value: 20, message: 'Max 20 characters' },
      { 
        type: 'pattern', 
        value: /^[a-z0-9_]+$/,
        message: 'Only lowercase, numbers, and underscores'
      },
      {
        type: 'async',
        validate: async (value) => {
          const available = await checkUsernameAvailable(value);
          return available ? true : 'Username already taken';
        }
      }
    ]
  },
  {
    key: 'password',
    type: 'password',
    label: 'Password',
    validation: [
      { type: 'required' },
      { type: 'minLength', value: 8 },
      {
        type: 'custom',
        validate: (value) => {
          if (!/[A-Z]/.test(value)) return 'Must contain uppercase';
          if (!/[a-z]/.test(value)) return 'Must contain lowercase';
          if (!/[0-9]/.test(value)) return 'Must contain number';
          return true;
        }
      }
    ]
  },
  {
    key: 'confirmPassword',
    type: 'password',
    label: 'Confirm Password',
    validation: [
      {
        type: 'custom',
        validate: (value, formData) => {
          return value === formData.password || 'Passwords must match';
        }
      }
    ]
  },
  {
    key: 'age',
    type: 'number',
    label: 'Age',
    validation: [
      { type: 'min', value: 18, message: 'Must be 18+' },
      { type: 'max', value: 120, message: 'Invalid age' }
    ]
  }
];
```

### Field Dependencies

```typescript
const fields = [
  {
    key: 'accountType',
    type: 'select',
    label: 'Account Type',
    options: [
      { label: 'Personal', value: 'personal' },
      { label: 'Business', value: 'business' }
    ]
  },
  {
    key: 'companyName',
    type: 'text',
    label: 'Company Name',
    // Only show if account type is business
    visible: (formData) => formData.accountType === 'business',
    required: (formData) => formData.accountType === 'business'
  },
  {
    key: 'taxId',
    type: 'text',
    label: 'Tax ID',
    visible: (formData) => formData.accountType === 'business'
  }
];
```

### Edit Mode

```typescript
function EditUserForm({ userId }: { userId: string }) {
  const [initialData, setInitialData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser(userId).then(user => {
      setInitialData(user);
      setLoading(false);
    });
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <EntityForm<User>
      fields={fields}
      initialData={initialData}
      onSubmit={handleUpdate}
      submitLabel="Update User"
      mode="edit"
    />
  );
}
```

### Auto-save

```typescript
<EntityForm
  fields={fields}
  initialData={data}
  autoSave
  autoSaveDelay={2000} // Save 2s after last change
  onAutoSave={async (data) => {
    await saveDraft(data);
  }}
  onSubmit={handleSubmit}
/>
```

## Props

### EntityFormProps<T>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fields` | `Field<T>[]` | required | Field definitions |
| `initialData` | `Partial<T>` | `{}` | Initial form values |
| `onSubmit` | `(data: T) => Promise<void>` | required | Submit handler |
| `onCancel` | `() => void` | - | Cancel handler |
| `onChange` | `(data: Partial<T>) => void` | - | Value change handler |
| `onValidate` | `(errors) => void` | - | Validation handler |
| `layout` | `'vertical'\|'horizontal'\|'grid'\|'tabs'\|'wizard'` | `'vertical'` | Form layout |
| `gridColumns` | `number` | `2` | Grid layout columns |
| `tabs` | `TabConfig[]` | - | Tab configuration |
| `steps` | `StepConfig[]` | - | Wizard step configuration |
| `mode` | `'create'\|'edit'\|'view'` | `'create'` | Form mode |
| `submitLabel` | `string` | `'Submit'` | Submit button label |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button label |
| `loading` | `boolean` | `false` | Loading state |
| `disabled` | `boolean` | `false` | Disable all fields |
| `readOnly` | `boolean` | `false` | Read-only mode |
| `autoSave` | `boolean` | `false` | Enable auto-save |
| `autoSaveDelay` | `number` | `1000` | Auto-save delay (ms) |
| `onAutoSave` | `(data) => Promise<void>` | - | Auto-save handler |
| `showDirty` | `boolean` | `true` | Show unsaved changes indicator |
| `validateOnChange` | `boolean` | `false` | Validate on every change |
| `validateOnBlur` | `boolean` | `true` | Validate on field blur |
| `className` | `string` | `''` | Custom CSS class |

### Field Definition

| Prop | Type | Description |
|------|------|-------------|
| `key` | `keyof T \| string` | Field key |
| `type` | `FieldType` | Field type (text, email, number, etc.) |
| `label` | `string` | Field label |
| `placeholder` | `string` | Placeholder text |
| `description` | `string` | Help text |
| `required` | `boolean \| (data) => boolean` | Required field |
| `disabled` | `boolean \| (data) => boolean` | Disabled field |
| `readOnly` | `boolean` | Read-only field |
| `visible` | `boolean \| (data) => boolean` | Field visibility |
| `validation` | `ValidationRule[]` | Validation rules |
| `defaultValue` | `any` | Default value |
| `options` | `{label, value}[]` | Options for select/radio |
| `min` | `number` | Min value (number/date) |
| `max` | `number` | Max value (number/date) |
| `step` | `number` | Step value (number/range) |
| `rows` | `number` | Textarea rows |
| `accept` | `string` | File accept types |
| `maxSize` | `number` | Max file size (bytes) |
| `preview` | `boolean` | Show image preview |
| `toolbar` | `string[]` | Rich text toolbar |
| `formatOnBlur` | `boolean` | Format JSON on blur |
| `order` | `number` | Field display order |
| `gridColumn` | `string` | Grid column span |
| `render` | `Component` | Custom field renderer |

## Examples

See the [demo page](../examples/EntityFormDemo.tsx) for live examples.

## Styling

```css
.entity-form { }
.entity-form-field { }
.entity-form-label { }
.entity-form-input { }
.entity-form-error { }
.entity-form-description { }
.entity-form-actions { }
.entity-form-dirty { }
```

## Performance

- Use `memo` for complex custom renderers
- Debounce validation for async validators
- Avoid inline functions for `visible`/`required` props
