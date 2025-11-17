/**
 * EntityView Component
 * 
 * Standalone component for displaying entity details in multiple view modes.
 * Works independently without orchestrator or context.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { BaseEntity } from '../../primitives/types';
import {
  EntityViewProps,
  ViewState,
  ViewMode,
  FieldRenderProps,
} from './types';
import {
  getVisibleFields,
  renderField,
  groupFields,
  sortFields,
  sortGroups,
  getSummaryFields,
  copyToClipboard,
  getEntityTitle,
  getEntitySubtitle,
  getEntityImage,
  getMetadataFields,
  getFieldValue,
} from './utils';

/**
 * EntityView Component
 * 
 * @example
 * ```tsx
 * const fields: ViewField<User>[] = [
 *   { key: 'id', label: 'ID', type: 'text' },
 *   { key: 'name', label: 'Name', type: 'text', showInSummary: true },
 *   { key: 'email', label: 'Email', type: 'email', copyable: true },
 *   { key: 'createdAt', label: 'Created', type: 'date' },
 * ];
 * 
 * <EntityView entity={user} fields={fields} mode="detail" />
 * ```
 */
export function EntityView<T extends BaseEntity = BaseEntity>({
  entity,
  fields,
  groups,
  mode = 'detail',
  showMetadata = true,
  tabs,
  titleField,
  subtitleField,
  imageField,
  loading = false,
  error,
  className = '',
  onCopy,
  actions,
}: EntityViewProps<T>): React.ReactElement {
  const [state, setState] = useState<ViewState>({
    activeTab: tabs?.[0]?.id,
    collapsedGroups: new Set<string>(),
  });

  /**
   * Toggle group collapse
   */
  const toggleGroup = useCallback((groupId: string) => {
    setState(prev => {
      const collapsed = new Set(prev.collapsedGroups);
      if (collapsed.has(groupId)) {
        collapsed.delete(groupId);
      } else {
        collapsed.add(groupId);
      }
      return { ...prev, collapsedGroups: collapsed };
    });
  }, []);

  /**
   * Handle copy to clipboard
   */
  const handleCopy = useCallback(async (field: keyof T | string, value: unknown) => {
    const text = String(value);
    const success = await copyToClipboard(text);
    
    if (success) {
      setState(prev => ({ ...prev, copiedField: String(field) }));
      setTimeout(() => {
        setState(prev => ({ ...prev, copiedField: undefined }));
      }, 2000);
      
      onCopy?.(field, value);
    }
  }, [onCopy]);

  // Loading state
  if (loading) {
    return (
      <div className={`entity-view loading ${className}`}>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    return (
      <div className={`entity-view error ${className}`}>
        <div className="error-message">Error: {errorMessage}</div>
      </div>
    );
  }

  // Get visible fields
  const visibleFields = sortFields(getVisibleFields(fields, entity));

  // Render based on mode
  switch (mode) {
    case 'card':
      return <CardView entity={entity} fields={visibleFields} {...{ titleField, subtitleField, imageField, actions, className }} />;
    
    case 'summary':
      return <SummaryView entity={entity} fields={getSummaryFields(visibleFields)} {...{ className }} />;
    
    case 'timeline':
      return <TimelineView entity={entity} fields={visibleFields} {...{ showMetadata, className }} />;
    
    case 'detail':
    default:
      return (
        <DetailView
          entity={entity}
          fields={visibleFields}
          groups={groups}
          state={state}
          tabs={tabs}
          showMetadata={showMetadata}
          titleField={titleField}
          actions={actions}
          className={className}
          onToggleGroup={toggleGroup}
          onCopy={handleCopy}
          onTabChange={(tabId: string) => setState(prev => ({ ...prev, activeTab: tabId }))}
          copiedField={state.copiedField}
        />
      );
  }
}

/**
 * Detail View (default mode)
 */
function DetailView<T extends BaseEntity>({
  entity,
  fields,
  groups,
  state,
  tabs,
  showMetadata,
  titleField,
  actions,
  className,
  onToggleGroup,
  onCopy,
  onTabChange,
  copiedField,
}: any) {
  const title = getEntityTitle(entity, titleField);
  const groupedFields = groupFields(fields, groups);
  const sortedGroups = groups ? sortGroups(groups) : [];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>

      {/* Main content */}
      <div className="space-y-6">
        {/* Ungrouped fields */}
        {groupedFields.get(null) && (
          <div className="space-y-3">
            {groupedFields.get(null)!.map(field => (
              <FieldRow key={String(field.key)} field={field} value={getFieldValue(entity, field.key)} entity={entity} onCopy={onCopy} copiedField={copiedField} />
            ))}
          </div>
        )}

        {/* Grouped fields */}
        {sortedGroups.map((group: any) => {
          const groupFields = groupedFields.get(group.id);
          if (!groupFields || groupFields.length === 0) return null;

          const isCollapsed = state.collapsedGroups.has(group.id);

          return (
            <div key={group.id} className="border rounded-lg overflow-hidden">
              <div 
                className={`flex items-center justify-between px-4 py-3 bg-muted/50 ${
                  group.collapsible ? 'cursor-pointer hover:bg-muted' : ''
                }`}
                onClick={() => group.collapsible && onToggleGroup(group.id)}
              >
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{group.label}</h3>
                  {group.description && <p className="text-xs text-muted-foreground mt-1">{group.description}</p>}
                </div>
                {group.collapsible && (
                  <svg
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      isCollapsed ? 'rotate-0' : 'rotate-180'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
              {!isCollapsed && (
                <div className="p-4 space-y-3 bg-card">
                  {groupFields.map(field => (
                    <FieldRow key={String(field.key)} field={field} value={getFieldValue(entity, field.key)} entity={entity} onCopy={onCopy} copiedField={copiedField} />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Metadata */}
        {showMetadata && (
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-muted/50">
              <h3 className="text-sm font-semibold text-foreground">Metadata</h3>
            </div>
            <div className="p-4 space-y-3 bg-card">
              {getMetadataFields(entity).map(({ label, value }) => (
                <div key={label} className="flex items-start">
                  <div className="w-1/3 text-sm font-medium text-muted-foreground">{label}</div>
                  <div className="w-2/3 text-sm text-foreground">{String(value)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="border-b bg-muted/50">
            <div className="flex">
              {tabs.map((tab: any) => (
                <button
                  key={tab.id}
                  className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    state.activeTab === tab.id
                      ? 'border-primary text-primary bg-background'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  onClick={() => onTabChange(tab.id)}
                >
                  {tab.icon && <span className="mr-2">{tab.icon}</span>}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                      {typeof tab.badge === 'function' ? tab.badge(entity) : tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 bg-card">
            {tabs.map((tab: any) => {
              if (tab.id !== state.activeTab) return null;
              
              const TabContent = tab.content as any;
              return (
                <div key={tab.id}>
                  {typeof TabContent === 'function' ? <TabContent entity={entity} /> : TabContent}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Field Row Component
 */
function FieldRow<T extends BaseEntity>({ field, entity, onCopy, copiedField }: FieldRenderProps<T> & { copiedField?: string }) {
  const value = getFieldValue(entity, field.key);
  const renderedValue = renderField(field, entity);

  return (
    <div className="flex items-start py-2">
      <div className="w-1/3 pr-4">
        <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
          {field.label}
          {field.helpText && (
            <span className="inline-flex items-center justify-center w-4 h-4 text-xs rounded-full bg-muted text-muted-foreground cursor-help" title={field.helpText}>
              ?
            </span>
          )}
        </div>
      </div>
      <div className="w-2/3 flex items-start gap-2">
        <div className="flex-1 text-sm text-foreground break-words">
          {renderedValue}
        </div>
        {field.copyable && (
          <button
            className={`flex-shrink-0 p-1.5 text-xs rounded-md transition-colors ${
              copiedField === String(field.key)
                ? 'bg-primary/10 text-primary'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => onCopy?.(field.key, value)}
            title="Copy to clipboard"
          >
            {copiedField === String(field.key) ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Card View
 */
function CardView<T extends BaseEntity>({ entity, fields, titleField, subtitleField, imageField, actions, className }: any) {
  const title = getEntityTitle(entity, titleField);
  const subtitle = getEntitySubtitle(entity, subtitleField);
  const image = getEntityImage(entity, imageField);

  return (
    <div className={`bg-card rounded-lg border shadow-sm overflow-hidden ${className}`}>
      {image && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className="space-y-2">
          {fields.slice(0, 5).map((field: any) => (
            <div key={String(field.key)} className="flex items-start">
              <span className="text-sm font-medium text-muted-foreground w-1/3">{field.label}:</span>
              <span className="text-sm text-foreground w-2/3">{renderField(field, entity)}</span>
            </div>
          ))}
        </div>
        {actions && <div className="flex items-center gap-2 pt-4 border-t">{actions}</div>}
      </div>
    </div>
  );
}

/**
 * Summary View
 */
function SummaryView<T extends BaseEntity>({ entity, fields, className }: any) {
  return (
    <div className={`bg-card rounded-lg border shadow-sm p-4 space-y-2 ${className}`}>
      {fields.map((field: any) => (
        <div key={String(field.key)} className="flex items-start py-1">
          <span className="text-sm font-medium text-muted-foreground w-1/3">{field.label}:</span>
          <span className="text-sm text-foreground w-2/3">{renderField(field, entity)}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Timeline View
 */
function TimelineView<T extends BaseEntity>({ entity, fields, showMetadata, className }: any) {
  const events = [...fields];
  if (showMetadata) {
    getMetadataFields(entity).forEach(({ label, value }) => {
      events.push({ key: label, label, type: 'date', value });
    });
  }

  return (
    <div className={`relative space-y-6 ${className}`}>
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
      {events.map((field: any, index: number) => (
        <div key={String(field.key)} className="relative pl-12">
          <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full bg-primary border-2 border-background shadow-sm"></div>
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <div className="text-sm font-medium text-foreground">{field.label}</div>
            <div className="text-sm text-muted-foreground mt-1">{renderField(field, entity)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EntityView;
