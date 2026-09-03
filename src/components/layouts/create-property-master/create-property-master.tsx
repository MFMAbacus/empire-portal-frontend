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

import { makeCreatePropertyMasterService } from "@/services/create-property-master-service";

type CreatePropertyMasterProps = {
  sessionId: string;
  onBack: () => void;
};

const delayAfterSuccess = 1000;

export const CreatePropertyMaster = ({
  sessionId,
  onBack,
}: CreatePropertyMasterProps): JSX.Element => {
  const [projectCode, setProjectCode] = React.useState<string>("");
  const [projectName, setProjectName] = React.useState<string>("");
  const [propertyName, setPropertyName] = React.useState<string>("");
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
    serviceMaker: makeCreatePropertyMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      projectCode,
      projectName,
      propertyName,
      isActive,
    });
  }, [sessionId, projectCode, projectName, propertyName, isActive, submit]);

  return (
    <Dashboard.Content>
      <Actionbar title="CREATE PROPERTY MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={isLoading || !projectCode || !projectName || !propertyName || isSuccess}
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        <Paper>
          {alertData !== null && (
            <Alert message={alertData.message} severity={alertData.severity} />
          )}

          <Paper.Title value="Project Master Details" />

          {/* Field 1: Project Code */}
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

          {/* Field 2: Project Name */}
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Project Name"
                placeholder="Enter project name"
                value={projectName}
                hasError={typeof validation["projectName"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setProjectName}
              />
            </Grid.Cell>
          </Grid>

          {/* Field 3: Property Name */}
          <Grid>
            <Grid.Cell size={Grid.CellSize.S3}>
              <TextInput
                className="w-100"
                label="Property Name"
                placeholder="Enter property name"
                value={propertyName}
                hasError={typeof validation["propertyName"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setPropertyName}
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