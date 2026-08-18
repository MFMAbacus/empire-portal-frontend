import {ServiceMaker} from '@/types/service';
import {Input} from './create-payment-service';

import {CreatePaymentServiceApi} from './create-payment-service-api';

export const makeCreatePaymentService: ServiceMaker<Input> = () => {
  return new CreatePaymentServiceApi();
};

export * from './create-payment-service-mock';
export * from './create-payment-service-api';
