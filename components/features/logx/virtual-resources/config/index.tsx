export { virtualResourceFields } from "./fields";
export { virtualResourceColumns, virtualResourceColumns as virtualResourceListConfig } from "./list";
export { virtualResourceViewConfig } from "./view";
export { virtualResourceActionsConfig } from "./actions";
export { virtualResourceExportConfig } from "./export";

import { virtualResourceFields } from "./fields";
import { virtualResourceColumns } from "./list";
import { virtualResourceViewConfig } from "./view";
import { virtualResourceActionsConfig } from "./actions";
import { virtualResourceExportConfig } from "./export";

export const virtualResourceConfig = {
  fields: virtualResourceFields,
  columns: virtualResourceColumns,
  view: virtualResourceViewConfig,
  actions: virtualResourceActionsConfig,
  export: virtualResourceExportConfig,
};
