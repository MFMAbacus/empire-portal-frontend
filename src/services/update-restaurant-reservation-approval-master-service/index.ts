import { ServiceMaker } from '@/types/service';
import { UpdateRestaurantReservationInput, UpdateRestaurantReservationApprovalMasterServiceApi } from './update-restaurant-reservation-approval-master-service-api';

export const makeUpdateRestaurantReservationApprovalMasterService: ServiceMaker<UpdateRestaurantReservationInput> = () => {
  return new UpdateRestaurantReservationApprovalMasterServiceApi();
};

export * from './update-restaurant-reservation-approval-master-service-api';
