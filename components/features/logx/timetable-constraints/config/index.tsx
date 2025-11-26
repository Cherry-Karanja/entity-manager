export { timetableConstraintFields } from "./fields";
export { timetableConstraintColumns, timetableConstraintColumns as timetableConstraintListConfig } from "./list";
export { timetableConstraintViewConfig } from "./view";
export { timetableConstraintActionsConfig } from "./actions";
export { timetableConstraintExportConfig } from "./export";

import { timetableConstraintFields } from "./fields";
import { timetableConstraintColumns } from "./list";
import { timetableConstraintViewConfig } from "./view";
import { timetableConstraintActionsConfig } from "./actions";
import { timetableConstraintExportConfig } from "./export";

export const timetableConstraintConfig = {
  fields: timetableConstraintFields,
  columns: timetableConstraintColumns,
  view: timetableConstraintViewConfig,
  actions: timetableConstraintActionsConfig,
  export: timetableConstraintExportConfig,
};
