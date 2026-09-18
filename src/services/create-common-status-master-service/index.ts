import { ServiceMaker } from '@/types/service';
import { Input } from './create-common-status-master-service';

import { CreateCommonStatusMasterServiceApi } from './create-common-status-master-service-api';

export const makeCreateCommonStatusMasterService: ServiceMaker<Input> = () => {
  return new CreateCommonStatusMasterServiceApi();
};

export * from './create-common-status-master-service-mock';
export * from './create-common-status-master-service-api';