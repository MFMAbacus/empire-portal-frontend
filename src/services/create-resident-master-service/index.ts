import { ServiceMaker } from '@/types/service';
import { Input } from './create-resident-master-service';

import { CreateResidentMasterServiceApi } from './create-resident-master-service-api';

export const makeCreateResidentMasterService: ServiceMaker<Input> = () => {
  return new CreateResidentMasterServiceApi();
};

export * from './create-resident-master-service-mock';
export * from './create-resident-master-service-api';