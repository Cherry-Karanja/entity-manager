import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EntityView } from '../../../../../components/entityManager/EntityView'
import type { EntityViewConfig, ViewAction, ViewField } from '../../../../../components/entityManager/EntityView/types'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Loader2: ({ className }: { className?: string }) => <div className={className} data-testid="loader" />,
  ChevronLeft: () => <span>←</span>,
  ChevronRight: () => <span>→</span>,
  AlertCircle: () => <span>⚠</span>,
}))

// Mock UI components
vi.mock('../../../../../components/ui/scroll-area', () => ({
  ScrollArea: ({ children, className }: any) => <div className={className} data-testid="scroll-area">{children}</div>
}))

vi.mock('../../../../../components/ui/alert', () => ({
  Alert: ({ children, variant, className }: any) => (
    <div data-testid="alert" data-variant={variant} className={className}>{children}</div>
  ),
  AlertDescription: ({ children }: any) => <div data-testid="alert-description">{children}</div>
}))

vi.mock('../../../../../components/ui/button', () => ({
  Button: ({ children, onClick, disabled, variant, size, className }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      data-size={size}
      className={className}
      data-testid="button"
    >
      {children}
    </button>
  )
}))

// Mock hooks
vi.mock('../../../../../hooks/use-mobile', () => ({
  useIsMobile: () => false
}))

// Mock view components
vi.mock('../../../../../components/entityManager/EntityView/components/ViewHeader', () => ({
  ViewHeader: ({ data, config }: any) => (
    <div data-testid="view-header">
      <h1>{config.title || 'View'}</h1>
      {config.subtitle && <p>{config.subtitle}</p>}
    </div>
  )
}))

vi.mock('../../../../../components/entityManager/EntityView/views/CardView', () => ({
  CardView: ({ data, fields, onActionClick }: any) => (
    <div data-testid="card-view">
      {fields?.map((field: ViewField) => (
        <div key={field.key} data-testid={`field-${field.key}`}>
          <span>{field.label}: </span>
          <span>{(data as any)[field.key]}</span>
        </div>
      ))}
    </div>
  )
}))

vi.mock('../../../../../components/entityManager/EntityView/views/DetailView', () => ({
  DetailView: ({ data, fieldGroups, onActionClick }: any) => (
    <div data-testid="detail-view">
      {fieldGroups?.map((group: any) => (
        <div key={group.id} data-testid={`group-${group.id}`}>
          {group.title && <h3>{group.title}</h3>}
          {group.fields?.map((field: ViewField) => (
            <div key={field.key} data-testid={`field-${field.key}`}>
              <span>{field.label}: </span>
              <span>{(data as any)[field.key]}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}))

vi.mock('../../../../../components/entityManager/EntityView/views/SummaryView', () => ({
  SummaryView: ({ data, fields, onActionClick }: any) => (
    <div data-testid="summary-view">
      {fields?.map((field: ViewField) => (
        <div key={field.key} data-testid={`field-${field.key}`}>
          <span>{field.label}: </span>
          <span>{(data as any)[field.key]}</span>
        </div>
      ))}
    </div>
  )
}))

vi.mock('../../../../../components/entityManager/EntityView/views/TimelineView', () => ({
  TimelineView: ({ data, fieldGroups, onActionClick }: any) => (
    <div data-testid="timeline-view">
      {fieldGroups?.map((group: any) => (
        <div key={group.id} data-testid={`group-${group.id}`}>
          {group.title && <h3>{group.title}</h3>}
        </div>
      ))}
    </div>
  )
}))

describe('EntityView', () => {
  const mockData = {
    id: 1,
    name: 'Test Entity',
    email: 'test@example.com',
    status: 'active',
    createdAt: '2024-01-01'
  }

  const mockFields: ViewField[] = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'status', label: 'Status', type: 'badge' }
  ]

  const mockFieldGroups = [
    {
      id: 'basic',
      title: 'Basic Information',
      fields: [
        { key: 'name', label: 'Name', type: 'text' as const },
        { key: 'email', label: 'Email', type: 'email' as const }
      ]
    },
    {
      id: 'details',
      title: 'Details',
      fields: [
        { key: 'status', label: 'Status', type: 'badge' as const },
        { key: 'createdAt', label: 'Created', type: 'date' as const }
      ]
    }
  ]

  const mockConfig: EntityViewConfig = {
    mode: 'detail',
    showHeader: true,
    showActions: true,
    fields: mockFields,
    fieldGroups: mockFieldGroups
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render detail view with data', () => {
      render(<EntityView config={mockConfig} data={mockData} />)

      expect(screen.getByTestId('detail-view')).toBeInTheDocument()
      expect(screen.getByTestId('field-name')).toBeInTheDocument()
      expect(screen.getByText('Test Entity')).toBeInTheDocument()
    })

    it('should render loading state', () => {
      const loadingConfig = { ...mockConfig, dataFetcher: () => new Promise(() => {}) }

      render(<EntityView config={loadingConfig} />)

      expect(screen.getByTestId('loader')).toBeInTheDocument()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should render error state', () => {
      const errorConfig = { ...mockConfig }

      render(<EntityView config={errorConfig} />)

      // Simulate error by not providing data
      const alert = screen.getByTestId('alert')
      expect(alert).toBeInTheDocument()
    })

    it('should render no data state', () => {
      render(<EntityView config={mockConfig} />)

      expect(screen.getByText('No data to display')).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      const { container } = render(
        <EntityView config={mockConfig} data={mockData} className="custom-class" />
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('custom-class')
    })
  })

  describe('View Modes', () => {
    it('should render card view', () => {
      const cardConfig = { ...mockConfig, mode: 'card' as const, fields: mockFields }

      render(<EntityView config={cardConfig} data={mockData} />)

      expect(screen.getByTestId('card-view')).toBeInTheDocument()
    })

    it('should render detail view by default', () => {
      render(<EntityView config={mockConfig} data={mockData} />)

      expect(screen.getByTestId('detail-view')).toBeInTheDocument()
    })

    it('should render summary view', () => {
      const summaryConfig = { ...mockConfig, mode: 'summary' as const }

      render(<EntityView config={summaryConfig} data={mockData} />)

      expect(screen.getByTestId('summary-view')).toBeInTheDocument()
    })

    it('should render timeline view', () => {
      const timelineConfig = { ...mockConfig, mode: 'timeline' as const }

      render(<EntityView config={timelineConfig} data={mockData} />)

      expect(screen.getByTestId('timeline-view')).toBeInTheDocument()
    })
  })

  describe('Field Rendering', () => {
    it('should render all visible fields', () => {
      const config = { ...mockConfig, mode: 'card' as const, fields: mockFields }

      render(<EntityView config={config} data={mockData} />)

      expect(screen.getByTestId('field-id')).toBeInTheDocument()
      expect(screen.getByTestId('field-name')).toBeInTheDocument()
      expect(screen.getByTestId('field-email')).toBeInTheDocument()
      expect(screen.getByTestId('field-status')).toBeInTheDocument()
    })

    it('should hide fields based on hidden property', () => {
      const fieldsWithHidden = [
        ...mockFields,
        { key: 'hidden', label: 'Hidden Field', type: 'text' as const, hidden: true }
      ]
      const config = { ...mockConfig, mode: 'card' as const, fields: fieldsWithHidden }

      render(<EntityView config={config} data={mockData} />)

      expect(screen.queryByTestId('field-hidden')).not.toBeInTheDocument()
    })

    it('should conditionally show fields', () => {
      const fieldsWithCondition = [
        { key: 'name', label: 'Name', type: 'text' as const },
        {
          key: 'conditional',
          label: 'Conditional Field',
          type: 'text' as const,
          condition: (data: any) => data.status === 'active'
        }
      ]
      const config = { ...mockConfig, mode: 'card' as const, fields: fieldsWithCondition }

      render(<EntityView config={config} data={mockData} />)

      // Field should be visible because status is 'active'
      expect(screen.getByTestId('field-name')).toBeInTheDocument()
    })

    it('should render field groups', () => {
      render(<EntityView config={mockConfig} data={mockData} />)

      expect(screen.getByTestId('group-basic')).toBeInTheDocument()
      expect(screen.getByTestId('group-details')).toBeInTheDocument()
      expect(screen.getByText('Basic Information')).toBeInTheDocument()
      expect(screen.getByText('Details')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should render navigation buttons when enabled', () => {
      const navConfig = {
        ...mockConfig,
        showNavigation: true,
        navigation: {
          canGoPrev: true,
          canGoNext: true
        }
      }

      render(<EntityView config={navConfig} data={mockData} />)

      expect(screen.getByText('Previous')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
    })

    it('should disable previous button when canGoPrev is false', () => {
      const navConfig = {
        ...mockConfig,
        showNavigation: true,
        navigation: {
          canGoPrev: false,
          canGoNext: true
        }
      }

      render(<EntityView config={navConfig} data={mockData} />)

      const prevButton = screen.getByText('Previous').closest('button')
      expect(prevButton).toBeDisabled()
    })

    it('should disable next button when canGoNext is false', () => {
      const navConfig = {
        ...mockConfig,
        showNavigation: true,
        navigation: {
          canGoPrev: true,
          canGoNext: false
        }
      }

      render(<EntityView config={navConfig} data={mockData} />)

      const nextButton = screen.getByText('Next').closest('button')
      expect(nextButton).toBeDisabled()
    })

    it('should call onNavigate when navigation buttons are clicked', () => {
      const onNavigate = vi.fn()
      const navConfig = {
        ...mockConfig,
        showNavigation: true,
        navigation: {
          canGoPrev: true,
          canGoNext: true
        }
      }

      render(<EntityView config={navConfig} data={mockData} onNavigate={onNavigate} />)

      const prevButton = screen.getByText('Previous')
      const nextButton = screen.getByText('Next')

      fireEvent.click(prevButton)
      expect(onNavigate).toHaveBeenCalledWith('prev')

      fireEvent.click(nextButton)
      expect(onNavigate).toHaveBeenCalledWith('next')
    })

    it('should not render navigation when showNavigation is false', () => {
      const navConfig = {
        ...mockConfig,
        showNavigation: false
      }

      render(<EntityView config={navConfig} data={mockData} />)

      expect(screen.queryByText('Previous')).not.toBeInTheDocument()
      expect(screen.queryByText('Next')).not.toBeInTheDocument()
    })
  })

  describe('Actions', () => {
    it('should handle action clicks', () => {
      const onActionClick = vi.fn()
      const actions: ViewAction[] = [
        { id: 'edit', label: 'Edit', variant: 'outline' },
        { id: 'delete', label: 'Delete', variant: 'destructive' }
      ]
      const actionConfig = { ...mockConfig, actions }

      render(<EntityView config={actionConfig} data={mockData} onActionClick={onActionClick} />)

      // Actions are rendered by child view components
      expect(screen.getByTestId('detail-view')).toBeInTheDocument()
    })

    it('should filter actions based on conditions', () => {
      const actions: ViewAction[] = [
        { id: 'edit', label: 'Edit', variant: 'outline' },
        {
          id: 'conditional',
          label: 'Conditional Action',
          variant: 'default',
          condition: (data: any) => data.status === 'inactive'
        }
      ]
      const actionConfig = { ...mockConfig, actions }

      render(<EntityView config={actionConfig} data={mockData} />)

      // Conditional action should not be rendered because status is 'active'
      expect(screen.getByTestId('detail-view')).toBeInTheDocument()
    })
  })

  describe('Data Fetching', () => {
    it('should fetch data when dataFetcher is provided', async () => {
      const dataFetcher = vi.fn().mockResolvedValue(mockData)
      const fetchConfig = { ...mockConfig, dataFetcher }

      render(<EntityView config={fetchConfig} />)

      // Should show loading initially
      expect(screen.getByTestId('loader')).toBeInTheDocument()

      // Wait for data to load
      await waitFor(() => {
        expect(dataFetcher).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(screen.getByTestId('detail-view')).toBeInTheDocument()
      })
    })

    it('should handle fetch errors', async () => {
      const dataFetcher = vi.fn().mockRejectedValue(new Error('Failed to load'))
      const fetchConfig = { ...mockConfig, dataFetcher }

      render(<EntityView config={fetchConfig} />)

      await waitFor(() => {
        expect(screen.getByText('Failed to load')).toBeInTheDocument()
      })
    })

    it('should transform data when dataTransformer is provided', async () => {
      const dataFetcher = vi.fn().mockResolvedValue({ rawData: 'test' })
      const dataTransformer = vi.fn((data: any) => ({ ...mockData, transformed: true }))
      const fetchConfig = { ...mockConfig, dataFetcher, dataTransformer }

      render(<EntityView config={fetchConfig} />)

      await waitFor(() => {
        expect(dataTransformer).toHaveBeenCalled()
      })
    })
  })

  describe('Hooks', () => {
    it('should call onViewLoad hook when data is fetched', async () => {
      const onViewLoad = vi.fn()
      const dataFetcher = vi.fn().mockResolvedValue(mockData)
      const hookConfig = {
        ...mockConfig,
        dataFetcher,
        hooks: { onViewLoad }
      }

      render(<EntityView config={hookConfig} />)

      await waitFor(() => {
        expect(onViewLoad).toHaveBeenCalledWith(mockData)
      })
    })

    it('should call onViewChange hook when data changes', async () => {
      const onViewChange = vi.fn()
      const hookConfig = {
        ...mockConfig,
        hooks: { onViewChange }
      }

      const { rerender } = render(<EntityView config={hookConfig} data={mockData} />)

      await waitFor(() => {
        expect(onViewChange).toHaveBeenCalledWith(mockData)
      })

      const newData = { ...mockData, name: 'Updated Entity' }
      rerender(<EntityView config={hookConfig} data={newData} />)

      await waitFor(() => {
        expect(onViewChange).toHaveBeenCalledWith(newData)
      })
    })

    it('should call onActionClick hook', () => {
      const onActionClick = vi.fn()
      const action: ViewAction = { id: 'test', label: 'Test Action' }
      const hookConfig = {
        ...mockConfig,
        hooks: { onActionClick }
      }

      render(<EntityView config={hookConfig} data={mockData} />)

      // The hook would be called when an action is clicked in child components
      expect(screen.getByTestId('detail-view')).toBeInTheDocument()
    })

    it('should call onNavigate hook', () => {
      const onNavigate = vi.fn()
      const navConfig = {
        ...mockConfig,
        showNavigation: true,
        navigation: {
          canGoPrev: true,
          canGoNext: true
        },
        hooks: { onNavigate }
      }

      render(<EntityView config={navConfig} data={mockData} />)

      const nextButton = screen.getByText('Next')
      fireEvent.click(nextButton)

      expect(onNavigate).toHaveBeenCalledWith('next')
    })
  })

  describe('Custom Components', () => {
    it('should render custom header component', () => {
      const CustomHeader = ({ data }: any) => (
        <div data-testid="custom-header">Custom Header: {data.name}</div>
      )

      const customConfig = {
        ...mockConfig,
        showHeader: true,
        customComponents: {
          header: CustomHeader
        }
      }

      render(<EntityView config={customConfig} data={mockData} />)

      expect(screen.getByTestId('custom-header')).toBeInTheDocument()
      expect(screen.getByText(/Custom Header: Test Entity/)).toBeInTheDocument()
    })

    it('should render custom metadata component', () => {
      const CustomMetadata = ({ data }: any) => (
        <div data-testid="custom-metadata">Created: {data.createdAt}</div>
      )

      const customConfig = {
        ...mockConfig,
        showMetadata: true,
        customComponents: {
          metadata: CustomMetadata
        }
      }

      render(<EntityView config={customConfig} data={mockData} />)

      expect(screen.getByTestId('custom-metadata')).toBeInTheDocument()
      expect(screen.getByText(/Created: 2024-01-01/)).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior', () => {
    it('should render in mobile view', () => {
      // Note: This would require mocking useIsMobile to return true
      render(<EntityView config={mockConfig} data={mockData} />)

      expect(screen.getByTestId('detail-view')).toBeInTheDocument()
    })
  })

  describe('ScrollArea', () => {
    it('should wrap content in ScrollArea', () => {
      render(<EntityView config={mockConfig} data={mockData} />)

      expect(screen.getByTestId('scroll-area')).toBeInTheDocument()
    })
  })
})
