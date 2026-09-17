import { ServiceMaker } from '@/types/service';
import { Input } from './create-court-blocking-master-service';

import { CreateCourtBlockingMasterServiceApi } from './create-court-blocking-master-service-api';

export const makeCreateCourtBlockingMasterService: ServiceMaker<Input> = () => {
  return new CreateCourtBlockingMasterServiceApi();
};

export * from './create-court-blocking-master-service-mock';
export * from './create-court-blocking-master-service-api';