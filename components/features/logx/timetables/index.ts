/**
 * Timetables Feature Index
 * Main export file for timetables feature
 */

export * from './config';
export * from './api/client';
export { timetableConfig } from './config';

// Re-export API client with expected name
export { timetablesClient as timetableClient } from './api/client';
