import * as React from "react";

import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useTimeout } from "@/hooks/use-timeout";
import { useForm } from "@/hooks/use-form";
import { AlertSeverity } from "@/types/alert";

import { makeGetVehicleTypeMasterService } from "@/services/get-vehicle-type-master-service";
import { makeCreateVehicleTypeMasterService } from "@/services/create-vehicle-type-master-service";

type EditVehicleTypeMasterProps = {
  sessionId: string;
  vehicleTypeId: string; // Database Record Primary Key / Unique ID
  onBack: () => void;
};

const delayAfterSuccess = 1000;

export const EditVehicleTypeMaster = ({
  sessionId,
  vehicleTypeId,
  onBack,
}: EditVehicleTypeMasterProps): JSX.Element => {
  const [vehicleTypeCode, setVehicleTypeCode] = React.useState<string>("");
  const [vehicleType, setVehicleType] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // Initial Vehicle Type Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getVehicleTypeService = makeGetVehicleTypeMasterService();
    getVehicleTypeService
      .execute({ sessionId, id: vehicleTypeId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setVehicleTypeCode(item.vehicleTypeId || item.id || "");
          setVehicleType(item.vehicleType || "");
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch vehicle type details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, vehicleTypeId]);

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
      id: vehicleTypeId,             // Target Record Primary Key
      vehicleTypeId: vehicleTypeCode, // User Input Field Value
      vehicleType,
      isActive,
    } as any);
  }, [
    sessionId,
    vehicleTypeId,
    vehicleTypeCode,
    vehicleType,
    isActive,
    submit,
  ]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT VEHICLE TYPE MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !vehicleTypeCode ||
            !vehicleType ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading vehicle type details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert message={alertData.message} severity={alertData.severity} />
            )}

            <Paper.Title value={`Vehicle Type Details (ID: ${vehicleTypeId})`} />

            <Grid>
              {/* Field 1: Vehicle Type ID */}
              <Grid.Cell size={Grid.CellSize.S4}>
                <TextInput
                  className="w-100"
                  label="Vehicle Type ID"
                  placeholder="Enter vehicle type ID"
                  value={vehicleTypeCode}
                  hasError={typeof validation["vehicleTypeId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setVehicleTypeCode}
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
        )}
      </Dashboard.Page>
    </Dashboard.Content>
  );
};