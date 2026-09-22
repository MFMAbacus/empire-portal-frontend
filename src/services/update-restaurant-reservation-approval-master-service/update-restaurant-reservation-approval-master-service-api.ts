import { Service } from '@/services/service';
import { ServiceOutput } from '@/types/service';
import { apiUrl } from '@/config';

export type UpdateRestaurantReservationInput = {
  sessionId: string;
  id: string;
  status: string;
  rejectionReason?: string;
};

export class UpdateRestaurantReservationApprovalMasterServiceApi extends Service<UpdateRestaurantReservationInput> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: UpdateRestaurantReservationInput): Promise<ServiceOutput> {
    const { sessionId, id, ...bodyData } = input;
    const endpoint = `${apiUrl}/restaurant-reservation-approval-master/${id}?sessionId=${sessionId}`;

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
