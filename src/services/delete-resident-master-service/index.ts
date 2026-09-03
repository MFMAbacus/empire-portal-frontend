import { ServiceMaker } from '@/types/service';
import { Input } from './delete-resident-master-service';

import { DeleteResidentMasterServiceApi } from './delete-resident-master-service-api';

export const makeDeleteResidentMasterService: ServiceMaker<Input> = () => {
  return new DeleteResidentMasterServiceApi();
};

export * from './delete-resident-master-service-mock';
export * from './delete-resident-master-service-api';
