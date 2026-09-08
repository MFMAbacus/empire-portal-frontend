import { ServiceMaker } from '@/types/service';
import { Input } from './create-guard-account-mapping-master-service';

import { CreateGuardAccountMappingMasterServiceApi } from './create-guard-account-mapping-master-service-api';

export const makeCreateGuardAccountMappingMasterService: ServiceMaker<Input> = () => {
  return new CreateGuardAccountMappingMasterServiceApi();
};

export * from './create-guard-account-mapping-master-service-mock';
export * from './create-guard-account-mapping-master-service-api';