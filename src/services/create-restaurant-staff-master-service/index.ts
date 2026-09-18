import { ServiceMaker } from '@/types/service';
import { Input } from './create-restaurant-staff-master-service';

import { CreateRestaurantStaffMasterServiceApi } from './create-restaurant-staff-master-service-api';

export const makeCreateRestaurantStaffMasterService: ServiceMaker<Input> = () => {
  return new CreateRestaurantStaffMasterServiceApi();
};

export * from './create-restaurant-staff-master-service-mock';
export * from './create-restaurant-staff-master-service-api';