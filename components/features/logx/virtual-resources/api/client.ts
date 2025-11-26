import { createHttpClient } from '@/components/entityManager';
import { authApi } from '@/components/connectionManager/http/client';
import { VirtualResource } from '../../types';

const BASE_PATH = '/api/v1/logx/timetabling/virtual-resources/';

const base = createHttpClient<VirtualResource>({ endpoint: BASE_PATH });

export const virtualResourceApi = {
  ...base,

  // Custom action: Check availability of virtual resource
  async checkAvailability(
    id: string | number,
    startTime: string,
    endTime: string,
    date: string
  ) {
    const response = await authApi.post(`${BASE_PATH}${id}/check_availability/`, {
      start_time: startTime,
      end_time: endTime,
      date,
    });

    return response.data;
  },
};

export default virtualResourceApi;
