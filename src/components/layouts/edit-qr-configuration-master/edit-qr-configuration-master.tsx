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

import { makeGetQRConfigurationMasterService } from "@/services/get-qr-configuration-master-service";
import { makeCreateQRConfigurationMasterService } from "@/services/create-qr-configuration-master-service";

type EditQRConfigurationMasterProps = {
  sessionId: string;
  qrConfigId: string; // Database Record ID / Config ID
  onBack: () => void;
};

const delayAfterSuccess = 1000;

export const EditQRConfigurationMaster = ({
  sessionId,
  qrConfigId,
  onBack,
}: EditQRConfigurationMasterProps): JSX.Element => {
  const [configCode, setConfigCode] = React.useState<string>("");
  const [expiryHours, setExpiryHours] = React.useState<string>("");
  const [isOneTimeScan, setIsOneTimeScan] = React.useState<boolean>(false);
  const [isGateValidation, setIsGateValidation] = React.useState<boolean>(false);
  const [isPdfRequired, setIsPdfRequired] = React.useState<boolean>(false);
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // Initial Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getService = makeGetQRConfigurationMasterService();
    getService
      .execute({ sessionId, id: qrConfigId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        
        // Handle array or object response format
        const data = Array.isArray(response?.data) 
          ? response.data.find((item: any) => item.id === qrConfigId || item.qrConfigId === qrConfigId)
          : response?.data || response;

        if (data) {
          setConfigCode(data.qrConfigId || data.id || "");
          setExpiryHours(data.expiryHours ? String(data.expiryHours) : "");
          setIsOneTimeScan(Boolean(data.isOneTimeScan));
          setIsGateValidation(Boolean(data.isGateValidation));
          setIsPdfRequired(Boolean(data.isPdfRequired));
          setIsActive(data.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch QR configuration details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, qrConfigId]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateQRConfigurationMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: qrConfigId,             // Target Record Primary Key
      qrConfigId: configCode,     // Auto-generated QR Config ID Code
      expiryHours: Number(expiryHours),
      isOneTimeScan,
      isGateValidation,
      isPdfRequired,
      isActive,
    } as any);
  }, [
    sessionId,
    qrConfigId,
    configCode,
    expiryHours,
    isOneTimeScan,
    isGateValidation,
    isPdfRequired,
    isActive,
    submit,
  ]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT QR CONFIGURATION MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !expiryHours ||
            isNaN(Number(expiryHours)) ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading QR configuration details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert message={alertData.message} severity={alertData.severity} />
            )}

            <Paper.Title value={`QR Configuration Details (ID: ${configCode || qrConfigId})`} />

            <Grid>
              {/* Field 1: QR Config ID (Auto Generated - Read Only) */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="QR Config ID"
                  value={configCode}
                  isDisabled={true}
                />
              </Grid.Cell>

              {/* Field 2: Expiry Hours */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Expiry Hours"
                  placeholder="Enter expiry in hours"
                  value={expiryHours}
                  hasError={typeof validation["expiryHours"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={(value) => {
                    if (value === "" || /^\d+$/.test(value)) {
                      setExpiryHours(value);
                    }
                  }}
                />
              </Grid.Cell>
            </Grid>

            <Grid>
              {/* Field 3: One-Time Scan */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <Checkbox
                  label="One-Time Scan"
                  isChecked={isOneTimeScan}
                  isDisabled={isLoading || isSuccess}
                  onChange={setIsOneTimeScan}
                />
              </Grid.Cell>

              {/* Field 4: Gate Validation Required */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <Checkbox
                  label="Gate Validation Required"
                  isChecked={isGateValidation}
                  isDisabled={isLoading || isSuccess}
                  onChange={setIsGateValidation}
                />
              </Grid.Cell>

              {/* Field 5: PDF Generation Required */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <Checkbox
                  label="PDF Generation Required"
                  isChecked={isPdfRequired}
                  isDisabled={isLoading || isSuccess}
                  onChange={setIsPdfRequired}
                />
              </Grid.Cell>

              {/* Field 6: Active Status */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <Checkbox
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