export { timetableSettingsFields, timetableSettingsFields as timetableSettingFields } from "./fields";
export { timetableSettingsColumns, timetableSettingsColumns as timetableSettingListConfig } from "./list";
export { timetableSettingsViewConfig, timetableSettingsViewConfig as timetableSettingViewConfig } from "./view";
export { timetableSettingsActions, timetableSettingsActions as timetableSettingActionsConfig } from "./actions";
export { timetableSettingsExportConfig, timetableSettingsExportConfig as timetableSettingExportConfig } from "./export";

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
