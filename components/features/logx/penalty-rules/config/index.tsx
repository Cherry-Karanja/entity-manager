export { penaltyRuleFields } from "./fields";
export { penaltyRuleColumns, penaltyRuleColumns as penaltyRuleListConfig } from "./list";
export { penaltyRuleViewConfig } from "./view";
export { penaltyRuleActionsConfig } from "./actions";
export { penaltyRuleExportConfig } from "./export";

import { penaltyRuleFields } from "./fields";
import { penaltyRuleColumns } from "./list";
import { penaltyRuleViewConfig } from "./view";
import { penaltyRuleActionsConfig } from "./actions";
import { penaltyRuleExportConfig } from "./export";

export const penaltyRuleConfig = {
  fields: penaltyRuleFields,
  columns: penaltyRuleColumns,
  view: penaltyRuleViewConfig,
  actions: penaltyRuleActionsConfig,
  export: penaltyRuleExportConfig,
};
