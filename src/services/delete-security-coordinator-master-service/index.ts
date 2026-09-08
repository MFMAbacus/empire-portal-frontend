import { ServiceMaker } from '@/types/service';
import { Input } from './delete-security-coordinator-master-service';

import { DeleteSecurityCoordinatorMasterServiceApi } from './delete-security-coordinator-master-service-api';

export const makeDeleteSecurityCoordinatorMasterService: ServiceMaker<Input> = () => {
  return new DeleteSecurityCoordinatorMasterServiceApi();
};

export * from './delete-security-coordinator-master-service-mock';
export * from './delete-security-coordinator-master-service-api';
