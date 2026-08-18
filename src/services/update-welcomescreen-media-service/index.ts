import { ServiceMaker } from "@/types/service";
import { Input } from "./update-welcomescreen-media-service";

import { UpdateWelcomescreenMediaServiceApi } from "./update-welcomescreen-media-service-api";

export const makeUpdateWelcomescreenMediaService: ServiceMaker<Input> = () => {
  return new UpdateWelcomescreenMediaServiceApi();
};

export * from "./update-welcomescreen-media-service-mock";
export * from "./update-welcomescreen-media-service-api";