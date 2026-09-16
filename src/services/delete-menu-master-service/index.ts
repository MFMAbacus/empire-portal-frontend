import { ServiceMaker } from '@/types/service';
import { Input } from './delete-menu-master-service';

import { DeleteMenuMasterServiceApi } from './delete-menu-master-service-api';

export const makeDeleteMenuMasterService: ServiceMaker<Input> = () => {
  return new DeleteMenuMasterServiceApi();
};

export * from './delete-menu-master-service-mock';
export * from './delete-menu-master-service-api';
