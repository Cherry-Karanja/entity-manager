// ===== V3 ENTITY CONFIGS - CENTRALIZED EXPORTS =====

export { userConfig as userEntityConfig } from './user'
export { loginAttemptConfig as loginAttemptEntityConfig } from './loginAttempt'
export { userProfileConfig as userProfileEntityConfig } from './userProfile'
export { userRoleConfig as userRoleEntityConfig } from './userRole'
export { userRoleHistoryConfig as userRoleHistoryEntityConfig } from './userRoleHistory'
export { userSessionConfig as userSessionEntityConfig } from './userSession'

// Re-export types
export type { User as UserEntity } from '../types/user.types'
export type { LoginAttempt as LoginAttemptEntity } from '../types/loginAttempt.types'
export type { UserProfile as UserProfileEntity } from '../types/userProfile.types'
export type { UserRole as UserRoleEntity } from '../types/userRole.types'
export type { UserRoleHistory as UserRoleHistoryEntity } from '../types/userRoleHistory.types'
export type { UserSession as UserSessionEntity } from '../types/userSession.types'
