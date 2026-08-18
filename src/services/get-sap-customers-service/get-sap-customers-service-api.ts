import { Service } from "@/services/service";
import { Input } from "./get-sap-customers-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class GetCustomersServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const { sessionId, bls, prs, fls } = input;

    const response = await fetch(
      `${apiUrl}/customers/getsapCustomers?sessionId=${sessionId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          project: prs,
          building: bls,
          floor: fls,
        }),
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
