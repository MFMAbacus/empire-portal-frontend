import {ServiceMaker} from '@/types/service';
import {Input} from './get-categories-service';

import {GetCategoriesServiceApi} from './get-categories-service-api';

export const makeGetCategoriesService: ServiceMaker<Input> = () => {
  return new GetCategoriesServiceApi();
};

export * from './get-categories-service-mock';
export * from './get-categories-service-api';
