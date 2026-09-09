import * as React from "react";

import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextInput } from "@/components/base/text-input";
import { ListInput } from "@/components/base/list-input";
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

import { makeCreateMovementTypeMasterService } from "@/services/create-movement-type-master-service";

type CreateMovementTypeMasterProps = {
  sessionId: string;
  onBack: () => void;
};

const MOVEMENT_OPTIONS = ["Move-In", "Move-Out"];

const delayAfterSuccess = 1000;

export const CreateMovementTypeMaster = ({
  sessionId,
  onBack,
}: CreateMovementTypeMasterProps): JSX.Element => {
  const [movementTypeId, setMovementTypeId] = React.useState<string>("");
  const [type, setType] = React.useState<string>("Move-In"); // Default option set kar sakte hain
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
    serviceMaker: makeCreateMovementTypeMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      movementTypeId,
      type,
      isActive,
    });
  }, [sessionId, movementTypeId, type, isActive, submit]);

  return (
    <Dashboard.Content>
      <Actionbar title="CREATE MOVEMENT TYPE MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            !movementTypeId ||
            !type ||
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

          <Paper.Title value="Movement Type Details" />

          <Grid>
            {/* Field 1: Movement Type ID */}
            <Grid.Cell size={Grid.CellSize.S4}>
              <TextInput
                className="w-100"
                label="Movement Type ID"
                placeholder="Enter movement type ID"
                value={movementTypeId}
                hasError={typeof validation["movementTypeId"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setMovementTypeId}
              />
            </Grid.Cell>

            {/* Field 2: Movement Type Dropdown / Select */}
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
      </Dashboard.Page>
    </Dashboard.Content>
  );
};