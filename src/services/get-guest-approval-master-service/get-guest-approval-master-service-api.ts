import { Service } from '@/services/service';
import { ServiceOutput } from '@/types/service';
import { apiUrl } from '@/config';

export type GetGuestApprovalInput = {
  sessionId: string;
  userId?: string;
};

export class GetGuestApprovalMasterServiceApi extends Service<GetGuestApprovalInput> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: GetGuestApprovalInput): Promise<ServiceOutput> {
    const { sessionId } = input;
    
    // 1. Sabse pehle input wali userId check karein
    let userId = input.userId;

    // 2. Agar nahi hai, toh localStorage aur sessionStorage ki tamam common keys check karein
    if (!userId) {
      const possibleKeys = ['user', 'userInfo', 'profile', 'account', 'currentUser', 'userId', 'role', 'auth'];
      
      for (const key of possibleKeys) {
        const val = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (val) {
          try {
            if (val.startsWith("{") || val.startsWith("[")) {
              const parsed = JSON.parse(val);
              userId = parsed.id || parsed._id || parsed.userId || parsed.role || parsed.coordinatorRole;
            } else {
              userId = val;
            }
            if (userId) break; // Agar ID mil jaye toh loop rok dein
          } catch (e) {
            // Agar parse na ho sake aur plain string ho
            userId = val;
            break;
          }
        }
      }
    }
    
    const queryParams = new URLSearchParams();
    queryParams.append('sessionId', sessionId);
    
    if (userId) {
      queryParams.append('userId', userId);
    }

    const endpoint = `${apiUrl}/guest-approval-request?${queryParams.toString()}`;

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
