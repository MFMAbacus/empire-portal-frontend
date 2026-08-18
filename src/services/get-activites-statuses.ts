import {ActivityStatusRecord} from '@/types/activities';

import {activitiesStatuses} from '@/data/activities';

export const getActivitiesStatuses = (): ActivityStatusRecord[] => {
  return activitiesStatuses.records;
};
