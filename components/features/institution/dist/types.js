"use strict";
/**
 * Institution Module Types
 *
 * Type definitions for the institution module based on Django backend models.
 * Covers institution_core (departments, programmes, class_groups, academic_cycles)
 * and academics (units, topics, subtopics, enrollments).
 */
exports.__esModule = true;
exports.INTAKE_CHOICES = exports.TERM_CHOICES = exports.ENROLLMENT_STATUS_LABELS = exports.TIME_OF_DAY_LABELS = exports.SESSION_TYPE_LABELS = exports.ROOM_TYPE_LABELS = void 0;
// ===========================
// Display Name Mappings
// ===========================
exports.ROOM_TYPE_LABELS = {
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
    microbiology_lab: 'Microbiology Lab'
};
exports.SESSION_TYPE_LABELS = {
    theory: 'Theory Only',
    practical: 'Practical Only',
    both: 'Theory and Practical'
};
exports.TIME_OF_DAY_LABELS = {
    any: 'No Preference',
    morning: 'Prefer Morning',
    afternoon: 'Prefer Afternoon',
    evening: 'Prefer Evening'
};
exports.ENROLLMENT_STATUS_LABELS = {
    scheduled: 'Scheduled',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled'
};
exports.TERM_CHOICES = ['Term 1', 'Term 2', 'Term 3'];
exports.INTAKE_CHOICES = ['January', 'May', 'September'];
