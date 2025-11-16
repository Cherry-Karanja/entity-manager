/**
 * EntityActions Component
 * 
 * Standalone component for rendering entity actions with support for 8 action types.
 * Works independently without orchestrator or context.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { BaseEntity } from '../../primitives/types';
import {
  EntityActionsProps,
  Action,
  ActionState,
  ActionResult,
  ImmediateAction,
  ConfirmAction,
  FormAction,
  ModalAction,
  NavigationAction,
  BulkAction,
  DownloadAction,
  CustomAction,
} from './types';
import {
  filterActionsByPosition,
  getEnabledActions,
  canExecuteAction,
  getActionTooltip,
  buildNavigationUrl,
  getConfirmMessage,
  getInitialFormValues,
  validateFormValues,
  getBulkConfirmMessage,
} from './utils';

/**
 * EntityActions Component
 * 
 * @example
 * ```tsx
 * const actions: Action<User>[] = [
 *   {
 *     id: 'edit',
 *     label: 'Edit',
 *     actionType: 'navigation',
 *     url: '/users/{id}/edit',
 *   },
 *   {
 *     id: 'delete',
 *     label: 'Delete',
 *     actionType: 'confirm',
 *     confirmMessage: 'Delete this user?',
 *     onConfirm: async (user) => {
 *       await deleteUser(user.id);
 *     },
 *   },
 * ];
 * 
 * <EntityActions actions={actions} entity={user} />
 * ```
 */
export function EntityActions<T extends BaseEntity = BaseEntity>({
  actions,
  entity,
  context,
  mode = 'buttons',
  position,
  className = '',
  onActionStart,
  onActionComplete,
  onActionError,
}: EntityActionsProps<T>): React.ReactElement {
  const [state, setState] = useState<ActionState>({
    loading: false,
    modalOpen: false,
  });

  /**
   * Execute action based on type
   */
  const executeAction = useCallback(async (action: Action<T>) => {
    if (!canExecuteAction(action, entity, context)) {
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, executing: action.id }));
      onActionStart?.(action.id);

      const result: ActionResult = { success: true };

      switch (action.actionType) {
        case 'immediate':
          await handleImmediateAction(action as ImmediateAction<T>);
          break;

        case 'confirm':
          await handleConfirmAction(action as ConfirmAction<T>);
          break;

        case 'form':
          handleFormAction(action as FormAction<T>);
          break;

        case 'modal':
          handleModalAction(action as ModalAction<T>);
          break;

        case 'navigation':
          handleNavigationAction(action as NavigationAction<T>);
          break;

        case 'bulk':
          await handleBulkAction(action as BulkAction<T>);
          break;

        case 'download':
          await handleDownloadAction(action as DownloadAction<T>);
          break;

        case 'custom':
          await handleCustomAction(action as CustomAction<T>);
          break;
      }

      onActionComplete?.(action.id, result);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Action failed');
      setState(prev => ({ ...prev, error: errorObj }));
      onActionError?.(action.id, errorObj);
      onActionComplete?.(action.id, { success: false, error: errorObj });
    } finally {
      setState(prev => ({ ...prev, loading: false, executing: undefined }));
    }
  }, [entity, context, onActionStart, onActionComplete, onActionError]);

  /**
   * Handle immediate action
   */
  const handleImmediateAction = async (action: ImmediateAction<T>) => {
    await action.handler(entity, context);
  };

  /**
   * Handle confirm action
   */
  const handleConfirmAction = async (action: ConfirmAction<T>) => {
    const message = getConfirmMessage(action.confirmMessage, entity);
    const confirmed = window.confirm(message);
    
    if (confirmed) {
      await action.onConfirm(entity, context);
    } else {
      action.onCancel?.();
    }
  };

  /**
   * Handle form action
   */
  const handleFormAction = (action: FormAction<T>) => {
    const initialValues = getInitialFormValues(action.initialValues, entity, action.fields);
    
    setState(prev => ({
      ...prev,
      modalOpen: true,
      modalContent: (
        <FormModal
          title={action.formTitle}
          fields={action.fields}
          initialValues={initialValues}
          submitText={action.submitText}
          onSubmit={async (values) => {
            await action.onSubmit(values, entity, context);
            setState(prev => ({ ...prev, modalOpen: false, modalContent: undefined }));
          }}
          onCancel={() => {
            action.onCancel?.();
            setState(prev => ({ ...prev, modalOpen: false, modalContent: undefined }));
          }}
        />
      ),
    }));
  };

  /**
   * Handle modal action
   */
  const handleModalAction = (action: ModalAction<T>) => {
    const ModalContent = action.content;
    
    setState(prev => ({
      ...prev,
      modalOpen: true,
      modalContent: (
        <ModalContent
          entity={entity}
          context={context}
          onClose={() => {
            action.onClose?.();
            setState(prev => ({ ...prev, modalOpen: false, modalContent: undefined }));
          }}
        />
      ),
    }));
  };

  /**
   * Handle navigation action
   */
  const handleNavigationAction = async (action: NavigationAction<T>) => {
    // Check before navigate
    if (action.beforeNavigate) {
      const canNavigate = await action.beforeNavigate(entity, context);
      if (!canNavigate) return;
    }

    const url = buildNavigationUrl(action.url, entity, context);
    
    if (action.newTab) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  };

  /**
   * Handle bulk action
   */
  const handleBulkAction = async (action: BulkAction<T>) => {
    const entities = context?.selectedEntities || [];
    
    if (entities.length === 0) {
      throw new Error('No items selected');
    }

    if (action.maxItems && entities.length > action.maxItems) {
      throw new Error(`Maximum ${action.maxItems} items allowed`);
    }

    // Confirm bulk operation
    if (action.confirmBulk) {
      const message = getBulkConfirmMessage(action.bulkConfirmMessage, entities.length);
      const confirmed = window.confirm(message);
      if (!confirmed) return;
    }

    await action.handler(entities, context);
  };

  /**
   * Handle download action
   */
  const handleDownloadAction = async (action: DownloadAction<T>) => {
    if (action.downloadUrl) {
      const url = typeof action.downloadUrl === 'string' 
        ? action.downloadUrl 
        : action.downloadUrl(entity);
      
      const link = document.createElement('a');
      link.href = url;
      if (action.filename) {
        const filename = typeof action.filename === 'string'
          ? action.filename
          : action.filename(entity);
        link.download = filename;
      }
      link.click();
    } else {
      await action.handler(entity, context);
    }
  };

  /**
   * Handle custom action
   */
  const handleCustomAction = async (action: CustomAction<T>) => {
    if (action.handler) {
      await action.handler(entity, context);
    }
  };

  // Filter actions
  const filteredActions = filterActionsByPosition(actions, position);
  const enabledActions = getEnabledActions(filteredActions, entity, context);

  // Render based on mode
  if (mode === 'dropdown') {
    return (
      <div className={`entity-actions-dropdown ${className}`}>
        <button className="dropdown-trigger">Actions ▾</button>
        <div className="dropdown-menu">
          {enabledActions.map(action => (
            <button
              key={action.id}
              onClick={() => executeAction(action)}
              disabled={state.loading && state.executing === action.id}
              title={getActionTooltip(action, entity, context)}
              className={`dropdown-item ${action.variant || ''}`}
            >
              {action.icon && <span className="action-icon">{action.icon}</span>}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
        {state.modalOpen && state.modalContent}
      </div>
    );
  }

  // Default: buttons mode
  return (
    <div className={`entity-actions-buttons ${className}`}>
      {enabledActions.map(action => (
        action.actionType === 'custom' && (action as CustomAction<T>).component ? (
          <action.component key={action.id} entity={entity} context={context} />
        ) : (
          <button
            key={action.id}
            onClick={() => executeAction(action)}
            disabled={state.loading && state.executing === action.id}
            title={getActionTooltip(action, entity, context)}
            className={`action-button ${action.variant || 'secondary'}`}
          >
            {action.icon && <span className="action-icon">{action.icon}</span>}
            <span>{action.label}</span>
            {state.loading && state.executing === action.id && (
              <span className="spinner">⟳</span>
            )}
          </button>
        )
      ))}
      {state.modalOpen && state.modalContent}
    </div>
  );
}

/**
 * FormModal Component
 */
function FormModal({
  title,
  fields,
  initialValues,
  submitText = 'Submit',
  onSubmit,
  onCancel,
}: {
  title: string;
  fields: any[];
  initialValues: Record<string, unknown>;
  submitText?: string;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateFormValues(values, fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map(field => (
            <div key={field.name} className="form-field">
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
              <input
                id={field.name}
                type={field.type}
                value={String(values[field.name] || '')}
                onChange={(e) => setValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                placeholder={field.placeholder}
                disabled={field.disabled || submitting}
              />
              {errors[field.name] && (
                <span className="field-error">{errors[field.name]}</span>
              )}
              {field.helpText && (
                <span className="field-help">{field.helpText}</span>
              )}
            </div>
          ))}
          <div className="form-actions">
            <button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : submitText}
            </button>
            <button type="button" onClick={onCancel} disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EntityActions;
