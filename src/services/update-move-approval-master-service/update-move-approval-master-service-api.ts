import { Service } from '@/services/service';
import { ServiceOutput } from '@/types/service';
import { apiUrl } from '@/config';

export type UpdateMoveApprovalInput = {
  sessionId: string;
  id: string;
  status?: string;
  rejectionReason?: string;
  approverId?: string;
  remarks?: string;
};

export class UpdateMoveApprovalMasterServiceApi extends Service<UpdateMoveApprovalInput> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: UpdateMoveApprovalInput): Promise<ServiceOutput> {
    const { sessionId, id, ...bodyData } = input;

    // Use action-specific endpoints for approve/reject
    let endpoint = `${apiUrl}/move-approval-request/${id}`;
    if (bodyData.status === 'Approved') {
      endpoint = `${apiUrl}/move-approval-request/${id}/approve`;
    } else if (bodyData.status === 'Rejected') {
      endpoint = `${apiUrl}/move-approval-request/${id}/reject`;
    }

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
