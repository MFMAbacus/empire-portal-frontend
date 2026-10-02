import { Service } from '@/services/service';
import { ServiceOutput } from '@/types/service';
import { apiUrl } from '@/config';

export type GetRestaurantReservationInput = {
  sessionId: string;
  userId?: string;
  residentId?: string;
  venueId?: string;
  isArchived?: boolean;
};

export class GetRestaurantReservationApprovalMasterServiceApi extends Service<GetRestaurantReservationInput> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: GetRestaurantReservationInput): Promise<ServiceOutput> {
    const { sessionId, userId, residentId, venueId, isArchived } = input;

    const queryParams = new URLSearchParams();
    queryParams.append("sessionId", sessionId);
    if (userId) queryParams.append("userId", userId);
    if (residentId) queryParams.append("residentId", residentId);
    if (venueId) queryParams.append("venueId", venueId);
    if (isArchived !== undefined) queryParams.append("isArchived", isArchived ? "1" : "0");

    const endpoint = `${apiUrl}/restaurant-reservation-approval-request?${queryParams.toString()}`;

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
