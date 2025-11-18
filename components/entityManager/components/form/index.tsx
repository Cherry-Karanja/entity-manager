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
  const [state, setState] = useState<FormState<T>>(() => {
    const initialVals = getInitialValues(fields, entity, initialValues);
    return {
      values: initialVals,
      errors: {},
      touched: new Set<string>(),
      dirty: new Set<string>(),
      submitting: false,
      submitError: undefined,
      currentStep: 0,
      currentTab: tabs?.[0]?.id || sections?.[0]?.id,
      collapsedSections: new Set<string>(),
    };
  });

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
      <div className="space-y-4">
        {/* Ungrouped fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupedFields.get(null)?.map(field => {
            // Parse width to determine grid column span
            let colSpan = 'col-span-1';
            if (field.width) {
              const widthStr = String(field.width);
              if (widthStr.includes('%')) {
                const percent = parseInt(widthStr);
                if (percent >= 50) colSpan = 'md:col-span-2';
              }
            }
            return (
              <div key={String(field.name)} className={colSpan}>
                <FormFieldComponent field={field} />
              </div>
            );
          })}
        </div>

        {/* Sectioned fields */}
        {sortedSections.map(section => {
          const sectionFields = groupedFields.get(section.id) || [];
          if (sectionFields.length === 0) return null;

          const isCollapsed = state.collapsedSections.has(section.id);

          return (
            <div key={section.id} className="border rounded-lg overflow-hidden">
              <div 
                className={`flex items-center justify-between px-4 py-3 bg-muted/50 border-b ${section.collapsible ? 'cursor-pointer hover:bg-muted transition-colors' : ''}`}
                onClick={() => section.collapsible && toggleSection(section.id)}
                tabIndex={section.collapsible ? 0 : undefined}
              >
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{section.label}</h3>
                  {section.description && <p className="text-xs text-muted-foreground mt-0.5">{section.description}</p>}
                </div>
                {section.collapsible && (
                  <span className="text-muted-foreground ml-2 transition-transform" style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
                    ▼
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sectionFields.map(field => {
                      // Parse width to determine grid column span
                      let colSpan = 'col-span-1';
                      if (field.width) {
                        const widthStr = String(field.width);
                        if (widthStr.includes('%')) {
                          const percent = parseInt(widthStr);
                          if (percent >= 50) colSpan = 'md:col-span-2';
                        }
                      }
                      return (
                        <div key={String(field.name)} className={colSpan}>
                          <FormFieldComponent field={field} />
                        </div>
                      );
                    })}
                  </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visibleFields.map(field => {
          // Parse width to determine grid column span
          let colSpan = 'col-span-1';
          if (field.width) {
            const widthStr = String(field.width);
            if (widthStr.includes('%')) {
              const percent = parseInt(widthStr);
              if (percent >= 75) colSpan = 'sm:col-span-2 lg:col-span-3 xl:col-span-4';
              else if (percent >= 50) colSpan = 'sm:col-span-2';
              else if (percent >= 25) colSpan = 'sm:col-span-1';
            }
          }
          return (
            <div key={String(field.name)} className={colSpan}>
              <FormFieldComponent field={field} />
            </div>
          );
        })}
      </div>
    );
  };

  /**
   * Grid Layout
   */
  const GridLayout = () => {
    const visibleFields = sortFields(fields.filter(f => isFieldVisible(f, state.values)));

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleFields.map(field => {
          // Parse width to determine grid column span
          let colSpan = 'col-span-1';
          if (field.width) {
            const widthStr = String(field.width);
            if (widthStr.includes('%')) {
              const percent = parseInt(widthStr);
              if (percent >= 75) colSpan = 'md:col-span-2 lg:col-span-4';
              else if (percent >= 50) colSpan = 'md:col-span-2';
              else if (percent >= 25) colSpan = 'md:col-span-1';
            } else {
              const numWidth = parseInt(widthStr);
              colSpan = `md:col-span-${Math.min(numWidth, 2)} lg:col-span-${Math.min(numWidth, 4)}`;
            }
          }
          
          return (
            <div key={String(field.name)} className={colSpan}>
              <FormFieldComponent field={field} />
            </div>
          );
        })}
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
      <div className="space-y-4">
        <div className="border-b border-border overflow-x-auto" role="tablist">
          <div className="flex space-x-1 min-w-max px-1">
            {sortedTabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all whitespace-nowrap border-b-2 ${
                  state.currentTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
                }`}
                onClick={() => setState(prev => ({ ...prev, currentTab: tab.id }))}
                role="tab"
                aria-selected={state.currentTab === tab.id}
              >
                {tab.icon && <span className="text-base">{tab.icon}</span>}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="min-h-[300px]">
          {sortedTabs.map(tab => {
            if (tab.id !== state.currentTab) return null;
            
            const tabFields = groupedFields.get(tab.id) || [];
            return (
              <div key={tab.id} role="tabpanel">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tabFields.map(field => {
                    // Parse width to determine grid column span
                    let colSpan = 'col-span-1';
                    if (field.width) {
                      const widthStr = String(field.width);
                      if (widthStr.includes('%')) {
                        const percent = parseInt(widthStr);
                        if (percent >= 50) colSpan = 'md:col-span-2';
                      }
                    }
                    return (
                      <div key={String(field.name)} className={colSpan}>
                        <FormFieldComponent field={field} />
                      </div>
                    );
                  })}
                </div>
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
    const visibleFields = fields.filter(f => isFieldVisible(f, state.values));
    const groupedFields = groupFieldsBySections(visibleFields, sections);
    
    // If there are ungrouped fields, add them to the first section
    const ungroupedFields = groupedFields.get(null) || [];
    if (ungroupedFields.length > 0 && sortedSections.length > 0) {
      const firstSectionId = sortedSections[0].id;
      const firstSectionFields = groupedFields.get(firstSectionId) || [];
      groupedFields.set(firstSectionId, [...firstSectionFields, ...ungroupedFields]);
      groupedFields.delete(null);
    }
    
    const currentSection = state.currentTab || sortedSections[0]?.id;

    return (
      <div className="space-y-4">
        <div className="border-b border-border overflow-x-auto" role="tablist">
          <div className="flex space-x-1 min-w-max px-1">
            {sortedSections.map(section => (
              <button
                key={section.id}
                type="button"
                className={`px-4 py-2.5 font-medium text-sm transition-all whitespace-nowrap border-b-2 ${
                  currentSection === section.id 
                    ? 'border-primary text-primary bg-primary/5' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
                }`}
                onClick={() => setState(prev => ({ ...prev, currentTab: section.id }))}
                role="tab"
                aria-selected={currentSection === section.id}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
        <div className="min-h-[300px]">
          {sortedSections.map(section => {
            if (section.id !== currentSection) return null;
            
            const sectionFields = groupedFields.get(section.id) || [];
            return (
              <div key={section.id} className="space-y-4" role="tabpanel">
                {section.description && (
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sectionFields.map(field => {
                    // Parse width to determine grid column span
                    let colSpan = 'col-span-1';
                    if (field.width) {
                      const widthStr = String(field.width);
                      if (widthStr.includes('%')) {
                        const percent = parseInt(widthStr);
                        if (percent >= 50) colSpan = 'md:col-span-2';
                      }
                    }
                    return (
                      <div key={String(field.name)} className={colSpan}>
                        <FormFieldComponent field={field} />
                      </div>
                    );
                  })}
                </div>
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
      <div className="space-y-6">
        {/* Step indicator */}
        <div className="relative">
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {sortedSteps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <div className={`flex flex-col items-center flex-1 ${index > 0 ? 'ml-2' : ''}`}>
                  <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${
                    index === currentStepIndex 
                      ? 'border-primary bg-primary text-primary-foreground' 
                      : index < currentStepIndex
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-muted-foreground/30 bg-background text-muted-foreground'
                  }`}>
                    <span className="text-sm font-semibold">{index + 1}</span>
                  </div>
                  <span className={`mt-2 text-xs sm:text-sm font-medium text-center line-clamp-2 ${
                    index === currentStepIndex ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < sortedSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 sm:mx-2 ${
                    index < currentStepIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="min-h-[300px]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">{currentStepData.label}</h3>
            {currentStepData.description && (
              <p className="text-sm text-muted-foreground mt-1">{currentStepData.description}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stepFields.map(field => {
              // Parse width to determine grid column span
              let colSpan = 'col-span-1';
              if (field.width) {
                const widthStr = String(field.width);
                if (widthStr.includes('%')) {
                  const percent = parseInt(widthStr);
                  if (percent >= 50) colSpan = 'md:col-span-2';
                }
              }
              return (
                <div key={String(field.name)} className={colSpan}>
                  <FormFieldComponent field={field} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <button 
            type="button" 
            onClick={goToPreviousStep}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-input rounded-md hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {currentStepIndex < sortedSteps.length - 1 ? (
            <button 
              type="button" 
              onClick={goToNextStep}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
            >
              Next
            </button>
          ) : (
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
            >
              {submitText}
            </button>
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

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 border-t">
        {showCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            disabled={state.submitting}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-input rounded-md hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cancelText}
          </button>
        )}
        
        {showReset && (
          <button 
            type="button" 
            onClick={handleReset} 
            disabled={state.submitting}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-input rounded-md hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reset
          </button>
        )}
        
        <button 
          type="submit" 
          disabled={isSubmitDisabled}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
    <div className="space-y-1.5">
      <label 
        htmlFor={String(field.name)}
        className="block text-sm font-medium text-foreground"
      >
        {field.label}
        {field.required && <span className="text-destructive ml-1" aria-label="required" title="Required field">*</span>}
      </label>
      {renderInput()}
      {field.helpText && !showError && (
        <p className="text-xs text-muted-foreground">{field.helpText}</p>
      )}
      {showError && (
        <p className="text-xs text-destructive flex items-center gap-1" id={errorId} role="alert">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

export default EntityForm;
