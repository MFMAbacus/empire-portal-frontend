import * as React from "react";

import { Map } from "@/components/base/map";
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

import { makeGetReplacementFeeMasterService } from "@/services/get-replacement-fee-master-service";
import { makeCreateReplacementFeeMasterService } from "@/services/create-replacement-fee-master-service";
import { GetPropertyMasterServiceApi } from "@/services/get-property-master-service";

type EditReplacementFeeMasterProps = {
  sessionId: string;
  feeRecordId: string; // Database Record ID / Unique Key
  onBack: () => void;
};

type PropertyMasterItem = {
  id?: string;
  projectCode?: string;
  projectName?: string;
  [key: string]: any;
};

const delayAfterSuccess = 1000;

export const EditReplacementFeeMaster = ({
  sessionId,
  feeRecordId,
  onBack,
}: EditReplacementFeeMasterProps): JSX.Element => {
  // Input fields state for Replacement Fee
  const [feeId, setFeeId] = React.useState<string>("");
  const [feeAmount, setFeeAmount] = React.useState<string>("");
  const [currency, setCurrency] = React.useState<string>("");
  const [tax, setTax] = React.useState<string>("");
  const [projectCode, setProjectCode] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const [propertyList, setPropertyList] = React.useState<PropertyMasterItem[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = React.useState<boolean>(false);

  const [isFetching, setIsFetching] = React.useState<boolean>(true);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const { startTimeout } = useTimeout();

  // Fetch Property Master List for Project Code Dropdown
  React.useEffect(() => {
    let isMounted = true;
    const propertyService = new GetPropertyMasterServiceApi();

    const fetchProperties = async () => {
      setIsLoadingProperties(true);
      try {
        const response = await propertyService.execute({
          sessionId,
          isArchived: false,
        } as any);

        if (isMounted && response) {
          const items: PropertyMasterItem[] = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : [];

          setPropertyList(items);
        }
      } catch (err) {
        console.error("Failed to fetch property master list:", err);
      } finally {
        if (isMounted) {
          setIsLoadingProperties(false);
        }
      }
    };

    fetchProperties();

    return () => {
      isMounted = false;
      propertyService.abort();
    };
  }, [sessionId]);

  // Initial Replacement Fee Data Fetching
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const getReplacementFeeService = makeGetReplacementFeeMasterService();
    getReplacementFeeService
      .execute({ sessionId, id: feeRecordId } as any)
      .then((response: any) => {
        if (!isMounted) return;
        if (response && response.data) {
          const item = response.data;
          setFeeId(item.feeId || item.id || "");
          setFeeAmount(item.feeAmount !== undefined && item.feeAmount !== null ? String(item.feeAmount) : "");
          setCurrency(item.currency || "");
          setTax(item.tax || "");
          setProjectCode(item.projectCode || "");
          setIsActive(item.isActive ?? true);
        }
        setIsFetching(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setFetchError(err?.message || "Failed to fetch replacement fee details.");
        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId, feeRecordId]);

  const handleSuccess = React.useCallback(() => {
    setIsSuccess(true);
    startTimeout(() => {
      onBack();
    }, delayAfterSuccess);
  }, [startTimeout, onBack]);

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeCreateReplacementFeeMasterService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      sessionId,
      id: feeRecordId, // Primary key / ID for updating
      feeId,
      feeAmount: feeAmount !== "" ? Number(feeAmount) : undefined,
      currency,
      tax,
      projectCode,
      isActive,
    } as any);
  }, [
    sessionId,
    feeRecordId,
    feeId,
    feeAmount,
    currency,
    tax,
    projectCode,
    isActive,
    submit,
  ]);

  // Extract unique project codes for dropdown options
  const uniqueProjectCodes = React.useMemo(() => {
    const codes = propertyList
      .map((item) => item.projectCode)
      .filter((code): code is string => Boolean(code));
    return Array.from(new Set(codes));
  }, [propertyList]);

  return (
    <Dashboard.Content>
      <Actionbar title="EDIT REPLACEMENT FEE MASTER">
        <Button
          label="SAVE"
          icon={isLoading ? <SpinnerIcon /> : <CheckIcon />}
          isDisabled={
            isLoading ||
            isFetching ||
            !feeId ||
            !feeAmount ||
            !currency ||
            !tax ||
            !projectCode ||
            isSuccess
          }
          onClick={handleSubmit}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>

      <Dashboard.Page>
        {isFetching ? (
          <LoadingFeedback feedback="Loading replacement fee details..." />
        ) : (
          <Paper>
            {fetchError !== null && (
              <Alert message={fetchError} severity={AlertSeverity.ERROR} />
            )}

            {alertData !== null && (
              <Alert message={alertData.message} severity={alertData.severity} />
            )}

            <Paper.Title value={`Replacement Fee Details (ID: ${feeRecordId})`} />

            <Grid>
              {/* Field 1: Fee ID */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Fee ID"
                  placeholder="Enter fee ID"
                  value={feeId}
                  hasError={typeof validation["feeId"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setFeeId}
                />
              </Grid.Cell>

              {/* Field 2: Fee Amount */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Fee Amount"
                  placeholder="Enter fee amount"
                  value={feeAmount}
                  hasError={typeof validation["feeAmount"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setFeeAmount}
                />
              </Grid.Cell>

              {/* Field 3: Currency */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Currency"
                  placeholder="Enter currency"
                  value={currency}
                  hasError={typeof validation["currency"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setCurrency}
                />
              </Grid.Cell>

              {/* Field 4: Tax */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <TextInput
                  className="w-100"
                  label="Tax"
                  placeholder="Enter tax"
                  value={tax}
                  hasError={typeof validation["tax"] !== "undefined"}
                  isDisabled={isLoading || isSuccess}
                  onChange={setTax}
                />
              </Grid.Cell>
            </Grid>

            <Grid>
              {/* Field 5: Project Code (ListInput Dropdown) */}
              <Grid.Cell size={Grid.CellSize.S3}>
                <ListInput
                  className="w-100"
                  label="Project Code"
                  value={projectCode || undefined}
                  placeholder={isLoadingProperties ? "Loading..." : "Select project code"}
                  hasError={typeof validation["projectCode"] !== "undefined"}
                  isDisabled={isLoading || isSuccess || isLoadingProperties}
                >
                  {(onClose) => (
                    <React.Fragment>
                      <ListInput.Item
                        label="None"
                        isActive={projectCode === ""}
                        onClick={() => {
                          setProjectCode("");
                          onClose();
                        }}
                      />
                      <Map
                        items={uniqueProjectCodes}
                        renderItem={(code) => (
                          <ListInput.Item
                            key={code}
                            label={code}
                            isActive={projectCode === code}
                            onClick={() => {
                              setProjectCode(code);
                              onClose();
                            }}
                          />
                        )}
                      />
                    </React.Fragment>
                  )}
                </ListInput>
              </Grid.Cell>

              {/* Status Checkbox */}
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