import { httpClient } from "@/components/connectionManager/http";
import { TimetableSettings } from "../../types";

const BASE_PATH = "/api/v1/logx/timetabling/timetable-settings/";

export const timetableSettingsApi = {
  list: async (params?: Record<string, unknown>) => {
    const response = await httpClient.get<{ results: TimetableSettings[]; count: number }>(
      BASE_PATH,
      params
    );
    return response;
  },

  get: async (id: string | number) => {
    const response = await httpClient.get<TimetableSettings>(`${BASE_PATH}${id}/`);
    return response;
  },

  create: async (data: Partial<TimetableSettings>) => {
    const response = await httpClient.post<TimetableSettings>(BASE_PATH, data);
    return response;
  },

  update: async (id: string | number, data: Partial<TimetableSettings>) => {
    const response = await httpClient.patch<TimetableSettings>(`${BASE_PATH}${id}/`, data);
    return response;
  },

  delete: async (id: string | number) => {
    await httpClient.delete(`${BASE_PATH}${id}/`);
  },
};

export default timetableSettingsApi;
