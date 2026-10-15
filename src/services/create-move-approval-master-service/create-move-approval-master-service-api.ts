import { Service } from '@/services/service';
import { ServiceOutput } from '@/types/service';
import { apiUrl } from '@/config';

export type CreateMoveApprovalInput = {
  sessionId: string;
  residentId: string;
  apartmentId: string;
  projectCode: string;
  movementTypeId: string;
  itemTypeId: string;
  itemImage?: string;
  movementDate: string;
  movementTime: string;
  comments?: string;
};

export class CreateMoveApprovalMasterServiceApi extends Service<CreateMoveApprovalInput> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: CreateMoveApprovalInput): Promise<ServiceOutput> {
    const { sessionId, ...bodyData } = input;
    const endpoint = `${apiUrl}/move-approval-request?sessionId=${sessionId}`;

    const response = await fetch(endpoint, {
      method: 'POST',
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
