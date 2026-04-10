import { ServiceMaker } from "@/types/service";
import { Input } from "./get-transactions-service";

import { GetTransactionsServiceApi } from "./get-transactions-service-api";

export const makeGetTransactionsService: ServiceMaker<Input> = () => {
  return new GetTransactionsServiceApi();
};

// export * from './get-welcomescreen-media-service-mock';
export * from "./get-transactions-service-api";
