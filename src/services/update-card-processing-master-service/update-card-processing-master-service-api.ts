import { Service } from '@/services/service';
import { ServiceOutput } from '@/types/service';
import { apiUrl } from '@/config';

export type UpdateCardProcessingInput = {
  sessionId: string;
  id: string;
  replacementStatus?: string;
  isSuspended?: boolean;
};

export class UpdateCardProcessingMasterServiceApi extends Service<UpdateCardProcessingInput> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: UpdateCardProcessingInput): Promise<ServiceOutput> {
    const { sessionId, id, ...bodyData } = input;
    const endpoint = `${apiUrl}/card-processing-master/${id}?sessionId=${sessionId}`;

    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      mode: 'cors',
      body: JSON.stringify(bodyData),
      signal: this._abortController.signal,
    });
    const body = await response.json();
    return body;
  }

  public abort(): void {
    this._abortController.abort();
  }
}
