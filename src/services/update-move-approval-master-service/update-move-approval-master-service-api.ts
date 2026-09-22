import { Service } from '@/services/service';
import { ServiceOutput } from '@/types/service';
import { apiUrl } from '@/config';

export type UpdateMoveApprovalInput = {
  sessionId: string;
  id: string;
  status: string;
  rejectionReason?: string;
};

export class UpdateMoveApprovalMasterServiceApi extends Service<UpdateMoveApprovalInput> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: UpdateMoveApprovalInput): Promise<ServiceOutput> {
    const { sessionId, id, ...bodyData } = input;
    const endpoint = `${apiUrl}/move-approval-master/${id}?sessionId=${sessionId}`;

    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      mode: 'cors',
      body: JSON.stringify(bodyData),
      signal: this._abortController.signal,
    });
    const body = await response.json();
    return body;
  }

  public abort(): void {
    this._abortController.abort();
  }
}
