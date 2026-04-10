import {StaffRecord} from '@/types/staff';
import {CustomerRecord} from '@/types//customers';

export type ActivityTypeRecord = {
  id: string;
  label: string;
};

export type ActivityPriorityRecord = {
  id: string;
  label: string;
};

export type ActivityStatusRecord = {
  id: string;
  label: string;
};

export type ActivityCategoryRecord = {
  id: string;
  label: string;
};

export type ActivityRecord = {
  id: string;
  typeId: string;
  categoryId: string;
  priorityId: string;
  customerId: string | null;
  statusId: string;
  assigendToId: string | null;
  subject: string;
  description: string | null;
  entryContact: string | null;
  visitDate: string | null;
  dueDate: string | null;
  projectId: string | null;
  unitId: string | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CompoundActivityRecord = ActivityRecord & {
  type: ActivityTypeRecord;
  category: ActivityCategoryRecord;
  priority: ActivityPriorityRecord;
  customer: CustomerRecord | null;
  status: ActivityStatusRecord;
  assignedTo: StaffRecord | null;
};
