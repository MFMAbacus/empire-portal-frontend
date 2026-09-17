import { ServiceMaker } from '@/types/service';
import { Input } from './delete-court-operating-master-service';

import { DeleteCourtOperatingMasterServiceApi } from './delete-court-operating-master-service-api';

export const makeDeleteCourtOperatingMasterService: ServiceMaker<Input> = () => {
  return new DeleteCourtOperatingMasterServiceApi();
};

export * from './delete-court-operating-master-service-mock';
export * from './delete-court-operating-master-service-api';
