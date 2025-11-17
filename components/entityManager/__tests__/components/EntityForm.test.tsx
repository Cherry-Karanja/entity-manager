/**
 * Tests for EntityForm Component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EntityForm } from '../../components/form';
import {
  createMockFormFields,
  createMockUser,
  mockHandlers,
  resetMocks,
} from '../testUtils';describe('EntityForm', () => {
  const mockFields = createMockFormFields();
  const mockUser = createMockUser();

  beforeEach(() => {
    resetMocks();
  });

  describe('rendering', () => {
    it('should render all form fields', () => {
      render(
        <EntityForm
          fields={mockFields}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      mockFields.forEach(field => {
        const role = field.type === 'select' ? 'combobox' : 'textbox';
        expect(screen.getByRole(role, { name: new RegExp(field.label, 'i') })).toBeInTheDocument();
      });
    });

    it('should render with initial data', () => {
      render(
        <EntityForm
          fields={mockFields}
          entity={mockUser}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      expect(screen.getByRole('textbox', { name: /Name/i })).toHaveValue(mockUser.name);
      expect(screen.getByRole('textbox', { name: /Email/i })).toHaveValue(mockUser.email);
    });

    it('should show submit button', () => {
      render(
        <EntityForm
          fields={mockFields}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      expect(screen.getByRole('button', { name: /create|save/i })).toBeInTheDocument();
    });

    it('should show cancel button when onCancel provided', () => {
      render(
        <EntityForm
          fields={mockFields}
          onSubmit={mockHandlers.onSubmit}
          onCancel={mockHandlers.onCancel}
        />
      );

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should use custom submit label', () => {
      render(
        <EntityForm
          fields={mockFields}
          onSubmit={mockHandlers.onSubmit}
          submitText="Save User"
        />
      );

      expect(screen.getByRole('button', { name: 'Save User' })).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('should show required field errors on submit', async () => {
      const user = userEvent.setup();

      render(
        <EntityForm
          fields={mockFields}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const submitButton = screen.getByRole('button', { name: /create|save/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });

      expect(mockHandlers.onSubmit).not.toHaveBeenCalled();
    });

    it('should validate field on blur', async () => {
      const user = userEvent.setup();

      render(
        <EntityForm
          fields={mockFields}
          onSubmit={mockHandlers.onSubmit}
          validateOnBlur={true}
        />
      );

      const nameInput = screen.getByRole('textbox', { name: /Name/i });
      await user.click(nameInput);
      await user.tab(); // Blur

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
    });

    it('should validate field on change', async () => {
      const user = userEvent.setup();

      render(
        <EntityForm
          fields={mockFields}
          onSubmit={mockHandlers.onSubmit}
          validateOnChange={true}
        />
      );

      const emailInput = screen.getByRole('textbox', { name: /Email/i });
      await user.type(emailInput, 'invalid');

      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });
    });

    it('should clear errors when field becomes valid', async () => {
      const user = userEvent.setup();

      render(
        <EntityForm
          fields={mockFields}
          onSubmit={mockHandlers.onSubmit}
          validateOnChange={true}
        />
      );

      const nameInput = screen.getByRole('textbox', { name: /Name/i });
      
      // Type and clear to trigger error
      await user.type(nameInput, 'a{selectall}{backspace}');

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });

      // Fix the error
      await user.type(nameInput, 'John Doe');

      await waitFor(() => {
        expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
      });
    });

    it('should validate minimum length', async () => {
      const user = userEvent.setup();

      render(
        <EntityForm
          fields={mockFields}
          onSubmit={mockHandlers.onSubmit}
          validateOnChange={true}
        />
      );

      const nameInput = screen.getByRole('textbox', { name: /Name/i });
      await user.type(nameInput, 'a');

      await waitFor(() => {
        expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
      });
    });

    it('should validate email pattern', async () => {
      const user = userEvent.setup();

      render(
        <EntityForm
          fields={mockFields}
          onSubmit={mockHandlers.onSubmit}
          validateOnChange={true}
        />
      );

      const emailInput = screen.getByRole('textbox', { name: /Email/i });
      await user.type(emailInput, 'notanemail');

      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });
    });
  });

  describe('submission', () => {
    it('should submit valid form data', async () => {
      const user = userEvent.setup();

      render(
        <EntityForm
          fields={mockFields}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const nameInput = screen.getByRole('textbox', { name: /Name/i });
      const emailInput = screen.getByRole('textbox', { name: /Email/i });
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.selectOptions(screen.getByRole('combobox', { name: /Role/i }), 'admin');
      await user.selectOptions(screen.getByRole('combobox', { name: /Status/i }), 'active');

      const submitButton = screen.getByRole('button', { name: /create|save/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockHandlers.onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin',
            status: 'active',
          })
        );
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      const slowSubmit = vi.fn(async () => {
        await new Promise<void>(resolve => setTimeout(resolve, 1000));
      });

      render(
        <EntityForm
          fields={mockFields}
          onSubmit={slowSubmit}
        />
      );

      const nameInput = screen.getByRole('textbox', { name: /Name/i });
      const emailInput = screen.getByRole('textbox', { name: /Email/i });
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.selectOptions(screen.getByRole('combobox', { name: /Role/i }), 'user');
      await user.selectOptions(screen.getByRole('combobox', { name: /Status/i }), 'active');

      const submitButton = screen.getByRole('button', { name: /create|save/i });
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/submitting/i)).toBeInTheDocument();
    });

    it('should call onCancel when cancel clicked', async () => {
      const user = userEvent.setup();

      render(
        <EntityForm
          fields={mockFields}
          onSubmit={mockHandlers.onSubmit}
          onCancel={mockHandlers.onCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockHandlers.onCancel).toHaveBeenCalled();
    });

    it('should reset form on successful submission if resetOnSubmit', async () => {
      const user = userEvent.setup();

      render(
        <EntityForm
          fields={mockFields}
          onSubmit={mockHandlers.onSubmit}
          resetOnSubmit={true}
        />
      );

      const nameInput = screen.getByRole('textbox', { name: /Name/i }) as HTMLInputElement;
      const emailInput = screen.getByRole('textbox', { name: /Email/i });
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.selectOptions(screen.getByRole('combobox', { name: /Role/i }), 'user');
      await user.selectOptions(screen.getByRole('combobox', { name: /Status/i }), 'active');

      await user.click(screen.getByRole('button', { name: /create|save/i }));

      await waitFor(() => {
        expect(nameInput.value).toBe('');
      });
    });
  });

  describe('field types', () => {
    it('should render text inputs', () => {
      render(
        <EntityForm
          fields={[{ name: 'name', label: 'Name', type: 'text' }]}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const input = screen.getByRole('textbox', { name: /Name/i });
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should render email inputs', () => {
      render(
        <EntityForm
          fields={[{ name: 'email', label: 'Email', type: 'email' }]}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const input = screen.getByRole('textbox', { name: /Email/i });
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render number inputs', () => {
      render(
        <EntityForm
          fields={[{ name: 'age', label: 'Age', type: 'number' }]}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const input = screen.getByRole('spinbutton', { name: /Age/i });
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should render select dropdowns', () => {
      render(
        <EntityForm
          fields={mockFields}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const select = screen.getByRole('combobox', { name: /Role/i });
      expect(select.tagName).toBe('SELECT');
    });

    it('should render textarea for multiline text', () => {
      render(
        <EntityForm
          fields={[{ name: 'bio', label: 'Bio', type: 'textarea' }]}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const textarea = screen.getByRole('textbox', { name: /Bio/i });
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('should render checkbox', () => {
      render(
        <EntityForm
          fields={[{ name: 'active', label: 'Active', type: 'checkbox' }]}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const checkbox = screen.getByRole('checkbox', { name: /Active/i });
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });

    it('should render date inputs', () => {
      render(
        <EntityForm
          fields={[{ name: 'birthdate', label: 'Birth Date', type: 'date' }]}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const input = document.getElementById('birthdate');
      expect(input).toHaveAttribute('type', 'date');
    });
  });

  describe('field visibility', () => {
    it('should hide fields based on visible function', () => {
      render(
        <EntityForm
          fields={[
            { name: 'name', label: 'Name', type: 'text' },
            { 
              name: 'adminField', 
              label: 'Admin Field', 
              type: 'text',
              visible: (values) => values.role === 'admin'
            },
          ]}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      expect(screen.getByRole('textbox', { name: /Name/i })).toBeInTheDocument();
      expect(screen.queryByRole('textbox', { name: /Admin Field/i })).not.toBeInTheDocument();
    });

    it('should show fields when condition is met', async () => {
      const user = userEvent.setup();

      render(
        <EntityForm
          fields={[
            { 
              name: 'role', 
              label: 'Role', 
              type: 'select',
              options: [
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' },
              ]
            },
            { 
              name: 'adminCode', 
              label: 'Admin Code', 
              type: 'text',
              visible: (values: Record<string, unknown>) => values.role === 'admin'
            },
          ]}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      // Wait for options to load
      await waitFor(() => {
        const roleSelect = screen.getByRole('combobox', { name: /Role/i }) as HTMLSelectElement;
        expect(roleSelect.options.length).toBeGreaterThan(1); // More than just "Select..."
      });

      expect(screen.queryByRole('textbox', { name: /Admin Code/i })).not.toBeInTheDocument();

      await user.selectOptions(screen.getByRole('combobox', { name: /Role/i }), 'admin');

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /Admin Code/i })).toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('should associate labels with inputs', () => {
      render(
        <EntityForm
          fields={mockFields}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      mockFields.forEach(field => {
        const role = field.type === 'select' ? 'combobox' : 'textbox';
        const input = screen.getByRole(role, { name: new RegExp(field.label, 'i') });
        expect(input).toBeInTheDocument();
      });
    });

    it('should mark required fields', () => {
      render(
        <EntityForm
          fields={mockFields}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      const nameInput = screen.getByRole('textbox', { name: /Name/i });
      expect(nameInput).toHaveAttribute('required');
    });

    it('should have proper ARIA attributes for errors', async () => {
      const user = userEvent.setup();

      render(
        <EntityForm
          fields={mockFields}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      await user.click(screen.getByRole('button', { name: /create|save/i }));

      await waitFor(() => {
        const nameInput = screen.getByRole('textbox', { name: /Name/i });
        expect(nameInput).toHaveAttribute('aria-invalid', 'true');
        expect(nameInput).toHaveAttribute('aria-describedby');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty fields array', () => {
      render(
        <EntityForm
          fields={[]}
          onSubmit={mockHandlers.onSubmit}
        />
      );

      expect(screen.getByRole('button', { name: /create|save/i })).toBeInTheDocument();
    });

    it('should handle submission errors', async () => {
      const user = userEvent.setup();
      const failingSubmit = vi.fn().mockRejectedValue(new Error('Server error'));

      render(
        <EntityForm
          fields={mockFields}
          onSubmit={failingSubmit}
        />
      );

      const nameInput = screen.getByRole('textbox', { name: /Name/i });
      const emailInput = screen.getByRole('textbox', { name: /Email/i });
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.selectOptions(screen.getByRole('combobox', { name: /Role/i }), 'admin');
      await user.selectOptions(screen.getByRole('combobox', { name: /Status/i }), 'active');

      await user.click(screen.getByRole('button', { name: /create|save/i }));

      await waitFor(() => {
        expect(screen.getByText(/server error/i)).toBeInTheDocument();
      });
    });
  });
});


