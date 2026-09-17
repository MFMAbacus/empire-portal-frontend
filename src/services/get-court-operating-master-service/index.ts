import { ServiceMaker } from '@/types/service';
import { Input } from './get-court-operating-master-service';

import { GetCourtOperatingMasterServiceApi } from './get-court-operating-master-service-api';

export const makeGetCourtOperatingMasterService: ServiceMaker<Input> = () => {
  return new GetCourtOperatingMasterServiceApi();
};

export * from './get-court-operating-master-service-mock';
export * from './get-court-operating-master-service-api';
