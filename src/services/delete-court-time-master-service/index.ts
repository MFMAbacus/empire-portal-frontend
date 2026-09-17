import { ServiceMaker } from '@/types/service';
import { Input } from './delete-court-time-master-service';

import { DeleteCourtTimeMasterServiceApi } from './delete-court-time-master-service-api';

export const makeDeleteCourtTimeMasterService: ServiceMaker<Input> = () => {
  return new DeleteCourtTimeMasterServiceApi();
};

export * from './delete-court-time-master-service-mock';
export * from './delete-court-time-master-service-api';
