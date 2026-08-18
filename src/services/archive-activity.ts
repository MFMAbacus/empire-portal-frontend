import {activities} from '@/data/activities';

type ArchiveActivity = {
  activityId: string;
};

export const archiveActivity = ({
  activityId,
}: ArchiveActivity) => {
  activities.records = activities.records.filter((activity) => {
    return activity.id !== activityId;
  });
};
