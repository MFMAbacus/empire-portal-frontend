import { Service } from '@/services/service';
import { Input } from './get-qr-configuration-master-service';
import { ServiceOutput } from '@/types/service';

import { apiUrl } from '@/config';

export class GetQRConfigurationMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const { sessionId, isArchived, qrConfigId, id } = input as any;
    const targetId = qrConfigId || id;
    const endpoint = targetId
      ? `${apiUrl}/qr-configuration-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/qr-configuration-master?sessionId=${sessionId}&isArchived=${isArchived ? '1' : ''}`;

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