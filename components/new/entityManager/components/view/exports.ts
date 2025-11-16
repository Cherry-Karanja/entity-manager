/**
 * EntityView Component Exports
 * 
 * Standalone component for entity detail views.
 */

export { EntityView, default } from './index';
export type {
  ViewMode,
  FieldGroup,
  ViewField,
  ViewTab,
  EntityViewProps,
  ViewState,
  FieldRenderProps,
} from './types';
export {
  isFieldVisible,
  getVisibleFields,
  getFieldValue,
  formatFieldValue,
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
} from './utils';
