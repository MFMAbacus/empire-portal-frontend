import { ServiceMaker } from '@/types/service';
import { Input } from './delete-guard-account-mapping-master-service';

import { DeleteGuardAccountMappingMasterServiceApi } from './delete-guard-account-mapping-master-service-api';

export const makeDeleteGuardAccountMappingMasterService: ServiceMaker<Input> = () => {
  return new DeleteGuardAccountMappingMasterServiceApi();
};

export * from './delete-guard-account-mapping-master-service-mock';
export * from './delete-guard-account-mapping-master-service-api';
