import { Service } from '@/services/service';
import { Input } from './delete-apartment-master-service';
import { ServiceOutput } from '@/types/service';

import { apiUrl } from '@/config';

export class DeleteApartmentMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const { sessionId, apartmentId, isRestore } = input;

    const response = await fetch(
      `${apiUrl}/apartment-master/${apartmentId}?sessionId=${sessionId}&isRestore=${isRestore ? '1' : ''}`,
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
