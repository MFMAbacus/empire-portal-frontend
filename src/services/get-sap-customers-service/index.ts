import { ServiceMaker } from "@/types/service";
import { Input } from "./get-sap-customers-service";

import { GetCustomersServiceApi } from "./get-sap-customers-service-api";

export const makeGetSapCustomersService: ServiceMaker<Input> = () => {
  return new GetCustomersServiceApi();
};

export * from "./get-sap-customers-service";
