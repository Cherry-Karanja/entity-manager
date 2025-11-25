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
    dropdownOpen: false,
    overflowOpen: false,
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
    // Show confirmation dialog
    setState(prev => ({
      ...prev,
      modalOpen: true,
      modalContent: (
        <ConfirmDialog
          title={action.confirmText || action.label}
          message={getConfirmMessage(action.confirmMessage, entity)}
          confirmText={action.confirmText || 'Confirm'}
          cancelText={action.cancelText || 'Cancel'}
          onConfirm={async () => {
            setState(prev => ({ ...prev, modalOpen: false, modalContent: undefined }));
            await action.onConfirm(entity, context);
          }}
          onCancel={() => {
            setState(prev => ({ ...prev, modalOpen: false, modalContent: undefined }));
            action.onCancel?.();
          }}
        />
      ),
    }));
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

  // Determine max visible actions based on mode and context
  const getMaxVisibleActions = () => {
    if (position === 'row') return 1; // In table rows, show only 1 actions + more
    if (position === 'toolbar') return 3; // In toolbar, show 3 actions + more
    return 2; // Default: show 2 actions + more
  };

  const maxVisible = getMaxVisibleActions();
  const visibleActions = enabledActions.slice(0, maxVisible);
  const overflowActions = enabledActions.slice(maxVisible);
  const hasOverflow = overflowActions.length > 0;

  // Get button variant classes
  const getButtonClasses = (variant?: string, isExecuting?: boolean) => {
    const baseClasses = 'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-background hover:bg-muted hover:text-foreground',
      ghost: 'hover:bg-muted hover:text-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    };

    const selectedVariant = variantClasses[variant as keyof typeof variantClasses] || variantClasses.ghost;
    return `${baseClasses} ${selectedVariant} ${isExecuting ? 'opacity-70' : ''}`;
  };

  // Render based on mode
  if (mode === 'dropdown') {
    return (
      <div className={`relative inline-block ${className}`}>
        <button 
          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground bg-background border border-input rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
          onClick={() => setState(prev => ({ ...prev, dropdownOpen: !prev.dropdownOpen }))}
        >
          Actions
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {state.dropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setState(prev => ({ ...prev, dropdownOpen: false }))}
            />
            <div className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-card border shadow-lg">
              <div className="py-1">
                {enabledActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => {
                      executeAction(action);
                      setState(prev => ({ ...prev, dropdownOpen: false }));
                    }}
                    disabled={state.loading && state.executing === action.id}
                    title={getActionTooltip(action, entity, context)}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      action.variant === 'destructive' ? 'text-destructive hover:bg-destructive/10' : ''
                    }`}
                  >
                    {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
                    <span className="flex-1 text-left">{action.label}</span>
                    {state.loading && state.executing === action.id && (
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        {state.modalOpen && state.modalContent}
      </div>
    );
  }

  // Default: buttons mode with overflow menu
  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {/* Visible actions */}
      {visibleActions.map(action => (
        action.actionType === 'custom' && (action as CustomAction<T>).component ? (
          <action.component key={action.id} entity={entity} context={context} />
        ) : (
          <button
            key={action.id}
            onClick={() => executeAction(action)}
            disabled={state.loading && state.executing === action.id}
            title={getActionTooltip(action, entity, context)}
            className={getButtonClasses(action.variant, state.loading && state.executing === action.id)}
          >
            {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
            {position !== 'row' && <span>{action.label}</span>}
            {state.loading && state.executing === action.id && (
              <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </button>
        )
      ))}

      {/* Overflow menu (three dots) */}
      {hasOverflow && (
        <div className="relative">
          <button
            className="inline-flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={() => setState(prev => ({ ...prev, overflowOpen: !prev.overflowOpen }))}
            title="More actions"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>

          {state.overflowOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setState(prev => ({ ...prev, overflowOpen: false }))}
              />
              <div className="absolute right-0 z-20 mt-1 w-48 origin-top-right rounded-md bg-card border shadow-lg">
                <div className="py-1">
                  {overflowActions.map(action => (
                    <button
                      key={action.id}
                      onClick={() => {
                        executeAction(action);
                        setState(prev => ({ ...prev, overflowOpen: false }));
                      }}
                      disabled={state.loading && state.executing === action.id}
                      title={getActionTooltip(action, entity, context)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        action.variant === 'destructive' ? 'text-destructive hover:bg-destructive/10' : ''
                      }`}
                    >
                      {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
                      <span className="flex-1 text-left">{action.label}</span>
                      {state.loading && state.executing === action.id && (
                        <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {state.modalOpen && state.modalContent}
    </div>
  );
}

/**
 * Confirmation Dialog Component
 */
function ConfirmDialog({
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    try {
      setConfirming(true);
      await onConfirm();
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-lg border shadow-lg max-w-md w-full mx-4 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button 
            onClick={onCancel} 
            disabled={confirming}
            className="px-4 py-2 text-sm font-medium border border-input rounded-md hover:bg-muted transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button 
            onClick={handleConfirm} 
            disabled={confirming}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {confirming && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {confirming ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Field type for form modals
 */
interface FormFieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'number' | 'select' | 'checkbox' | 'radio' | 'date';
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  helpText?: string;
  options?: Array<{ value: unknown; label: string }>;
}

/**
 * Form Modal Component
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
  fields: FormFieldDefinition[];
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-lg border shadow-lg max-w-lg w-full mx-4 p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(field => (
            <div key={field.name} className="space-y-1.5">
              <label htmlFor={field.name} className="text-sm font-medium text-foreground">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </label>
              <input
                id={field.name}
                type={field.type}
                value={String(values[field.name] || '')}
                onChange={(e) => setValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                placeholder={field.placeholder}
                disabled={field.disabled || submitting}
                className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors[field.name] && (
                <p className="text-xs text-destructive">{errors[field.name]}</p>
              )}
              {field.helpText && (
                <p className="text-xs text-muted-foreground">{field.helpText}</p>
              )}
            </div>
          ))}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={onCancel} 
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium border border-input rounded-md hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              {submitting && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {submitting ? 'Submitting...' : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EntityActions;
