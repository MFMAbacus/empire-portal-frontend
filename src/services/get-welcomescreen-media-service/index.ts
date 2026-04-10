import { ServiceMaker } from "@/types/service";
import { Input } from "./get-welcomescreen-media-service";

import { GetWelcomescreenMediaServiceApi } from "./get-welcomescreen-media-service-api";

export const makeGetWelcomescreenMediaService: ServiceMaker<Input> = () => {
  return new GetWelcomescreenMediaServiceApi();
};

// export * from './get-welcomescreen-media-service-mock';
export * from "./get-welcomescreen-media-service-api";
