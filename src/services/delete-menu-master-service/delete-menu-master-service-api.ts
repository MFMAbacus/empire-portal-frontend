import { Service } from '@/services/service';
import { Input } from './delete-menu-master-service';
import { ServiceOutput } from '@/types/service';

import { apiUrl } from '@/config';

export class DeleteMenuMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const { sessionId, menuId, isRestore } = input;

    const response = await fetch(
      `${apiUrl}/menu-master/${menuId}?sessionId=${sessionId}&isRestore=${isRestore ? '1' : ''}`,
      {
        method: 'DELETE',
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
