import {ServiceMaker} from '@/types/service';
import {Input} from './get-salespersons-service';

import {GetSalespersonsServiceApi} from './get-salespersons-service-api';

export const makeGetSalespersonsService: ServiceMaker<Input> = () => {
  return new GetSalespersonsServiceApi();
};

export * from './get-salespersons-service-mock';
export * from './get-salespersons-service-api';
