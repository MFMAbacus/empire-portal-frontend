import { ServiceMaker } from '@/types/service';
import { Input } from './get-venue-operating-master-service';

import { GetVenueOperatingMasterServiceApi } from './get-venue-operating-master-service-api';

export const makeGetVenueOperatingMasterService: ServiceMaker<Input> = () => {
  return new GetVenueOperatingMasterServiceApi();
};

export * from './get-venue-operating-master-service-mock';
export * from './get-venue-operating-master-service-api';
