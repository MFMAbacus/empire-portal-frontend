import {UnitRecord} from '@/types/units';

import {units} from '@/data/units';

export const getUnits = (): UnitRecord[] => {
  return units.records;
};
