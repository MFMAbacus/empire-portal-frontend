import {Service} from '@/services/service';
import {Input} from './sign-in-service';
import {ServiceOutput} from '@/types/service';

import {apiUrl} from '@/config';

export class SignInServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      email,
      password,
      role,
    } = input;

    const response = await fetch(`${apiUrl}/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        login: email !== '' ? email : undefined,
        password: password !== '' ? password : undefined,
        role,
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
