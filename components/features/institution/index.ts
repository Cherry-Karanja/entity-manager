/**
 * Institution Features Index
 * 
 * Exports all institution-related entity configurations and API clients
 */

// Types
export * from './types';

// Departments
export { departmentsApiClient, departmentActions } from './departments/api/client';
export { departmentConfig } from './departments/config';

// Programmes
export { programmesApiClient } from './programmes/api/client';
export { programmeConfig } from './programmes/config';

// Class Groups
export { classGroupsApiClient, classGroupActions } from './class-groups/api/client';
export { classGroupConfig } from './class-groups/config';

// Academic Years
export { academicYearsApiClient, academicYearActions } from './academic-years/api/client';
export { academicYearConfig } from './academic-years/config';

// Terms
export { termsApiClient, termActions } from './terms/api/client';
export { termConfig } from './terms/config';

// Intakes
export { intakesApiClient, intakeActions } from './intakes/api/client';
export { intakeConfig } from './intakes/config';

// Units
export { unitsApiClient, unitActions } from './units/api/client';
export { unitConfig } from './units/config';

// Topics
export { topicsApiClient, topicActions } from './topics/api/client';
export { topicConfig } from './topics/config';

// Subtopics
export { subtopicsApiClient, subtopicActions } from './subtopics/api/client';
export { subtopicConfig } from './subtopics/config';

// Enrollments
export { enrollmentsApiClient, enrollmentActions } from './enrollments/api/client';
export { enrollmentConfig } from './enrollments/config';
