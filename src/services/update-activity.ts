import {ActivityRecord} from '@/types/activities';

import {activities} from '@/data/activities';

type UpdateActivityArgs = {
  activityId: string;
  activity: ActivityRecord;
};

export const updateActivity = ({
  activityId,
  activity,
}: UpdateActivityArgs) => {
  activities.records = activities.records.map((current) => {
    if (current.id !== activityId) {
      return current;
    }
    return activity;
  });
};
