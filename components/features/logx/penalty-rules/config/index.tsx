export { penaltyRuleFields } from "./fields";
export { penaltyRuleColumns, penaltyRuleColumns as penaltyRuleListConfig } from "./list";
export { penaltyRuleViewConfig } from "./view";
export { penaltyRuleActions, penaltyRuleActions as penaltyRuleActionsConfig } from "./actions";
export { penaltyRuleExportConfig } from "./export";

import { penaltyRuleFields } from "./fields";
import { penaltyRuleColumns } from "./list";
import { penaltyRuleViewConfig } from "./view";
import { penaltyRuleActions } from "./actions";
import { penaltyRuleExportConfig } from "./export";

export const penaltyRuleConfig = {
  fields: penaltyRuleFields,
  columns: penaltyRuleColumns,
  view: penaltyRuleViewConfig,
  actions: penaltyRuleActions,
  export: penaltyRuleExportConfig,
};
