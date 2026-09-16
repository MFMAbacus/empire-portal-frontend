import { ServiceMaker } from '@/types/service';
import { Input } from './create-menu-master-service';

import { CreateMenuMasterServiceApi } from './create-menu-master-service-api';

export const makeCreateMenuMasterService: ServiceMaker<Input> = () => {
  return new CreateMenuMasterServiceApi();
};

export * from './create-menu-master-service-mock';
export * from './create-menu-master-service-api';