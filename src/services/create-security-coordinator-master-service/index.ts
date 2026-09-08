import { ServiceMaker } from '@/types/service';
import { Input } from './create-security-coordinator-master-service';

import { CreateSecurityCoordinatorMasterServiceApi } from './create-security-coordinator-master-service-api';

export const makeCreateSecurityCoordinatorMasterService: ServiceMaker<Input> = () => {
  return new CreateSecurityCoordinatorMasterServiceApi();
};

export * from './create-security-coordinator-master-service-mock';
export * from './create-security-coordinator-master-service-api';