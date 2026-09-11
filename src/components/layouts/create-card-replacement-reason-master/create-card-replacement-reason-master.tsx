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

import { makeCreateCardReplacementReasonMasterService } from "@/services/create-card-replacement-reason-master-service";

type CreateCardReplacementReasonMasterProps = {
  sessionId: string;
  onBack: () => void;
};

const delayAfterSuccess = 1000;

export const CreateCardReplacementReasonMaster = ({
  sessionId,
  onBack,
}: CreateCardReplacementReasonMasterProps): JSX.Element => {
  const [reasonId, setReasonId] = React.useState<string>("");
  const [reasonName, setReasonName] = React.useState<string>("");
  const [chargesApplicable, setChargesApplicable] = React.useState<boolean>(true);
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
    serviceMaker: makeCreateCardReplacementReasonMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      reasonId,
      reasonName,
      chargesApplicable,
      isActive,
    });
  }, [sessionId, reasonId, reasonName, chargesApplicable, isActive, submit]);

  return (
    <Dashboard.Content>
      <Actionbar title="CREATE CARD REPLACEMENT REASON">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            !reasonId ||
            !reasonName ||
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

          <Paper.Title value="Card Replacement Reason Details" />

          <Grid>
            {/* Field 1: Reason ID */}
            <Grid.Cell size={Grid.CellSize.S4}>
              <TextInput
                className="w-100"
                label="Reason ID"
                placeholder="Enter reason ID (e.g., RSN001)"
                value={reasonId}
                hasError={typeof validation["reasonId"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setReasonId}
              />
            </Grid.Cell>

            {/* Field 2: Reason Name */}
            <Grid.Cell size={Grid.CellSize.S4}>
              <TextInput
                className="w-100"
                label="Reason Name"
                placeholder="Enter reason name (e.g., Lost / Damaged / Stolen)"
                value={reasonName}
                hasError={typeof validation["reasonName"] !== "undefined"}
                isDisabled={isLoading || isSuccess}
                onChange={setReasonName}
              />
            </Grid.Cell>

            {/* Field 3: Charges Applicable Checkbox */}
            <Grid.Cell size={Grid.CellSize.S4}>
              <Checkbox
                className="mt-2"
                label="Charges Applicable"
                isChecked={chargesApplicable}
                isDisabled={isLoading || isSuccess}
                onChange={setChargesApplicable}
              />
            </Grid.Cell>
          </Grid>

          <Grid>
            {/* Field 5: System IsActive Checkbox */}
            <Grid.Cell size={Grid.CellSize.S4}>
              <Checkbox
                className="mt-2"
                label="Is Active"
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