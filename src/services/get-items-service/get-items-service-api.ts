import {Service} from '@/services/service';
import {Input} from './get-items-service';
import {ServiceOutput} from '@/types/service';

import {apiUrl} from '@/config';

export class GetItemsServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      currentPage = 1,
      id = '',
      name = '',
    } = input;

    const response = await fetch(`${apiUrl}/items?sessionId=${sessionId}&currentPage=${currentPage}&id=${id}&name=${name}`, {
      method: 'GET',
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
