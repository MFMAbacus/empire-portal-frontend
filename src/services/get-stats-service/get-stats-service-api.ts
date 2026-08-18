import {Service} from '@/services/service';
import {Input} from './get-stats-service';
import {ServiceOutput} from '@/types/service';

import {apiUrl} from '@/config';

export class GetStatsServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      minDate,
      maxDate,
      sessionId,
    } = input;

    const query = new URLSearchParams();
    query.append('sessionId', sessionId);
    if (minDate) {
      query.append('minDate', minDate);
    }
    if (maxDate) {
      query.append('maxDate', maxDate);
    }

    const response = await fetch(`${apiUrl}/reports/stats?${query.toString()}`, {
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
