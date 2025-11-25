/**
 * Institution Module Types
 * 
 * Type definitions for the institution module based on Django backend models.
 * Covers institution_core (departments, programmes, class_groups, academic_cycles)
 * and academics (units, topics, subtopics, enrollments).
 */

import { BaseEntity } from '@/components/entityManager/primitives/types';

// ===========================
// Academic Cycles
// ===========================

export interface AcademicYear extends BaseEntity {
  id: string;
  year: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Term extends BaseEntity {
  id: string;
  name: 'Term 1' | 'Term 2' | 'Term 3';
  academic_year: string; // AcademicYear ID
  academic_year_display?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  duration?: number; // days
  is_current?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Intake extends BaseEntity {
  id: string;
  name: 'January' | 'May' | 'September';
  year: number;
  created_at: string;
  updated_at?: string;
}

// ===========================
// Departments & Programmes
// ===========================

export interface Department extends BaseEntity {
  id: string;
  name: string;
  hod?: string; // User ID
  hod_name?: string;
  hod_email?: string;
  trainers: string[]; // User IDs
  trainers_count?: number;
  total_programmes?: number;
  total_class_groups?: number;
  total_trainees?: number;
  total_trainers?: number;
  created_at: string;
  updated_at?: string;
}

export interface Programme extends BaseEntity {
  id: string;
  name: string;
  code?: string;
  level: number;
  department: string; // Department ID
  department_name?: string;
  total_trainees?: number;
  total_class_groups?: number;
  created_at: string;
  updated_at?: string;
}

export interface ClassGroup extends BaseEntity {
  id: string;
  programme: string; // Programme ID
  programme_name?: string;
  programme_code?: string;
  name: string;
  cirriculum_code?: string;
  intake?: string; // Intake ID
  intake_name?: string;
  year?: number;
  term_number?: number;
  suffix?: string;
  auto_fill_fields: boolean;
  trainees: string[]; // User IDs
  trainees_count?: number;
  total_trainees?: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// ===========================
// Units (Courses)
// ===========================

export type RoomType = 
  | 'lecture_hall'
  | 'laboratory'
  | 'classroom'
  | 'workshop'
  | 'studio'
  | 'online'
  | 'other'
  | 'theory_room'
  | 'technical_drawing_room'
  | 'computer_lab'
  | 'automotive_workshop'
  | 'driving'
  | 'machine_shop'
  | 'fitting_area'
  | 'sheet_metal_workshop'
  | 'mmaw_oaw_workshop'
  | 'mig_tig_workshop'
  | 'instruction_room'
  | 'auto_body_workshop'
  | 'engine_workshop'
  | 'textile_workshop'
  | 'food_science_lab'
  | 'chemistry_lab'
  | 'pharmacy_lab'
  | 'science_lab'
  | 'salon'
  | 'batik_coloring_workshop'
  | 'cosmetology_workshop'
  | 'electrical_machine_lab'
  | 'electronics_lab'
  | 'plumbing_workshop'
  | 'masonry_workshop'
  | 'bitumen_lab'
  | 'metrology_lab'
  | 'smart_classroom'
  | 'carpentry_workshop'
  | 'electrical_installation_lab'
  | 'kitchen'
  | 'cafeteria'
  | 'horticulture_farm'
  | 'microbiology_lab';

export type SessionType = 'theory' | 'practical' | 'both';

export type TimeOfDay = 'any' | 'morning' | 'afternoon' | 'evening';

export interface Unit extends BaseEntity {
  id: string;
  name: string;
  code: string;
  department: string; // Department ID
  department_name?: string;
  programmes: string[]; // Programme IDs
  programmes_display?: string[];
  description?: string;
  prerequisites: string[]; // Unit IDs
  prerequisites_display?: string[];
  theory_sessions_per_week: number;
  practical_sessions_per_week: number;
  theory_duration: string; // Duration string (HH:MM:SS)
  practical_duration: string; // Duration string (HH:MM:SS)
  theory_room_type: RoomType;
  practical_room_type: RoomType;
  session_type: SessionType;
  preferred_time_of_day: TimeOfDay;
  isolate_day: boolean;
  hard_scheduling_constraints?: Record<string, unknown>;
  topics_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface Topic extends BaseEntity {
  id: string;
  unit: string; // Unit ID
  unit_code?: string;
  unit_name?: string;
  title: string;
  description?: string;
  duration_hours: number;
  order: number;
  subtopics_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Subtopic extends BaseEntity {
  id: string;
  topic: string; // Topic ID
  topic_title?: string;
  unit_code?: string;
  title: string;
  description?: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

// ===========================
// Enrollments
// ===========================

export type EnrollmentStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Enrollment extends BaseEntity {
  id: string;
  trainer?: string; // User ID
  trainer_name?: string;
  trainer_email?: string;
  class_group: string; // ClassGroup ID
  class_group_name?: string;
  unit: string; // Unit ID
  unit_code?: string;
  unit_name?: string;
  year: string; // AcademicYear ID
  year_display?: string;
  term: string; // Term ID
  term_name?: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  status: EnrollmentStatus;
  total_hours: number;
  teaching_group_id?: string;
  co_teaching_id?: string;
  subgroup_index?: number;
  allow_split?: boolean;
  created_at: string;
  updated_at?: string;
}

// ===========================
// Display Name Mappings
// ===========================

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  lecture_hall: 'Lecture Hall',
  laboratory: 'Laboratory',
  classroom: 'Classroom',
  workshop: 'Workshop',
  studio: 'Studio',
  online: 'Online/Virtual',
  other: 'Other',
  theory_room: 'Theory Room',
  technical_drawing_room: 'Technical Drawing Room',
  computer_lab: 'Computer Lab',
  automotive_workshop: 'Automotive Workshop',
  driving: 'Driving',
  machine_shop: 'Machine Shop',
  fitting_area: 'Fitting Area',
  sheet_metal_workshop: 'Sheet Metal Workshop',
  mmaw_oaw_workshop: 'MMAW/OAW Workshop',
  mig_tig_workshop: 'MIG/TIG Workshop',
  instruction_room: 'Instruction Room',
  auto_body_workshop: 'Body and Spray Painting Workshop',
  engine_workshop: 'Engine Workshop',
  textile_workshop: 'Textile Workshop',
  food_science_lab: 'Food Science Lab',
  chemistry_lab: 'Chemistry Lab',
  pharmacy_lab: 'Pharmacy Lab',
  science_lab: 'Science Lab',
  salon: 'Salon',
  batik_coloring_workshop: 'Batik and Coloring Workshop',
  cosmetology_workshop: 'Cosmetology Workshop',
  electrical_machine_lab: 'Electrical Machine Lab',
  electronics_lab: 'Analogue and Digital Electronics Lab',
  plumbing_workshop: 'Plumbing Workshop',
  masonry_workshop: 'Masonry Workshop',
  bitumen_lab: 'Concrete/Bitumen Lab',
  metrology_lab: 'Metrology Lab',
  smart_classroom: 'Smart Classroom',
  carpentry_workshop: 'Carpentry Workshop',
  electrical_installation_lab: 'Electrical Installation Lab',
  kitchen: 'Kitchen',
  cafeteria: 'Cafeteria',
  horticulture_farm: 'Horticultural and Animal Farm',
  microbiology_lab: 'Microbiology Lab',
};

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  theory: 'Theory Only',
  practical: 'Practical Only',
  both: 'Theory and Practical',
};

export const TIME_OF_DAY_LABELS: Record<TimeOfDay, string> = {
  any: 'No Preference',
  morning: 'Prefer Morning',
  afternoon: 'Prefer Afternoon',
  evening: 'Prefer Evening',
};

export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const TERM_CHOICES = ['Term 1', 'Term 2', 'Term 3'] as const;

export const INTAKE_CHOICES = ['January', 'May', 'September'] as const;
