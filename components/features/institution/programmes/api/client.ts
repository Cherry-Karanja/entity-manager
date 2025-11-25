/**
 * Programme API Client
 */

import { createHttpClient } from '@/components/entityManager';
import { Programme } from '../../types';

export const programmesApiClient = createHttpClient<Programme>({
  endpoint: '/api/v1/institution/programmes/',
});
