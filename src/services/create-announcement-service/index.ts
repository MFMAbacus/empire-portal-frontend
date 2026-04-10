import {ServiceMaker} from '@/types/service';
import {Input} from './create-announcement-service';

import {CreateAnnouncementServiceApi} from './create-announcement-service-api';

export const makeCreateAnnouncementService: ServiceMaker<Input> = () => {
  return new CreateAnnouncementServiceApi();
};

export * from './create-announcement-service-mock';
export * from './create-announcement-service-api';
