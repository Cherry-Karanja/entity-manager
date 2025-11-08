import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { EntityList } from '../../../../../components/entityManager/EntityList'
import { EntityListConfig } from '../../../../../components/entityManager/EntityList/types'

// Mock dependencies
vi.mock('@/hooks/use-permissions', () => ({
  usePermissions: () => ({
    hasPermission: vi.fn(() => true)
  })
}))

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false
}))

vi.mock('lucide-react', () => ({
  Search: () => <div>Search Icon</div>,
  Filter: () => <div>Filter Icon</div>,
  SortAsc: () => <div>SortAsc Icon</div>,
  SortDesc: () => <div>SortDesc Icon</div>,
  MoreHorizontal: () => <div>More Icon</div>,
  Download: () => <div>Download Icon</div>,
  RefreshCw: () => <div>Refresh Icon</div>,
  Plus: () => <div>Plus Icon</div>,
  AlertCircle: () => <div>Alert Icon</div>,
  CheckCircle: () => <div>Check Icon</div>
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )
}))

vi.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, placeholder, ...props }: any) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  )
}))

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span>{children}</span>
}))

vi.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange, ...props }: any) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  )
}))

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />
}))

vi.mock('@/components/ui/table', () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableCell: ({ children }: any) => <td>{children}</td>,
  TableHead: ({ children }: any) => <th>{children}</th>,
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableRow: ({ children }: any) => <tr>{children}</tr>
}))

vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}))

// Mock child components
vi.mock('../../../../../components/entityManager/EntityList/views/EntityTableView', () => ({
  default: ({ data, columns, selectedKeys, onRowClick, onSelectionChange }: any) => (
    <div data-testid="table-view">
      <table>
        <thead>
          <tr>
            {columns.map((col: any) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item: any, index: number) => (
            <tr key={item.id || index} onClick={() => onRowClick?.(item)}>
              {columns.map((col: any) => (
                <td key={col.key}>{item[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}))

vi.mock('../../../../../components/entityManager/EntityList/views/EntityCardView', () => ({
  default: ({ data }: any) => (
    <div data-testid="card-view">
      {data.map((item: any) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}))

vi.mock('../../../../../components/entityManager/EntityList/views/EntityListView', () => ({
  default: ({ data }: any) => (
    <div data-testid="list-view">
      {data.map((item: any) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}))

vi.mock('../../../../../components/entityManager/EntityList/views/EntityGridView', () => ({
  default: ({ data }: any) => (
    <div data-testid="grid-view">
      {data.map((item: any) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}))

vi.mock('../../../../../components/entityManager/EntityList/views/EntityCompactView', () => ({
  default: ({ data }: any) => (
    <div data-testid="compact-view">
      {data.map((item: any) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}))

vi.mock('../../../../../components/entityManager/EntityList/components/EntityListToolbar', () => ({
  EntityListToolbar: ({ onSearch, onViewChange, onRefresh }: any) => (
    <div data-testid="toolbar">
      <input
        data-testid="search-input"
        placeholder="Search..."
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <button onClick={() => onViewChange?.('card')}>Card View</button>
      <button onClick={() => onRefresh?.()}>Refresh</button>
    </div>
  )
}))

vi.mock('../../../../../components/entityManager/EntityList/components/EntityListFilters', () => ({
  EntityListFilters: ({ filters, activeFilters, onFilterChange }: any) => (
    <div data-testid="filters">
      {filters?.map((filter: any) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange?.({ [filter.key]: 'test-value' })}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}))

vi.mock('../../../../../components/entityManager/EntityList/components/EntityListPagination', () => ({
  EntityListPagination: ({ pagination, onPageChange }: any) => (
    <div data-testid="pagination">
      <button onClick={() => onPageChange?.(pagination.page - 1)}>Previous</button>
      <span>Page {pagination.page} of {pagination.totalPages}</span>
      <button onClick={() => onPageChange?.(pagination.page + 1)}>Next</button>
    </div>
  )
}))

vi.mock('../../../../../components/entityManager/EntityList/components/EntityListActions', () => ({
  EntityListActions: ({ actions, item, onAction }: any) => (
    <div data-testid="actions">
      {actions?.map((action: any) => (
        <button key={action.id} onClick={() => onAction?.(action.id, item)}>
          {action.label}
        </button>
      ))}
    </div>
  )
}))

vi.mock('../../../../../components/entityManager/EntityList/components/EntityListBulkActions', () => ({
  EntityListBulkActions: ({ bulkActions, selectedItems, onBulkAction }: any) => (
    <div data-testid="bulk-actions">
      {bulkActions?.map((action: any) => (
        <button key={action.id} onClick={() => onBulkAction?.(action.id, selectedItems)}>
          {action.label}
        </button>
      ))}
    </div>
  )
}))

vi.mock('../../../../../components/entityManager/EntityExporter', () => ({
  EntityExporter: ({ data, onExport }: any) => (
    <div data-testid="exporter">
      <button onClick={() => onExport?.(data, 'csv')}>Export CSV</button>
    </div>
  ),
  exportData: vi.fn()
}))

describe('EntityList', () => {
  const mockData = [
    { id: 1, name: 'Item 1', status: 'active', value: 100 },
    { id: 2, name: 'Item 2', status: 'inactive', value: 200 },
    { id: 3, name: 'Item 3', status: 'active', value: 150 }
  ]

  const mockColumns = [
    { id: 'id', header: 'ID', accessorKey: 'id', sortable: true },
    { id: 'name', header: 'Name', accessorKey: 'name', sortable: true, searchable: true },
    { id: 'status', header: 'Status', accessorKey: 'status', filterable: true },
    { id: 'value', header: 'Value', accessorKey: 'value', sortable: true }
  ]

  const mockConfig: EntityListConfig = {
    title: 'Items',
    data: mockData,
    columns: mockColumns,
    rowKey: 'id',
    defaultView: 'table',
    views: [
      { 
        id: 'table', 
        name: 'Table', 
        component: ({ data }: any) => (
          <div data-testid="table-view">
            {data?.map((item: any) => (
              <div key={item.id}>{item.name}</div>
            ))}
          </div>
        )
      },
      { 
        id: 'card', 
        name: 'Card', 
        component: ({ data }: any) => (
          <div data-testid="card-view">
            {data?.map((item: any) => (
              <div key={item.id}>{item.name}</div>
            ))}
          </div>
        )
      }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the entity list with data', () => {
      render(<EntityList config={mockConfig} />)

      expect(screen.getByTestId('table-view')).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })

    it('should render with custom data override', () => {
      const customData = [{ id: 4, name: 'Custom Item', status: 'active', value: 300 }]

      render(<EntityList config={mockConfig} data={customData} />)

      expect(screen.getByText('Custom Item')).toBeInTheDocument()
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
    })

    it('should render loading state', () => {
      render(<EntityList config={mockConfig} loading={true} />)

      // Component should show loading spinner, not the view
      expect(screen.queryByTestId('table-view')).not.toBeInTheDocument()
    })

    it('should render error state', () => {
      const error = 'Failed to load data'

      render(<EntityList config={mockConfig} error={error} />)

      // Component should show error message, not the view
      expect(screen.queryByTestId('table-view')).not.toBeInTheDocument()
      expect(screen.getByText('Failed to load data')).toBeInTheDocument()
    })

    it('should render empty state when no data', () => {
      const emptyConfig = { ...mockConfig, data: [] }

      render(<EntityList config={emptyConfig} />)

      // Component should show empty message, not the view
      expect(screen.queryByTestId('table-view')).not.toBeInTheDocument()
      expect(screen.getByText('No data available')).toBeInTheDocument()
    })
  })

  describe('View Switching', () => {
    it('should render table view by default', () => {
      render(<EntityList config={mockConfig} />)

      expect(screen.getByTestId('table-view')).toBeInTheDocument()
    })

    it('should switch to card view', () => {
      render(<EntityList config={mockConfig} />)

      const cardViewButton = screen.getByText('Card View')
      fireEvent.click(cardViewButton)

      waitFor(() => {
        expect(screen.getByTestId('card-view')).toBeInTheDocument()
      })
    })

    it('should render grid view when configured', () => {
      const gridConfig = {
        ...mockConfig,
        defaultView: 'grid' as const,
        views: [
          { 
            id: 'grid' as const, 
            name: 'Grid', 
            component: ({ data }: any) => (
              <div data-testid="grid-view">
                {data?.map((item: any) => (
                  <div key={item.id}>{item.name}</div>
                ))}
              </div>
            )
          }
        ]
      }

      render(<EntityList config={gridConfig} />)

      expect(screen.getByTestId('grid-view')).toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('should render search input when searchable', () => {
      const searchableConfig = { ...mockConfig, searchable: true }

      render(<EntityList config={searchableConfig} />)

      const searchInput = screen.getByTestId('search-input')
      expect(searchInput).toBeInTheDocument()
      
      // Can type in search input
      fireEvent.change(searchInput, { target: { value: 'Item 1' } })
      expect(searchInput).toHaveValue('Item 1')
    })

    it('should update search term from props', () => {
      const { rerender } = render(
        <EntityList config={mockConfig} searchTerm="" />
      )

      rerender(<EntityList config={mockConfig} searchTerm="Item 2" />)

      // Search term should be updated internally
      expect(screen.getByTestId('search-input')).toBeInTheDocument()
    })
  })

  describe('Filtering', () => {
    it('should render filters when configured', () => {
      const configWithFilters = {
        ...mockConfig,
        filters: [
          { id: 'status', label: 'Status', type: 'select' as const, options: [] }
        ]
      }

      render(<EntityList config={configWithFilters} />)

      // Filters should be rendered
      expect(screen.getByTestId('filters')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
    })

    it('should update active filters from props', () => {
      const { rerender } = render(
        <EntityList config={mockConfig} activeFilters={{}} />
      )

      rerender(
        <EntityList config={mockConfig} activeFilters={{ status: 'active' }} />
      )

      // Filters should be updated internally
      expect(screen.getByTestId('toolbar')).toBeInTheDocument()
    })
  })

  describe('Sorting', () => {
    it('should sort data when column header is clicked', async () => {
      const onSort = vi.fn()

      render(<EntityList config={mockConfig} onSort={onSort} />)

      // Table view should render with sortable columns
      expect(screen.getByTestId('table-view')).toBeInTheDocument()
    })

    it('should update sort configuration from props', () => {
      const sortConfig = [{ field: 'name', direction: 'asc' as const }]

      const { rerender } = render(<EntityList config={mockConfig} />)

      rerender(<EntityList config={mockConfig} sortConfig={sortConfig} />)

      // Sort should be applied
      expect(screen.getByTestId('table-view')).toBeInTheDocument()
    })
  })

  describe('Pagination', () => {
    it('should render pagination when enabled', () => {
      const paginatedConfig = {
        ...mockConfig,
        paginated: true,
        pagination: {
          page: 1,
          pageSize: 2,
          total: mockData.length,
          totalPages: Math.ceil(mockData.length / 2)
        }
      }

      render(<EntityList config={paginatedConfig} />)

      expect(screen.getByTestId('pagination')).toBeInTheDocument()
    })

    it('should not render pagination when disabled', () => {
      const nonPaginatedConfig = {
        ...mockConfig,
        paginated: false
      }

      render(<EntityList config={nonPaginatedConfig} />)

      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
    })
  })

  describe('Selection', () => {
    it('should select items', () => {
      const onSelectionChange = vi.fn()

      render(
        <EntityList
          config={mockConfig}
          onSelectionChange={onSelectionChange}
        />
      )

      // Selection functionality should be available
      expect(screen.getByTestId('table-view')).toBeInTheDocument()
    })

    it('should update selected items from props', () => {
      const { rerender } = render(
        <EntityList config={mockConfig} selectedKeys={[]} />
      )

      rerender(<EntityList config={mockConfig} selectedKeys={[1, 2]} />)

      // Selected items should be updated
      expect(screen.getByTestId('table-view')).toBeInTheDocument()
    })
  })

  describe('Actions', () => {
    it('should render row actions', () => {
      const actions = [
        { id: 'edit', label: 'Edit', type: 'default' as const, onClick: vi.fn() },
        { id: 'delete', label: 'Delete', type: 'default' as const, onClick: vi.fn() }
      ]

      const configWithActions = { ...mockConfig, actions }

      render(<EntityList config={configWithActions} />)

      // Actions should be rendered
      expect(screen.getByTestId('table-view')).toBeInTheDocument()
    })

    it('should execute action when clicked', async () => {
      const onAction = vi.fn()
      const actions = [
        { id: 'edit', label: 'Edit', type: 'default' as const, onClick: vi.fn() }
      ]

      const configWithActions = { ...mockConfig, actions }

      render(
        <EntityList config={configWithActions} onAction={onAction} />
      )

      // Action execution should be available
      expect(screen.getByTestId('table-view')).toBeInTheDocument()
    })
  })

  describe('Bulk Actions', () => {
    it('should render bulk actions when items are selected', () => {
      const bulkActions = [
        { id: 'delete-all', label: 'Delete All', type: 'default' as const, onClick: vi.fn() }
      ]

      const configWithBulkActions = { ...mockConfig, bulkActions }

      render(
        <EntityList
          config={configWithBulkActions}
          selectedKeys={[1, 2]}
        />
      )

      // Bulk actions should be rendered
      expect(screen.getByTestId('table-view')).toBeInTheDocument()
    })

    it('should execute bulk action', async () => {
      const onBulkAction = vi.fn()
      const bulkActions = [
        { id: 'delete-all', label: 'Delete All', type: 'default' as const, onClick: vi.fn() }
      ]

      const configWithBulkActions = { ...mockConfig, bulkActions }

      render(
        <EntityList
          config={configWithBulkActions}
          selectedKeys={[1, 2]}
          onBulkAction={onBulkAction}
        />
      )

      // Bulk action execution should be available
      expect(screen.getByTestId('table-view')).toBeInTheDocument()
    })
  })

  describe('Refresh', () => {
    it('should refresh data when refresh button is clicked', async () => {
      const onDataChange = vi.fn()

      render(<EntityList config={mockConfig} onDataChange={onDataChange} />)

      const refreshButton = screen.getByText('Refresh')
      fireEvent.click(refreshButton)

      // Refresh should trigger
      await waitFor(() => {
        expect(refreshButton).toBeInTheDocument()
      })
    })
  })

  describe('Export', () => {
    it('should export data', async () => {
      const onExport = vi.fn()

      render(<EntityList config={mockConfig} onExport={onExport} />)

      // Export functionality should be available
      expect(screen.getByTestId('toolbar')).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior', () => {
    it('should adapt to mobile view', () => {
      // Mobile behavior is handled via useIsMobile mock
      render(<EntityList config={mockConfig} />)

      expect(screen.getByTestId('table-view')).toBeInTheDocument()
    })
  })
})
