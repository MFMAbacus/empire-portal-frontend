import { ServiceMaker } from '@/types/service';
import { Input } from './get-restaurant-staff-master-service';

import { GetRestaurantStaffMasterServiceApi } from './get-restaurant-staff-master-service-api';

export const makeGetRestaurantStaffMasterService: ServiceMaker<Input> = () => {
  return new GetRestaurantStaffMasterServiceApi();
};

export * from './get-restaurant-staff-master-service-mock';
export * from './get-restaurant-staff-master-service-api';
