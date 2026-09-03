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

import { makeCreateApartmentMasterService } from "@/services/create-apartment-master-service";

type CreateApartmentMasterProps = {
  sessionId: string;
  onBack: () => void;
};

const delayAfterSuccess = 1000;

export const CreateApartmentMaster = ({
  sessionId,
  onBack,
}: CreateApartmentMasterProps): JSX.Element => {
  const [apartmentNo, setApartmentNo] = React.useState<string>("");
  const [apartmentId, setApartmentId] = React.useState<string>("");
  const [buildingOrTower, setBuildingOrTower] = React.useState<string>("");
  const [floor, setFloor] = React.useState<string>("");
  const [projectCode, setProjectCode] = React.useState<string>("");
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
    serviceMaker: makeCreateApartmentMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      apartmentId,
      apartmentNo,
      buildingOrTower,
      floor,
      projectCode,
      isActive,
    });
  }, [sessionId, apartmentId, apartmentNo, buildingOrTower, floor, projectCode, isActive, submit]);

  return (
    <Dashboard.Content>
      <Actionbar title="CREATE APARTMENT MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            !apartmentId ||
            !apartmentNo ||
            !buildingOrTower ||
            !floor ||
            !projectCode ||
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

          <Paper.Title value="Apartment Master Details" />

          {/* Field 1: Apartment ID. */}
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Apartment ID."
                placeholder="Enter apartment number"
                value={apartmentId}
                hasError={typeof validation["apartmentId"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setApartmentId}
              />
            </Grid.Cell>
          </Grid>

          {/* Field 1: Apartment No. */}
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Apartment No."
                placeholder="Enter apartment number"
                value={apartmentNo}
                hasError={typeof validation["apartmentNo"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setApartmentNo}
              />
            </Grid.Cell>
          </Grid>

          {/* Field 2: Building / Tower */}
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Building/Tower"
                placeholder="Enter building or tower name"
                value={buildingOrTower}
                hasError={typeof validation["buildingOrTower"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setBuildingOrTower}
              />
            </Grid.Cell>
          </Grid>

          {/* Field 3: Floor */}
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Floor"
                placeholder="Enter floor number"
                value={floor}
                hasError={typeof validation["floor"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setFloor}
              />
            </Grid.Cell>
          </Grid>

          {/* Field 4: Project Code */}
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Project Code"
                placeholder="Enter project code"
                value={projectCode}
                hasError={typeof validation["projectCode"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setProjectCode}
              />
            </Grid.Cell>
          </Grid>

          {/* Status Checkbox */}
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
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