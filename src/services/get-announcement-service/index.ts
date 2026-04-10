import {ServiceMaker} from '@/types/service';
import {Input} from './get-announcement-service';

import {GetAnnouncementServiceApi} from './get-announcement-service-api';

export const makeGetAnnouncementService: ServiceMaker<Input> = () => {
  return new GetAnnouncementServiceApi();
};

export * from './get-announcement-service-mock';
export * from './get-announcement-service-api';
