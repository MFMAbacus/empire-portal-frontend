import { ServiceMaker } from "@/types/service";
import { Input } from "./get-welcomescreen-media-item-service";

import { GetWelcomescreenMediaItemServiceApi } from "./get-welcomescreen-media-item-service-api";

export const makeGetWelcomescreenMediaItemService: ServiceMaker<Input> = () => {
  return new GetWelcomescreenMediaItemServiceApi();
};

export * from "./get-welcomescreen-media-item-service-mock";
export * from "./get-welcomescreen-media-item-service-api";