import { ServiceMaker } from '@/types/service';
import { Input } from './delete-restaurant-staff-master-service';

import { DeleteRestaurantStaffMasterServiceApi } from './delete-restaurant-staff-master-service-api';

export const makeDeleteRestaurantStaffMasterService: ServiceMaker<Input> = () => {
  return new DeleteRestaurantStaffMasterServiceApi();
};

export * from './delete-restaurant-staff-service-mock';
export * from './delete-restaurant-staff-master-service-api';
