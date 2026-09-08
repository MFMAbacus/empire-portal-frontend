import { ServiceMaker } from '@/types/service';
import { Input } from './get-security-coordinator-master-service';

import { GetSecurityCoordinatorMasterServiceApi } from './get-security-coordinator-master-service-api';

export const makeGetSecurityCoordinatorMasterService: ServiceMaker<Input> = () => {
  return new GetSecurityCoordinatorMasterServiceApi();
};

export * from './get-security-coordinator-master-service-mock';
export * from './get-security-coordinator-master-service-api';
