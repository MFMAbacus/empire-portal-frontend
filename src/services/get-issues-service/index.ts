import {ServiceMaker} from '@/types/service';
import {Input} from './get-issues-service';

import {GetIssuesServiceApi} from './get-issues-service-api';

export const makeGetIssuesService: ServiceMaker<Input> = () => {
  return new GetIssuesServiceApi();
};

export * from './get-issues-service-mock';
export * from './get-issues-service-api';
