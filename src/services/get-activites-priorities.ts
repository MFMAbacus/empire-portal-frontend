import {ActivityPriorityRecord} from '@/types/activities';

import {activitiesPriorities} from '@/data/activities';

export const getActivitiesPriorities = (): ActivityPriorityRecord[] => {
  return activitiesPriorities.records;
};
