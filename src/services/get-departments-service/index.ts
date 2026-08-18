import {ServiceMaker} from '@/types/service';
import {Input} from './get-departments-service';

import {GetDepartmentsServiceApi} from './get-departments-service-api';

export const makeGetDepartmentsService: ServiceMaker<Input> = () => {
  return new GetDepartmentsServiceApi();
};

export * from './get-departments-service-mock';
export * from './get-departments-service-api';
