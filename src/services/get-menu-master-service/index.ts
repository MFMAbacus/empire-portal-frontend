import { ServiceMaker } from '@/types/service';
import { Input } from './get-menu-master-service';

import { GetMenuMasterServiceApi } from './get-menu-master-service-api';

export const makeGetMenuMasterService: ServiceMaker<Input> = () => {
  return new GetMenuMasterServiceApi();
};

export * from './get-menu-master-service-mock';
export * from './get-menu-master-service-api';
