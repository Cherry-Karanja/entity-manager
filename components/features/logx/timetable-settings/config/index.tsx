export { timetableSettingsFields } from "./fields";
export { timetableSettingsColumns } from "./list";
export { timetableSettingsViewConfig } from "./view";
export { timetableSettingsActions } from "./actions";
export { timetableSettingsExportConfig } from "./export";

import { timetableSettingsFields } from "./fields";
import { timetableSettingsColumns } from "./list";
import { timetableSettingsViewConfig } from "./view";
import { timetableSettingsActions } from "./actions";
import { timetableSettingsExportConfig } from "./export";

export const timetableSettingsConfig = {
  fields: timetableSettingsFields,
  columns: timetableSettingsColumns,
  view: timetableSettingsViewConfig,
  actions: timetableSettingsActions,
  export: timetableSettingsExportConfig,
};
