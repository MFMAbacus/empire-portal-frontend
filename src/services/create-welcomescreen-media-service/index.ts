import { ServiceMaker } from "@/types/service";
import { Input } from "./create-welcomescreen-media-service";

import { CreateWelcomescreenMediaServiceApi } from "./create-welcomescreen-media-service-api";

export const makeCreateWelcomescreenMediaService: ServiceMaker<Input> = () => {
  return new CreateWelcomescreenMediaServiceApi();
};

// export * from './create-welcomescreen-media-service-mock';
export * from "./create-welcomescreen-media-service-api";
