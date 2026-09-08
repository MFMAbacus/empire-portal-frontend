import { Service } from '@/services/service';
import { Input } from './get-vehicle-type-master-service';
import { ServiceOutput } from '@/types/service';

import { apiUrl } from '@/config';

export class GetVehicleTypeMasterServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const { sessionId, isArchived, vehicleTypeId, id } = input as any;
    const targetId = vehicleTypeId || id;
    const endpoint = targetId
      ? `${apiUrl}/vehicle-type-master/${targetId}?sessionId=${sessionId}`
      : `${apiUrl}/vehicle-type-master?sessionId=${sessionId}&isArchived=${isArchived ? '1' : ''}`;

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