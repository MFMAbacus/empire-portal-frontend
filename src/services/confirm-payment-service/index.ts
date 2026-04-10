import {ServiceMaker} from '@/types/service';
import {Input} from './confirm-payment-service';

import {ConfirmPaymentServiceApi} from './confirm-payment-service-api';

export const makeConfirmPaymentService: ServiceMaker<Input> = () => {
  return new ConfirmPaymentServiceApi();
};

export * from './confirm-payment-service-mock';
export * from './confirm-payment-service-api';
