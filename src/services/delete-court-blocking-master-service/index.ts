import { ServiceMaker } from '@/types/service';
import { Input } from './delete-court-blocking-master-service';

import { DeleteCourtBlockingMasterServiceApi } from './delete-court-blocking-master-service-api';

export const makeDeleteCourtBlockingMasterService: ServiceMaker<Input> = () => {
  return new DeleteCourtBlockingMasterServiceApi();
};

export * from './delete-court-blocking-master-service-mock';
export * from './delete-court-blocking-master-service-api';
