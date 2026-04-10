import {ServiceMaker} from '@/types/service';
import {Input} from './get-payments-service';

import {GetPaymentsServiceApi} from './get-payments-service-api';

export const makeGetPaymentsService: ServiceMaker<Input> = () => {
  return new GetPaymentsServiceApi();
};

export * from './get-payments-service-mock';
export * from './get-payments-service-api';
