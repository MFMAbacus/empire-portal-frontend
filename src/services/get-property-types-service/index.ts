import {ServiceMaker} from '@/types/service';
import {Input} from './get-property-types-service';

import {GetPropertyTypesServiceApi} from './get-property-types-service-api';

export const makeGetPropertyTypesService: ServiceMaker<Input> = () => {
  return new GetPropertyTypesServiceApi();
};

export * from './get-property-types-service-mock';
export * from './get-property-types-service-api';
