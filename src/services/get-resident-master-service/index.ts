import { ServiceMaker } from '@/types/service';
import { Input } from './get-resident-master-service';

import { GetResidentMasterServiceApi } from './get-resident-master-service-api';

export const makeGetResidentMasterService: ServiceMaker<Input> = () => {
  return new GetResidentMasterServiceApi();
};

export * from './get-resident-master-service-mock';
export * from './get-resident-master-service-api';
