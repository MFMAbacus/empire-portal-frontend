import {ActivityTypeRecord} from '@/types/activities';

import {activitiesTypes} from '@/data/activities';

export const getActivitiesTypes = (): ActivityTypeRecord[] => {
  return activitiesTypes.records;
};
