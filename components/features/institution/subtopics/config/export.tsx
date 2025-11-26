/**
 * Subtopic Export Configuration
 */

import { EntityExporterConfig } from "@/components/entityManager/composition/config/types";

export const SubtopicExporterConfig: EntityExporterConfig = {
  fields: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'order', label: 'Order' },
    { key: 'topic_name', label: 'Topic' },
    { key: 'content_type', label: 'Content Type' },
    { key: 'duration_minutes', label: 'Duration (Minutes)' },
    { key: 'description', label: 'Description' },
    { key: 'created_at', label: 'Created At' },
  ],
  options: {
    format: 'csv',
    filename: 'subtopics',
  },
  showFormatSelector: true,
};
