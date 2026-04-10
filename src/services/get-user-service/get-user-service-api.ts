import { Service } from "@/services/service";
import { Input } from "./get-user-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class GetUserServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const { sessionId, userId } = input;

    const response = await fetch(
      `${apiUrl}/users/${userId}?sessionId=${sessionId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
        mode: "cors",
        signal: this._abortController.signal,
      }
    );
    const body = await response.json();
    return body;
  }

  public abort(): void {
    this._abortController.abort();
  }
}
