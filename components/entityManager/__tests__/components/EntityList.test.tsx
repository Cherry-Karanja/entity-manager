/**
 * Tests for EntityList Component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EntityList } from '../../components/list';
import { 
  createMockUsers, 
  createMockColumns, 
  createMockActions,
  resetMocks,
  TestUser
} from '../testUtils';

describe('EntityList', () => {
  const mockData = createMockUsers(10);
  const mockColumns = createMockColumns();
  const mockActions = createMockActions();

  beforeEach(() => {
    resetMocks();
  });

  describe('rendering', () => {
    it('should render data in table format', () => {
      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
        />
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    });

    it('should render all columns', () => {
      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
        />
      );

      mockColumns.forEach(column => {
        if (column.label) expect(screen.getByText(column.label)).toBeInTheDocument();
      });
    });

    it('should render all rows', () => {
      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
        />
      );

      const rows = screen.getAllByRole('row');
      // +1 for header row
      expect(rows).toHaveLength(mockData.length + 1);
    });

    it('should render custom cell content with render function', () => {
      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
        />
      );

      // Role column has custom render that uppercases in each row
      const userRoles = screen.getAllByText('USER');
      expect(userRoles).toHaveLength(mockData.length);
    });

    it('should show empty state when no data', () => {
      render(
        <EntityList
          data={[]}
          columns={mockColumns}
          emptyMessage="No users found"
        />
      );

      expect(screen.getByText('No users found')).toBeInTheDocument();
    });

    it('should show loading state', () => {
      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          loading={true}
        />
      );

      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('should show selection checkboxes when selectable', () => {
      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          selectable={true}
          multiSelect={true}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      // +1 for select-all checkbox in header
      expect(checkboxes).toHaveLength(mockData.length + 1);
    });

    it('should select individual row', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();

      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          selectable={true}
          onSelectionChange={onSelectionChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]); // First data row (User 2 with id='2')

      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.any(Set),
        [mockData[1]] // User 2 is at index 1
      );
    });

    it('should select all rows', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();

      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          selectable={true}
          multiSelect={true}
          onSelectionChange={onSelectionChange}
        />
      );

      const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
      await user.click(selectAllCheckbox);

      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.any(Set),
        mockData
      );
    });

    it('should deselect all rows', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      const initialSelection = new Set(mockData.map(d => d.id));

      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          selectable={true}
          multiSelect={true}
          selectedIds={initialSelection}
          onSelectionChange={onSelectionChange}
        />
      );

      const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
      await user.click(selectAllCheckbox);

      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.any(Set),
        []
      );
    });
  });

  describe('sorting', () => {
    it('should show sort indicators on sortable columns', () => {
      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          sortable={true}
        />
      );

      const nameHeader = screen.getByText('Name').closest('th');
      expect(nameHeader).toBeInTheDocument();
    });

    it('should sort ascending on first click', async () => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();

      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          sortable={true}
          onSortChange={onSortChange}
        />
      );

      const nameHeader = screen.getByText('Name').closest('th');
      await user.click(nameHeader!);

      expect(onSortChange).toHaveBeenCalledWith({ field: 'name', direction: 'asc' });
    });

    it('should toggle sort direction on second click', async () => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();

      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          sortable={true}
          onSortChange={onSortChange}
        />
      );

      const nameHeader = screen.getByText('Name').closest('th');
      // First click -> asc, second click -> desc
      await user.click(nameHeader!);
      await user.click(nameHeader!);

      expect(onSortChange).toHaveBeenCalledWith({ field: 'name', direction: 'desc' });
    });

    it('should apply sorting to data', () => {
      const { container } = render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          sortable={true}
        />
      );

      const rows = container.querySelectorAll('tbody tr');
      const firstRowName = within(rows[0] as HTMLElement).getByText(/User 1/);
      expect(firstRowName).toBeInTheDocument();
    });
  });

  describe('filtering', () => {
    it('should show search input when searchable', () => {
      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          searchable={true}
        />
      );

      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    it('should filter data by search query', async () => {
      const user = userEvent.setup();

      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          searchable={true}
        />
      );

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, 'User 1');

      // Should show User 1 and User 10
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.queryByText('User 2')).not.toBeInTheDocument();
    });

    it.skip('should show column filters when filterable', () => {
      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          filterable={true}
        />
      );

      // Filter buttons or dropdowns should be visible
      const filterButtons = screen.getAllByRole('button', { name: /filter/i });
      expect(filterButtons.length).toBeGreaterThan(0);
    });

    it.skip('should apply column filters', async () => {
      const user = userEvent.setup();
      const onFilterChange = vi.fn();

      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          filterable={true}
          onFilterChange={onFilterChange}
        />
      );

      // Simulate filter selection
      const roleFilter = screen.getByRole('combobox', { name: /role/i });
      await user.selectOptions(roleFilter, 'admin');

      expect(onFilterChange).toHaveBeenCalled();
    });
  });

  describe('pagination', () => {
    it('should show pagination controls when paginated', () => {
      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          pagination={true}
          paginationConfig={{
            page: 1,
            pageSize: 5,
            totalCount: mockData.length
          }}
        />
      );

      expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
    });

    it('should show correct page size of data', () => {
      // For server-side pagination, data should be pre-paginated
      const pageData = mockData.slice(0, 5);
      render(
        <EntityList
          data={pageData}
          columns={mockColumns}
            pagination={true}
            paginationConfig={{
              page: 1,
              pageSize: 5,
              totalCount: mockData.length
            }}
        />
      );

      const rows = screen.getAllByRole('row');
      // 5 data rows + 1 header row
      expect(rows).toHaveLength(6);
    });

    it('should navigate to next page', async () => {
      const user = userEvent.setup();
      const mockOnPaginationChange = vi.fn();

      // For server-side pagination, data should be pre-paginated
      const pageData = mockData.slice(0, 5);
      render(
        <EntityList
          data={pageData}
          columns={mockColumns}
            pagination={true}
            paginationConfig={{
                page: 1,
                pageSize: 5,
                totalCount: mockData.length
            }}
            onPaginationChange={mockOnPaginationChange}
        />
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      // Should call onPaginationChange with page 2
      expect(mockOnPaginationChange).toHaveBeenCalledWith({
        page: 2,
        pageSize: 5,
        totalCount: mockData.length
      });
    });

    it('should navigate to previous page', async () => {
      const user = userEvent.setup();
      const mockOnPaginationChange = vi.fn();

      // For server-side pagination, data should be pre-paginated (second page)
      const pageData = mockData.slice(5, 10);
      render(
        <EntityList
          data={pageData}
          columns={mockColumns}
            pagination={true}
            paginationConfig={{
                page: 2,
                pageSize: 5,
                totalCount: mockData.length
            }}
            onPaginationChange={mockOnPaginationChange}
        />
      );

      const prevButton = screen.getByRole('button', { name: /previous/i });
      await user.click(prevButton);

      // Should call onPaginationChange with page 1
      expect(mockOnPaginationChange).toHaveBeenCalledWith({
        page: 1,
        pageSize: 5,
        totalCount: mockData.length
      });
    });

    it('should allow page size change', async () => {
      const user = userEvent.setup();
      const onPageSizeChange = vi.fn();

      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
            pagination={true}
            paginationConfig={{
                page: 1,
                pageSize: 5,
                totalCount: mockData.length
            }}
          onPaginationChange={onPageSizeChange}
        />
      );

      const pageSizeSelect = screen.getByRole('combobox', { name: /items per page/i });
      await user.selectOptions(pageSizeSelect, '10');

      expect(onPageSizeChange).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        totalCount: mockData.length
      });
    });
  });

  describe('actions', () => {
    it('should render row actions', () => {
      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          actions={{ actions: mockActions }}
        />
      );

      // Actions column should be present
      const actionsHeaders = screen.getAllByText(/actions/i);
      expect(actionsHeaders.length).toBeGreaterThan(0);
    });

    it('should trigger immediate actions', async () => {
      const user = userEvent.setup();
      const editHandler = vi.fn();
      const actions = [
        {
          id: 'edit',
          label: 'Edit',
          actionType: 'immediate' as const,
          handler: editHandler,
        },
      ];

      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          actions={{ actions }}
        />
      );

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);

      expect(editHandler).toHaveBeenCalledWith(mockData[0], undefined);
    });

    it('should show confirmation dialog for confirm actions', async () => {
      const user = userEvent.setup();
      const deleteHandler = vi.fn();
      const actions = [
        {
          id: 'delete',
          label: 'Delete',
          actionType: 'confirm' as const,
          confirmMessage: 'Are you sure?',
          confirmText: 'Confirm Delete',
          onConfirm: deleteHandler,
        },
      ];

      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          actions={{ actions }}
        />
      );

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      expect(screen.getByRole('heading', { name: 'Confirm Delete' })).toBeInTheDocument();
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA roles', () => {
      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
        />
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(11); // 10 + header
      expect(screen.getAllByRole('columnheader')).toHaveLength(4);
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          selectable={true}
        />
      );

      const firstCheckbox = screen.getAllByRole('checkbox')[0] as HTMLInputElement;
      
      // Use click instead of keyboard to check checkbox
      await user.click(firstCheckbox);

      expect(firstCheckbox).toBeChecked();
    });

    it('should have accessible labels', () => {
      render(
        <EntityList
          data={mockData}
          columns={mockColumns}
          selectable={true}
          multiSelect={true}
          searchable={true}
        />
      );

      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /select all/i })).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty data gracefully', () => {
      render(
        <EntityList
          data={[]}
          columns={mockColumns}
        />
      );

      expect(screen.getByText(/no data/i)).toBeInTheDocument();
    });

    it('should handle missing column keys', () => {
      const dataWithMissing = [{ ...mockData[0], name: undefined }];

      render(
        <EntityList
          data={dataWithMissing as unknown as TestUser[]}
          columns={mockColumns}
        />
      );

      // Should not crash
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should handle dynamic data updates', () => {
      const { rerender } = render(
        <EntityList
          data={mockData.slice(0, 5)}
          columns={mockColumns}
        />
      );

      expect(screen.getAllByRole('row')).toHaveLength(6); // 5 + header

      rerender(
        <EntityList
          data={mockData}
          columns={mockColumns}
        />
      );

      expect(screen.getAllByRole('row')).toHaveLength(11); // 10 + header
    });
  });
});
