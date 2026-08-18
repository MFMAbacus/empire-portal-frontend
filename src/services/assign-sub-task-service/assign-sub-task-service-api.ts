import {Service} from '@/services/service';
import {Input} from './assign-sub-task-service';
import {ServiceOutput} from '@/types/service';

import {apiUrl} from '@/config';

export class AssignSubTaskServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      taskId,
      subTaskId,
      staffId,
    } = input;

    const response = await fetch(`${apiUrl}/tasks/${taskId}/sub-tasks/${subTaskId}/assign?sessionId=${sessionId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        staffId: staffId !== '' ? staffId : null,
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
