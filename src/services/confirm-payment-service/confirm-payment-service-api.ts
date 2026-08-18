import {Service} from '@/services/service';
import {Input} from './confirm-payment-service';
import {ServiceOutput} from '@/types/service';

import {apiUrl} from '@/config';

export class ConfirmPaymentServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      amount,
      remarks,
    } = input;

    const response = await fetch(`${apiUrl}/payments/${id}/confirm?sessionId=${sessionId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        id,
        amount,
        remarks,
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
