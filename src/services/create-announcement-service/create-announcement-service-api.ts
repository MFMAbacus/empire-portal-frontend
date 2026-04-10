import {Service} from '@/services/service';
import {Input} from './create-announcement-service';
import {ServiceOutput} from '@/types/service';

import {apiUrl} from '@/config';

export class CreateAnnouncementServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
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

    const response = await fetch(`${apiUrl}/announcements?sessionId=${sessionId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        title: title !== '' ? title : null,
        description: description !== '' ? description : null,
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
