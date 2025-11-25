/**
 * Topic Export Configuration
 */

import { EntityExporterConfig } from "@/components/entityManager/composition/config/types";

export const TopicExporterConfig: EntityExporterConfig = {
  fields: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'order', label: 'Order' },
    { key: 'unit_name', label: 'Unit' },
    { key: 'duration_hours', label: 'Duration (Hours)' },
    { key: 'weight', label: 'Weight (%)' },
    { key: 'subtopic_count', label: 'Subtopic Count' },
    { key: 'description', label: 'Description' },
    { key: 'created_at', label: 'Created At' },
  ],
  filename: 'topics',
  formats: ['csv', 'json'],
};
