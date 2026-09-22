import { Service } from '@/services/service';
import { ServiceOutput } from '@/types/service';
import { apiUrl } from '@/config';

export type CreateCourtApprovalInput = {
  sessionId: string;
  courtName: string;
  residentName?: string;
  apartmentNo?: string;
  projectCode?: string;
  bookingDate: string;
  timeSlot: string;
  duration?: string;
  slotStatus: string;
};

export class CreateCourtApprovalMasterServiceApi extends Service<CreateCourtApprovalInput> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: CreateCourtApprovalInput): Promise<ServiceOutput> {
    const { sessionId, ...bodyData } = input;
    const endpoint = `${apiUrl}/court-approval-master?sessionId=${sessionId}`;

    const response = await fetch(endpoint, {
      method: 'POST',
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
