import * as React from "react";

import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";

import { makeCreateVehicleTypeMasterService } from "@/services/create-vehicle-type-master-service";

type CreateVehicleTypeMasterProps = {
  sessionId: string;
  onBack: () => void;
};

const delayAfterSuccess = 1000;

export const CreateVehicleTypeMaster = ({
  sessionId,
  onBack,
}: CreateVehicleTypeMasterProps): JSX.Element => {
  const [vehicleTypeId, setVehicleTypeId] = React.useState<string>("");
  const [vehicleType, setVehicleType] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { startTimeout } = useTimeout();

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateVehicleTypeMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      vehicleTypeId,
      vehicleType,
      isActive,
    });
  }, [
    sessionId,
    vehicleTypeId,
    vehicleType,
    isActive,
    submit,
  ]);

  return (
    <Dashboard.Content>
      <Actionbar title="CREATE VEHICLE TYPE MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            !vehicleTypeId ||
            !vehicleType ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          {alertData !== null && (
            <Alert message={alertData.message} severity={alertData.severity} />
          )}

          <Paper.Title value="Vehicle Type Master Details" />

          <Grid>
            {/* Field 1: Vehicle Type ID */}
            <Grid.Cell size={Grid.CellSize.S4}>
              <TextInput
                className="w-100"
                label="Vehicle Type ID"
                placeholder="Enter vehicle type ID"
                value={vehicleTypeId}
                hasError={typeof validation["vehicleTypeId"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setVehicleTypeId}
              />
            </Grid.Cell>

            {/* Field 2: Vehicle Type / Make */}
            <Grid.Cell size={Grid.CellSize.S4}>
              <TextInput
                className="w-100"
                label="Vehicle Type / Make"
                placeholder="Enter vehicle type or make"
                value={vehicleType}
                hasError={typeof validation["vehicleType"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setVehicleType}
              />
            </Grid.Cell>

            {/* Field 3: Status Checkbox */}
            <Grid.Cell size={Grid.CellSize.S4}>
              <Checkbox
                className="mt-2"
                label="Active"
                isChecked={isActive}
                isDisabled={isLoading || isSuccess}
                onChange={setIsActive}
              />
            </Grid.Cell>
          </Grid>
        </Paper>
      </Dashboard.Page>
    </Dashboard.Content>
  );
};