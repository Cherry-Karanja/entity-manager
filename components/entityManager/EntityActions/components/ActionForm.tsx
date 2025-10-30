import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { EntityActionFormField } from '../types';

interface ActionFormProps {
  fields: EntityActionFormField[];
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ActionForm: React.FC<ActionFormProps> = ({
  fields,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const renderField = (field: EntityActionFormField) => {
    const { key, label, type, required, placeholder, options, defaultValue } = field;

    switch (type) {
      case 'string':
      case 'email':
      case 'password':
      case 'url':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={key}
              type={type === 'string' ? 'text' : type}
              placeholder={placeholder}
              value={formData[key] || defaultValue || ''}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              required={required}
            />
          </div>
        );

      case 'number':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={key}
              type="number"
              placeholder={placeholder}
              value={formData[key] || defaultValue || ''}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              required={required}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={key}
              placeholder={placeholder}
              value={formData[key] || defaultValue || ''}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              required={required}
            />
          </div>
        );

      case 'select':
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={formData[key] || defaultValue || ''}
              onValueChange={(value) => handleFieldChange(key, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={String(option.value)} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'boolean':
        return (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox
              id={key}
              checked={formData[key] || defaultValue || false}
              onCheckedChange={(checked) => handleFieldChange(key, checked)}
            />
            <Label htmlFor={key}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(renderField)}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};