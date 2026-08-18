import {Service} from '@/services/service';
import {Input} from './create-meeting-service';
import {ServiceOutput} from '@/types/service';

import {apiUrl} from '@/config';

export class CreateMeetingServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      subject,
      date,
      time,
      duration,
      location,
      importance,
      agenda,
      invitation,
    } = input;

    const response = await fetch(`${apiUrl}/meetings?sessionId=${sessionId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        subject: subject !== '' ? subject : undefined,
        date: date !== '' ? date : undefined,
        time: time !== '' ? time : undefined,
        duration,
        location: location !== '' ? location : undefined,
        importance,
        agenda: agenda !== '' ? agenda : undefined,
        invitation,
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
