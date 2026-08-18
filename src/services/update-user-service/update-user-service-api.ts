import { Service } from "@/services/service";
import { Input } from "./update-user-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class UpdateUserServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
      id,
      salespersonId,
      firstName,
      lastName,
      email,
      phoneNumber,
      departmentId,
      employeeId,
      jobTitle,
      password,
      isMobileUser,
      isCachier,
      serviceType,
      project,
      profilePicture,
      permissions,
    } = input;

    const response = await fetch(
      `${apiUrl}/users/${id}?sessionId=${sessionId}`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          salespersonId,
          firstName,
          lastName,
          email,
          phoneNumber: phoneNumber !== "" ? phoneNumber : undefined,
          departmentId,
          employeeId,
          jobTitle,
          password,
          isMobileUser,
          isCachier,
          serviceType,
          project,
          profilePicture,
          permissions,
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
