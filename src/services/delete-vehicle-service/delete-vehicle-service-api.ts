import {Service} from '@/services/service';
import {Input} from './delete-vehicle-service';
import {ServiceOutput} from '@/types/service';

import {apiUrl} from '@/config';

export class DeleteVehicleServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      customerId,
      vehicleId,
    } = input;

    const response = await fetch(`${apiUrl}/customers/${customerId}/vehicles/${vehicleId}?sessionId=${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
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
