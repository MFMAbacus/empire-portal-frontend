import { Service } from '@/services/service';
import { ServiceOutput } from '@/types/service';
import { apiUrl } from '@/config';

export type GetAuditLogsInput = {
  sessionId: string;
};

export class GetAuditLogsMasterServiceApi extends Service<GetAuditLogsInput> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: GetAuditLogsInput): Promise<ServiceOutput> {
    const { sessionId } = input;
    const endpoint = `${apiUrl}/audit-logs-master?sessionId=${sessionId}`;

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
    return body;
  }

  public abort(): void {
    this._abortController.abort();
  }
}
