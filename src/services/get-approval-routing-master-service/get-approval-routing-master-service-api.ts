import { Service } from '@/services/service';
import { Input } from './get-approval-routing-master-service';
import { ServiceOutput } from '@/types/service';

import { apiUrl } from '@/config';

export class GetApprovalRoutingMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const { sessionId, isArchived, routingId, id } = input as any;
    const targetId = routingId || id;
    const endpoint = targetId
      ? `${apiUrl}/approval-routing-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/approval-routing-master?sessionId=${sessionId}&isArchived=${isArchived ? '1' : ''}`;

    const response = await fetch(
      endpoint,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        mode: 'cors',
        signal: this._abortController.signal,
      },
    );
    const body = await response.json();
    return body;
  }

  public abort(): void {
    this._abortController.abort();
  }
}
