/**
 * Timetabling API Client
 * 
 * API client for Django timetabling endpoints using the HTTP client factory.
 * Integrates with a backend timetable generation service using Google OR-Tools.
 * 
 * The HTTP client factory handles:
 * - Authentication via authApi from connectionManager
 * - CSRF token handling
 * - 401 token refresh
 * - DRF pagination format (results, count, next, previous)
 * - Error handling with toast notifications
 * - Bulk operations
 * - Custom actions
 */

import { createHttpClient } from '@/components/entityManager';
import {
  Timetable,
  ScheduleEntry,
  Teacher,
  Subject,
  Room,
  ClassGroup,
  TimeSlot,
  TimetableConstraint,
  TimetableConflict,
  GenerationTask,
  GenerateTimetableRequest,
  GenerateTimetableResponse,
  RegenerateTimetableRequest,
  PublishTimetableRequest,
  SwapScheduleRequest,
  MoveScheduleRequest,
  ValidationResult,
  TimetableStatistics,
  TeacherWorkload,
  RoomUtilization,
} from '../types';
import { authApi, handleApiError } from '@/components/connectionManager/http/client';
import { AxiosError } from 'axios';

// ===========================
// Base API Clients
// ===========================

/**
 * Timetables API Client
 */
export const timetablesApiClient = createHttpClient<Timetable>({
  endpoint: '/api/v1/timetabling/timetables/',
});

/**
 * Schedule Entries API Client
 */
export const scheduleEntriesApiClient = createHttpClient<ScheduleEntry>({
  endpoint: '/api/v1/timetabling/schedules/',
});

/**
 * Teachers API Client
 */
export const teachersApiClient = createHttpClient<Teacher>({
  endpoint: '/api/v1/timetabling/teachers/',
});

/**
 * Subjects API Client
 */
export const subjectsApiClient = createHttpClient<Subject>({
  endpoint: '/api/v1/timetabling/subjects/',
});

/**
 * Rooms API Client
 */
export const roomsApiClient = createHttpClient<Room>({
  endpoint: '/api/v1/timetabling/rooms/',
});

/**
 * Class Groups API Client
 */
export const classGroupsApiClient = createHttpClient<ClassGroup>({
  endpoint: '/api/v1/timetabling/class-groups/',
});

/**
 * Time Slots API Client
 */
export const timeSlotsApiClient = createHttpClient<TimeSlot>({
  endpoint: '/api/v1/timetabling/time-slots/',
});

/**
 * Constraints API Client
 */
export const constraintsApiClient = createHttpClient<TimetableConstraint>({
  endpoint: '/api/v1/timetabling/constraints/',
});

/**
 * Conflicts API Client
 */
export const conflictsApiClient = createHttpClient<TimetableConflict>({
  endpoint: '/api/v1/timetabling/conflicts/',
});

/**
 * Generation Tasks API Client
 */
export const generationTasksApiClient = createHttpClient<GenerationTask>({
  endpoint: '/api/v1/timetabling/generation-tasks/',
});

// ===========================
// Custom Timetable Actions
// ===========================

/**
 * Timetable generation and management actions
 * 
 * These actions interact with the backend timetable generation service
 * which uses Google OR-Tools for constraint-based scheduling.
 */
export const timetableActions = {
  /**
   * Generate a new timetable using Google OR-Tools optimization
   * 
   * This triggers a Celery background task that uses constraint programming
   * to find an optimal or near-optimal schedule.
   */
  async generate(request: GenerateTimetableRequest): Promise<GenerateTimetableResponse> {
    try {
      const response = await authApi.post(
        `/api/v1/timetabling/timetables/${request.timetable_id}/generate/`,
        request.parameters || {}
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Regenerate an existing timetable
   * 
   * Clears existing schedules (optionally keeping locked entries) and
   * generates a new schedule from scratch.
   */
  async regenerate(request: RegenerateTimetableRequest): Promise<GenerateTimetableResponse> {
    try {
      const response = await authApi.post(
        `/api/v1/timetabling/timetables/${request.timetable_id}/regenerate/`,
        {
          clear_existing: request.clear_existing,
          keep_locked_entries: request.keep_locked_entries,
          parameters: request.parameters,
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Publish a timetable making it active and visible
   * 
   * Optionally sends notifications to teachers and students.
   */
  async publish(request: PublishTimetableRequest): Promise<Timetable> {
    try {
      const response = await authApi.post(
        `/api/v1/timetabling/timetables/${request.timetable_id}/publish/`,
        {
          notify_teachers: request.notify_teachers,
          notify_students: request.notify_students,
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Unpublish a timetable (revert to draft)
   */
  async unpublish(timetableId: string | number): Promise<Timetable> {
    try {
      const response = await authApi.post(
        `/api/v1/timetabling/timetables/${timetableId}/unpublish/`
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Archive a timetable
   */
  async archive(timetableId: string | number): Promise<Timetable> {
    try {
      const response = await authApi.post(
        `/api/v1/timetabling/timetables/${timetableId}/archive/`
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Clone/duplicate a timetable
   */
  async clone(timetableId: string | number, newName?: string): Promise<Timetable> {
    try {
      const response = await authApi.post(
        `/api/v1/timetabling/timetables/${timetableId}/clone/`,
        { name: newName }
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Get generation task status
   */
  async getGenerationStatus(timetableId: string | number): Promise<GenerationTask> {
    try {
      const response = await authApi.get(
        `/api/v1/timetabling/timetables/${timetableId}/generation-status/`
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Cancel an in-progress generation task
   */
  async cancelGeneration(timetableId: string | number): Promise<void> {
    try {
      await authApi.post(
        `/api/v1/timetabling/timetables/${timetableId}/cancel-generation/`
      );
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Get timetable statistics
   */
  async getStatistics(timetableId?: string | number): Promise<TimetableStatistics> {
    try {
      const endpoint = timetableId
        ? `/api/v1/timetabling/timetables/${timetableId}/statistics/`
        : '/api/v1/timetabling/statistics/';
      const response = await authApi.get(endpoint);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Validate timetable for conflicts
   */
  async validate(timetableId: string | number): Promise<ValidationResult> {
    try {
      const response = await authApi.post(
        `/api/v1/timetabling/timetables/${timetableId}/validate/`
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Export timetable in various formats
   */
  async export(
    timetableId: string | number,
    format: 'pdf' | 'excel' | 'csv' | 'ical'
  ): Promise<Blob> {
    try {
      const response = await authApi.get(
        `/api/v1/timetabling/timetables/${timetableId}/export/`,
        {
          params: { format },
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },
};

// ===========================
// Schedule Entry Actions
// ===========================

/**
 * Schedule entry manipulation actions
 */
export const scheduleActions = {
  /**
   * Swap two schedule entries
   * 
   * Swaps the time slots of two schedule entries while checking for conflicts.
   */
  async swap(request: SwapScheduleRequest): Promise<ValidationResult> {
    try {
      const response = await authApi.post(
        '/api/v1/timetabling/schedules/swap/',
        request
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Move a schedule entry to a different time slot
   */
  async move(request: MoveScheduleRequest): Promise<ValidationResult> {
    try {
      const response = await authApi.post(
        `/api/v1/timetabling/schedules/${request.schedule_entry_id}/move/`,
        {
          new_time_slot_id: request.new_time_slot_id,
          new_room_id: request.new_room_id,
          validate_only: request.validate_only,
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Lock a schedule entry (prevents automatic modification)
   */
  async lock(scheduleId: string | number): Promise<ScheduleEntry> {
    try {
      const response = await authApi.post(
        `/api/v1/timetabling/schedules/${scheduleId}/lock/`
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Unlock a schedule entry
   */
  async unlock(scheduleId: string | number): Promise<ScheduleEntry> {
    try {
      const response = await authApi.post(
        `/api/v1/timetabling/schedules/${scheduleId}/unlock/`
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Get schedules by class group
   */
  async getByClassGroup(classGroupId: string | number): Promise<ScheduleEntry[]> {
    try {
      const response = await authApi.get(
        '/api/v1/timetabling/schedules/',
        { params: { class_group: classGroupId } }
      );
      return response.data.results || response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Get schedules by teacher
   */
  async getByTeacher(teacherId: string | number): Promise<ScheduleEntry[]> {
    try {
      const response = await authApi.get(
        '/api/v1/timetabling/schedules/',
        { params: { teacher: teacherId } }
      );
      return response.data.results || response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Get schedules by room
   */
  async getByRoom(roomId: string | number): Promise<ScheduleEntry[]> {
    try {
      const response = await authApi.get(
        '/api/v1/timetabling/schedules/',
        { params: { room: roomId } }
      );
      return response.data.results || response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },
};

// ===========================
// Teacher Actions
// ===========================

/**
 * Teacher-related actions
 */
export const teacherActions = {
  /**
   * Get teacher workload analysis
   */
  async getWorkload(teacherId: string | number): Promise<TeacherWorkload> {
    try {
      const response = await authApi.get(
        `/api/v1/timetabling/teachers/${teacherId}/workload/`
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Get teacher's schedule
   */
  async getSchedule(
    teacherId: string | number,
    timetableId?: string | number
  ): Promise<ScheduleEntry[]> {
    try {
      const params: Record<string, unknown> = {};
      if (timetableId) params.timetable = timetableId;
      
      const response = await authApi.get(
        `/api/v1/timetabling/teachers/${teacherId}/schedule/`,
        { params }
      );
      return response.data.results || response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Get teacher availability
   */
  async getAvailability(teacherId: string | number): Promise<TimeSlot[]> {
    try {
      const response = await authApi.get(
        `/api/v1/timetabling/teachers/${teacherId}/availability/`
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Update teacher availability
   */
  async updateAvailability(
    teacherId: string | number,
    unavailableSlots: (string | number)[]
  ): Promise<Teacher> {
    try {
      const response = await authApi.post(
        `/api/v1/timetabling/teachers/${teacherId}/update-availability/`,
        { unavailable_slots: unavailableSlots }
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },
};

// ===========================
// Room Actions
// ===========================

/**
 * Room-related actions
 */
export const roomActions = {
  /**
   * Get room utilization statistics
   */
  async getUtilization(roomId: string | number): Promise<RoomUtilization> {
    try {
      const response = await authApi.get(
        `/api/v1/timetabling/rooms/${roomId}/utilization/`
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Get room schedule
   */
  async getSchedule(
    roomId: string | number,
    timetableId?: string | number
  ): Promise<ScheduleEntry[]> {
    try {
      const params: Record<string, unknown> = {};
      if (timetableId) params.timetable = timetableId;
      
      const response = await authApi.get(
        `/api/v1/timetabling/rooms/${roomId}/schedule/`,
        { params }
      );
      return response.data.results || response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Check room availability for a time slot
   */
  async checkAvailability(
    roomId: string | number,
    timeSlotId: string | number,
    timetableId: string | number
  ): Promise<{ available: boolean; conflicting_schedule?: ScheduleEntry }> {
    try {
      const response = await authApi.get(
        `/api/v1/timetabling/rooms/${roomId}/check-availability/`,
        { params: { time_slot: timeSlotId, timetable: timetableId } }
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },
};

// ===========================
// Class Group Actions
// ===========================

/**
 * Class group actions
 */
export const classGroupActions = {
  /**
   * Get class group schedule
   */
  async getSchedule(
    classGroupId: string | number,
    timetableId?: string | number
  ): Promise<ScheduleEntry[]> {
    try {
      const params: Record<string, unknown> = {};
      if (timetableId) params.timetable = timetableId;
      
      const response = await authApi.get(
        `/api/v1/timetabling/class-groups/${classGroupId}/schedule/`,
        { params }
      );
      return response.data.results || response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Export class group timetable
   */
  async exportSchedule(
    classGroupId: string | number,
    format: 'pdf' | 'excel' | 'csv'
  ): Promise<Blob> {
    try {
      const response = await authApi.get(
        `/api/v1/timetabling/class-groups/${classGroupId}/export-schedule/`,
        {
          params: { format },
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },
};

// ===========================
// Conflict Actions
// ===========================

/**
 * Conflict resolution actions
 */
export const conflictActions = {
  /**
   * Mark conflict as resolved
   */
  async resolve(
    conflictId: string | number,
    notes?: string
  ): Promise<TimetableConflict> {
    try {
      const response = await authApi.post(
        `/api/v1/timetabling/conflicts/${conflictId}/resolve/`,
        { resolution_notes: notes }
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Ignore/dismiss a conflict
   */
  async ignore(
    conflictId: string | number,
    notes?: string
  ): Promise<TimetableConflict> {
    try {
      const response = await authApi.post(
        `/api/v1/timetabling/conflicts/${conflictId}/ignore/`,
        { resolution_notes: notes }
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },

  /**
   * Get suggestions for resolving a conflict
   */
  async getSuggestions(
    conflictId: string | number
  ): Promise<{ suggestions: string[]; alternative_slots: TimeSlot[] }> {
    try {
      const response = await authApi.get(
        `/api/v1/timetabling/conflicts/${conflictId}/suggestions/`
      );
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
      throw error;
    }
  },
};
