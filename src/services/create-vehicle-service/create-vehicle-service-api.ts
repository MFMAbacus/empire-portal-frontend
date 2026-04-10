import {Service} from '@/services/service';
import {Input} from './create-vehicle-service';
import {ServiceOutput} from '@/types/service';

import {apiUrl} from '@/config';

export class CreateVehicleServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      customerId,
      palletNumber,
      model,
      type,
      color,
    } = input;

    const response = await fetch(`${apiUrl}/customers/${customerId}/vehicles?sessionId=${sessionId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        palletNumber: palletNumber !== '' ? palletNumber : undefined,
        model: model !== '' ? model : undefined,
        type: type !== '' ? type : undefined,
        color: color !== '' ? color : undefined,
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
