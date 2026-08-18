import { Service } from "@/services/service";
import { Input } from "./create-user-service";
import { ServiceOutput } from "@/types/service";

import { apiUrl } from "@/config";

export class CreateUserServiceApi extends Service<Input> {
  protected _abortController: AbortController;

  public constructor() {
    super();
    this._abortController = new AbortController();
  }

  public async execute(input: Input): Promise<ServiceOutput> {
    const {
      sessionId,
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
      profilePicture,
      permissions,
    } = input;

    const response = await fetch(`${apiUrl}/users?sessionId=${sessionId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        salespersonId,
        firstName: firstName !== "" ? firstName : undefined,
        lastName: lastName !== "" ? lastName : undefined,
        email: email !== "" ? email : undefined,
        phoneNumber: phoneNumber !== "" ? phoneNumber : undefined,
        departmentId,
        employeeId: employeeId !== "" ? employeeId : undefined,
        jobTitle: jobTitle !== "" ? jobTitle : undefined,
        password: password !== "" ? password : undefined,
        isMobileUser,
        isCachier,
        serviceType,
        profilePicture,
        permissions,
      }),
      mode: "cors",
      signal: this._abortController.signal,
    });
    const body = await response.json();
    return body;
  }

  public abort(): void {
    this._abortController.abort();
  }
}
