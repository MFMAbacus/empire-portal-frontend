import {ServiceMaker} from '@/types/service';
import {Input} from './get-items-service';

import {GetItemsServiceApi} from './get-items-service-api';

export const makeGetItemsService: ServiceMaker<Input> = () => {
  return new GetItemsServiceApi();
};

export * from './get-items-service-mock';
export * from './get-items-service-api';
