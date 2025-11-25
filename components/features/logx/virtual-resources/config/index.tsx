export { virtualResourceFields } from "./fields";
export { virtualResourceColumns, virtualResourceColumns as virtualResourceListConfig } from "./list";
export { virtualResourceViewConfig } from "./view";
export { virtualResourceActions, virtualResourceActions as virtualResourceActionsConfig } from "./actions";
export { virtualResourceExportConfig } from "./export";

import { virtualResourceFields } from "./fields";
import { virtualResourceColumns } from "./list";
import { virtualResourceViewConfig } from "./view";
import { virtualResourceActions } from "./actions";
import { virtualResourceExportConfig } from "./export";

export const virtualResourceConfig = {
  fields: virtualResourceFields,
  columns: virtualResourceColumns,
  view: virtualResourceViewConfig,
  actions: virtualResourceActions,
  export: virtualResourceExportConfig,
};
