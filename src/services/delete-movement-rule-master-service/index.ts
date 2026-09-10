import { ServiceMaker } from '@/types/service';
import { Input } from './delete-movement-rule-master-service';

import { DeleteMovementRuleMasterServiceApi } from './delete-movement-rule-master-service-api';

export const makeDeleteMovementRuleMasterService: ServiceMaker<Input> = () => {
  return new DeleteMovementRuleMasterServiceApi();
};

export * from './delete-movement-rule-master-service-mock';
export * from './delete-movement-rule-master-service-api';
