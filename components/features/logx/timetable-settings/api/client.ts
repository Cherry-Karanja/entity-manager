import { createHttpClient } from "@/components/entityManager";
import { TimetableSettings } from "../../types";

const BASE_PATH = "/api/v1/logx/timetabling/timetable-settings/";

export const timetableSettingsApi = createHttpClient<TimetableSettings>({
  endpoint: BASE_PATH,
});

export default timetableSettingsApi;
