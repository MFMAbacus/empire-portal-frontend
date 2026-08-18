import * as React from "react";

import {
  GeneralConfiguration as IGeneralConfiguration,
  ConfigurationType,
  CommissionType,
  UpdateGeneralConfigurationInput,
} from "@/types/general-configuration";
import { AlertSeverity } from "@/types/alert";

import { Paper } from "@/components/base/paper";
import { Button } from "@/components/base/button";

// import { Select } from "@/components/base/select";
import { Input } from "@/components/base/input";

// import { Toggle } from "@/components/base/toggle";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { makeGetGeneralConfigurationService } from "@/services/get-general-configuration-service";
import { makeUpdateGeneralConfigurationService } from "@/services/update-general-configuration";
import { usePermission } from "@/hooks/use-permission";
import { ModuleName } from "@/types/user";
import { TextInput } from "@/components/base/text-input";
import { Grid, GridCell } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { SpinnerIcon } from "@/components/icons/spinner-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { useForm } from "@/hooks/use-form";
import { useSession } from "@/hooks/use-session";
import { useTimeout } from "@/hooks/use-timeout";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CommissionTypeInput } from "../commission-type-input/commission-type-input";
import { NumberInput } from "@/components/base/number-input";

type EditGeneralConfigurationProps = {
  sessionId: string;
  configKey: string;
  onBack: () => void;
};

export const EditGeneralConfiguration = ({
  sessionId,
  configKey,
  onBack,
}: EditGeneralConfigurationProps): JSX.Element => {
  const [configuration, setConfiguration] =
    React.useState<IGeneralConfiguration | null>(null);

  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = React.useState<AlertSeverity>(
    AlertSeverity.SUCCESS,
  );
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const [commissionType, setCommissionType] = React.useState<CommissionType>(
    CommissionType.PERCENTAGE,
  );
  const [commissionValue, setCommissionValue] = React.useState<string>("0");
  const [validationValue, setValidationValue] = React.useState<number>(0);
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const { checkModule } = usePermission();
  const { canRead, canWrite } = checkModule(ModuleName.GENERAL_CONFIGURATIONS);

  const { startTimeout } = useTimeout();

  const handleGetSuccess = React.useCallback((data: unknown) => {
    const config = data as IGeneralConfiguration;

    setConfiguration(config);

    if (config.configType === ConfigurationType.COMMISSION) {
      setCommissionType(config.commissionType || CommissionType.PERCENTAGE);
      setCommissionValue(String(config.commissionValue) || "0");
    } else if (config.configType === ConfigurationType.VALIDATION_RULE) {
      setValidationValue(config.validationValue || 0);
    }
    setIsActive(config.isActive);
  }, []);

  const {
    isLoading: isGetLoading,
    alertData: getAlertData,
    submit: getSubmit,
  } = useForm({
    serviceMaker: makeGetGeneralConfigurationService,
    onSuccess: handleGetSuccess,
  });

  React.useEffect(() => {
    getSubmit({
      sessionId,
      configKey,
    });
  }, [sessionId, configKey, getSubmit]);

  const handleSubmit = async () => {
    if (!configuration) {
      setAlertMessage("You don't have permission to update this configuration");
      setAlertSeverity(AlertSeverity.ERROR);
      return;
    }

    const updates: UpdateGeneralConfigurationInput = {
      isActive,
    };

    if (configuration.configType === ConfigurationType.COMMISSION) {
      updates.commissionType = commissionType;
      updates.commissionValue = parseFloat(commissionValue) || 0;
    } else if (configuration.configType === ConfigurationType.VALIDATION_RULE) {
      updates.validationValue = validationValue;
    }

    submit({
      sessionId,
      configKey,
      updates,
    });
  };

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    setTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeUpdateGeneralConfigurationService,
    onSuccess: handleSuccess,
  });

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT CONFIGURATION">
        {canWrite && (
          <Button
            label="SAVE"
            icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
            isDisabled={isLoading || isSuccess}
            onClick={handleSubmit}
          />
        )}
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>
      <Dashboard.Page>
        <Paper>
          {alertData !== null && (
            <Alert message={alertData.message} severity={alertData.severity} />
          )}
          {alertMessage && (
            <Alert severity={alertSeverity} message={alertMessage} />
          )}
          {isGetLoading && (
            <LoadingFeedback feedback="Loading configuration..." />
          )}
          <Paper.Title value={configuration?.configName || "Loading..."} />
          {isGetLoading ? (
            <LoadingFeedback feedback="Loading configuration..." />
          ) : configuration ? (
            <>
              {configuration.configType === ConfigurationType.COMMISSION && (
                <Grid>
                  <GridCell size={Grid.CellSize.S3}>
                    <CommissionTypeInput
                      value={commissionType}
                      onChange={setCommissionType}
                      isRequired
                    />
                  </GridCell>
                  <GridCell size={Grid.CellSize.S3}>
                    <NumberInput
                      label={`Commission Value ${
                        commissionType === CommissionType.PERCENTAGE
                          ? "(%)"
                          : "(IQD)"
                      }`}
                      value={commissionValue}
                      onChange={setCommissionValue}
                      isRequired
                    />
                  </GridCell>
                </Grid>
              )}

              {configuration.configType ===
                ConfigurationType.VALIDATION_RULE && (
                <GridCell size={Grid.CellSize.S4}>
                  <TextInput
                    label="Maximum Allowed Count"
                    value={validationValue.toString()}
                    onChange={(value) =>
                      setValidationValue(parseInt(value) || 0)
                    }
                    isRequired
                  />
                </GridCell>
              )}

              <Grid>
                <GridCell size={Grid.CellSize.S3}>
                  <Checkbox
                    className="mt-2"
                    label="Active"
                    isChecked={isActive}
                    isDisabled={isLoading || !canWrite}
                    onChange={setIsActive}
                  />
                </GridCell>
              </Grid>
            </>
          ) : (
            <Alert
              severity={AlertSeverity.ERROR}
              message="Configuration not found"
            />
          )}
        </Paper>
      </Dashboard.Page>
    </Dashboard.Content>
  );
};
const delayAfterSuccess = 2000;
