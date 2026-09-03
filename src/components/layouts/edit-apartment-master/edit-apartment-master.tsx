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

import { makeGetApartmentMasterService } from "@/services/get-apartment-master-service";
import { makeCreateApartmentMasterService } from "@/services/create-apartment-master-service"

type EditApartmentMasterProps = {
  sessionId: string;
  apartmentId: string; // Database Record ID
  onBack: () => void;
};

const delayAfterSuccess = 1000;

export const EditApartmentMaster = ({
  sessionId,
  apartmentId,
  onBack,
}: EditApartmentMasterProps): JSX.Element => {
  // User editable input state for Apartment ID/Code
  const [apartmentCode, setApartmentCode] = React.useState<string>("");
  const [apartmentNo, setApartmentNo] = React.useState<string>("");
  const [buildingOrTower, setBuildingOrTower] = React.useState<string>("");
  const [floor, setFloor] = React.useState<string>("");
  const [projectCode, setProjectCode] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // Initial Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getApartmentService = makeGetApartmentMasterService();
    getApartmentService
      .execute({ sessionId, apartmentId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setApartmentCode(item.apartmentId || item.id || "");
          setApartmentNo(item.apartmentNo || "");
          setBuildingOrTower(item.buildingOrTower || "");
          setFloor(item.floor ? String(item.floor) : "");
          setProjectCode(item.projectCode || "");
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch apartment details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, apartmentId]);

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
      id: apartmentId,            // Target Record Primary Key (e.g., AM-1001)
      apartmentId: apartmentCode, // User Input Field Value (e.g., APT-101)
      apartmentNo,
      buildingOrTower,
      floor,
      projectCode,
      isActive,
    } as any);
  }, [
    sessionId,
    apartmentId,
    apartmentCode,
    apartmentNo,
    buildingOrTower,
    floor,
    projectCode,
    isActive,
    submit,
  ]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT APARTMENT MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !apartmentCode ||
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
        {isFetching ? (
          <LoadingFeedback feedback="Loading apartment details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert message={alertData.message} severity={alertData.severity} />
            )}

            <Paper.Title value={`Apartment Details (ID: ${apartmentId})`} />

            {/* Field 1: Apartment ID (User Input) */}
            <Grid>
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Apartment ID"
                  placeholder="Enter apartment ID"
                  value={apartmentCode}
                  hasError={typeof validation["apartmentId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setApartmentCode}
                />
              </Grid.Cell>
            </Grid>

            {/* Field 2: Apartment No. */}
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

            {/* Field 3: Building/Tower */}
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

            {/* Field 4: Floor */}
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

            {/* Field 5: Project Code */}
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
        )}
      </Dashboard.Page>
    </Dashboard.Content>
  );
};