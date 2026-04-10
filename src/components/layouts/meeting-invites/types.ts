import {TaskPriority} from '@/types/task';

export type Filters = {
  id?: string;
  subject?: string;
  date?: string;
  importance?: TaskPriority;
  showArchived?: boolean;
  sortBy?: 'date';
  sortOrder?: 'asc' | 'desc';
};
