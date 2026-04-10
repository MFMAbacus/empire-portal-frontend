import {Service} from '@/services/service';
import {Input} from './update-vehicle-service';
import {ServiceOutput} from '@/types/service';

import {apiUrl} from '@/config';

export class UpdateVehicleServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      customerId,
      id,
      palletNumber,
      model,
      type,
      color,
    } = input;

    const response = await fetch(`${apiUrl}/customers/${customerId}/vehicles/${id}?sessionId=${sessionId}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        palletNumber,
        model,
        type,
        color,
      }),
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
