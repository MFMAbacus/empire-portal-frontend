import { ServiceMaker } from '@/types/service';
import { Input } from './get-court-time-master-service';

import { GetCourtTimeMasterServiceApi } from './get-court-time-master-service-api';

export const makeGetCourtTimeMasterService: ServiceMaker<Input> = () => {
  return new GetCourtTimeMasterServiceApi();
};

export * from './get-court-time-master-service-mock';
export * from './get-court-time-master-service-api';
