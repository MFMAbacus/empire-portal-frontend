import { Service } from '@/services/service';
import { ServiceOutput } from '@/types/service';
import { apiUrl } from '@/config';

export type GetMoveApprovalInput = {
  sessionId: string;
  userId?: string;
  residentId?: string;
};

export class GetMoveApprovalMasterServiceApi extends Service<GetMoveApprovalInput> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: GetMoveApprovalInput): Promise<ServiceOutput> {
    const { sessionId, userId, residentId } = input;
    let endpoint = `${apiUrl}/move-approval-request`;
    const params: string[] = [];
    if (sessionId) params.push(`sessionId=${sessionId}`);
    if (userId) params.push(`userId=${userId}`);
    if (residentId) params.push(`residentId=${residentId}`);
    if (params.length > 0) endpoint += `?${params.join('&')}`;

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
