import React from 'react';
import { EntityForm } from '@/components/entityManager/EntityForm';

// Example: Enhanced File Upload in EntityForm
// This demonstrates how to use the advanced file upload features

const FileUploadExample: React.FC = () => {
  const formConfig = {
    fields: [
      {
        name: 'singleFile',
        label: 'Single File Upload',
        type: 'file' as const,
        required: true,
        // Basic file input (no advanced features)
        options: [
          { label: 'Images', value: 'image/*' },
          { label: 'Documents', value: '.pdf,.doc,.docx' }
        ]
      },
      {
        name: 'multipleFiles',
        label: 'Multiple Files with Drag & Drop',
        type: 'file' as const,
        multiple: true,
        // Enable advanced features
        enableDragDrop: true,
        showPreview: true,
        max: 5, // Maximum 5 files
        maxSize: 10 * 1024 * 1024, // 10MB per file
        minSize: 1024, // 1KB minimum
        options: [
          { label: 'Images', value: 'image/*' },
          { label: 'Videos', value: 'video/*' },
          { label: 'Documents', value: '.pdf,.doc,.docx,.txt' }
        ]
      },
      {
        name: 'profileImage',
        label: 'Profile Image',
        type: 'file' as const,
        // Advanced single file with preview
        enableDragDrop: true,
        showPreview: true,
        maxSize: 5 * 1024 * 1024, // 5MB
        options: [
          { label: 'Images', value: 'image/*' }
        ]
      }
    ],
    onSubmit: async (data: Record<string, unknown>) => {
      console.log('Form submitted with data:', data);

      // Handle file uploads
      const formData = new FormData();

      // Add regular fields
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value) && value.every(item => item instanceof File)) {
          value.forEach((file, index) => {
            formData.append(`${key}[${index}]`, file);
          });
        } else if (typeof value === 'string' || typeof value === 'number') {
          formData.append(key, String(value));
        }
      });

      // Submit to your API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Enhanced File Upload Example</h1>

      <EntityForm
        config={formConfig}
        onSubmit={async (data) => {
          try {
            await formConfig.onSubmit(data);
            alert('Files uploaded successfully!');
          } catch (error) {
            alert('Upload failed: ' + (error as Error).message);
          }
        }}
        onCancel={() => {
          console.log('Form cancelled');
        }}
      />

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">File Upload Features:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Basic Upload:</strong> Simple file input for single files</li>
          <li><strong>Drag & Drop:</strong> Visual drop zone for better UX</li>
          <li><strong>Multiple Files:</strong> Support for uploading multiple files at once</li>
          <li><strong>File Preview:</strong> Preview selected files before upload</li>
          <li><strong>Validation:</strong> File type, size, and count validation</li>
          <li><strong>Progress Tracking:</strong> Real-time upload progress (when using BatchUpload component)</li>
          <li><strong>Chunked Upload:</strong> Large file support with resumable uploads</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploadExample;