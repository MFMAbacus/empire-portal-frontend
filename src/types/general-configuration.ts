export enum ConfigurationType {
  COMMISSION = "commission",
  VALIDATION_RULE = "validation_rule",
}

export enum CommissionType {
  PERCENTAGE = "Percentage",
  LUMP_SUM = "LumpSum",
}

export enum ServiceType {
  ELECTRICITY = "electricity",
}

export enum ConfigurationKey {
  FIB_COMMISSION = "FIB_COMMISSION",
  FASTPAY_COMMISSION = "FASTPAY_COMMISSION",
  MAX_OUTSTANDING_INVOICES_ELECTRICITY = "MAX_OUTSTANDING_INVOICES_ELECTRICITY",
}

export type GeneralConfiguration = {
  id: string;
  configKey: string;
  configName: string;
  configType: ConfigurationType;

  // Commission fields
  commissionType?: CommissionType;
  commissionValue?: number;

  // Validation rule fields
  validationValue?: number;
  serviceType?: ServiceType;

  // Common fields
  isActive: boolean;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type GeneralConfigurationRecord = GeneralConfiguration;

export type UpdateGeneralConfigurationInput = {
  commissionType?: CommissionType;
  commissionValue?: number;
  validationValue?: number;
  isActive?: boolean;
};

export type GetGeneralConfigurationsResponse = {
  configurations: GeneralConfiguration[];
};

export type GetGeneralConfigurationResponse = {
  configuration: GeneralConfiguration;
};

export type UpdateGeneralConfigurationResponse = {
  configuration: GeneralConfiguration;
};
