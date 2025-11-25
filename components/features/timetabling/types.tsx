/**
 * Timetabling Module Types
 * 
 * Type definitions for the timetabling module to integrate with
 * a backend timetable generation service using Google OR-Tools.
 */

import { BaseEntity } from '@/components/entityManager/primitives/types';

// ===========================
// Time Slot Types
// ===========================

export interface TimeSlot extends BaseEntity {
  id: string | number;
  day_of_week: DayOfWeek;
  start_time: string; // Format: "HH:MM"
  end_time: string;   // Format: "HH:MM"
  slot_number: number;
  is_break: boolean;
  break_type?: BreakType;
  label?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type BreakType = 'short_break' | 'lunch_break' | 'assembly' | 'other';

// ===========================
// Teacher Types
// ===========================

export interface Teacher extends BaseEntity {
  id: string | number;
  employee_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone_number?: string;
  department?: string;
  subjects: Subject[];
  subject_ids: (string | number)[];
  max_periods_per_day: number;
  max_consecutive_periods: number;
  preferred_time_slots?: (string | number)[];
  unavailable_slots?: (string | number)[];
  is_class_teacher: boolean;
  class_teacher_of?: string | number; // ClassGroup ID
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// ===========================
// Subject Types
// ===========================

export interface Subject extends BaseEntity {
  id: string | number;
  code: string;
  name: string;
  short_name?: string;
  description?: string;
  periods_per_week: number;
  requires_lab: boolean;
  requires_special_room: boolean;
  special_room_type?: RoomType;
  color?: string;
  is_elective: boolean;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// ===========================
// Room Types
// ===========================

export interface Room extends BaseEntity {
  id: string | number;
  code: string;
  name: string;
  building?: string;
  floor?: number;
  capacity: number;
  room_type: RoomType;
  facilities: string[];
  is_available: boolean;
  unavailable_slots?: (string | number)[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export type RoomType = 
  | 'classroom' 
  | 'laboratory' 
  | 'computer_lab' 
  | 'library' 
  | 'auditorium' 
  | 'sports_hall' 
  | 'music_room' 
  | 'art_room' 
  | 'workshop'
  | 'other';

// ===========================
// Class Group Types
// ===========================

export interface ClassGroup extends BaseEntity {
  id: string | number;
  code: string;
  name: string;
  grade_level: string;
  section?: string;
  stream?: string;
  student_count: number;
  home_room?: string | number; // Room ID
  class_teacher?: string | number; // Teacher ID
  class_teacher_name?: string;
  subjects: Subject[];
  subject_ids: (string | number)[];
  is_active: boolean;
  academic_year: string;
  created_at: string;
  updated_at?: string;
}

// ===========================
// Timetable Types
// ===========================

export interface Timetable extends BaseEntity {
  id: string | number;
  name: string;
  description?: string;
  academic_year: string;
  term: string;
  version: number;
  status: TimetableStatus;
  is_active: boolean;
  is_published: boolean;
  generation_status?: GenerationStatus;
  generation_started_at?: string;
  generation_completed_at?: string;
  generation_error?: string;
  generated_by?: string | number;
  generated_by_name?: string;
  schedules_count: number;
  conflicts_count: number;
  fitness_score?: number;
  constraints_satisfied?: number;
  total_constraints?: number;
  created_at: string;
  updated_at?: string;
  published_at?: string;
  published_by?: string | number;
}

export type TimetableStatus = 'draft' | 'generating' | 'generated' | 'published' | 'archived';
export type GenerationStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

// ===========================
// Schedule Entry Types
// ===========================

export interface ScheduleEntry extends BaseEntity {
  id: string | number;
  timetable: string | number;
  timetable_name?: string;
  class_group: string | number;
  class_group_name?: string;
  subject: string | number;
  subject_name?: string;
  subject_code?: string;
  teacher: string | number;
  teacher_name?: string;
  room: string | number;
  room_name?: string;
  room_code?: string;
  time_slot: string | number;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  slot_number: number;
  is_locked: boolean;
  is_manual: boolean;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// ===========================
// Constraint Types
// ===========================

export interface TimetableConstraint extends BaseEntity {
  id: string | number;
  timetable?: string | number;
  constraint_type: ConstraintType;
  priority: ConstraintPriority;
  is_hard_constraint: boolean;
  description: string;
  parameters: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export type ConstraintType =
  | 'no_teacher_conflict'      // Teacher cannot be in two places at once
  | 'no_room_conflict'         // Room cannot be used by two classes at once
  | 'no_class_conflict'        // Class cannot have two lessons at once
  | 'max_periods_per_day'      // Max periods per day for teacher/class
  | 'max_consecutive_periods'  // Max consecutive periods for teacher/class
  | 'preferred_time_slot'      // Preferred time slots for subjects
  | 'avoid_time_slot'          // Avoid certain time slots
  | 'subject_spacing'          // Spread subject across week
  | 'room_requirement'         // Subject requires specific room type
  | 'teacher_availability'     // Teacher availability constraints
  | 'lunch_break'              // Mandatory lunch break
  | 'assembly_time'            // Assembly time constraints
  | 'lab_consecutive'          // Lab sessions should be consecutive
  | 'physical_education'       // PE constraints (outdoor, weather)
  | 'custom';

export type ConstraintPriority = 'critical' | 'high' | 'medium' | 'low';

// ===========================
// Conflict Types
// ===========================

export interface TimetableConflict extends BaseEntity {
  id: string | number;
  timetable: string | number;
  conflict_type: ConflictType;
  severity: ConflictSeverity;
  description: string;
  affected_entries: (string | number)[];
  affected_entities: ConflictEntity[];
  resolution_status: ResolutionStatus;
  resolution_notes?: string;
  resolved_by?: string | number;
  resolved_at?: string;
  created_at: string;
}

export type ConflictType =
  | 'teacher_double_booking'
  | 'room_double_booking'
  | 'class_double_booking'
  | 'constraint_violation'
  | 'resource_unavailable'
  | 'capacity_exceeded'
  | 'missing_assignment';

export type ConflictSeverity = 'critical' | 'high' | 'medium' | 'low' | 'warning';
export type ResolutionStatus = 'unresolved' | 'in_progress' | 'resolved' | 'ignored';

export interface ConflictEntity {
  entity_type: 'teacher' | 'room' | 'class_group' | 'subject' | 'time_slot';
  entity_id: string | number;
  entity_name: string;
}

// ===========================
// Generation Task Types
// ===========================

export interface GenerationTask extends BaseEntity {
  id: string | number;
  timetable: string | number;
  timetable_name?: string;
  task_id: string; // Celery task ID
  status: GenerationStatus;
  progress: number; // 0-100
  current_step?: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  parameters: GenerationParameters;
  result_summary?: GenerationResult;
  created_by?: string | number;
  created_by_name?: string;
  created_at: string;
  updated_at?: string;
}

export interface GenerationParameters {
  algorithm: 'or_tools' | 'genetic' | 'simulated_annealing' | 'constraint_programming';
  time_limit_seconds: number;
  max_iterations?: number;
  population_size?: number; // For genetic algorithm
  mutation_rate?: number;   // For genetic algorithm
  cooling_rate?: number;    // For simulated annealing
  prioritize_constraints?: ConstraintType[];
  respect_locked_entries: boolean;
  allow_partial_solution: boolean;
}

export interface GenerationResult {
  success: boolean;
  schedules_created: number;
  conflicts_found: number;
  constraints_satisfied: number;
  total_constraints: number;
  fitness_score: number;
  generation_time_seconds: number;
  iterations_performed?: number;
  improvements_found?: number;
}

// ===========================
// Statistics Types
// ===========================

export interface TimetableStatistics {
  total_timetables: number;
  active_timetables: number;
  published_timetables: number;
  draft_timetables: number;
  generating_timetables: number;
  total_schedules: number;
  total_conflicts: number;
  unresolved_conflicts: number;
  average_fitness_score: number;
  teachers_assigned: number;
  rooms_utilized: number;
  classes_covered: number;
}

export interface TeacherWorkload {
  teacher_id: string | number;
  teacher_name: string;
  total_periods: number;
  periods_per_day: Record<DayOfWeek, number>;
  subjects_taught: string[];
  classes_taught: string[];
  free_periods: number;
  utilization_percentage: number;
}

export interface RoomUtilization {
  room_id: string | number;
  room_name: string;
  room_type: RoomType;
  total_slots: number;
  occupied_slots: number;
  utilization_percentage: number;
  peak_hours: string[];
  subjects_held: string[];
}

// ===========================
// Filter Types
// ===========================

export interface TimetableFilters {
  search?: string;
  status?: TimetableStatus;
  academic_year?: string;
  term?: string;
  is_active?: boolean;
  is_published?: boolean;
  ordering?: string;
}

export interface ScheduleFilters {
  timetable?: string | number;
  class_group?: string | number;
  teacher?: string | number;
  room?: string | number;
  subject?: string | number;
  day_of_week?: DayOfWeek;
  ordering?: string;
}

export interface ConflictFilters {
  timetable?: string | number;
  conflict_type?: ConflictType;
  severity?: ConflictSeverity;
  resolution_status?: ResolutionStatus;
  ordering?: string;
}

// ===========================
// Request/Response Types
// ===========================

export interface GenerateTimetableRequest {
  timetable_id: string | number;
  parameters?: Partial<GenerationParameters>;
}

export interface GenerateTimetableResponse {
  task_id: string;
  status: GenerationStatus;
  message: string;
}

export interface RegenerateTimetableRequest {
  timetable_id: string | number;
  clear_existing: boolean;
  keep_locked_entries: boolean;
  parameters?: Partial<GenerationParameters>;
}

export interface PublishTimetableRequest {
  timetable_id: string | number;
  notify_teachers: boolean;
  notify_students: boolean;
}

export interface SwapScheduleRequest {
  schedule_entry_1_id: string | number;
  schedule_entry_2_id: string | number;
  validate_only?: boolean;
}

export interface MoveScheduleRequest {
  schedule_entry_id: string | number;
  new_time_slot_id: string | number;
  new_room_id?: string | number;
  validate_only?: boolean;
}

export interface ValidationResult {
  is_valid: boolean;
  conflicts: TimetableConflict[];
  warnings: string[];
}

// ===========================
// Export Types
// ===========================

export type { Timetable as TimetableEntity };
export type { ScheduleEntry as ScheduleEntryEntity };
export type { Teacher as TeacherEntity };
export type { Subject as SubjectEntity };
export type { Room as RoomEntity };
export type { ClassGroup as ClassGroupEntity };
export type { TimeSlot as TimeSlotEntity };
export type { TimetableConstraint as ConstraintEntity };
export type { TimetableConflict as TimetableConflictEntity };
export type { GenerationTask as GenerationTaskEntity };
