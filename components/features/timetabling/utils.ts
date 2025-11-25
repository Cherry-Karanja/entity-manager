/**
 * Timetable Generation Utilities
 * 
 * Client-side utilities for timetable validation and constraint checking.
 * These complement the server-side Google OR-Tools optimization.
 */

import {
  ScheduleEntry,
  TimeSlot,
  Teacher,
  Room,
  ClassGroup,
  TimetableConflict,
  ConflictType,
  ConflictSeverity,
  DayOfWeek,
} from './types';

// ===========================
// Conflict Detection
// ===========================

/**
 * Detect conflicts in a set of schedule entries
 */
export function detectConflicts(
  schedules: ScheduleEntry[],
  teachers: Map<string | number, Teacher>,
  rooms: Map<string | number, Room>,
  classGroups: Map<string | number, ClassGroup>
): TimetableConflict[] {
  const conflicts: TimetableConflict[] = [];
  let conflictId = 1;

  // Group schedules by time slot for efficient conflict detection
  const schedulesBySlot = new Map<string | number, ScheduleEntry[]>();
  for (const schedule of schedules) {
    const key = schedule.time_slot;
    if (!schedulesBySlot.has(key)) {
      schedulesBySlot.set(key, []);
    }
    schedulesBySlot.get(key)!.push(schedule);
  }

  // Check each time slot for conflicts
  for (const [, slotSchedules] of schedulesBySlot) {
    // Teacher conflicts
    const teacherMap = new Map<string | number, ScheduleEntry[]>();
    for (const schedule of slotSchedules) {
      if (!teacherMap.has(schedule.teacher)) {
        teacherMap.set(schedule.teacher, []);
      }
      teacherMap.get(schedule.teacher)!.push(schedule);
    }

    for (const [teacherId, teacherSchedules] of teacherMap) {
      if (teacherSchedules.length > 1) {
        const teacher = teachers.get(teacherId);
        conflicts.push({
          id: conflictId++,
          timetable: teacherSchedules[0].timetable,
          conflict_type: 'teacher_double_booking' as ConflictType,
          severity: 'critical' as ConflictSeverity,
          description: `Teacher ${teacher?.full_name || teacherId} is double-booked`,
          affected_entries: teacherSchedules.map(s => s.id),
          affected_entities: [
            {
              entity_type: 'teacher',
              entity_id: teacherId,
              entity_name: teacher?.full_name || String(teacherId),
            },
          ],
          resolution_status: 'unresolved',
          created_at: new Date().toISOString(),
        });
      }
    }

    // Room conflicts
    const roomMap = new Map<string | number, ScheduleEntry[]>();
    for (const schedule of slotSchedules) {
      if (!roomMap.has(schedule.room)) {
        roomMap.set(schedule.room, []);
      }
      roomMap.get(schedule.room)!.push(schedule);
    }

    for (const [roomId, roomSchedules] of roomMap) {
      if (roomSchedules.length > 1) {
        const room = rooms.get(roomId);
        conflicts.push({
          id: conflictId++,
          timetable: roomSchedules[0].timetable,
          conflict_type: 'room_double_booking' as ConflictType,
          severity: 'critical' as ConflictSeverity,
          description: `Room ${room?.name || roomId} is double-booked`,
          affected_entries: roomSchedules.map(s => s.id),
          affected_entities: [
            {
              entity_type: 'room',
              entity_id: roomId,
              entity_name: room?.name || String(roomId),
            },
          ],
          resolution_status: 'unresolved',
          created_at: new Date().toISOString(),
        });
      }
    }

    // Class group conflicts
    const classMap = new Map<string | number, ScheduleEntry[]>();
    for (const schedule of slotSchedules) {
      if (!classMap.has(schedule.class_group)) {
        classMap.set(schedule.class_group, []);
      }
      classMap.get(schedule.class_group)!.push(schedule);
    }

    for (const [classId, classSchedules] of classMap) {
      if (classSchedules.length > 1) {
        const classGroup = classGroups.get(classId);
        conflicts.push({
          id: conflictId++,
          timetable: classSchedules[0].timetable,
          conflict_type: 'class_double_booking' as ConflictType,
          severity: 'critical' as ConflictSeverity,
          description: `Class ${classGroup?.name || classId} has multiple lessons scheduled`,
          affected_entries: classSchedules.map(s => s.id),
          affected_entities: [
            {
              entity_type: 'class_group',
              entity_id: classId,
              entity_name: classGroup?.name || String(classId),
            },
          ],
          resolution_status: 'unresolved',
          created_at: new Date().toISOString(),
        });
      }
    }
  }

  return conflicts;
}

// ===========================
// Schedule Validation
// ===========================

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Validate a schedule entry before saving
 */
export function validateScheduleEntry(
  entry: Partial<ScheduleEntry>,
  existingSchedules: ScheduleEntry[],
  teachers: Map<string | number, Teacher>,
  rooms: Map<string | number, Room>
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required field validation
  if (!entry.class_group) {
    errors.push({ field: 'class_group', message: 'Class is required', severity: 'error' });
  }
  if (!entry.subject) {
    errors.push({ field: 'subject', message: 'Subject is required', severity: 'error' });
  }
  if (!entry.teacher) {
    errors.push({ field: 'teacher', message: 'Teacher is required', severity: 'error' });
  }
  if (!entry.room) {
    errors.push({ field: 'room', message: 'Room is required', severity: 'error' });
  }
  if (!entry.time_slot) {
    errors.push({ field: 'time_slot', message: 'Time slot is required', severity: 'error' });
  }

  // Conflict checking (excluding the current entry if updating)
  const otherSchedules = existingSchedules.filter(s => s.id !== entry.id);
  const sameSslotSchedules = otherSchedules.filter(s => s.time_slot === entry.time_slot);

  // Check teacher availability
  if (entry.teacher && sameSslotSchedules.some(s => s.teacher === entry.teacher)) {
    const teacher = teachers.get(entry.teacher);
    errors.push({
      field: 'teacher',
      message: `${teacher?.full_name || 'Teacher'} is already scheduled for this time slot`,
      severity: 'error',
    });
  }

  // Check room availability
  if (entry.room && sameSslotSchedules.some(s => s.room === entry.room)) {
    const room = rooms.get(entry.room);
    errors.push({
      field: 'room',
      message: `${room?.name || 'Room'} is already booked for this time slot`,
      severity: 'error',
    });
  }

  // Check class availability
  if (entry.class_group && sameSslotSchedules.some(s => s.class_group === entry.class_group)) {
    errors.push({
      field: 'class_group',
      message: 'This class already has a lesson scheduled for this time slot',
      severity: 'error',
    });
  }

  // Check teacher-subject qualification
  if (entry.teacher && entry.subject) {
    const teacher = teachers.get(entry.teacher);
    if (teacher && teacher.subject_ids && !teacher.subject_ids.includes(entry.subject)) {
      errors.push({
        field: 'teacher',
        message: `${teacher.full_name} may not be qualified to teach this subject`,
        severity: 'warning',
      });
    }
  }

  return errors;
}

// ===========================
// Time Slot Utilities
// ===========================

/**
 * Get day of week display name
 */
export function getDayDisplayName(day: DayOfWeek): string {
  const dayNames: Record<DayOfWeek, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };
  return dayNames[day] || day;
}

/**
 * Get short day name
 */
export function getDayShortName(day: DayOfWeek): string {
  const dayNames: Record<DayOfWeek, string> = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
  };
  return dayNames[day] || day.substring(0, 3);
}

/**
 * Sort days of week in correct order
 */
export function sortDaysOfWeek(days: DayOfWeek[]): DayOfWeek[] {
  const order: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return days.sort((a, b) => order.indexOf(a) - order.indexOf(b));
}

/**
 * Format time slot for display
 */
export function formatTimeSlot(slot: TimeSlot): string {
  return `${getDayShortName(slot.day_of_week)} ${slot.start_time} - ${slot.end_time}`;
}

/**
 * Parse time string to minutes from midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Calculate duration in minutes between two times
 */
export function calculateDuration(startTime: string, endTime: string): number {
  return timeToMinutes(endTime) - timeToMinutes(startTime);
}

/**
 * Check if two time ranges overlap
 */
export function timesOverlap(
  start1: string, end1: string,
  start2: string, end2: string
): boolean {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);
  
  return s1 < e2 && s2 < e1;
}

// ===========================
// Teacher Workload Analysis
// ===========================

export interface WorkloadAnalysis {
  teacherId: string | number;
  teacherName: string;
  totalPeriods: number;
  periodsPerDay: Record<DayOfWeek, number>;
  maxConsecutive: number;
  subjectsCount: number;
  classesCount: number;
  utilizationPercentage: number;
  warnings: string[];
}

/**
 * Analyze teacher workload from schedule entries
 */
export function analyzeTeacherWorkload(
  teacherId: string | number,
  schedules: ScheduleEntry[],
  teacher: Teacher,
  timeSlots: Map<string | number, TimeSlot>,
  totalAvailableSlots: number
): WorkloadAnalysis {
  const teacherSchedules = schedules.filter(s => s.teacher === teacherId);
  const warnings: string[] = [];

  // Count periods per day
  const periodsPerDay: Record<DayOfWeek, number> = {
    monday: 0, tuesday: 0, wednesday: 0, thursday: 0,
    friday: 0, saturday: 0, sunday: 0,
  };

  for (const schedule of teacherSchedules) {
    periodsPerDay[schedule.day_of_week]++;
  }

  // Check max periods per day constraint
  for (const [day, count] of Object.entries(periodsPerDay)) {
    if (count > teacher.max_periods_per_day) {
      warnings.push(
        `${getDayDisplayName(day as DayOfWeek)}: ${count} periods exceeds max of ${teacher.max_periods_per_day}`
      );
    }
  }

  // Calculate max consecutive periods
  let maxConsecutive = 0;
  const days = Object.keys(periodsPerDay) as DayOfWeek[];
  
  for (const day of days) {
    const daySchedules = teacherSchedules
      .filter(s => s.day_of_week === day)
      .sort((a, b) => a.slot_number - b.slot_number);

    let consecutive = 1;
    let maxForDay = 1;

    for (let i = 1; i < daySchedules.length; i++) {
      if (daySchedules[i].slot_number === daySchedules[i - 1].slot_number + 1) {
        consecutive++;
        maxForDay = Math.max(maxForDay, consecutive);
      } else {
        consecutive = 1;
      }
    }

    maxConsecutive = Math.max(maxConsecutive, maxForDay);
  }

  if (maxConsecutive > teacher.max_consecutive_periods) {
    warnings.push(
      `Has ${maxConsecutive} consecutive periods, exceeds max of ${teacher.max_consecutive_periods}`
    );
  }

  // Count unique subjects and classes
  const subjects = new Set(teacherSchedules.map(s => s.subject));
  const classes = new Set(teacherSchedules.map(s => s.class_group));

  // Calculate utilization
  const utilizationPercentage = totalAvailableSlots > 0
    ? (teacherSchedules.length / totalAvailableSlots) * 100
    : 0;

  return {
    teacherId,
    teacherName: teacher.full_name,
    totalPeriods: teacherSchedules.length,
    periodsPerDay,
    maxConsecutive,
    subjectsCount: subjects.size,
    classesCount: classes.size,
    utilizationPercentage,
    warnings,
  };
}

// ===========================
// Room Utilization Analysis
// ===========================

export interface RoomAnalysis {
  roomId: string | number;
  roomName: string;
  totalSlots: number;
  occupiedSlots: number;
  utilizationPercentage: number;
  peakDays: DayOfWeek[];
  subjectsHeld: string[];
}

/**
 * Analyze room utilization from schedule entries
 */
export function analyzeRoomUtilization(
  roomId: string | number,
  schedules: ScheduleEntry[],
  room: Room,
  totalAvailableSlots: number
): RoomAnalysis {
  const roomSchedules = schedules.filter(s => s.room === roomId);

  // Count by day
  const usageByDay: Record<DayOfWeek, number> = {
    monday: 0, tuesday: 0, wednesday: 0, thursday: 0,
    friday: 0, saturday: 0, sunday: 0,
  };

  const subjects = new Set<string>();

  for (const schedule of roomSchedules) {
    usageByDay[schedule.day_of_week]++;
    if (schedule.subject_name) {
      subjects.add(schedule.subject_name);
    }
  }

  // Find peak days
  const maxUsage = Math.max(...Object.values(usageByDay));
  const peakDays = (Object.entries(usageByDay) as [DayOfWeek, number][])
    .filter(([, count]) => count === maxUsage && count > 0)
    .map(([day]) => day);

  return {
    roomId,
    roomName: room.name,
    totalSlots: totalAvailableSlots,
    occupiedSlots: roomSchedules.length,
    utilizationPercentage: totalAvailableSlots > 0
      ? (roomSchedules.length / totalAvailableSlots) * 100
      : 0,
    peakDays,
    subjectsHeld: Array.from(subjects),
  };
}

// ===========================
// Grid View Helpers
// ===========================

export interface TimetableGrid {
  days: DayOfWeek[];
  slots: TimeSlot[];
  cells: Map<string, ScheduleEntry | null>;
}

/**
 * Build a timetable grid for a specific class or teacher
 */
export function buildTimetableGrid(
  schedules: ScheduleEntry[],
  timeSlots: TimeSlot[],
  days: DayOfWeek[]
): TimetableGrid {
  const cells = new Map<string, ScheduleEntry | null>();

  // Initialize all cells as null
  for (const day of days) {
    for (const slot of timeSlots) {
      if (slot.day_of_week === day) {
        const key = `${day}-${slot.id}`;
        cells.set(key, null);
      }
    }
  }

  // Populate with schedules
  for (const schedule of schedules) {
    const key = `${schedule.day_of_week}-${schedule.time_slot}`;
    cells.set(key, schedule);
  }

  // Sort slots by slot number
  const sortedSlots = [...timeSlots].sort((a, b) => {
    if (a.day_of_week === b.day_of_week) {
      return a.slot_number - b.slot_number;
    }
    return 0;
  });

  return {
    days: sortDaysOfWeek(days),
    slots: sortedSlots,
    cells,
  };
}

/**
 * Get unique time slots (ignoring day) for grid header
 */
export function getUniqueTimeSlots(timeSlots: TimeSlot[]): TimeSlot[] {
  const seen = new Set<number>();
  const unique: TimeSlot[] = [];

  for (const slot of timeSlots) {
    if (!seen.has(slot.slot_number)) {
      seen.add(slot.slot_number);
      unique.push(slot);
    }
  }

  return unique.sort((a, b) => a.slot_number - b.slot_number);
}
