import { Service } from '@/services/service';
import { ServiceOutput } from '@/types/service';
import { apiUrl } from '@/config';

export type GetMoveApprovalInput = {
  sessionId: string;
};

export class GetMoveApprovalMasterServiceApi extends Service<GetMoveApprovalInput> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: GetMoveApprovalInput): Promise<ServiceOutput> {
    const { sessionId } = input;
    const endpoint = `${apiUrl}/move-approval-master?sessionId=${sessionId}`;

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
