import {ServiceMaker} from '@/types/service';
import {Input} from './get-stats-service';

import {GetStatsServiceApi} from './get-stats-service-api';

export const makeGetStatsService: ServiceMaker<Input> = () => {
  return new GetStatsServiceApi();
};

export * from './get-stats-service-api';
