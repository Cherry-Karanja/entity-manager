import { createHttpClient } from '@/components/entityManager';
import { TimetableSettings } from '../../types';

const BASE_PATH = '/api/v1/timetabling/timetable-settings/';

const base = createHttpClient<TimetableSettings>({ endpoint: BASE_PATH });

export const timetableSettingsApi = {
  ...base,
};

export default timetableSettingsApi;
