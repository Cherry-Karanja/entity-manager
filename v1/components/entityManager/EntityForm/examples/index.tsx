import React, { useState } from 'react'
import { EntityForm } from '../index'
import { EntityFormConfig } from '../types'
import { userFormVariation } from '../variations/userForm'
import { productFormVariation } from '../variations/productForm'
import { orderFormVariation } from '../variations/orderForm'
import { settingsFormVariation } from '../variations/settingsForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * EntityForm Examples
 * Showcases all variations and common use cases
 */

// Mock user data for examples
const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'admin',
  department: 'IT',
  salary: 75000,
  isActive: true,
  hireDate: '2020-03-15',
  bio: 'Experienced software developer with 5+ years in web development.',
  skills: ['React', 'TypeScript', 'Node.js'],
  notifications: true,
}

// Example 1: Basic Create Form
const basicCreateConfig: EntityFormConfig = {
  mode: 'create',
  fields: [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your full name',
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email',
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'User', value: 'user' },
      ],
    },
  ],
  onSubmit: async (data) => {
    console.log('Creating user:', data)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('User created successfully!')
  },
}

// Example 2: Advanced Edit Form
const advancedEditConfig: EntityFormConfig = {
  mode: 'edit',
  fields: [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      validation: [{ type: 'minLength', value: 2 }],
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      validation: [{ type: 'email' }],
    },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      required: true,
      options: [
        { label: 'IT', value: 'IT' },
        { label: 'HR', value: 'HR' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Marketing', value: 'Marketing' },
      ],
    },
    {
      name: 'salary',
      label: 'Salary',
      type: 'number',
      required: true,
      prefix: '$',
      min: 30000,
      max: 200000,
      validation: [{ type: 'min', value: 30000 }, { type: 'max', value: 200000 }],
    },
    {
      name: 'hireDate',
      label: 'Hire Date',
      type: 'date',
      required: true,
    },
    {
      name: 'isActive',
      label: 'Active Status',
      type: 'switch',
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'textarea',
      rows: 4,
      maxLength: 500,
      helpText: 'Tell us about yourself (max 500 characters)',
    },
    {
      name: 'skills',
      label: 'Skills',
      type: 'multiselect',
      options: [
        { label: 'React', value: 'React' },
        { label: 'TypeScript', value: 'TypeScript' },
        { label: 'Node.js', value: 'Node.js' },
        { label: 'Python', value: 'Python' },
        { label: 'AWS', value: 'AWS' },
      ],
    },
    {
      name: 'notifications',
      label: 'Email Notifications',
      type: 'checkbox',
    },
  ],
  initialData: mockUser,
  onSubmit: async (data) => {
    console.log('Updating user:', data)
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert('User updated successfully!')
  },
  hooks: {
    onFormChange: (data, field, value) => {
      console.log(`Field ${field} changed to:`, value)
    },
    onValidationError: (errors) => {
      console.log('Validation errors:', errors)
    },
    onSubmitStart: (data) => {
      console.log('Starting form submission...')
    },
    onSubmitSuccess: (data) => {
      console.log('Form submitted successfully')
    },
  },
}

// Example 3: Grid Layout Form
const gridLayoutConfig: EntityFormConfig = {
  mode: 'create',
  layout: 'grid',
  columns: 2,
  fields: [
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'tel' },
    { name: 'department', label: 'Department', type: 'select', options: [
      { label: 'IT', value: 'IT' },
      { label: 'HR', value: 'HR' },
      { label: 'Finance', value: 'Finance' },
    ]},
    { name: 'startDate', label: 'Start Date', type: 'date' },
  ],
  onSubmit: async (data) => {
    console.log('Creating employee:', data)
    await new Promise(resolve => setTimeout(resolve, 1000))
  },
}

// Example 4: Form with Conditional Fields
const conditionalFieldsConfig: EntityFormConfig = {
  mode: 'create',
  fields: [
    {
      name: 'employmentType',
      label: 'Employment Type',
      type: 'radio',
      required: true,
      options: [
        { label: 'Full-time', value: 'full-time' },
        { label: 'Part-time', value: 'part-time' },
        { label: 'Contract', value: 'contract' },
      ],
    },
    {
      name: 'salary',
      label: 'Annual Salary',
      type: 'number',
      required: true,
      prefix: '$',
      condition: (values) => values.employmentType === 'full-time',
    },
    {
      name: 'hourlyRate',
      label: 'Hourly Rate',
      type: 'number',
      required: true,
      prefix: '$',
      condition: (values) => values.employmentType === 'part-time',
    },
    {
      name: 'contractDuration',
      label: 'Contract Duration (months)',
      type: 'number',
      required: true,
      condition: (values) => values.employmentType === 'contract',
    },
    {
      name: 'benefits',
      label: 'Benefits Package',
      type: 'multiselect',
      options: [
        { label: 'Health Insurance', value: 'health' },
        { label: 'Dental Insurance', value: 'dental' },
        { label: '401k', value: '401k' },
        { label: 'Paid Time Off', value: 'pto' },
      ],
      condition: (values) => values.employmentType === 'full-time',
    },
  ],
  onSubmit: async (data) => {
    console.log('Creating employment record:', data)
    await new Promise(resolve => setTimeout(resolve, 1000))
  },
}

// Example 5: Form with Bulk Import
const bulkImportConfig: EntityFormConfig = {
  mode: 'create',
  enableBulkImport: true,
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'department', label: 'Department', type: 'text', required: true },
    { name: 'salary', label: 'Salary', type: 'number', required: true },
  ],
  onSubmit: async (data) => {
    console.log('Creating user:', data)
    await new Promise(resolve => setTimeout(resolve, 1000))
  },
  onBulkImport: async (data) => {
    console.log('Bulk importing users:', data)
    await new Promise(resolve => setTimeout(resolve, 2000))
  },
}

// Example 6: View Mode Form
const viewModeConfig: EntityFormConfig = {
  mode: 'view',
  fields: [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'role', label: 'Role', type: 'text' },
    { name: 'department', label: 'Department', type: 'text' },
    { name: 'salary', label: 'Salary', type: 'number', format: (value: unknown) => `$${Number(value).toLocaleString()}` },
    { name: 'hireDate', label: 'Hire Date', type: 'date' },
    { name: 'isActive', label: 'Active', type: 'text', format: (value) => value ? 'Yes' : 'No' },
  ],
  initialData: mockUser,
}

// Main Examples Component
export const EntityFormExamples: React.FC = () => {
  const [activeExample, setActiveExample] = useState<string>('basic-create')
  const [formData, setFormData] = useState<Record<string, unknown>>({})

  const examples = {
    'basic-create': {
      title: 'Basic Create Form',
      description: 'Simple form with basic field types and validation',
      config: basicCreateConfig,
    },
    'advanced-edit': {
      title: 'Advanced Edit Form',
      description: 'Complex form with multiple field types, validation, and event hooks',
      config: advancedEditConfig,
    },
    'grid-layout': {
      title: 'Grid Layout Form',
      description: 'Form with responsive grid layout and multiple columns',
      config: gridLayoutConfig,
    },
    'conditional-fields': {
      title: 'Conditional Fields',
      description: 'Form with fields that show/hide based on other field values',
      config: conditionalFieldsConfig,
    },
    'bulk-import': {
      title: 'Bulk Import Form',
      description: 'Form with bulk import functionality for CSV/JSON/XML files',
      config: bulkImportConfig,
    },
    'view-mode': {
      title: 'View Mode Form',
      description: 'Read-only form for displaying data',
      config: viewModeConfig,
    },
  }

  const handleFormSubmit = (exampleId: string, data: Record<string, unknown>) => {
    setFormData(prev => ({ ...prev, [exampleId]: data }))
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">EntityForm Examples</h1>
        <p className="text-gray-600 mb-6">
          Comprehensive examples of the EntityForm component with different configurations,
          field types, layouts, and features.
        </p>
      </div>

      {/* Example Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(examples).map(([id, example]) => (
          <button
            key={id}
            onClick={() => setActiveExample(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeExample === id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {example.title}
          </button>
        ))}
      </div>

      {/* Active Example */}
      <div className="border rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">
            {examples[activeExample as keyof typeof examples].title}
          </h2>
          <p className="text-sm text-gray-600">
            {examples[activeExample as keyof typeof examples].description}
          </p>
        </div>

        <EntityForm
          config={examples[activeExample as keyof typeof examples].config}
          onSubmit={(data) => handleFormSubmit(activeExample, data)}
        />

        {/* Form Data Display */}
        {formData[activeExample] ? (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Submitted Data:</h3>
            <pre className="text-xs text-gray-700 overflow-auto">
              {JSON.stringify(formData[activeExample] as Record<string, unknown>, null, 2)}
            </pre>
          </div>
        ) : null}
      </div>

      {/* Configuration Reference */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Configuration Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <div>
            <h3 className="font-medium mb-2">Form Configuration:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• mode: &apos;create&apos; | &apos;edit&apos; | &apos;view&apos;</li>
              <li>• layout: &apos;vertical&apos; | &apos;horizontal&apos; | &apos;grid&apos;</li>
              <li>• columns: number of grid columns</li>
              <li>• validateOnChange/validateOnBlur</li>
              <li>• showProgress/showValidationErrors</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Field Types:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• text, email, password, number, tel, url</li>
              <li>• textarea, select, multiselect</li>
              <li>• checkbox, radio, switch</li>
              <li>• date, datetime, time</li>
              <li>• file, slider, color, json</li>
              <li>• custom (with render/component)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Field Features:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• required, disabled, hidden</li>
              <li>• validation rules</li>
              <li>• conditional visibility</li>
              <li>• custom formatting</li>
              <li>• prefix/suffix text</li>
              <li>• help text and descriptions</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Bulk Import:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• enableBulkImport: boolean</li>
              <li>• bulkImportFormats: array</li>
              <li>• onBulkImport: callback</li>
              <li>• Supports CSV, JSON, XML</li>
              <li>• Field mapping interface</li>
              <li>• Progress tracking</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Event Hooks:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• onFormChange</li>
              <li>• onValidationError</li>
              <li>• onSubmitStart/Success/Error</li>
              <li>• onBulkImport*</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Styling:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• className: custom CSS classes</li>
              <li>• fieldSpacing: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;</li>
              <li>• buttonVariant/buttonSize</li>
              <li>• Custom field widths</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EntityFormExamples