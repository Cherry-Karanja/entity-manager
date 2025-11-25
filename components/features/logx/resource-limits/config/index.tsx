export { resourceLimitFields } from "./fields";
export { resourceLimitListConfig } from "./list";
export { resourceLimitViewConfig } from "./view";
export { resourceLimitActionsConfig } from "./actions";
export { resourceLimitExportConfig } from "./export";

import { resourceLimitFields } from "./fields";
import { resourceLimitListConfig } from "./list";
import { resourceLimitViewConfig } from "./view";
import { resourceLimitActionsConfig } from "./actions";
import { resourceLimitExportConfig } from "./export";

// Combined config object for EntityManager
export const resourceLimitConfig = {
  fields: resourceLimitFields,
  list: resourceLimitListConfig,
  view: resourceLimitViewConfig,
  actions: resourceLimitActionsConfig,
  export: resourceLimitExportConfig,
};
