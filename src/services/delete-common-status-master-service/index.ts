import { ServiceMaker } from '@/types/service';
import { Input } from './delete-common-status-master-service';

import { DeleteCommonStatusMasterServiceApi } from './delete-common-status-master-service-api';

export const makeDeleteCommonStatusMasterService: ServiceMaker<Input> = () => {
  return new DeleteCommonStatusMasterServiceApi();
};

export * from './delete-common-status-master-service-mock';
export * from './delete-common-status-master-service-api';
