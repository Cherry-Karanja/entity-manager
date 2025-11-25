import { httpClient } from "@/components/connectionManager/http";
import { VirtualResource } from "../../types";

const BASE_PATH = "/api/v1/logx/timetabling/virtual-resources/";

export const virtualResourceApi = {
  list: async (params?: Record<string, unknown>) => {
    const response = await httpClient.get<{ results: VirtualResource[]; count: number }>(
      BASE_PATH,
      params
    );
    return response;
  },

  get: async (id: string | number) => {
    const response = await httpClient.get<VirtualResource>(`${BASE_PATH}${id}/`);
    return response;
  },

  create: async (data: Partial<VirtualResource>) => {
    const response = await httpClient.post<VirtualResource>(BASE_PATH, data);
    return response;
  },

  update: async (id: string | number, data: Partial<VirtualResource>) => {
    const response = await httpClient.patch<VirtualResource>(`${BASE_PATH}${id}/`, data);
    return response;
  },

  delete: async (id: string | number) => {
    await httpClient.delete(`${BASE_PATH}${id}/`);
  },

  // Custom action: Check availability of virtual resource
  checkAvailability: async (
    id: string | number,
    startTime: string,
    endTime: string,
    date: string
  ) => {
    const response = await httpClient.post<{
      resource_id: number;
      resource_name: string;
      is_available: boolean;
      availability_windows: Array<{
        start_time: string;
        end_time: string;
        status: string;
      }>;
      conflicts: Array<{
        schedule_id: number;
        class_group_name: string;
        start_time: string;
        end_time: string;
      }>;
    }>(`${BASE_PATH}${id}/check_availability/`, {
      start_time: startTime,
      end_time: endTime,
      date,
    });
    return response;
  },
};
