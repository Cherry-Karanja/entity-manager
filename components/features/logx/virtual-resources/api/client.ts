import { createHttpClient } from "@/components/entityManager";
import { VirtualResource } from "../../types";

const BASE_PATH = "/api/v1/logx/timetabling/virtual-resources/";

export const virtualResourceApi = createHttpClient<VirtualResource>({
  endpoint: BASE_PATH,
});

// Custom actions
export const virtualResourceActions = {
  // Check availability of virtual resource
  checkAvailability: async (
    id: string | number,
    startTime: string,
    endTime: string,
    date: string
  ) => {
    return virtualResourceApi.customAction(id, 'check_availability', {
      start_time: startTime,
      end_time: endTime,
      date,
    });
  },
};

export default virtualResourceApi;
