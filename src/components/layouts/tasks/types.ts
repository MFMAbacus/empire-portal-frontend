import {TaskPriority, TaskStatus} from '@/types/task';

export type Filters = {
  id?: string;
  title?: string;
  category?: string;
  customer?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedTo?: string;
  minDate?: string;
  maxDate?: string;
  closeDate?: string;
  showArchived?: boolean;
  sortBy?: 'created-at' | 'priority';
  sortOrder?: 'asc' | 'desc';
};
