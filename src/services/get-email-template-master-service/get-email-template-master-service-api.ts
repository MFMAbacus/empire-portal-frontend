import { Service } from '@/services/service';
import { Input } from './get-email-template-master-service';
import { ServiceOutput } from '@/types/service';

import { apiUrl } from '@/config';

export class GetEmailTemplateMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const { sessionId, isArchived, id, templateCode } = input as any;
    
    let endpoint = `${apiUrl}/email-template-master`;

    if (id) {
      endpoint += `/${id}?sessionId=${sessionId}`;
    } else {
      const queryParams = new URLSearchParams({
        sessionId: sessionId || '',
        ...(isArchived ? { isArchived: '1' } : {}),
        ...(templateCode ? { templateCode } : {}),
      });
      endpoint += `?${queryParams.toString()}`;
    }

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