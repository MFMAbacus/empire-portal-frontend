import {ServiceMaker} from '@/types/service';
import {Input} from './get-meeting-service';

import {GetMeetingServiceApi} from './get-meeting-service-api';

export const makeGetMeetingService: ServiceMaker<Input> = () => {
  return new GetMeetingServiceApi();
};

export * from './get-meeting-service-mock';
export * from './get-meeting-service-api';
