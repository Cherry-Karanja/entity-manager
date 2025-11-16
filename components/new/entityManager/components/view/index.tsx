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
  FieldRenderProps,
  ViewTab,
  ViewField,
  FieldGroup,
} from './types';

/**
 * Internal props for view functions
 */
interface DetailViewProps<T extends BaseEntity> {
  entity: T;
  fields: ViewField<T>[];
  groups?: FieldGroup[];
  state: ViewState;
  tabs?: ViewTab<T>[];
  showMetadata?: boolean;
  titleField?: keyof T | string;
  actions?: React.ReactNode;
  className?: string;
  onToggleGroup?: (groupId: string) => void;
  onCopy?: (field: keyof T | string, value: unknown) => void;
  onTabChange?: (tabId: string) => void;
  copiedField?: string;
}

interface CardViewProps<T extends BaseEntity> {
  entity: T;
  fields: ViewField<T>[];
  titleField?: keyof T | string;
  subtitleField?: keyof T | string;
  imageField?: keyof T | string;
  actions?: React.ReactNode;
  className?: string;
}

interface SummaryViewProps<T extends BaseEntity> {
  entity: T;
  fields: ViewField<T>[];
  className?: string;
}

interface TimelineViewProps<T extends BaseEntity> {
  entity: T;
  fields: ViewField<T>[];
  showMetadata?: boolean;
  className?: string;
}
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
function DetailView<T extends BaseEntity>(props: DetailViewProps<T>) {
  const {
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
  } = props;
  const title = getEntityTitle(entity, titleField);
  const groupedFields = groupFields(fields, groups);
  const sortedGroups = groups ? sortGroups(groups) : [];

  return (
    <div className={`entity-view detail ${className}`}>
      {/* Header */}
      <div className="view-header">
        <h2 className="view-title">{title}</h2>
        {actions && <div className="view-actions">{actions}</div>}
      </div>

      {/* Main content */}
      <div className="view-content">
        {/* Ungrouped fields */}
        {groupedFields.get(null) && (
          <div className="field-list">
            {groupedFields.get(null)!.map(field => (
              <FieldRow key={String(field.key)} field={field} entity={entity} value={getFieldValue(entity, field.key)} onCopy={onCopy} copiedField={copiedField} />
            ))}
          </div>
        )}

        {/* Grouped fields */}
        {sortedGroups.map(group => {
          const groupFields = groupedFields.get(group.id);
          if (!groupFields || groupFields.length === 0) return null;

          const isCollapsed = state.collapsedGroups.has(group.id);

          return (
            <div key={group.id} className="field-group">
              <div 
                className="group-header" 
                onClick={() => group.collapsible && onToggleGroup?.(group.id)}
              >
                <h3>{group.label}</h3>
                {group.description && <p className="group-description">{group.description}</p>}
                {group.collapsible && <span className="collapse-icon">{isCollapsed ? '▶' : '▼'}</span>}
              </div>
              {!isCollapsed && (
                <div className="field-list">
                  {groupFields.map(field => (
                    <FieldRow key={String(field.key)} field={field} entity={entity} value={getFieldValue(entity, field.key)} onCopy={onCopy} copiedField={copiedField} />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Metadata */}
        {showMetadata && (
          <div className="field-group metadata">
            <div className="group-header">
              <h3>Metadata</h3>
            </div>
            <div className="field-list">
              {getMetadataFields(entity).map(({ label, value }) => (
                <div key={label} className="field-row">
                  <div className="field-label">{label}</div>
                  <div className="field-value">{String(value)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="view-tabs">
          <div className="tab-headers">
            {tabs.map((tab: ViewTab<T>) => (
              <button
                key={tab.id}
                className={`tab-header ${state.activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange?.(tab.id)}
              >
                {tab.icon && <span className="tab-icon">{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.badge && <span className="tab-badge">{typeof tab.badge === 'function' ? tab.badge(entity) : tab.badge}</span>}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {tabs.map((tab: ViewTab<T>) => {
              if (tab.id !== state.activeTab) return null;
              
              const TabContent = tab.content;
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
    <div className="field-row">
      <div className="field-label">
        {field.label}
        {field.helpText && <span className="field-help" title={field.helpText}>?</span>}
      </div>
      <div className="field-value">
        {renderedValue}
        {field.copyable && (
          <button
            className="copy-button"
            onClick={() => onCopy?.(field.key, value)}
            title="Copy to clipboard"
          >
            {copiedField === String(field.key) ? '✓ Copied' : '📋'}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Card View
 */
function CardView<T extends BaseEntity>(props: CardViewProps<T>) {
  const { entity, fields, titleField, subtitleField, imageField, actions, className } = props;
  const title = getEntityTitle(entity, titleField);
  const subtitle = getEntitySubtitle(entity, subtitleField);
  const image = getEntityImage(entity, imageField);

  return (
    <div className={`entity-view card ${className}`}>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={title} className="card-image" />
      )}
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
        <div className="card-fields">
          {fields.slice(0, 5).map((field: ViewField<T>) => (
            <div key={String(field.key)} className="card-field">
              <span className="field-label">{field.label}:</span>
              <span className="field-value">{renderField(field, entity)}</span>
            </div>
          ))}
        </div>
        {actions && <div className="card-actions">{actions}</div>}
      </div>
    </div>
  );
}

/**
 * Summary View
 */
function SummaryView<T extends BaseEntity>(props: SummaryViewProps<T>) {
  const { entity, fields, className } = props;
  return (
    <div className={`entity-view summary ${className}`}>
      {fields.map((field: ViewField<T>) => (
        <div key={String(field.key)} className="summary-field">
          <span className="field-label">{field.label}:</span>
          <span className="field-value">{renderField(field, entity)}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Timeline event type
 */
type TimelineEvent<T extends BaseEntity> = ViewField<T> | {
  key: string;
  label: string;
  type: string;
  value: unknown;
};
function TimelineView<T extends BaseEntity>(props: TimelineViewProps<T>) {
  const { entity, fields, showMetadata, className } = props;
  const events: TimelineEvent<T>[] = [...fields];
  if (showMetadata) {
    getMetadataFields(entity).forEach(({ label, value }) => {
      events.push({ key: label, label, type: 'date', value });
    });
  }

  return (
    <div className={`entity-view timeline ${className}`}>
      <div className="timeline-line"></div>
      {events.map((event: TimelineEvent<T>) => {
        const isMetadata = 'value' in event;
        return (
        <div key={String(event.key)} className="timeline-event">
          <div className="event-marker"></div>
          <div className="event-content">
            <div className="event-label">{event.label}</div>
            <div className="event-value">{isMetadata ? String(event.value) : renderField(event, entity)}</div>
          </div>
        </div>
        );
      })}
    </div>
  );
}

export default EntityView;
