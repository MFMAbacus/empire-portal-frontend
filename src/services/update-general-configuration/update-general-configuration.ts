import { UpdateGeneralConfigurationInput } from "@/types/general-configuration";

export type Input = {
  sessionId: string;
  configKey: string;
  updates: UpdateGeneralConfigurationInput;
};
