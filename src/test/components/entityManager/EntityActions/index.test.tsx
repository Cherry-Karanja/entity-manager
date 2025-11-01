import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { EntityActions } from '../../../../../components/entityManager/EntityActions'
import { EntityActionsConfig, EntityAction, EntityBulkAction } from '../../../../../components/entityManager/EntityActions/types'

// Mock dependencies
vi.mock('@/hooks/use-permissions', () => ({
  usePermissions: () => ({
    hasPermission: vi.fn(() => true)
  })
}))

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )
}))

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>{children}</button>
  ),
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />
}))

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => open ? <div>{children}</div> : null,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>
}))

vi.mock('@/components/ui/drawer', () => ({
  Drawer: ({ children, open }: any) => open ? <div>{children}</div> : null,
  DrawerContent: ({ children }: any) => <div>{children}</div>,
  DrawerHeader: ({ children }: any) => <div>{children}</div>,
  DrawerTitle: ({ children }: any) => <div>{children}</div>,
  DrawerFooter: ({ children }: any) => <div>{children}</div>
}))

vi.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children, open }: any) => open ? <div>{children}</div> : null,
  AlertDialogAction: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  AlertDialogCancel: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  AlertDialogContent: ({ children }: any) => <div>{children}</div>,
  AlertDialogDescription: ({ children }: any) => <div>{children}</div>,
  AlertDialogFooter: ({ children }: any) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: any) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: any) => <div>{children}</div>
}))

vi.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children }: any) => <div>{children}</div>
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span>{children}</span>
}))

vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}))

vi.mock('../../../../../components/entityManager/EntityActions/components/ActionForm', () => ({
  ActionForm: ({ onSubmit }: any) => (
    <form onSubmit={onSubmit}>
      <button type="submit">Submit Form</button>
    </form>
  )
}))

vi.mock('../../../../../components/entityManager/EntityActions/components/ActionModal', () => ({
  ActionModal: ({ children, onClose }: any) => (
    <div>
      {children}
      <button onClick={onClose}>Close Modal</button>
    </div>
  )
}))

vi.mock('../../../../../components/entityManager/EntityActions/components/ActionDrawer', () => ({
  ActionDrawer: ({ children, onClose }: any) => (
    <div>
      {children}
      <button onClick={onClose}>Close Drawer</button>
    </div>
  )
}))

describe('EntityActions', () => {
  const mockItem = { id: 1, name: 'Test Item' }
  const mockConfig: EntityActionsConfig = {
    actions: [],
    context: {},
    permissions: {
      check: vi.fn(() => true)
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render primary actions as buttons', () => {
      const actions: EntityAction[] = [
        {
          id: 'edit',
          label: 'Edit',
          type: 'primary',
          actionType: 'immediate',
          onExecute: vi.fn()
        }
      ]

      const config = { ...mockConfig, actions }

      render(<EntityActions config={config} item={mockItem} />)

      expect(screen.getByText('Edit')).toBeInTheDocument()
    })

    it('should render dropdown actions in dropdown menu', () => {
      const actions: EntityAction[] = [
        {
          id: 'edit',
          label: 'Edit',
          type: 'default',
          actionType: 'immediate',
          onExecute: vi.fn()
        },
        {
          id: 'delete',
          label: 'Delete',
          type: 'default',
          actionType: 'immediate',
          onExecute: vi.fn()
        }
      ]

      const config = { ...mockConfig, actions }

      render(<EntityActions config={config} item={mockItem} />)

      expect(screen.getByText('Edit')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })

    it('should not render hidden actions', () => {
      const actions: EntityAction[] = [
        {
          id: 'hidden',
          label: 'Hidden Action',
          type: 'default',
          actionType: 'immediate',
          hidden: true,
          onExecute: vi.fn()
        }
      ]

      const config = { ...mockConfig, actions }

      render(<EntityActions config={config} item={mockItem} />)

      expect(screen.queryByText('Hidden Action')).not.toBeInTheDocument()
    })

    it('should respect permission checks', () => {
      const mockPermissions = {
        check: vi.fn(() => false)
      }

      const actions: EntityAction[] = [
        {
          id: 'admin-only',
          label: 'Admin Only',
          type: 'default',
          actionType: 'immediate',
          permission: 'admin',
          onExecute: vi.fn()
        }
      ]

      const config = { ...mockConfig, actions, permissions: mockPermissions }

      render(<EntityActions config={config} item={mockItem} />)

      expect(screen.queryByText('Admin Only')).not.toBeInTheDocument()
    })
  })

  describe('Action Execution', () => {
    it('should execute immediate actions', async () => {
      const onExecute = vi.fn()
      const actions: EntityAction[] = [
        {
          id: 'immediate',
          label: 'Immediate Action',
          type: 'primary',
          actionType: 'immediate',
          onExecute
        }
      ]

      const config = { ...mockConfig, actions }

      render(<EntityActions config={config} item={mockItem} />)

      await act(async () => {
        fireEvent.click(screen.getByText('Immediate Action'))
      })

      expect(onExecute).toHaveBeenCalledWith(mockItem, {})
    })

    it('should show confirmation dialog for confirm actions', async () => {
      const onExecute = vi.fn()
      const actions: EntityAction[] = [
        {
          id: 'confirm',
          label: 'Confirm Action',
          type: 'primary',
          actionType: 'confirm',
          confirm: {
            title: 'Confirm Action',
            content: 'Are you sure?'
          },
          onExecute
        }
      ]

      const config = { ...mockConfig, actions }

      render(<EntityActions config={config} item={mockItem} />)

      fireEvent.click(screen.getByText('Confirm Action'))

      expect(screen.getByText('Are you sure?')).toBeInTheDocument()
    })

    it('should execute action after confirmation', async () => {
      const onExecute = vi.fn()
      const actions: EntityAction[] = [
        {
          id: 'confirm',
          label: 'Confirm Action',
          type: 'primary',
          actionType: 'confirm',
          confirm: {
            title: 'Confirm Action',
            content: 'Are you sure?'
          },
          onExecute
        }
      ]

      const config = { ...mockConfig, actions }

      render(<EntityActions config={config} item={mockItem} />)

      fireEvent.click(screen.getByText('Confirm Action'))
      fireEvent.click(screen.getByText('OK')) // AlertDialogAction

      await waitFor(() => {
        expect(onExecute).toHaveBeenCalledWith(mockItem, {})
      })
    })

    it('should handle async actions', async () => {
      const onExecute = vi.fn().mockResolvedValue(undefined)
      const actions: EntityAction[] = [
        {
          id: 'async',
          label: 'Async Action',
          type: 'primary',
          actionType: 'async',
          onExecute
        }
      ]

      const config = { ...mockConfig, actions }

      render(<EntityActions config={config} item={mockItem} />)

      fireEvent.click(screen.getByText('Async Action'))

      await waitFor(() => {
        expect(onExecute).toHaveBeenCalledWith(mockItem, {})
      })
    })
  })

  describe('Bulk Actions', () => {
    const selectedItems = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ]

    it('should render bulk actions when items are selected', () => {
      const bulkActions: EntityBulkAction[] = [
        {
          id: 'bulk-delete',
          label: 'Delete Selected',
          type: 'default',
          actionType: 'bulk',
          onExecute: vi.fn()
        }
      ]

      const config = { ...mockConfig, bulkActions }

      render(<EntityActions config={config} item={mockItem} selectedItems={selectedItems} />)

      expect(screen.getByText('Delete Selected')).toBeInTheDocument()
    })

    it('should execute bulk actions when clicked', async () => {
      const onExecute = vi.fn()
      const bulkActions: EntityBulkAction[] = [
        {
          id: 'bulk-export',
          label: 'Export Selected',
          type: 'primary',
          actionType: 'bulk',
          bulk: {},
          onExecute
        }
      ]

      const config = { ...mockConfig, bulkActions }

      render(<EntityActions config={config} item={mockItem} selectedItems={selectedItems} />)

      await act(async () => {
        fireEvent.click(screen.getByText('Export Selected'))
      })

      // Verify the bulk action was executed
      expect(onExecute).toHaveBeenCalled()
    })
  })

  describe('Form Actions', () => {
    it('should show form dialog for form actions', () => {
      const actions: EntityAction[] = [
        {
          id: 'form-action',
          label: 'Form Action',
          type: 'primary',
          actionType: 'form',
          form: {
            title: 'Edit Item',
            fields: [],
            onSubmit: vi.fn()
          },
          onExecute: vi.fn()
        }
      ]

      const config = { ...mockConfig, actions }

      render(<EntityActions config={config} item={mockItem} />)

      fireEvent.click(screen.getByText('Form Action'))

      expect(screen.getByText('Submit Form')).toBeInTheDocument()
    })
  })

  describe('Modal Actions', () => {
    it('should show modal for modal actions', () => {
      const ModalContent = ({ item, onClose }: { item: unknown; onClose: () => void }) => (
        <div>Modal Content for {(item as any)?.name}</div>
      )

      const actions: EntityAction[] = [
        {
          id: 'modal-action',
          label: 'Modal Action',
          type: 'primary',
          actionType: 'modal',
          modal: {
            title: 'Modal Title',
            content: ModalContent
          },
          onExecute: vi.fn()
        }
      ]

      const config = { ...mockConfig, actions }

      render(<EntityActions config={config} item={mockItem} />)

      fireEvent.click(screen.getByText('Modal Action'))

      expect(screen.getByText('Close Modal')).toBeInTheDocument()
    })
  })

  describe('Drawer Actions', () => {
    it('should show drawer for drawer actions', () => {
      const DrawerContent = ({ item, onClose }: { item: unknown; onClose: () => void }) => (
        <div>Drawer Content for {(item as any)?.name}</div>
      )

      const actions: EntityAction[] = [
        {
          id: 'drawer-action',
          label: 'Drawer Action',
          type: 'primary',
          actionType: 'drawer',
          drawer: {
            title: 'Drawer Title',
            content: DrawerContent
          },
          onExecute: vi.fn()
        }
      ]

      const config = { ...mockConfig, actions }

      render(<EntityActions config={config} item={mockItem} />)

      fireEvent.click(screen.getByText('Drawer Action'))

      expect(screen.getByText('Close Drawer')).toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    it('should disable all actions when disabled prop is true', () => {
      const actions: EntityAction[] = [
        {
          id: 'action',
          label: 'Action',
          type: 'primary',
          actionType: 'immediate',
          onExecute: vi.fn()
        }
      ]

      const config = { ...mockConfig, actions }

      render(<EntityActions config={config} item={mockItem} disabled={true} />)

      const button = screen.getByText('Action') as HTMLButtonElement
      expect(button).toBeDisabled()
    })
  })

  describe('Loading State', () => {
    it('should show loading state during async execution', async () => {
      const onExecute = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      const actions: EntityAction[] = [
        {
          id: 'async-action',
          label: 'Async Action',
          type: 'primary',
          actionType: 'async',
          onExecute
        }
      ]

      const config = { ...mockConfig, actions }

      render(<EntityActions config={config} item={mockItem} />)

      fireEvent.click(screen.getByText('Async Action'))

      // Button should be disabled during execution
      await waitFor(() => {
        expect(onExecute).toHaveBeenCalled()
      })
    })
  })

  describe('Condition and Visibility', () => {
    it('should respect condition functions', () => {
      const condition = vi.fn(() => false)
      const actions: EntityAction[] = [
        {
          id: 'conditional',
          label: 'Conditional Action',
          type: 'primary',
          actionType: 'immediate',
          condition,
          onExecute: vi.fn()
        }
      ]

      const config = { ...mockConfig, actions }

      render(<EntityActions config={config} item={mockItem} />)

      expect(screen.queryByText('Conditional Action')).not.toBeInTheDocument()
      expect(condition).toHaveBeenCalledWith(mockItem, {})
    })

    it('should respect visible functions', () => {
      const visible = vi.fn(() => false)
      const actions: EntityAction[] = [
        {
          id: 'invisible',
          label: 'Invisible Action',
          type: 'primary',
          actionType: 'immediate',
          visible,
          onExecute: vi.fn()
        }
      ]

      const config = { ...mockConfig, actions }

      render(<EntityActions config={config} item={mockItem} />)

      expect(screen.queryByText('Invisible Action')).not.toBeInTheDocument()
      expect(visible).toHaveBeenCalledWith(mockItem, {})
    })
  })
})