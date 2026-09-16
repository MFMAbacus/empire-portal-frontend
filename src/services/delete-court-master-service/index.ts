import { ServiceMaker } from '@/types/service';
import { Input } from './delete-court-master-service';

import { DeleteCourtMasterServiceApi } from './delete-court-master-service-api';

export const makeDeleteCourtMasterService: ServiceMaker<Input> = () => {
  return new DeleteCourtMasterServiceApi();
};

export * from './delete-court-master-service-mock';
export * from './delete-court-master-service-api';
