import { ServiceMaker } from '@/types/service';
import { GetAuditLogsInput, GetAuditLogsMasterServiceApi } from './get-audit-logs-master-service-api';

export const makeGetAuditLogsMasterService: ServiceMaker<GetAuditLogsInput> = () => {
  return new GetAuditLogsMasterServiceApi();
};

export * from './get-audit-logs-master-service-api';
