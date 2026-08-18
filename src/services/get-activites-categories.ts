import {ActivityCategoryRecord} from '@/types/activities';

import {activitiesCategories} from '@/data/activities';

export const getActivitiesCategories = (): ActivityCategoryRecord[] => {
  return activitiesCategories.records;
};
