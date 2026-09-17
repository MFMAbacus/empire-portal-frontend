import { ServiceMaker } from '@/types/service';
import { Input } from './create-court-operating-master-service';

import { CreateCourtOperatingMasterServiceApi } from './create-court-operating-master-service-api';

export const makeCreateCourtOperatingMasterService: ServiceMaker<Input> = () => {
  return new CreateCourtOperatingMasterServiceApi();
};

export * from './create-court-operating-master-service-mock';
export * from './create-court-operating-master-service-api';