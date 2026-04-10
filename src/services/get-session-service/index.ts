import {ServiceMaker} from '@/types/service';
import {Input} from './get-session-service';

import {GetSessionServiceApi} from './get-session-service-api';

export const makeGetSessionService: ServiceMaker<Input> = () => {
  return new GetSessionServiceApi();
};

export * from './get-session-service-mock';
export * from './get-session-service-api';
