/**
 * EntityForm Component
 * 
 * Standalone component for creating/editing entities with comprehensive form features.
 * Works independently without orchestrator or context.
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { BaseEntity } from '../../primitives/types';
import {
  EntityFormProps,
  FormState,
  FormMode,
  FormField,
  FieldRenderProps,
} from './types';
import {
  getInitialValues,
  validateField,
  validateForm,
  isFieldVisible,
  isFieldDisabled,
  sortFields,
  groupFieldsBySections,
  groupFieldsByTabs,
  groupFieldsBySteps,
  sortSections,
  sortTabs,
  sortSteps,
  transformValues,
  hasErrors,
  getFieldOptions,
  formatFieldValue,
} from './utils';

/**
 * EntityForm Component
 * 
 * @example
 * ```tsx
 * const fields: FormField<User>[] = [
 *   { name: 'name', label: 'Name', type: 'text', required: true },
 *   { name: 'email', label: 'Email', type: 'email', required: true },
 *   { name: 'role', label: 'Role', type: 'select', options: roleOptions },
 * ];
 * 
 * <EntityForm
 *   fields={fields}
 *   mode="create"
 *   onSubmit={async (values) => {
 *     await createUser(values);
 *   }}
 * />
 * ```
 */
export function EntityForm<T extends BaseEntity = BaseEntity>({
  fields,
  mode = 'create',
  layout = 'vertical',
  initialValues,
  entity,
  sections,
  tabs,
  steps,
  onSubmit,
  onCancel,
  onChange,
  onValidate,
  submitText = mode === 'create' ? 'Create' : 'Save',
  cancelText = 'Cancel',
  showCancel = true,
  showReset = false,
  resetOnSubmit = false,
  loading = false,
  disabled = false,
  className = '',
  validateOnChange = false,
  validateOnBlur = true,
}: EntityFormProps<T>): React.ReactElement {
  console.log('EntityForm render:', { fieldsCount: fields?.length, mode, layout, sectionsCount: sections?.length });
  const [state, setState] = useState<FormState<T>>(() => ({
    values: getInitialValues(fields, entity, initialValues),
    errors: {},
    touched: new Set<string>(),
    dirty: new Set<string>(),
    submitting: false,
    submitError: undefined,
    currentStep: 0,
    currentTab: tabs?.[0]?.id,
    collapsedSections: new Set<string>(),
  }));

  /**
   * Set field value
   */
  const setFieldValue = useCallback((fieldName: string, value: unknown) => {
    setState(prev => {
      const newValues = { ...prev.values, [fieldName]: value };
      const newDirty = new Set(prev.dirty);
      newDirty.add(fieldName);

      onChange?.(newValues);

      // Validate on change if enabled
      if (validateOnChange) {
        const field = fields.find(f => String(f.name) === fieldName);
        if (field) {
          validateField(value, field, newValues as Record<string, unknown>).then(error => {
            setState(s => ({
              ...s,
              errors: error 
                ? { ...s.errors, [fieldName]: error }
                : Object.fromEntries(Object.entries(s.errors).filter(([k]) => k !== fieldName)),
            }));
          });
        }
      }

      return {
        ...prev,
        values: newValues,
        dirty: newDirty,
      };
    });
  }, [onChange, validateOnChange, fields]);

  /**
   * Set field touched
   */
  const setFieldTouched = useCallback((fieldName: string) => {
    setState(prev => {
      const newTouched = new Set(prev.touched);
      newTouched.add(fieldName);

      // Validate on blur if enabled
      if (validateOnBlur) {
        const field = fields.find(f => String(f.name) === fieldName);
        if (field) {
          const value = prev.values[field.name as keyof T];
          validateField(value, field, prev.values as Record<string, unknown>).then(error => {
            setState(s => ({
              ...s,
              errors: error 
                ? { ...s.errors, [fieldName]: error }
                : Object.fromEntries(Object.entries(s.errors).filter(([k]) => k !== fieldName)),
            }));
          });
        }
      }

      return { ...prev, touched: newTouched };
    });
  }, [validateOnBlur, fields]);

  /**
   * Validate entire form
   */
  const validateFormAsync = useCallback(async (): Promise<boolean> => {
    const visibleFields = fields.filter(f => isFieldVisible(f, state.values));
    let errors = await validateForm(state.values, visibleFields);

    // Run custom validation
    if (onValidate) {
      const customErrors = await onValidate(state.values);
      errors = { ...errors, ...customErrors };
    }

    setState(prev => ({ ...prev, errors }));
    return !hasErrors(errors);
  }, [fields, state.values, onValidate]);

  /**
   * Handle form submit
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = new Set(fields.map(f => String(f.name)));
    setState(prev => ({ ...prev, touched: allTouched, submitError: undefined }));

    // Validate form
    const isValid = await validateFormAsync();
    if (!isValid) return;

    try {
      setState(prev => ({ ...prev, submitting: true }));
      
      // Transform values
      const transformedValues = transformValues(state.values, fields);
      
      await onSubmit(transformedValues);
      
      // Reset form if resetOnSubmit is true
      if (resetOnSubmit) {
        const resetValues = getInitialValues(fields, undefined, initialValues);
        setState(prev => ({
          ...prev,
          values: resetValues,
          errors: {},
          touched: new Set(),
          dirty: new Set(),
          submitting: false,
          submitError: undefined,
        }));
      } else {
        setState(prev => ({ ...prev, submitting: false }));
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setState(prev => ({ 
        ...prev, 
        submitting: false,
        submitError: error instanceof Error ? error.message : 'An error occurred during submission'
      }));
    }
  }, [fields, state.values, validateFormAsync, onSubmit, resetOnSubmit, initialValues]);

  /**
   * Handle reset
   */
  const handleReset = useCallback(() => {
    const resetValues = getInitialValues(fields, entity, initialValues);
    setState(prev => ({
      ...prev,
      values: resetValues,
      errors: {},
      touched: new Set(),
      dirty: new Set(),
    }));
  }, [fields, entity, initialValues]);

  /**
   * Toggle section collapse
   */
  const toggleSection = useCallback((sectionId: string) => {
    setState(prev => {
      const collapsed = new Set(prev.collapsedSections);
      if (collapsed.has(sectionId)) {
        collapsed.delete(sectionId);
      } else {
        collapsed.add(sectionId);
      }
      return { ...prev, collapsedSections: collapsed };
    });
  }, []);

  // Render based on layout
  const renderLayout = () => {
    switch (layout) {
      case 'tabs':
        // Use tabs if provided, otherwise convert sections to tabs
        return tabs ? <TabsLayout /> : sections ? <SectionsAsTabsLayout /> : <VerticalLayout />;
      
      case 'wizard':
        return steps ? <WizardLayout /> : <VerticalLayout />;
      
      case 'grid':
        return <GridLayout />;
      
      case 'horizontal':
        return <HorizontalLayout />;
      
      case 'vertical':
      default:
        return <VerticalLayout />;
    }
  };

  /**
   * Vertical Layout
   */
  const VerticalLayout = () => {
    const visibleFields = sortFields(fields.filter(f => isFieldVisible(f, state.values)));
    const groupedFields = groupFieldsBySections(visibleFields, sections);
    const sortedSections = sections ? sortSections(sections) : [];

    return (
      <div className="form-layout-vertical">
        {/* Ungrouped fields */}
        {groupedFields.get(null)?.map(field => (
          <FormFieldComponent key={String(field.name)} field={field} />
        ))}

        {/* Sectioned fields */}
        {sortedSections.map(section => {
          const sectionFields = groupedFields.get(section.id) || [];
          if (sectionFields.length === 0) return null;

          const isCollapsed = state.collapsedSections.has(section.id);

          return (
            <div key={section.id} className="form-section">
              <div 
                className="section-header"
                onClick={() => section.collapsible && toggleSection(section.id)}
              >
                <h3>{section.label}</h3>
                {section.description && <p>{section.description}</p>}
                {section.collapsible && <span>{isCollapsed ? '▶' : '▼'}</span>}
              </div>
              {!isCollapsed && (
                <div className="section-fields">
                  {sectionFields.map(field => (
                    <FormFieldComponent key={String(field.name)} field={field} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  /**
   * Horizontal Layout
   */
  const HorizontalLayout = () => {
    const visibleFields = sortFields(fields.filter(f => isFieldVisible(f, state.values)));

    return (
      <div className="form-layout-horizontal">
        {visibleFields.map(field => (
          <FormFieldComponent key={String(field.name)} field={field} />
        ))}
      </div>
    );
  };

  /**
   * Grid Layout
   */
  const GridLayout = () => {
    const visibleFields = sortFields(fields.filter(f => isFieldVisible(f, state.values)));

    return (
      <div className="form-layout-grid">
        {visibleFields.map(field => (
          <div 
            key={String(field.name)} 
            style={{ gridColumn: `span ${field.width || 1}` }}
          >
            <FormFieldComponent field={field} />
          </div>
        ))}
      </div>
    );
  };

  /**
   * Tabs Layout
   */
  const TabsLayout = () => {
    if (!tabs) return null;

    const sortedTabs = sortTabs(tabs);
    const groupedFields = groupFieldsByTabs(fields, sortedTabs);

    return (
      <div className="form-layout-tabs">
        <div className="tab-headers">
          {sortedTabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`tab-header ${state.currentTab === tab.id ? 'active' : ''}`}
              onClick={() => setState(prev => ({ ...prev, currentTab: tab.id }))}
            >
              {tab.icon && <span className="tab-icon">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {sortedTabs.map(tab => {
            if (tab.id !== state.currentTab) return null;
            
            const tabFields = groupedFields.get(tab.id) || [];
            return (
              <div key={tab.id}>
                {tabFields.map(field => (
                  <FormFieldComponent key={String(field.name)} field={field} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * Sections as Tabs Layout
   * Uses sections prop to render as tabs
   */
  const SectionsAsTabsLayout = () => {
    if (!sections) return null;

    const sortedSections = sortSections(sections);
    const groupedFields = groupFieldsBySections(fields.filter(f => isFieldVisible(f, state.values)), sections);
    const currentSection = state.currentTab || sortedSections[0]?.id;

    return (
      <div className="form-layout-tabs space-y-4">
        <div className="border-b border-border">
          <div className="flex space-x-2">
            {sortedSections.map(section => (
              <button
                key={section.id}
                type="button"
                className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                  currentSection === section.id 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setState(prev => ({ ...prev, currentTab: section.id }))}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
        <div className="tab-content p-4">
          {sortedSections.map(section => {
            if (section.id !== currentSection) return null;
            
            const sectionFields = groupedFields.get(section.id) || [];
            return (
              <div key={section.id} className="space-y-4">
                {section.description && (
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                )}
                {sectionFields.map(field => (
                  <FormFieldComponent key={String(field.name)} field={field} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * Wizard Layout
   */
  const WizardLayout = () => {
    if (!steps) return null;

    const sortedSteps = sortSteps(steps);
    const groupedFields = groupFieldsBySteps(fields, sortedSteps);
    const currentStepIndex = state.currentStep || 0;
    const currentStepData = sortedSteps[currentStepIndex];
    const stepFields = groupedFields.get(currentStepData.id) || [];

    const goToNextStep = async () => {
      if (currentStepData.validate) {
        const errors = await currentStepData.validate(state.values as Record<string, unknown>);
        if (hasErrors(errors)) {
          setState(prev => ({ ...prev, errors: { ...prev.errors, ...errors } }));
          return;
        }
      }

      if (currentStepIndex < sortedSteps.length - 1) {
        setState(prev => ({ ...prev, currentStep: currentStepIndex + 1 }));
      }
    };

    const goToPreviousStep = () => {
      if (currentStepIndex > 0) {
        setState(prev => ({ ...prev, currentStep: currentStepIndex - 1 }));
      }
    };

    return (
      <div className="form-layout-wizard">
        <div className="wizard-steps">
          {sortedSteps.map((step, index) => (
            <div key={step.id} className={`wizard-step ${index === currentStepIndex ? 'active' : ''}`}>
              <div className="step-number">{index + 1}</div>
              <div className="step-label">{step.label}</div>
            </div>
          ))}
        </div>
        <div className="wizard-content">
          <h3>{currentStepData.label}</h3>
          {currentStepData.description && <p>{currentStepData.description}</p>}
          <div className="wizard-fields">
            {stepFields.map(field => (
              <FormFieldComponent key={String(field.name)} field={field} />
            ))}
          </div>
        </div>
        <div className="wizard-actions">
          {currentStepIndex > 0 && (
            <button type="button" onClick={goToPreviousStep}>Previous</button>
          )}
          {currentStepIndex < sortedSteps.length - 1 ? (
            <button type="button" onClick={goToNextStep}>Next</button>
          ) : (
            <button type="submit">{submitText}</button>
          )}
        </div>
      </div>
    );
  };

  /**
   * Form Field Component
   */
  const FormFieldComponent = ({ field }: { field: FormField<T> }) => {
    const fieldName = String(field.name);
    const value = state.values[field.name as keyof T];
    const error = state.errors[fieldName];
    const touched = state.touched.has(fieldName);
    const fieldDisabled = disabled || loading || state.submitting || isFieldDisabled(field, state.values);

    const fieldProps: FieldRenderProps<T> = {
      field,
      value,
      error,
      touched,
      onChange: (newValue) => setFieldValue(fieldName, newValue),
      onBlur: () => setFieldTouched(fieldName),
      disabled: fieldDisabled,
      mode,
      validateOnChange,
    };

    // Custom renderer
    if (field.render) {
      return <>{field.render(fieldProps)}</>;
    }

    // View mode
    if (mode === 'view') {
      return (
        <div className="form-field view-mode">
          <label>{field.label}</label>
          <div className="field-value">{formatFieldValue(value, field)}</div>
        </div>
      );
    }

    return <DefaultFieldRenderer {...fieldProps} />;
  };

  /**
   * Render
   */
  const isSubmitDisabled = disabled || loading || state.submitting;

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`} noValidate>
      {state.submitError && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md" role="alert">
          <p className="text-sm font-medium">{state.submitError}</p>
        </div>
      )}
      {renderLayout()}

      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        {showCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            disabled={state.submitting}
            className="px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-input rounded-md hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cancelText}
          </button>
        )}
        
        {showReset && (
          <button 
            type="button" 
            onClick={handleReset} 
            disabled={state.submitting}
            className="px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-input rounded-md hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reset
          </button>
        )}
        
        <button 
          type="submit" 
          disabled={isSubmitDisabled}
          className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {state.submitting && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
          {state.submitting ? 'Submitting...' : submitText}
        </button>
      </div>
    </form>
  );
}

/**
 * Default Field Renderer
 */
function DefaultFieldRenderer<T extends BaseEntity>({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
  disabled,
  validateOnChange,
}: FieldRenderProps<T>) {
  const [options, setOptions] = useState<Array<{ label: string; value: string | number | boolean; disabled?: boolean }>>([]);

  useEffect(() => {
    if (field.type === 'select' || field.type === 'multiselect' || field.type === 'radio') {
      getFieldOptions(field, {} as Partial<T>).then(setOptions);
    }
  }, [field]);

  // Show errors immediately if validateOnChange is true, otherwise wait for touch
  const showError = validateOnChange ? !!error : (touched && !!error);
  const errorId = `${String(field.name)}-error`;

  const commonProps = {
    id: String(field.name),
    disabled,
    onBlur,
    required: field.required,
    'aria-invalid': showError ? ('true' as const) : undefined,
    'aria-describedby': showError ? errorId : undefined,
  };

  const renderInput = () => {
    const inputClasses = "w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed";
    const errorClasses = showError ? "border-destructive focus:ring-destructive" : "";
    
    // Format date values for input fields
    const getDateValue = (val: unknown): string => {
      if (!val) return '';
      if (typeof val === 'string') {
        try {
          // Convert ISO string to YYYY-MM-DD format for date input
          const date = new Date(val);
          return date.toISOString().slice(0, 10);
        } catch {
          return String(val);
        }
      }
      if (val instanceof Date) {
        return val.toISOString().slice(0, 10);
      }
      return String(val);
    };

    const getDateTimeValue = (val: unknown): string => {
      if (!val) return '';
      if (typeof val === 'string') {
        try {
          // Convert ISO string to datetime-local format
          const date = new Date(val);
          return date.toISOString().slice(0, 16);
        } catch {
          return String(val);
        }
      }
      if (val instanceof Date) {
        return val.toISOString().slice(0, 16);
      }
      return String(val);
    };
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            className={`${inputClasses} ${errorClasses}`}
            {...commonProps}
          />
        );

      case 'select':
        return (
          <select 
            value={String(value || '')} 
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClasses} ${errorClasses}`}
            {...commonProps}
          >
            <option value="">Select...</option>
            {options.map(opt => (
              <option key={String(opt.value)} value={String(opt.value)} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
      case 'switch':
        return (
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            {...commonProps}
          />
        );

      case 'file':
      case 'image':
        return (
          <input
            type="file"
            onChange={(e) => onChange(e.target.files?.[0])}
            accept={field.accept}
            multiple={field.multiple}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            {...commonProps}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={getDateValue(value)}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`${inputClasses} ${errorClasses}`}
            {...commonProps}
          />
        );

      case 'datetime':
        return (
          <input
            type="datetime-local"
            value={getDateTimeValue(value)}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`${inputClasses} ${errorClasses}`}
            {...commonProps}
          />
        );

      case 'time':
        return (
          <input
            type="time"
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`${inputClasses} ${errorClasses}`}
            {...commonProps}
          />
        );

      default:
        return (
          <input
            type={field.type}
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            className={`${inputClasses} ${errorClasses}`}
            {...commonProps}
          />
        );
    }
  };

  return (
    <div className={`space-y-1.5 ${showError ? '' : ''}`}>
      <label 
        htmlFor={String(field.name)}
        className="block text-sm font-medium text-foreground"
      >
        {field.label}
        {field.required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
      </label>
      {renderInput()}
      {field.helpText && (
        <p className="text-xs text-muted-foreground">{field.helpText}</p>
      )}
      {showError && (
        <p className="text-xs text-destructive" id={errorId}>{error}</p>
      )}
    </div>
  );
}

export default EntityForm;
