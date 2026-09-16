import { ServiceMaker } from '@/types/service';
import { Input } from './get-court-master-service';

import { GetCourtMasterServiceApi } from './get-court-master-service-api';

export const makeGetCourtMasterService: ServiceMaker<Input> = () => {
  return new GetCourtMasterServiceApi();
};

export * from './get-court-master-service-mock';
export * from './get-court-master-service-api';
