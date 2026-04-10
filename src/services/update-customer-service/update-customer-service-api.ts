import { Service } from "@/services/service";
import { Input } from "./update-customer-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class UpdateCustomerServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfBirth,
      address,
      comments,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactNumber,
      password,
    } = input;

    const response = await fetch(
      `${apiUrl}/customers/${id}?sessionId=${sessionId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber,
          dateOfBirth,
          address,
          comments,
          emergencyContactName,
          emergencyContactRelationship,
          emergencyContactNumber,
          password,
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
