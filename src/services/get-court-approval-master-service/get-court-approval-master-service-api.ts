import { Service } from '@/services/service';
import { ServiceOutput } from '@/types/service';
import { apiUrl } from '@/config';

export type GetCourtApprovalInput = {
  sessionId: string;
  userId?: string;
  projectCode?: string;
  isArchived?: boolean;
  residentId?: string;
  status?: string;
};

export class GetCourtApprovalMasterServiceApi extends Service<GetCourtApprovalInput> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: GetCourtApprovalInput): Promise<ServiceOutput> {
    const { sessionId, userId, projectCode, isArchived, residentId, status } = input;
    const queryParams = new URLSearchParams({ sessionId });

    if (userId) queryParams.append('userId', userId);
    if (projectCode) queryParams.append('projectCode', projectCode);
    if (isArchived) queryParams.append('isArchived', '1');
    if (residentId) queryParams.append('residentId', residentId);
    if (status) queryParams.append('status', status);

    const endpoint = `${apiUrl}/court-approval-request?${queryParams.toString()}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      mode: 'cors',
      signal: this._abortController.signal,
    });
    const body = await response.json();
    return body;
  }

  public abort(): void {
    this._abortController.abort();
  }
}
