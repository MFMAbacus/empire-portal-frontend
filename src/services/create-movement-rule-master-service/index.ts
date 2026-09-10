import { ServiceMaker } from '@/types/service';
import { Input } from './create-movement-rule-master-service';

import { CreateMovementRuleMasterServiceApi } from './create-movement-rule-master-service-api';

export const makeCreateMovementRuleMasterService: ServiceMaker<Input> = () => {
  return new CreateMovementRuleMasterServiceApi();
};

export * from './create-movement-rule-master-service-mock';
export * from './create-movement-rule-master-service-api';