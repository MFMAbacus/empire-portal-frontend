import { ServiceMaker } from '@/types/service';
import { GetRestaurantReservationInput, GetRestaurantReservationApprovalMasterServiceApi } from './get-restaurant-reservation-approval-master-service-api';

export const makeGetRestaurantReservationApprovalMasterService: ServiceMaker<GetRestaurantReservationInput> = () => {
  return new GetRestaurantReservationApprovalMasterServiceApi();
};

export * from './get-restaurant-reservation-approval-master-service-api';
