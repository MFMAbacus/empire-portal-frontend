import { ServiceMaker } from '@/types/service';
import { Input } from './get-common-status-master-service';

import { GetCommonStatusMasterServiceApi } from './get-common-status-master-service-api';

export const makeGetCommonStatusMasterService: ServiceMaker<Input> = () => {
  return new GetCommonStatusMasterServiceApi();
};

export * from './get-common-status-master-service-mock';
export * from './get-common-status-master-service-api';
