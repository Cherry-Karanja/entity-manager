import React from 'react';
import { EntityExporter } from '../index';
import { EntityExporterConfig, DEFAULT_EXPORT_FORMATS } from '../types';

// Mock data for examples
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', createdAt: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'manager', status: 'active', createdAt: '2023-02-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive', createdAt: '2023-03-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'user', status: 'active', createdAt: '2023-04-05' },
];

const mockProducts = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99, stock: 50, rating: 4.5 },
  { id: 2, name: 'Mouse', category: 'Electronics', price: 29.99, stock: 200, rating: 4.2 },
  { id: 3, name: 'Book', category: 'Education', price: 19.99, stock: 100, rating: 4.8 },
  { id: 4, name: 'Chair', category: 'Furniture', price: 149.99, stock: 25, rating: 4.0 },
];

// Example 1: Basic CSV Export
const basicCsvConfig: EntityExporterConfig = {
  formats: DEFAULT_EXPORT_FORMATS,
  data: mockUsers,
  fields: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
  ],
  defaultFormat: 'csv',
  filename: 'users_export',
  showFormatSelector: false,
  showProgress: true,
};

// Example 2: Multiple Formats with Selector
const multiFormatConfig: EntityExporterConfig = {
  formats: DEFAULT_EXPORT_FORMATS,
  data: mockProducts,
  fields: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    {
      key: 'price',
      label: 'Price',
      format: (value) => `$${Number(value).toFixed(2)}`
    },
    { key: 'stock', label: 'Stock' },
    {
      key: 'rating',
      label: 'Rating',
      format: (value) => `${value}/5.0`
    },
  ],
  defaultFormat: 'csv',
  filename: (format) => `products_export_${new Date().toISOString().split('T')[0]}.${format}`,
  showFormatSelector: true,
  showProgress: true,
};

// Example 3: Async Data Fetching
const asyncDataConfig: EntityExporterConfig = {
  formats: DEFAULT_EXPORT_FORMATS,
  dataFetcher: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      ...mockUsers,
      { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'user', status: 'pending', createdAt: '2023-05-12' },
    ];
  },
  fields: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    {
      key: 'createdAt',
      label: 'Created Date',
      format: (value) => new Date(value as string).toLocaleDateString()
    },
  ],
  defaultFormat: 'json',
  filename: 'users_with_api_data',
  showFormatSelector: true,
  showProgress: true,
  hooks: {
    onExportStart: (format, data) => {
      console.log(`Starting export of ${data.length} records in ${format} format`);
    },
    onExportComplete: (format, result) => {
      console.log(`Export completed: ${result.filename} with ${result.recordCount} records`);
    },
    onExportError: (format, error) => {
      console.error(`Export failed for ${format}:`, error);
    },
  },
};

// Example 4: Data Transformation
const transformedDataConfig: EntityExporterConfig = {
  formats: DEFAULT_EXPORT_FORMATS,
  data: mockProducts,
  dataTransformer: (data) => {
    return data.map((item: any) => ({
      ...item,
      priceRange: item.price < 50 ? 'Budget' : item.price < 200 ? 'Mid-range' : 'Premium',
      availability: item.stock > 100 ? 'High' : item.stock > 50 ? 'Medium' : 'Low',
      ratingCategory: item.rating >= 4.5 ? 'Excellent' : item.rating >= 4.0 ? 'Good' : 'Average',
    }));
  },
  fields: [
    { key: 'name', label: 'Product' },
    { key: 'category', label: 'Category' },
    {
      key: 'price',
      label: 'Price',
      format: (value) => `$${Number(value).toFixed(2)}`
    },
    { key: 'priceRange', label: 'Price Range' },
    { key: 'availability', label: 'Availability' },
    { key: 'rating', label: 'Rating' },
    { key: 'ratingCategory', label: 'Rating Category' },
  ],
  defaultFormat: 'xlsx',
  filename: 'products_transformed',
  showFormatSelector: true,
  showProgress: true,
};

// Example 5: Custom Formats Configuration
const customFormatsConfig: EntityExporterConfig = {
  data: mockUsers,
  fields: [
    { key: 'id', label: 'User ID' },
    { key: 'name', label: 'Full Name' },
    { key: 'email', label: 'Email Address' },
    { key: 'role', label: 'User Role' },
    { key: 'status', label: 'Account Status' },
  ],
  formats: [
    {
      type: 'csv',
      label: 'CSV (Comma)',
      extension: 'csv',
      mimeType: 'text/csv',
      icon: () => React.createElement('span', null, '📊'),
    },
    {
      type: 'json',
      label: 'JSON',
      extension: 'json',
      mimeType: 'application/json',
      icon: () => React.createElement('span', null, '📋'),
    },
    {
      type: 'xml',
      label: 'XML',
      extension: 'xml',
      mimeType: 'application/xml',
      icon: () => React.createElement('span', null, '📄'),
    },
  ],
  defaultFormat: 'csv',
  filename: 'custom_export',
  delimiter: ';', // Use semicolon for CSV
  includeHeaders: true,
  showFormatSelector: true,
  showProgress: true,
};

// Main Examples Component
export const EntityExporterExamples: React.FC = () => {
  const [exportResults, setExportResults] = React.useState<Array<{ id: string; result: any }>>([]);

  const handleExport = (exampleId: string, result: any) => {
    setExportResults(prev => [...prev.filter(r => r.id !== exampleId), { id: exampleId, result }]);
  };

  const getExportResult = (exampleId: string) => {
    return exportResults.find(r => r.id === exampleId)?.result;
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">EntityExporter Examples</h1>
        <p className="text-gray-600 mb-6">
          Comprehensive examples of the EntityExporter component with different configurations,
          data sources, and export formats.
        </p>
      </div>

      {/* Basic CSV Export Example */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Basic CSV Export</h2>
        <p className="text-sm text-gray-600 mb-4">
          Simple export with predefined fields and CSV format only.
        </p>
        <div className="flex items-center gap-4">
          <EntityExporter
            config={basicCsvConfig}
            onExport={(result) => handleExport('basic-csv', result)}
          />
          {getExportResult('basic-csv') && (
            <div className="text-sm text-green-600">
              ✓ Exported {getExportResult('basic-csv').recordCount} records
            </div>
          )}
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <strong>Data:</strong> {JSON.stringify(mockUsers.slice(0, 2), null, 2)}
        </div>
      </div>

      {/* Multiple Formats Example */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Multiple Formats</h2>
        <p className="text-sm text-gray-600 mb-4">
          Export with multiple format options and custom field formatting.
        </p>
        <div className="flex items-center gap-4">
          <EntityExporter
            config={multiFormatConfig}
            onExport={(result) => handleExport('multi-format', result)}
          />
          {getExportResult('multi-format') && (
            <div className="text-sm text-green-600">
              ✓ Exported {getExportResult('multi-format').recordCount} records as {getExportResult('multi-format').format.toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Async Data Example */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Async Data Fetching</h2>
        <p className="text-sm text-gray-600 mb-4">
          Export with data fetched asynchronously and event hooks.
        </p>
        <div className="flex items-center gap-4">
          <EntityExporter
            config={asyncDataConfig}
            onExport={(result) => handleExport('async-data', result)}
          />
          {getExportResult('async-data') && (
            <div className="text-sm text-green-600">
              ✓ Exported {getExportResult('async-data').recordCount} records
            </div>
          )}
        </div>
        <div className="mt-2 text-xs text-blue-600">
          Check browser console for export events
        </div>
      </div>

      {/* Data Transformation Example */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Data Transformation</h2>
        <p className="text-sm text-gray-600 mb-4">
          Export with data transformation and computed fields.
        </p>
        <div className="flex items-center gap-4">
          <EntityExporter
            config={transformedDataConfig}
            onExport={(result) => handleExport('transformed', result)}
          />
          {getExportResult('transformed') && (
            <div className="text-sm text-green-600">
              ✓ Exported {getExportResult('transformed').recordCount} transformed records
            </div>
          )}
        </div>
      </div>

      {/* Custom Formats Example */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Custom Configuration</h2>
        <p className="text-sm text-gray-600 mb-4">
          Export with custom formats, delimiter, and field labels.
        </p>
        <div className="flex items-center gap-4">
          <EntityExporter
            config={customFormatsConfig}
            onExport={(result) => handleExport('custom-config', result)}
          />
          {getExportResult('custom-config') && (
            <div className="text-sm text-green-600">
              ✓ Exported {getExportResult('custom-config').recordCount} records
            </div>
          )}
        </div>
      </div>

      {/* Configuration Reference */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Configuration Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">Data Options:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• data: Static data array</li>
              <li>• dataFetcher: Async data fetching function</li>
              <li>• dataTransformer: Data transformation function</li>
              <li>• fields: Field mapping and formatting</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Export Options:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• formats: Available export formats</li>
              <li>• defaultFormat: Default selected format</li>
              <li>• filename: Export filename pattern</li>
              <li>• delimiter: CSV delimiter character</li>
              <li>• includeHeaders: Include column headers</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">UI Options:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• showFormatSelector: Show format dropdown</li>
              <li>• showProgress: Show export progress</li>
              <li>• buttonVariant: Button style variant</li>
              <li>• buttonSize: Button size</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Event Hooks:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• onExportStart: Before export begins</li>
              <li>• onExportComplete: After successful export</li>
              <li>• onExportError: On export failure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityExporterExamples;