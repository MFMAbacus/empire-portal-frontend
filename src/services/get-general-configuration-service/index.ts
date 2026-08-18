import { ServiceMaker } from "@/types/service";
import { Input } from "./get-general-configuration-service";

import { GetGeneralConfigurationServiceApi } from "./get-general-configuration-service-api";

export const makeGetGeneralConfigurationService: ServiceMaker<Input> = () => {
  return new GetGeneralConfigurationServiceApi();
};

export * from "./get-general-configuration-service-api";
