import { Service } from '@/services/service';
import { Input } from './get-gate-master-service';
import { ServiceOutput } from '@/types/service';

import { apiUrl } from '@/config';

export class GetGateMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const { sessionId, isArchived, gateId, id } = input as any;
    const targetId = gateId || id;
    const endpoint = targetId
      ? `${apiUrl}/gate-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/gate-master?sessionId=${sessionId}&isArchived=${isArchived ? '1' : ''}`;

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
