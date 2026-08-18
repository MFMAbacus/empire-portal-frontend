import {ActivityRecord} from '@/types/activities';

import {activities} from '@/data/activities';

export const createActivity = (activity: ActivityRecord) => {
  return activities.records.push(activity);
};
