import { ServiceMaker } from '@/types/service';
import { Input } from './get-guard-account-mapping-master-service';

import { GetGuardAccountMappingMasterServiceApi } from './get-guard-account-mapping-master-service-api';

export const makeGetGuardAccountMappingMasterService: ServiceMaker<Input> = () => {
  return new GetGuardAccountMappingMasterServiceApi();
};

export * from './get-guard-account-mapping-master-service-mock';
export * from './get-guard-account-mapping-master-service-api';
