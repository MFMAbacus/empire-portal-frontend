import { ServiceMaker } from '@/types/service';
import { Input } from './create-court-master-service';

import { CreateCourtMasterServiceApi } from './create-court-master-service-api';

export const makeCreateCourtMasterService: ServiceMaker<Input> = () => {
  return new CreateCourtMasterServiceApi();
};

export * from './create-court-master-service-mock';
export * from './create-court-master-service-api';