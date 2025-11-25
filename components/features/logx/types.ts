/**
 * Type definitions for logx module entities.
 * These types correspond to the Django models in the logx app.
 */

import { BaseEntity } from '@/components/entityManager';

// =============================================================================
// Room Types (Resources Module)
// =============================================================================

/**
 * Room type choices
 */
export type RoomType = 
  | 'classroom'
  | 'lecture_hall'
  | 'lab'
  | 'computer_lab'
  | 'auditorium'
  | 'seminar_room'
  | 'office'
  | 'other';

/**
 * Geolocation coordinates
 */
export interface Geolocation {
  latitude: number;
  longitude: number;
}

/**
 * Room feature
 */
export interface RoomFeature {
  name: string;
  quantity?: number;
  condition?: string;
}

/**
 * Room facility
 */
export interface RoomFacility {
  type: string;
  description?: string;
  operational?: boolean;
}

/**
 * Maintenance schedule item
 */
export interface MaintenanceScheduleItem {
  start_date: string;
  end_date: string;
  reason: string;
}

/**
 * Room entity - physical room or resource that can be allocated for classes
 */
export interface Room extends BaseEntity {
  name: string;
  code: string;
  department: number;
  department_name?: string;
  building?: string;
  floor?: string;
  capacity: number;
  room_type: RoomType;
  geolocation?: Geolocation;
  features: RoomFeature[];
  facilities: RoomFacility[];
  is_active: boolean;
  maintenance_schedule: MaintenanceScheduleItem[];
  operating_hours_start?: string;
  operating_hours_end?: string;
  allows_concurrent_bookings: boolean;
  requires_approval: boolean;
  notes?: string;
}

// =============================================================================
// Timetable Types (Timetabling Module)
// =============================================================================

/**
 * Day of week choices
 */
export type DayOfWeek = 
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

/**
 * Break period configuration
 */
export interface BreakPeriod {
  name: string;
  start_time: string;
  end_time: string;
  days?: DayOfWeek[];
}

/**
 * Timetable entity - main timetable containing overall scheduling information
 */
export interface Timetable extends BaseEntity {
  name: string;
  academic_year: number;
  academic_year_name?: string;
  term: number;
  term_name?: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  working_days: DayOfWeek[];
  working_hours_start: string;
  working_hours_end: string;
  break_periods: BreakPeriod[];
  additional_breaks: BreakPeriod[];
  generation_task_id?: string;
  version: number;
}

/**
 * ClassGroupSchedule entity - schedule for a specific class group within a timetable
 */
export interface ClassGroupSchedule extends BaseEntity {
  timetable: number;
  timetable_name?: string;
  class_group: number;
  class_group_name?: string;
  enrollment: number;
  enrollment_name?: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  room?: number;
  room_name?: string;
  is_active: boolean;
  notes?: string;
}

/**
 * TimetableSettings entity - global settings for timetable generation and constraints
 */
export interface TimetableSettings extends BaseEntity {
  timetable: number;
  timetable_name?: string;
  max_classes_per_day: number;
  min_break_between_classes: number;
  preferred_class_duration: number;
  allow_consecutive_classes: boolean;
  max_consecutive_classes: number;
  prioritize_room_capacity: boolean;
  allow_room_sharing: boolean;
}

/**
 * Constraint type choices
 */
export type ConstraintType = 
  | 'room_availability'
  | 'trainer_availability'
  | 'class_group_availability'
  | 'resource_conflict'
  | 'time_restriction'
  | 'custom';

/**
 * Constraint parameters (stored as JSON)
 */
export interface ConstraintParameters {
  [key: string]: unknown;
}

/**
 * TimetableConstraint entity - constraints that must be satisfied during timetable generation
 */
export interface TimetableConstraint extends BaseEntity {
  timetable: number;
  timetable_name?: string;
  name: string;
  description?: string;
  constraint_type: ConstraintType;
  parameters: ConstraintParameters;
  priority: number;
  is_hard_constraint: boolean;
  is_active: boolean;
}

/**
 * Violation type choices
 */
export type ViolationType = 
  | 'room_conflict'
  | 'trainer_conflict'
  | 'time_overlap'
  | 'capacity_exceeded'
  | 'preference_violation'
  | 'custom';

/**
 * PenaltyRule entity - rules for calculating penalties when constraints are violated
 */
export interface PenaltyRule extends BaseEntity {
  timetable: number;
  timetable_name?: string;
  name: string;
  description?: string;
  violation_type: ViolationType;
  penalty_points: number;
  is_active: boolean;
}

/**
 * Virtual resource type choices
 */
export type VirtualResourceType = 
  | 'projector'
  | 'computer_lab'
  | 'equipment'
  | 'software'
  | 'other';

/**
 * VirtualResource entity - virtual resources that can be allocated
 */
export interface VirtualResource extends BaseEntity {
  timetable: number;
  timetable_name?: string;
  name: string;
  resource_type: VirtualResourceType;
  is_available: boolean;
  maintenance_schedule: MaintenanceScheduleItem[];
  max_concurrent_usage: number;
}

/**
 * Entity type choices for resource limits
 */
export type ResourceLimitEntityType = 
  | 'class_group'
  | 'trainer'
  | 'room'
  | 'department';

/**
 * Resource type choices for limits
 */
export type ResourceLimitResourceType = 
  | 'room_hours'
  | 'class_hours'
  | 'equipment_usage'
  | 'budget';

/**
 * Period type choices
 */
export type PeriodType = 
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'term'
  | 'year';

/**
 * ResourceLimit entity - limits on resource usage for specific entities
 */
export interface ResourceLimit extends BaseEntity {
  timetable: number;
  timetable_name?: string;
  entity_type: ResourceLimitEntityType;
  class_group?: number;
  class_group_name?: string;
  trainer?: number;
  trainer_name?: string;
  resource_type: ResourceLimitResourceType;
  max_limit: number;
  current_usage: number;
  period_type: PeriodType;
  is_active: boolean;
}

// =============================================================================
// Display Label Mappings
// =============================================================================

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  classroom: 'Classroom',
  lecture_hall: 'Lecture Hall',
  lab: 'Laboratory',
  computer_lab: 'Computer Lab',
  auditorium: 'Auditorium',
  seminar_room: 'Seminar Room',
  office: 'Office',
  other: 'Other',
};

export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export const CONSTRAINT_TYPE_LABELS: Record<ConstraintType, string> = {
  room_availability: 'Room Availability',
  trainer_availability: 'Trainer Availability',
  class_group_availability: 'Class Group Availability',
  resource_conflict: 'Resource Conflict',
  time_restriction: 'Time Restriction',
  custom: 'Custom Constraint',
};

export const VIOLATION_TYPE_LABELS: Record<ViolationType, string> = {
  room_conflict: 'Room Conflict',
  trainer_conflict: 'Trainer Conflict',
  time_overlap: 'Time Overlap',
  capacity_exceeded: 'Capacity Exceeded',
  preference_violation: 'Preference Violation',
  custom: 'Custom Violation',
};

export const VIRTUAL_RESOURCE_TYPE_LABELS: Record<VirtualResourceType, string> = {
  projector: 'Projector',
  computer_lab: 'Computer Lab',
  equipment: 'Special Equipment',
  software: 'Software License',
  other: 'Other',
};

export const ENTITY_TYPE_LABELS: Record<ResourceLimitEntityType, string> = {
  class_group: 'Class Group',
  trainer: 'Trainer',
  room: 'Room',
  department: 'Department',
};

export const RESOURCE_TYPE_LABELS: Record<ResourceLimitResourceType, string> = {
  room_hours: 'Room Hours',
  class_hours: 'Class Hours',
  equipment_usage: 'Equipment Usage',
  budget: 'Budget',
};

export const PERIOD_TYPE_LABELS: Record<PeriodType, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  term: 'Per Term',
  year: 'Per Year',
};
