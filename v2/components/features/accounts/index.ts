// ===== ACCOUNTS FEATURE CONFIGS =====

import userConfig from './configs/user/index'
import userRoleConfig from './configs/userRole/index'
import userProfileConfig from './configs/userProfile/index'
import userSessionConfig from './configs/userSession/index'
import loginAttemptConfig from './configs/loginAttempt/index'
import userRoleHistoryConfig from './configs/userRoleHistory/index'

// Entity configurations
export { userConfig, userRoleConfig, userProfileConfig, userSessionConfig, loginAttemptConfig, userRoleHistoryConfig }

// Type exports
export * from './types'

// Re-export entity configs for easy access
export const accountsEntityConfigs = {
  user: userConfig,
  userRole: userRoleConfig,
  userProfile: userProfileConfig,
  userSession: userSessionConfig,
  loginAttempt: loginAttemptConfig,
  userRoleHistory: userRoleHistoryConfig
}