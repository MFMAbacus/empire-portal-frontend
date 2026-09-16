import { Service } from '@/services/service';
import { Input } from './get-menu-master-service';
import { ServiceOutput } from '@/types/service';

import { apiUrl } from '@/config';

export class GetMenuMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const { sessionId, isArchived, menuId, id } = input as any;
    const targetId = menuId || id;
    const endpoint = targetId
      ? `${apiUrl}/menu-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/menu-master?sessionId=${sessionId}&isArchived=${isArchived ? '1' : ''}`;

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
