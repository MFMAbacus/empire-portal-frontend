import { ServiceMaker } from '@/types/service';
import { Input } from './create-court-time-master-service';

import { CreateCourtTimeMasterServiceApi } from './create-court-time-master-service-api';

export const makeCreateCourtTimeMasterService: ServiceMaker<Input> = () => {
  return new CreateCourtTimeMasterServiceApi();
};

export * from './create-court-time-master-service-mock';
export * from './create-court-time-master-service-api';