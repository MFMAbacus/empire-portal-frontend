import {ServiceMaker} from '@/types/service';
import {Input} from './update-announcement-service';

import {UpdateAnnouncementServiceApi} from './update-announcement-service-api';

export const makeUpdateAnnouncementService: ServiceMaker<Input> = () => {
  return new UpdateAnnouncementServiceApi();
};

export * from './update-announcement-service-mock';
export * from './update-announcement-service-api';
