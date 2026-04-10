import {ServiceMaker} from '@/types/service';
import {Input} from './get-meetings-service';

import {GetMeetingsServiceApi} from './get-meetings-service-api';

export const makeGetMeetingsService: ServiceMaker<Input> = () => {
  return new GetMeetingsServiceApi();
};

export * from './get-meetings-service-mock';
export * from './get-meetings-service-api';
