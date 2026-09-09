import * as React from "react";

import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { ListInput } from "@/components/base/list-input";
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

import { makeGetMovementTypeMasterService } from "@/services/get-movement-type-master-service";
import { makeCreateMovementTypeMasterService } from "@/services/create-movement-type-master-service";

type EditMovementTypeMasterProps = {
  sessionId: string;
  movementTypeId: string; // Database Record ID
  onBack: () => void;
};

const MOVEMENT_OPTIONS = ["Move-In", "Move-Out"];
const delayAfterSuccess = 1000;

export const EditMovementTypeMaster = ({
  sessionId,
  movementTypeId,
  onBack,
}: EditMovementTypeMasterProps): JSX.Element => {
  const [movementTypeCode, setMovementTypeCode] = React.useState<string>("");
  const [type, setType] = React.useState<string>("Move-In");
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // Initial Movement Type Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getService = makeGetMovementTypeMasterService();
    getService
      .execute({ sessionId, id: movementTypeId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setMovementTypeCode(item.movementTypeId || item.id || "");
          setType(item.type || "Move-In");
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch movement type details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, movementTypeId]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateMovementTypeMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: movementTypeId,              // Target Record Primary Key
      movementTypeId: movementTypeCode, // User Input Field Value
      type,
      isActive,
    } as any);
  }, [
    sessionId,
    movementTypeId,
    movementTypeCode,
    type,
    isActive,
    submit,
  ]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT MOVEMENT TYPE MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !movementTypeCode ||
            !type ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading movement type details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert message={alertData.message} severity={alertData.severity} />
            )}

            <Paper.Title value={`Movement Type Details (ID: ${movementTypeId})`} />

            <Grid>
              {/* Field 1: Movement Type ID */}
              <Grid.Cell size={Grid.CellSize.S4}>
                <TextInput
                  className="w-100"
                  label="Movement Type ID"
                  placeholder="Enter movement type ID"
                  value={movementTypeCode}
                  hasError={typeof validation["movementTypeId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setMovementTypeCode}
                />
              </Grid.Cell>

              {/* Field 2: Movement Type Dropdown Options */}
              <Grid.Cell size={Grid.CellSize.S4}>
                <ListInput
                  className="w-100"
                  label="Movement Type"
                  value={type}
                  placeholder="Select movement type"
                  hasError={typeof validation["type"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                >
                  {(onClose) => (
                    <React.Fragment>
                      {MOVEMENT_OPTIONS.map((option) => (
                        <ListInput.Item
                          key={option}
                          label={option}
                          isActive={type === option}
                          onClick={() => {
                            setType(option);
                            onClose();
                          }}
                        />
                      ))}
                    </React.Fragment>
                  )}
                </ListInput>
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