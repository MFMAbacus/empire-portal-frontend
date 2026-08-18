import {Service} from '@/services/service';
import {Input} from './get-units-service';
import {ServiceOutput} from '@/types/service';

import {apiUrl} from '@/config';

export class GetUnitsServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
    } = input;

    const response = await fetch(`${apiUrl}/units?sessionId=${sessionId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        propertyTypes: input.propertyTypes || [],
        purposes: input.purposes || [],
        projects: input.projects || [],
        buildings: input.buildings || [],
        fllors: input.fllors || [],
        customers: input.customers || [],
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
