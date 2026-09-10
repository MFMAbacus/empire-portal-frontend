import { ServiceMaker } from '@/types/service';
import { Input } from './get-movement-rule-master-service';

import { GetMovementRuleMasterServiceApi } from './get-movement-rule-master-service-api';

export const makeGetMovementRuleMasterService: ServiceMaker<Input> = () => {
  return new GetMovementRuleMasterServiceApi();
};

export * from './get-movement-rule-master-service-mock';
export * from './get-movement-rule-master-service-api';
