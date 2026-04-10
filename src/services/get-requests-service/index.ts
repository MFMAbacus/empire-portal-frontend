import {ServiceMaker} from '@/types/service';
import {Input} from './get-requests-service';

import {GetRequestsServiceApi} from './get-requests-service-api';

export const makeGetRequestsService: ServiceMaker<Input> = () => {
  return new GetRequestsServiceApi();
};

export * from './get-requests-service-mock';
export * from './get-requests-service-api';
