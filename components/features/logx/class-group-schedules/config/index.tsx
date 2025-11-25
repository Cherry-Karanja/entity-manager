export { classGroupScheduleFields } from "./fields";
export { classGroupScheduleColumns, classGroupScheduleColumns as classGroupScheduleListConfig } from "./list";
export { classGroupScheduleViewConfig } from "./view";
export { classGroupScheduleActions, classGroupScheduleActions as classGroupScheduleActionsConfig } from "./actions";
export { classGroupScheduleExportConfig } from "./export";

import { classGroupScheduleFields } from "./fields";
import { classGroupScheduleColumns } from "./list";
import { classGroupScheduleViewConfig } from "./view";
import { classGroupScheduleActions } from "./actions";
import { classGroupScheduleExportConfig } from "./export";

export const classGroupScheduleConfig = {
  fields: classGroupScheduleFields,
  columns: classGroupScheduleColumns,
  view: classGroupScheduleViewConfig,
  actions: classGroupScheduleActions,
  export: classGroupScheduleExportConfig,
};
