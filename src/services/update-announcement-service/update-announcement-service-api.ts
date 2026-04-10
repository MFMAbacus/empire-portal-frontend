import {Service} from '@/services/service';
import {Input} from './update-announcement-service';
import {ServiceOutput} from '@/types/service';

import {apiUrl} from '@/config';

export class UpdateAnnouncementServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      title,
      description,
      publishDate,
      expirationDate,
      isPublished,
      group,
      pts,
      pss,
      bps,
      prs,
      bls,
      fls,
      uns,
      attachments,
    } = input;

    const response = await fetch(`${apiUrl}/announcements/${id}?sessionId=${sessionId}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        title,
        description,
        publishDate: publishDate !== '' ? publishDate : null,
        expirationDate: expirationDate !== '' ? expirationDate : null,
        isPublished,
        group,
        pts,
        pss,
        bps,
        prs,
        bls,
        fls,
        uns,
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
