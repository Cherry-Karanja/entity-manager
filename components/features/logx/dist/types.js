"use strict";
/**
 * Type definitions for logx module entities.
 * These types correspond to the Django models in the logx app.
 */
exports.__esModule = true;
exports.PERIOD_TYPE_LABELS = exports.RESOURCE_TYPE_LABELS = exports.ENTITY_TYPE_LABELS = exports.VIRTUAL_RESOURCE_TYPE_LABELS = exports.VIOLATION_TYPE_LABELS = exports.CONSTRAINT_TYPE_LABELS = exports.DAY_OF_WEEK_LABELS = exports.ROOM_TYPE_LABELS = void 0;
// =============================================================================
// Display Label Mappings
// =============================================================================
exports.ROOM_TYPE_LABELS = {
    classroom: 'Classroom',
    lecture_hall: 'Lecture Hall',
    lab: 'Laboratory',
    computer_lab: 'Computer Lab',
    auditorium: 'Auditorium',
    seminar_room: 'Seminar Room',
    office: 'Office',
    other: 'Other'
};
exports.DAY_OF_WEEK_LABELS = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
};
exports.CONSTRAINT_TYPE_LABELS = {
    room_availability: 'Room Availability',
    trainer_availability: 'Trainer Availability',
    class_group_availability: 'Class Group Availability',
    resource_conflict: 'Resource Conflict',
    time_restriction: 'Time Restriction',
    custom: 'Custom Constraint'
};
exports.VIOLATION_TYPE_LABELS = {
    room_conflict: 'Room Conflict',
    trainer_conflict: 'Trainer Conflict',
    time_overlap: 'Time Overlap',
    capacity_exceeded: 'Capacity Exceeded',
    preference_violation: 'Preference Violation',
    custom: 'Custom Violation'
};
exports.VIRTUAL_RESOURCE_TYPE_LABELS = {
    projector: 'Projector',
    computer_lab: 'Computer Lab',
    equipment: 'Special Equipment',
    software: 'Software License',
    other: 'Other'
};
exports.ENTITY_TYPE_LABELS = {
    class_group: 'Class Group',
    trainer: 'Trainer',
    room: 'Room',
    department: 'Department'
};
exports.RESOURCE_TYPE_LABELS = {
    room_hours: 'Room Hours',
    class_hours: 'Class Hours',
    equipment_usage: 'Equipment Usage',
    budget: 'Budget'
};
exports.PERIOD_TYPE_LABELS = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    term: 'Per Term',
    year: 'Per Year'
};
