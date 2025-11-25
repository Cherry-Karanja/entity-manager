export * from "./api/client";
export * from "./config";

// Re-export API client with expected name
export { penaltyRuleApi as penaltyRuleClient } from "./api/client";
