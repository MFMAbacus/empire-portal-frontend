import { ServiceMaker } from '@/types/service';
import { Input } from './get-court-blocking-master-service';

import { GetCourtBlockingMasterServiceApi } from './get-court-blocking-master-service-api';

export const makeGetCourtBlockingMasterService: ServiceMaker<Input> = () => {
  return new GetCourtBlockingMasterServiceApi();
};

export * from './get-court-blocking-master-service-mock';
export * from './get-court-blocking-master-service-api';
