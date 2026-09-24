import { Service } from '@/services/service';
import { ServiceOutput } from '@/types/service';
import { apiUrl } from '@/config';

export type GetGuestApprovalHistoryInput = {
  sessionId: string;
};

export class GetGuestApprovalHistoryMasterServiceApi extends Service<GetGuestApprovalHistoryInput> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: GetGuestApprovalHistoryInput): Promise<ServiceOutput> {
    const { sessionId } = input;
    const endpoint = `${apiUrl}/guest-approval-master?sessionId=${sessionId}`;

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