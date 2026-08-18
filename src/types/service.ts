import {Service} from '@/services/service';

export enum ServiceStatus {
  IDLE = 'service-status/idle',
  PENDING = 'service-status/pending',
  COMPLETE = 'service-status/complete',
}

export type ServiceOutput = {
  success: boolean;
  code: string;
  data: unknown;
};

export type ServiceMaker<Input> = () => Service<Input>;

export type ServiceValidation = {
  [key: string]: {
    code: string;
    data: unknown;
  };
};
