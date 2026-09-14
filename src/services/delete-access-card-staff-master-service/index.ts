import { ServiceMaker } from '@/types/service';
import { Input } from './delete-access-card-staff-master-service';

import { DeleteAccessCardStaffMasterServiceApi } from './delete-access-card-staff-master-service-api';

export const makeDeleteAccessCardStaffMasterService: ServiceMaker<Input> = () => {
  return new DeleteAccessCardStaffMasterServiceApi();
};

export * from './delete-access-card-staff-master-service-mock';
export * from './delete-access-card-staff-master-service-api';
