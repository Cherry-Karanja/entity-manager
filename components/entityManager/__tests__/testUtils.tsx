/**
 * Test Utilities and Setup
 * 
 * Common test helpers, mocks, and utilities for Entity Manager tests.
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import { BaseEntity} from '../primitives/types';
import { Column } from '../components/list/types';
import { Action } from '../components/actions/types';
import { FormField } from '../components/form/types';
import { ViewField } from '../components/view/types';
/**
 * Test entity types
 */
export interface TestUser extends BaseEntity {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  age?: number;
  [key: string]: unknown;
}

export interface TestProduct extends BaseEntity {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  [key: string]: unknown;
}

/**
 * Mock data generators
 */
export function createMockUser(overrides?: Partial<TestUser>): TestUser {
  return {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    age: 30,
    ...overrides,
  };
}

export function createMockUsers(count: number): TestUser[] {
  return Array.from({ length: count }, (_, i) => createMockUser({
    id: String(i + 1),
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    age: 20 + i,
  }));
}

export function createMockProduct(overrides?: Partial<TestProduct>): TestProduct {
  return {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    category: 'Electronics',
    inStock: true,
    ...overrides,
  };
}

/**
 * Mock column definitions
 */
export function createMockColumns(): Column<TestUser>[] {
  return [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      filterable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      filterable: true,
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      filterable: true,
      render: (value) => String(value).toUpperCase(),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
    },
  ];
}

/**
 * Mock form fields
 */
export function createMockFormFields(): FormField<TestUser>[] {
  return [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      validation: [
        { type: 'required', message: 'Name is required' },
        { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' },
      ],
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validation: [
        { type: 'required', message: 'Email is required' },
        { type: 'pattern', value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
      ],
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
        { value: 'guest', label: 'Guest' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' },
      ],
    },
  ];
}

/**
 * Mock view fields
 */
export function createMockViewFields(): ViewField<TestUser>[] {
  return [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'role', label: 'Role', type: 'text' },
    { key: 'status', label: 'Status', type: 'text' },
    { key: 'createdAt', label: 'Created At', type: 'date' },
    { key: 'age', label: 'Age', type: 'number' },
  ];
}

/**
 * Mock actions
 */
export function createMockActions(): Action<TestUser>[] {
  return [
    {
      id: 'edit',
      label: 'Edit',
      actionType: 'immediate',
      icon: 'edit',
      handler: async () => {},
    },
    {
      id: 'delete',
      label: 'Delete',
      actionType: 'confirm',
      icon: 'delete',
      variant: 'danger',
      confirmMessage: 'Are you sure you want to delete this user?',
      confirmText: 'Delete User',
      cancelText: 'Cancel',
      onConfirm: async () => {},
    },
    {
      id: 'view',
      label: 'View Details',
      actionType: 'navigation',
      icon: 'eye',
      url: (entity?: TestUser) => `/users/${entity?.id}`,
    },
  ];
}

/**
 * Custom render function with providers
 */
export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: Record<string, unknown>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: CustomRenderOptions
) {
  const { ...renderOptions } = options || {};

  // Wrapper with providers if needed
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Wait utilities
 */
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function waitForAsync(callback: () => void | Promise<void>, timeout = 1000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      await callback();
      return;
    } catch {
      await waitFor(50);
    }
  }
  throw new Error('Timeout waiting for condition');
}

/**
 * Mock handlers
 */
export const mockHandlers = {
  onSubmit: vi.fn().mockResolvedValue(undefined),
  onCancel: vi.fn(),
  onChange: vi.fn(),
  onSelect: vi.fn(),
  onAction: vi.fn().mockResolvedValue(undefined),
  onError: vi.fn(),
  onSuccess: vi.fn(),
};

/**
 * Reset all mocks
 */
export function resetMocks() {
  Object.values(mockHandlers).forEach(mock => {
    if (typeof mock.mockReset === 'function') {
      mock.mockReset();
    }
  });
}

/**
 * Assertion helpers
 */
export function expectToBeInDOM(element: HTMLElement | null) {
  expect(element).toBeInTheDocument();
}

export function expectNotToBeInDOM(element: HTMLElement | null) {
  expect(element).not.toBeInTheDocument();
}

export function expectToHaveClass(element: HTMLElement, className: string) {
  expect(element).toHaveClass(className);
}

export function expectToBeDisabled(element: HTMLElement) {
  expect(element).toBeDisabled();
}

export function expectToBeEnabled(element: HTMLElement) {
  expect(element).toBeEnabled();
}
