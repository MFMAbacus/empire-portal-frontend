import { ServiceMaker } from "@/types/service";
import { Input } from "./update-general-configuration";

import { UpdateGeneralConfigurationServiceApi } from "./update-general-configuration-api";

export const makeUpdateGeneralConfigurationService: ServiceMaker<
  Input
> = () => {
  return new UpdateGeneralConfigurationServiceApi();
};

export * from "./update-general-configuration-api";
