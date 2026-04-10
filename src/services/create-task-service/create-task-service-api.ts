import {Service} from '@/services/service';
import {Input} from './create-task-service';
import {ServiceOutput} from '@/types/service';

import {apiUrl} from '@/config';

export class CreateTaskServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      customerId,
      categoryId,
      categoryName,
      projectId,
      title,
      description,
      visitDate,
      visitTime,
      priority,
      dueDate,
      attachments,
      bls,
      fls,
    } = input;

    const response = await fetch(`${apiUrl}/tasks?sessionId=${sessionId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        sessionId,
        customerId: customerId !== '' ? customerId : null,
        categoryId: categoryId !== '' ? categoryId : null,
        categoryName: categoryName !== '' ? categoryName : null,
        projectId,
        title: title !== '' ? title : null,
        description: description !== '' ? description : null,
        visitDate: visitDate !== '' ? visitDate : null,
        visitTime: visitTime !== '' ? visitTime : null,
        priority,
        dueDate: dueDate !== '' ? dueDate : null,
        bls,
        fls,
        attachments,
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
