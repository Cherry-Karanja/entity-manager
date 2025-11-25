/**
 * Timetabling Module
 * 
 * Complete timetable management feature with:
 * - Type definitions for all timetabling entities
 * - API clients for backend integration
 * - Entity configurations for the Entity Manager
 * - Utility functions for validation and analysis
 * 
 * This module is designed to work with a backend service that uses
 * Google OR-Tools for constraint-based timetable optimization.
 */

// Types
export * from './types';

// API Clients
export {
  // Base API clients
  timetablesApiClient,
  scheduleEntriesApiClient,
  teachersApiClient,
  subjectsApiClient,
  roomsApiClient,
  classGroupsApiClient,
  timeSlotsApiClient,
  constraintsApiClient,
  conflictsApiClient,
  generationTasksApiClient,
  
  // Custom actions
  timetableActions,
  scheduleActions,
  teacherActions,
  roomActions,
  classGroupActions,
  conflictActions,
} from './api/client';

// Configurations
export { timetableConfig } from './config';
export { TimetableFormConfig, ScheduleEntryFormConfig } from './config/fields';
export { TimetableListConfig } from './config/list';
export { TimetableViewConfig } from './config/view';
export { TimetableActionsConfig } from './config/actions';

// Utilities
export {
  // Conflict detection
  detectConflicts,
  
  // Validation
  validateScheduleEntry,
  type ValidationError,
  
  // Time utilities
  getDayDisplayName,
  getDayShortName,
  sortDaysOfWeek,
  formatTimeSlot,
  timeToMinutes,
  calculateDuration,
  timesOverlap,
  
  // Workload analysis
  analyzeTeacherWorkload,
  type WorkloadAnalysis,
  analyzeRoomUtilization,
  type RoomAnalysis,
  
  // Grid helpers
  buildTimetableGrid,
  getUniqueTimeSlots,
  type TimetableGrid,
} from './utils';
