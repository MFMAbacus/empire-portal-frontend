import { Service } from '@/services/service';
import { Input } from './get-role-service';
import { ServiceOutput } from '@/types/service';

import { apiUrl } from '@/config';

export class GetUserRoleServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const { sessionId } = input;

    const endpoint =
      `${apiUrl}/role?sessionId=${encodeURIComponent(sessionId)}&isArchived=false`;

    console.log('Get Roles Endpoint:', endpoint);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      mode: 'cors',
      signal: this._abortController.signal,
    });

    const body = await response.json();

    console.log('Get Roles Response:', body);

    return body;
  }

  public abort(): void {
    this._abortController.abort();
  }
}