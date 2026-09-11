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

import { makeGetCardReplacementReasonMasterService } from "@/services/get-card-replacement-reason-master-service";
import { makeCreateCardReplacementReasonMasterService } from "@/services/create-card-replacement-reason-master-service";

type EditCardReplacementReasonMasterProps = {
  sessionId: string;
  reasonRecordId: string; // Database Record Primary Key ID
  onBack: () => void;
};

const delayAfterSuccess = 1000;

export const EditCardReplacementReasonMaster = ({
  sessionId,
  reasonRecordId,
  onBack,
}: EditCardReplacementReasonMasterProps): JSX.Element => {
  const [reasonId, setReasonId] = React.useState<string>("");
  const [reasonName, setReasonName] = React.useState<string>("");
  const [chargesApplicable, setChargesApplicable] = React.useState<boolean>(false);
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // Initial Card Replacement Reason Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getService = makeGetCardReplacementReasonMasterService();
    getService
      .execute({ sessionId, id: reasonRecordId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setReasonId(item.reasonId || item.id || "");
          setReasonName(item.reasonName || "");
          setChargesApplicable(item.chargesApplicable ?? true);
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch card replacement reason details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, reasonRecordId]);

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
      id: reasonRecordId,       // Database Primary Key Target
      reasonId,                 // User Input Reason ID / Code
      reasonName,               // User Input Reason Name
      chargesApplicable,
      isActive,
    } as any);
  }, [
    sessionId,
    reasonRecordId,
    reasonId,
    reasonName,
    chargesApplicable,
    isActive,
    submit,
  ]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT CARD REPLACEMENT REASON">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !reasonId ||
            !reasonName ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading card replacement reason details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert message={alertData.message} severity={alertData.severity} />
            )}

            <Paper.Title value={`Card Replacement Reason Details (ID: ${reasonRecordId})`} />

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
                  placeholder="Enter reason name (e.g., Lost / Damaged)"
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
        )}
      </Dashboard.Page>
    </Dashboard.Content>
  );
};