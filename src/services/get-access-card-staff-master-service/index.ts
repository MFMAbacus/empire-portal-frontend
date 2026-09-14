import { ServiceMaker } from '@/types/service';
import { Input } from './get-access-card-staff-master-service';

import { GetAccessCardStaffMasterServiceApi } from './get-access-card-staff-master-service-api';

export const makeGetAccessCardStaffMasterService: ServiceMaker<Input> = () => {
  return new GetAccessCardStaffMasterServiceApi();
};

export * from './get-access-card-staff-master-service-mock';
export * from './get-access-card-staff-master-service-api';
