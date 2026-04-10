import {ServiceMaker} from '@/types/service';
import {Input} from './get-projects-service';

import {GetProjectsServiceApi} from './get-projects-service-api';

export const makeGetProjectsService: ServiceMaker<Input> = () => {
  return new GetProjectsServiceApi();
};

export * from './get-projects-service-mock';
export * from './get-projects-service-api';
