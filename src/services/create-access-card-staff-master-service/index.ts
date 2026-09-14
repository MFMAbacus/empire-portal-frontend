import { ServiceMaker } from '@/types/service';
import { Input } from './create-access-card-staff-master-service';

import { CreateAccessCardStaffMasterServiceApi } from './create-access-card-staff-master-service-api';

export const makeCreateAccessCardStaffMasterService: ServiceMaker<Input> = () => {
  return new CreateAccessCardStaffMasterServiceApi();
};

export * from './create-access-card-staff-master-service-mock';
export * from './create-access-card-staff-master-service-api';