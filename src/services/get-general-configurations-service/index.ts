import { ServiceMaker } from "@/types/service";
import { Input } from "./get-general-configurations-service";

import { GetGeneralConfigurationsServiceApi } from "./get-general-configurations-service-api";

export const makeGetGeneralConfigurationsService: ServiceMaker<Input> = () => {
  return new GetGeneralConfigurationsServiceApi();
};

export * from "./get-general-configurations-service-api";