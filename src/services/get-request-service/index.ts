import {ServiceMaker} from '@/types/service';
import {Input} from './get-request-service';

import {GetRequestServiceApi} from './get-request-service-api';

export const makeGetRequestService: ServiceMaker<Input> = () => {
  return new GetRequestServiceApi();
};

export * from './get-request-service-mock';
export * from './get-request-service-api';
