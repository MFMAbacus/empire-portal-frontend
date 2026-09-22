import { Service } from '@/services/service';
import { ServiceOutput } from '@/types/service';
import { apiUrl } from '@/config';

export type UpdateGuestApprovalInput = {
  sessionId: string;
  id: string;
  status: string;
  assignedGateId?: string;
  rejectionReason?: string;
  qrCodeUrl?: string;
};

export class UpdateGuestApprovalMasterServiceApi extends Service<UpdateGuestApprovalInput> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: UpdateGuestApprovalInput): Promise<ServiceOutput> {
    const { sessionId, id, ...bodyData } = input;
    const endpoint = `${apiUrl}/guest-approval-master/${id}?sessionId=${sessionId}`;

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
