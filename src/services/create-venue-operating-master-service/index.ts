import { ServiceMaker } from '@/types/service';
import { Input } from './create-venue-operating-master-service';

import { CreateVenueOperatingMasterServiceApi } from './create-venue-operating-master-service-api';

export const makeCreateVenueOperatingMasterService: ServiceMaker<Input> = () => {
  return new CreateVenueOperatingMasterServiceApi();
};

export * from './create-venue-operating-master-service-mock';
export * from './create-venue-operating-master-service-api';