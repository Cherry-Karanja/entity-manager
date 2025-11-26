/**
 * Rooms Feature Index
 * Main export file for rooms feature
 */

export * from './config';
export { roomConfig } from './config';

// Re-export API client with expected name
export { roomsClient as roomClient } from './api/client';
