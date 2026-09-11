import { ServiceMaker } from '@/types/service';
import { Input } from './delete-replacement-fee-master-service';

import { DeleteReplacementFeeMasterServiceApi } from './delete-replacement-fee-master-service-api';

export const makeDeleteReplacementFeeMasterService: ServiceMaker<Input> = () => {
  return new DeleteReplacementFeeMasterServiceApi();
};

export * from './delete-replacement-fee-master-service-mock';
export * from './delete-replacement-fee-master-service-api';
