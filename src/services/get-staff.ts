import {StaffRecord} from '@/types/staff';

import {staff} from '@/data/staff';

export const getStaff = (): StaffRecord[] => {
  return staff.records;
};
