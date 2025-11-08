import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { EntityForm } from '@/components/entityManager/EntityForm'
import { EntityFormConfig } from '@/components/entityManager/EntityForm/types'

// Mock dependencies
vi.mock('../../../hooks/use-mobile', () => ({
  useIsMobile: () => false,
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

const mockConfig: EntityFormConfig = {
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      minLength: 2,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      required: false,
    },
  ],
  validationSchema: {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' }
    ],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Invalid email format' }
    ],
    age: [{ type: 'min', value: 18, message: 'Age must be at least 18' }],
  },
  layout: 'vertical',
  submitButtonText: 'Save',
  cancelButtonText: 'Cancel',
  onCancel: vi.fn(),
}

const mockData = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
}

describe('EntityForm Component', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Form Rendering', () => {
    it('should render all form fields', () => {
      render(
        <EntityForm
          config={mockConfig}
          data={mockData}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Age')).toBeInTheDocument()
    })

    it('should render submit and cancel buttons', () => {
      render(
        <EntityForm
          config={mockConfig}
          data={mockData}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    it('should display initial data', () => {
      render(
        <EntityForm
          config={mockConfig}
          data={mockData}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('30')).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('should show validation errors for required fields', async () => {
      render(
        <EntityForm
          config={mockConfig}
          data={{}}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      const form = document.querySelector('form') as HTMLFormElement
      await act(async () => {
        fireEvent.submit(form)
      })

      await waitFor(() => {
        expect(screen.getByText((content) => content.includes('Name is required'))).toBeInTheDocument()
        expect(screen.getByText((content) => content.includes('Email is required'))).toBeInTheDocument()
      })
    })

    it('should validate email format', async () => {
      render(
        <EntityForm
          config={mockConfig}
          data={{ name: 'John' }}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      const emailInput = screen.getByLabelText('Email')
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.blur(emailInput)

      const submitButton = screen.getByRole('button', { name: 'Save' })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText((content) => content.includes('Invalid email format'))).toBeInTheDocument()
      })
    })

    it('should validate minimum length', async () => {
      render(
        <EntityForm
          config={mockConfig}
          data={{ email: 'john@example.com' }}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      const nameInput = screen.getByLabelText('Name')
      fireEvent.change(nameInput, { target: { value: 'A' } })
      fireEvent.blur(nameInput)

      const submitButton = screen.getByRole('button', { name: 'Save' })
      fireEvent.click(submitButton)

      expect(screen.getByText((content) => content.includes('Name must be at least 2 characters'))).toBeInTheDocument()
    })

    it('should validate number ranges', async () => {
      render(
        <EntityForm
          config={mockConfig}
          data={{ name: 'John', email: 'john@example.com' }}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      const ageInput = screen.getByLabelText('Age')
      await act(async () => {
        fireEvent.change(ageInput, { target: { value: '15' } })
        fireEvent.blur(ageInput)
      })

      const form = document.querySelector('form') as HTMLFormElement
      await act(async () => {
        fireEvent.submit(form)
      })

      expect(screen.getByText((content) => content.includes('Age must be at least 18'))).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should call onSubmit with valid data', async () => {
      render(
        <EntityForm
          config={mockConfig}
          data={mockData}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      const submitButton = screen.getByRole('button', { name: 'Save' })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(mockData)
      })
    })

    it('should not call onSubmit with invalid data', async () => {
      render(
        <EntityForm
          config={mockConfig}
          data={{}}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      const submitButton = screen.getByRole('button', { name: 'Save' })
      fireEvent.click(submitButton)

      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should call onCancel when cancel button is clicked', () => {
      render(
        <EntityForm
          config={mockConfig}
          data={mockData}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      fireEvent.click(cancelButton)

      expect(mockOnCancel).toHaveBeenCalled()
    })
  })

  describe('Form State', () => {
    it('should disable form when disabled prop is true', () => {
      render(
        <EntityForm
          config={mockConfig}
          data={mockData}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          disabled={true}
        />
      )

      const submitButton = screen.getByRole('button', { name: 'Save' })
      const cancelButton = screen.getByRole('button', { name: 'Cancel' })

      expect(submitButton).toBeDisabled()
      expect(cancelButton).toBeDisabled()
    })

    it('should show loading state', () => {
      render(
        <EntityForm
          config={mockConfig}
          data={mockData}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          loading={true}
        />
      )

      const submitButton = screen.getByRole('button', { name: 'Save' })
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Field Updates', () => {
    it('should update form data on input change', () => {
      render(
        <EntityForm
          config={mockConfig}
          data={mockData}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      const nameInput = screen.getByLabelText('Name')
      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } })

      expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument()
    })

    it('should clear validation errors on valid input', async () => {
      render(
        <EntityForm
          config={mockConfig}
          data={{}}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      const nameInput = screen.getByLabelText('Name')
      const submitButton = screen.getByRole('button', { name: 'Save' })

      // Trigger validation error
      const form = document.querySelector('form') as HTMLFormElement
      await act(async () => {
        fireEvent.submit(form)
      })
      expect(screen.getByText((content) => content.includes('Name is required'))).toBeInTheDocument()

      // Fix the error
      await act(async () => {
        fireEvent.change(nameInput, { target: { value: 'John' } })
        fireEvent.blur(nameInput)
      })

      await waitFor(() => {
      expect(screen.queryByText((content) => content.includes('Name is required'))).not.toBeInTheDocument()
      })
    })
  })
})